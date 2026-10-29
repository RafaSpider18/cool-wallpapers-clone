// T-019 — Fotografía real con licencia abierta (Wikimedia Commons).
// Curado determinista: búsqueda por temas con filtros estrictos (JPEG, gran
// tamaño, orientación horizontal, licencia libre), descarga del original,
// recorte 16:9 centrado con canvas de Chromium (misma cadena que T-013) y
// salida de thumb/1080p(/4K) JPEG registrada en data/photos.json con crédito
// (autor, licencia, página Commons de origen). Sin upscaling.
// Este script NO descarga nada de 4kwallpapers.com (ADR-4).
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(scriptDir, "..");
const wallsDir = join(rootDir, "public", "walls");
const thumbsDir = join(wallsDir, "thumbs");
const fullDir = join(wallsDir, "full");
const cacheDir = join(rootDir, ".photo-cache");
const PHOTOS_JSON = join(rootDir, "data", "photos.json");
const PHOTOS_SOURCE = join(rootDir, "data", "photowalls.source.json");

const UA = "cool-wallpapers-clone/1.0 (catalog curation; repo: RafaSpider18/cool-wallpapers-clone)";

const THUMB_W = 640;
const THUMB_H = 360;
const RESOLUTIONS = [
  { label: "1080p", width: 1920, height: 1080, quality: 80, minW: 1920, minH: 1080 },
  { label: "4K", width: 3840, height: 2160, quality: 84, minW: 3840, minH: 2160 },
];
const FIRST_PHOTO_ID = 61;

// Cache dirigida por contenido: clave = hash de la URL (no del índice).
// Así el orden de los candidatos puede cambiar entre corridas sin mezclar fotos.
const cachePathFor = (downloadUrl) =>
  join(cacheDir, `${createHash("md5").update(downloadUrl).digest("hex")}.jpg`);

// ------------------------------------------------------------ temas curados ---
const THEMES = [
  { category: "space", picks: 6, tags: ["space", "galaxy", "nebula"], queries: ["nebula hubble", "carina nebula", "orion nebula"] },
  { category: "nature", picks: 4, tags: ["nature", "mountain", "lake"], queries: ['mountain landscape lake incategory:"Quality images"', "mountain landscape lake"] },
  { category: "nature", picks: 1, tags: ["nature", "waterfall", "long-exposure"], queries: ['waterfall incategory:"Quality images"', "waterfall long exposure"] },
  { category: "architecture", picks: 4, tags: ["architecture", "city", "night"], queries: ['city skyline night incategory:"Quality images"', "city skyline night"] },
  { category: "flowers", picks: 2, tags: ["flowers", "tulip", "field"], queries: ['tulip field incategory:"Quality images"', "tulip field"] },
  { category: "flowers", picks: 2, tags: ["flowers", "rose", "garden"], queries: ['rose incategory:"Quality images"', "rose flower garden", "rose flower macro"] },
  { category: "food", picks: 3, tags: ["food", "cuisine", "dish"], queries: ['incategory:"Food photographs" breakfast', 'incategory:"Food photographs" cake', "food dish plated"] },
  { category: "animals", picks: 2, tags: ["animals", "bird", "wildlife"], queries: ['bird incategory:"Quality images"', "bird wildlife"] },
  { category: "animals", picks: 2, tags: ["animals", "deer", "nature"], queries: ['deer incategory:"Quality images"', "deer wildlife"] },
  { category: "photography", picks: 2, tags: ["photography", "camera", "vintage"], queries: ['vintage camera incategory:"Quality images"', "classic camera"] },
];

const LICENSE_RE = /^(public domain|cc0|cc by(-sa)? ([1-4](\.\d)?))$/i;
const BAD_TITLE = /\b(logo|icon|chart|diagram|screenshot|poster|banner|collage)\b/i;

// ------------------------------------------------------------ utilidades ---
function stripHtml(html) {
  return html
    .replace(/\[\d+\]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function apiSearch(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json" +
    "&prop=imageinfo&iiprop=url%7Csize%7Cmime%7Cextmetadata&iiurlwidth=3840" +
    "&generator=search&gsrnamespace=6&gsrlimit=30&gsrsearch=" +
    encodeURIComponent(query);
  // Cortesía con la API: pausa fija y reintentos con backoff ante 429.
  await sleep(2500);
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch(url, { headers: { "User-Agent": UA } });
    if (response.ok) {
      const json = await response.json();
      const pages = json?.query?.pages ?? {};
      return Object.values(pages).filter((p) => p.imageinfo?.length);
    }
    if (response.status === 429 && attempt < 3) {
      console.warn(`Aviso: 429, reintento ${attempt} tras espera (${query})`);
      await sleep(8000 * attempt);
      continue;
    }
    throw new Error(`Commons API ${response.status}: "${query}"`);
  }
  return [];
}

function pickable(file) {
  const info = file.imageinfo[0];
  const meta = info.extmetadata ?? {};
  const license = stripHtml(meta.LicenseShortName?.value ?? "?");
  if (!LICENSE_RE.test(license)) return null;
  if (info.mime !== "image/jpeg") return null;
  if (BAD_TITLE.test(file.title)) return null;
  const { width = 0, height = 0 } = info;
  if (width < 2600 || height < 1500) return null;
  const aspect = width / height;
  if (aspect < 1.45 || aspect > 2.5) return null;
  const artist = stripHtml(meta.Artist?.value ?? "");
  if (!artist) return null;
  const sourceUrl = (info.descriptionurl ?? "").split("?")[0];
  if (!sourceUrl) return null;
  const originalUrl = info.url.split("?")[0];
  const thumbUrl = info.thumburl ? info.thumburl.split("?")[0] : null;
  const downloadUrl = width >= 3840 ? thumbUrl ?? originalUrl : originalUrl;
  const commonsTitle = stripHtml(file.title.replace(/^File:/, "").replace(/\.\w+$/, ""));
  return {
    commonsTitle,
    downloadUrl,
    original: { width, height },
    credit: { author: artist, license, sourceUrl },
  };
}

async function download(url, outPath) {
  // Cortesía con upload.wikimedia.org: reintentos ante 429.
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch(url, { headers: { "User-Agent": UA } });
    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.byteLength < 80_000) throw new Error(`Archivo demasiado pequeño: ${outPath}`);
      writeFileSync(outPath, buffer);
      return;
    }
    if (response.status === 429 && attempt < 3) {
      console.warn(`Aviso: 429 descargando, reintento ${attempt} tras espera`);
      await sleep(9000 * attempt);
      continue;
    }
    throw new Error(`Descarga ${response.status}: ${url}`);
  }
  throw new Error(`Descarga agotó reintentos: ${url}`);
}

function deriveTitle(commonsTitle, index) {
  const tokens = commonsTitle
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^A-Za-z0-9 -]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !/^\d+$/.test(token))
    .slice(0, 4);
  const usable = tokens.length > 0 ? tokens : [`photo`, `wallpaper`, String(index + 1)];
  const STOP = new Set(["the", "of", "and", "in", "at", "on"]);
  return usable
    .map((token, i) => (i > 0 && STOP.has(token.toLowerCase()) ? token.toLowerCase() : token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()))
    .join(" ");
}

// Procesa el fuente en el canvas de Chromium: recorte 16:9 centrado + JPEG.
async function processSource(page, sourcePath, targets) {
  const dataUrl = `data:image/jpeg;base64,${readFileSync(sourcePath).toString("base64")}`;
  return page.evaluate(async ({ dataUrl, targets }) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const sw = Math.min(img.naturalWidth, (img.naturalHeight * 16) / 9);
    const sh = Math.min(img.naturalHeight, (img.naturalWidth * 9) / 16);
    const sx = Math.round((img.naturalWidth - sw) / 2);
    const sy = Math.round((img.naturalHeight - sh) / 2);

    const results = [];
    for (const target of targets) {
      const canvas = document.createElement("canvas");
      canvas.width = target.w;
      canvas.height = target.h;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, target.w, target.h);
      if (target.avg) {
        const probe = document.createElement("canvas");
        probe.width = 6;
        probe.height = 4;
        const pctx = probe.getContext("2d");
        pctx.drawImage(img, sx, sy, sw, sh, 0, 0, 6, 4);
        const px = pctx.getImageData(0, 0, 6, 4).data;
        let r = 0, g = 0, b = 0;
        for (let i = 0; i < px.length; i += 4) {
          r += px[i]; g += px[i + 1]; b += px[i + 2];
        }
        const n = px.length / 4;
        const hex = (v) => Math.round(v / n).toString(16).padStart(2, "0");
        target.avgHex = `#${hex(r)}${hex(g)}${hex(b)}`;
      }
      const blob = await new Promise((resolve, reject) =>
        canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("toBlob null"))), "image/jpeg", target.q),
      );
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = "";
      for (let i = 0; i < bytes.length; i += 32768) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
      }
      results.push({ data: btoa(binary), bytes: bytes.length, avgHex: target.avgHex ?? null });
    }
    return results;
  }, { dataUrl, targets });
}

function buildContactSheet(entries) {
  const cols = 6;
  const cellW = 320;
  const cellH = 180;
  const labelH = 22;
  const rows = Math.ceil(entries.length / cols);
  const sheets = entries.map((entry) => ({
    data: readFileSync(join(thumbsDir, `${entry.id}.jpg`)).toString("base64"),
    label: `#${entry.id} ${entry.slug}`,
  }));
  return { sheets, cols, rows, cellW, cellH, labelH };
}

// ------------------------------------------------------------------- main ---
async function main() {
  const overrides = existsSync(PHOTOS_SOURCE)
    ? JSON.parse(readFileSync(PHOTOS_SOURCE, "utf8"))
    : { exclude: [] };
  const excludes = new Set(overrides.exclude ?? []);

  // 1. Curación: candidatos por tema (el orden de la API es determinista).
  const seen = new Set();
  const chosen = [];
  for (const theme of THEMES) {
    let picked = 0;
    for (const query of theme.queries) {
      if (picked >= theme.picks) break;
      let files = [];
      try {
        files = await apiSearch(query);
      } catch (error) {
        console.warn(`Aviso: ${error.message}`);
        continue;
      }
      for (const file of files) {
        if (picked >= theme.picks) break;
        if (seen.has(file.pageid) || excludes.has(file.title)) continue;
        const card = pickable(file);
        if (!card) continue;
        seen.add(file.pageid);
        chosen.push({ ...card, theme, category: theme.category, tags: [...theme.tags] });
        picked++;
      }
    }
    if (picked < theme.picks) {
      console.warn(`Aviso: ${theme.category}/${theme.tags[0]} solo ${picked}/${theme.picks}`);
    }
  }
  if (chosen.length === 0) throw new Error("Sin candidatos tras los filtros");

  // Deduplicación por título derivado: Commons puede tener varios archivos del
  // mismo objeto con distinto nombre; primero va primero, id estable.
  const uniqueChosen = new Map();
  for (const candidate of chosen) {
    const key = `${candidate.category}:${deriveTitle(candidate.commonsTitle, 0).toLowerCase()}`;
    if (!uniqueChosen.has(key)) uniqueChosen.set(key, candidate);
    else console.warn(`Aviso: duplicado derivado “${candidate.commonsTitle}” omitido`);
  }
  const ordered = [...uniqueChosen.values()];

  // 2. ids/urls estables entre corridas (clave categoría + título derivado).
  const previous = existsSync(PHOTOS_JSON) ? JSON.parse(readFileSync(PHOTOS_JSON, "utf8")) : [];
  const byKey = new Map(previous.map((entry) => [entry.photoKey, entry]));
  const usedUrls = new Set(previous.map((entry) => `${entry.category}/${entry.slug}`));
  let nextId = Math.max(FIRST_PHOTO_ID - 1, ...previous.map((entry) => entry.id));

  mkdirSync(thumbsDir, { recursive: true });
  mkdirSync(fullDir, { recursive: true });
  mkdirSync(cacheDir, { recursive: true });

  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  const page = await context.newPage();

  const manifest = [];
  const seenIds = new Set();
  let index = 0;
  for (const candidate of ordered) {
    index++;
    const cachePath = cachePathFor(candidate.downloadUrl);
    try {
      if (!existsSync(cachePath) || statSync(cachePath).size < 80_000) {
        console.log(`descargando ${candidate.commonsTitle} (${candidate.original.width}x${candidate.original.height})...`);
        await sleep(1800);
        await download(candidate.downloadUrl, cachePath);
      }
    } catch (error) {
      console.warn(`Aviso: fallo la descarga (${candidate.commonsTitle}): ${error.message}`);
      continue;
    }

    const photoKey = `${candidate.category}:${deriveTitle(candidate.commonsTitle, index)}`;
    const existing = byKey.get(photoKey);

    let title = deriveTitle(candidate.commonsTitle, index);
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `photo-${index}`;
    let id;
    if (existing) {
      id = seenIds.has(existing.id) ? ++nextId : existing.id;
    } else if (usedUrls.has(`${candidate.category}/${slug}`)) {
      continue; // duplicado con corridas anteriores
    } else {
      id = ++nextId;
    }
    while (seenIds.has(id)) id = ++nextId;
    seenIds.add(id);

    if (manifest.some((m) => `${m.category}/${m.slug}` === `${candidate.category}/${slug}`)) {
      slug = `${slug}-${id}`;
      title = `${title} ${id}`;
    }

    // variantes sin upscaling (1080p garantizado por el filtro de entrada)
    const targets = [{ w: THUMB_W, h: THUMB_H, q: 78, avg: true }];
    const usableRes = RESOLUTIONS.filter(
      (r) => candidate.original.width >= r.minW && candidate.original.height >= r.minH,
    );
    for (const r of usableRes) targets.push({ w: r.width, h: r.height, q: r.quality });
    const results = await processSource(page, cachePath, targets);
    const resolutions = usableRes.map((r, i) => ({
      label: r.label,
      width: r.width,
      height: r.height,
      url: `/walls/full/${slug}-${r.width}x${r.height}-${id}.jpg`,
      _bytes: results[i + 1].bytes,
    }));

    const top = resolutions[resolutions.length - 1];
    writeFileSync(join(thumbsDir, `${id}.jpg`), Buffer.from(results[0].data, "base64"));
    for (let i = 0; i < resolutions.length; i++) {
      writeFileSync(join(fullDir, resolutions[i].url.replace(/^.*\//, "")), Buffer.from(results[i + 1].data, "base64"));
    }

    manifest.push({
      photoKey,
      id,
      slug,
      title,
      category: candidate.category,
      tags: candidate.tags,
      width: top.width,
      height: top.height,
      thumb: `/walls/thumbs/${id}.jpg`,
      full: top.url,
      resolutions,
      dominant: results[0].avgHex ?? "#333333",
      source: {
        author: candidate.credit.author,
        license: candidate.credit.license,
        page: candidate.credit.sourceUrl,
      },
    });
    usedUrls.add(`${candidate.category}/${slug}`);
    console.log(`OK #${id} ${slug} (${candidate.category}) ${resolutions.map((r) => r.label).join("+")}`);
  }

  if (manifest.length === 0) throw new Error("Ninguna foto se pudo procesar");

  // 3. publicar JSON (sin metadatos internos) + hoja de contacto.
  const cleaned = manifest.map((entry) => ({
    ...entry,
    resolutions: entry.resolutions.map(({ _bytes, ...rest }) => rest),
  }));
  writeFileSync(PHOTOS_JSON, JSON.stringify(cleaned, null, 2) + "\n", "utf8");

  // huérfanos de corridas anteriores (solo ids de fotos, nunca los generativos)
  const keepThumbs = new Set(manifest.map((m) => `${m.id}.jpg`));
  const keepFull = new Set(manifest.flatMap((m) => m.resolutions.map((r) => r.url.split("/").pop())));
  for (const dir of [thumbsDir, fullDir]) {
    for (const file of readdirSync(dir)) {
      const thumbId = file.match(/^(\d+)\.jpg$/)?.[1];
      if (thumbId) {
        if (Number(thumbId) >= FIRST_PHOTO_ID && !keepThumbs.has(file)) rmSync(join(dir, file));
        continue;
      }
      const fullId = Number(file.match(/-(\d+)\.jpg$/)?.[1] ?? 0);
      if (fullId >= FIRST_PHOTO_ID && !keepFull.has(file)) rmSync(join(dir, file));
    }
  }

  const sheet = buildContactSheet(manifest);
  const page2 = await context.newPage();
  const montage = await page2.evaluate(
    async ({ sheets, cols, rows, cellW, cellH, labelH }) => {
      const canvas = document.createElement("canvas");
      canvas.width = cols * cellW;
      canvas.height = rows * (cellH + labelH);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "13px sans-serif";
      for (let i = 0; i < sheets.length; i++) {
        const img = new Image();
        img.src = `data:image/jpeg;base64,${sheets[i].data}`;
        await img.decode();
        const cx = (i % cols) * cellW;
        const cy = Math.floor(i / cols) * (cellH + labelH);
        ctx.drawImage(img, cx, cy, cellW, cellH);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(sheets[i].label, cx + 6, cy + cellH + 15);
        ctx.fillStyle = "#000000";
      }
      const url = canvas.toDataURL("image/jpeg", 82);
      return url.slice(url.indexOf(",") + 1);
    },
    sheet,
  );
  writeFileSync(join(rootDir, "docs", "photo-sheet.jpg"), Buffer.from(montage, "base64"));
  await browser.close();

  const megabytes = cleaned.reduce(
    (sum, item) =>
      sum +
      item.resolutions.reduce((s, r) => s + statSync(join(fullDir, r.url.split("/").pop())).size, 0) +
      statSync(join(thumbsDir, `${item.id}.jpg`)).size,
    0,
  );
  console.log(`T-019: ${cleaned.length} fotos publicadas · ${(megabytes / 1024 / 1024).toFixed(1)} MB · data/photos.json · docs/photo-sheet.jpg`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
