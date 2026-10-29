import { expect, test, type Locator, type Page } from "@playwright/test";

const cards = (page: Page): Locator => page.locator("main div.grid > div");

test("1. la raíz redirige a /cool-wallpapers", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/cool-wallpapers$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cool Wallpapers");
});

test("2. /cool-wallpapers pinta 12 cards y la paginación", async ({ page }) => {
  await page.goto("/cool-wallpapers");
  await expect(cards(page)).toHaveCount(12);
  await expect(page.getByRole("navigation", { name: "Pagination" })).toBeVisible();
});

test("3. ?page=2 muestra otra tanda de cards", async ({ page }) => {
  await page.goto("/cool-wallpapers");
  const firstOnPageOne = await cards(page).first().locator("a").first().getAttribute("href");

  await page.goto("/cool-wallpapers?page=2");
  await expect(cards(page)).toHaveCount(12);
  const firstOnPageTwo = await cards(page).first().locator("a").first().getAttribute("href");

  expect(firstOnPageTwo).not.toBe(firstOnPageOne);
});

test("4. /abstract solo lista wallpapers de abstract", async ({ page }) => {
  await page.goto("/abstract");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Abstract");

  const hrefs = await cards(page)
    .locator("a:not([download])")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));

  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    expect(href.startsWith("/abstract/")).toBe(true);
  }
});

test("5. el detalle muestra H1, tags y descarga local", async ({ page }) => {
  await page.goto("/abstract/aurora-veil-1.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Aurora Veil");
  await expect(page.getByText(/Resolución:/)).toBeVisible();

  const download = page.locator("article a[download]");
  await expect(download).toBeVisible();
  await expect(download).toHaveAttribute("href", /^\/walls\/full\//);
  await expect(download).toHaveText(/Download 4K/);
});

test("6. la búsqueda cuenta resultados y tiene estado vacío", async ({ page }) => {
  await page.goto("/search?q=anime");
  await expect(page.getByText(/\d+ resultados? para/)).toBeVisible();
  expect(await cards(page).count()).toBeGreaterThan(0);

  await page.goto("/search?q=zzzz");
  await expect(page.getByText(/No encontramos wallpapers/)).toBeVisible();
  await expect(cards(page)).toHaveCount(0);
});

test("7. /random responde 307 hacia un detalle", async ({ request }) => {
  const response = await request.get("/random", { maxRedirects: 0 });
  expect(response.status()).toBe(307);

  const location = response.headers()["location"];
  expect(location).toBeTruthy();
  expect(location).toMatch(/^https?:\/\/[^/]+\/[\w-]+\/[\w-]+-\d+\.html$/);
});

test("8. sin scroll horizontal a 390 px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/cool-wallpapers");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("9. las páginas del footer existen y tienen H1", async ({ page }) => {
  const pages = [
    ["/privacy", "Política de privacidad"],
    ["/terms", "Términos de uso"],
    ["/copyright", "Copyright"],
    ["/contact", "Contacto"],
    ["/upload", "Subir un wallpaper"],
  ] as const;

  for (const [href, heading] of pages) {
    await page.goto(href);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  }
});

test("10. 404 propio, sitemap, robots y metadatos sociales", async ({ page, request }) => {
  const missing = await page.goto("/esto-no-existe");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Esta página no existe",
  );

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("/cool-wallpapers");
  expect(xml).toContain("/abstract/aurora-veil-1.html");
  expect(xml).toContain("/privacy");

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");

  await page.goto("/cool-wallpapers");
  const ogImage = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(ogImage).toMatch(/opengraph-image/);

  const image = await request.get(ogImage!);
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  expect((await image.body()).byteLength).toBeGreaterThan(1000);

  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
});

test("11. el selector de resolución cambia la descarga", async ({ page, request }) => {
  await page.goto("/abstract/aurora-veil-1.html");
  const download = page.locator("article a[download]");
  await expect(download).toHaveAttribute("href", /3840x2160/);
  await expect(download).toHaveAttribute("download", /\.jpg$/);

  const picker = page.getByRole("group");

  await picker.getByText("1080p", { exact: true }).click();
  await expect(page.getByText(/Resolución: 1080p/)).toBeVisible();
  await expect(download).toHaveAttribute("href", /1920x1080/);

  const asset = await request.get("/walls/full/aurora-veil-1920x1080-1.jpg");
  expect(asset.status()).toBe(200);
  expect(asset.headers()["content-type"]).toContain("image/jpeg");
  expect((await asset.body()).byteLength).toBeGreaterThan(1000);

  await picker.getByText("4K", { exact: true }).click();
  await expect(page.getByText(/Resolución: 4K/)).toBeVisible();
  await expect(download).toHaveAttribute("href", /3840x2160/);
});

test("12. breadcrumbs y tags navegables", async ({ page }) => {
  await page.goto("/abstract/aurora-veil-1.html");

  const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(breadcrumb.getByRole("link", { name: "Abstract" })).toHaveAttribute(
    "href",
    "/abstract",
  );
  await expect(breadcrumb.getByText("Aurora Veil")).toHaveAttribute(
    "aria-current",
    "page",
  );

  await page
    .locator("article")
    .getByRole("link", { name: "gradient" })
    .click();
  await expect(page).toHaveURL(/\/search\?q=gradient$/);
  await expect(page.getByText(/resultados? para/)).toBeVisible();
  expect(await cards(page).count()).toBeGreaterThan(0);
});

test("13. Random del header lleva a un detalle", async ({ page }) => {
  await page.goto("/cool-wallpapers");
  await page.getByRole("link", { name: "Random" }).click();
  await expect(page).toHaveURL(/\/[\w-]+\/[\w-]+-\d+\.html$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});


