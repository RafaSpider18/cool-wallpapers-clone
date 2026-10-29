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
  await expect(download).toHaveText("Download");
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
