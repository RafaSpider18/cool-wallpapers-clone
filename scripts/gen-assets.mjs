// T-013 — Arte raster propio.
// Genera thumbs (640x360) y full (1080p/4K) en JPEG con escenas SVG distintas
// por categoría, renderizadas con Chromium headless (Playwright).
// Determinista: todo el azar sale de seeds derivados del id del item.
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const wallsDir = join(rootDir, "public", "walls");
const thumbsDir = join(wallsDir, "thumbs");
const fullDir = join(wallsDir, "full");

const THUMB_W = 640;
const THUMB_H = 360;
const RESOLUTIONS = [
  { label: "1080p", width: 1920, height: 1080, quality: 80 },
  { label: "4K", width: 3840, height: 2160, quality: 84 },
];
const DEFAULT_RESOLUTION = RESOLUTIONS[1];
const JPEG_EXT = ".jpg";

// ------------------------------------------------------------- catálogo ---
// Mismas paletas/tags del T-003; las variantes nominales se derivan de abajo.
const rawItems = [
  { id: 1, slug: "aurora-veil", title: "Aurora Veil", category: "abstract", tags: ["abstract", "gradient", "minimal"], dominant: "#7c3aed", secondary: "#312e81" },
  { id: 2, slug: "prism-drift", title: "Prism Drift", category: "abstract", tags: ["abstract", "color", "hd"], dominant: "#06b6d4", secondary: "#164e63" },
  { id: 3, slug: "wild-echo", title: "Wild Echo", category: "animals", tags: ["animals", "wildlife", "nature"], dominant: "#65a30d", secondary: "#1a2e05" },
  { id: 4, slug: "gentle-paw", title: "Gentle Paw", category: "animals", tags: ["animals", "cute", "pet"], dominant: "#f59e0b", secondary: "#451a03" },
  { id: 5, slug: "neon-ronin", title: "Neon Ronin", category: "anime", tags: ["anime", "neon", "samurai"], dominant: "#ec4899", secondary: "#500724" },
  { id: 6, slug: "star-kami", title: "Star Kami", category: "anime", tags: ["anime", "space", "divine"], dominant: "#8b5cf6", secondary: "#2e1065" },
  { id: 7, slug: "steel-skyline", title: "Steel Skyline", category: "architecture", tags: ["architecture", "city", "urban"], dominant: "#64748b", secondary: "#0f172a" },
  { id: 8, slug: "glass-spire", title: "Glass Spire", category: "architecture", tags: ["architecture", "minimal", "tower"], dominant: "#38bdf8", secondary: "#082f49" },
  { id: 9, slug: "midnight-ride", title: "Midnight Ride", category: "bikes", tags: ["bikes", "motorcycle", "night"], dominant: "#ef4444", secondary: "#450a0a" },
  { id: 10, slug: "coastal-dash", title: "Coastal Dash", category: "bikes", tags: ["bikes", "coast", "sport"], dominant: "#14b8a6", secondary: "#042f2e" },
  { id: 11, slug: "void-pulse", title: "Void Pulse", category: "black-dark", tags: ["black", "dark", "night"], dominant: "#1e293b", secondary: "#020617" },
  { id: 12, slug: "nocturne", title: "Nocturne", category: "black-dark", tags: ["black", "blue", "dark"], dominant: "#312e81", secondary: "#0c0a1d" },
  { id: 13, slug: "redline-dream", title: "Redline Dream", category: "cars", tags: ["cars", "supercar", "sport"], dominant: "#dc2626", secondary: "#450a0a" },
  { id: 14, slug: "midnight-gt", title: "Midnight GT", category: "cars", tags: ["cars", "gt", "night"], dominant: "#334155", secondary: "#0f172a" },
  { id: 15, slug: "festival-glow", title: "Festival Glow", category: "celebrations", tags: ["celebrations", "party", "glow"], dominant: "#f97316", secondary: "#431407" },
  { id: 16, slug: "fireworks-night", title: "Fireworks Night", category: "celebrations", tags: ["celebrations", "fireworks", "night"], dominant: "#eab308", secondary: "#422006" },
  { id: 17, slug: "kawaii-day", title: "Kawaii Day", category: "cute", tags: ["cute", "kawaii", "anime"], dominant: "#f472b6", secondary: "#500724" },
  { id: 18, slug: "bunny-halo", title: "Bunny Halo", category: "cute", tags: ["cute", "animal", "spring"], dominant: "#fb7185", secondary: "#4c0519" },
  { id: 19, slug: "dragon-haze", title: "Dragon's Haze", category: "fantasy", tags: ["fantasy", "dragon", "magic"], dominant: "#a855f7", secondary: "#3b0764" },
  { id: 20, slug: "arcane-grove", title: "Arcane Grove", category: "fantasy", tags: ["fantasy", "forest", "magic"], dominant: "#22c55e", secondary: "#052e16" },
  { id: 21, slug: "petal-storm", title: "Petal Storm", category: "flowers", tags: ["flowers", "nature", "wind"], dominant: "#e11d48", secondary: "#881337" },
  { id: 22, slug: "rose-circuit", title: "Rose Circuit", category: "flowers", tags: ["flowers", "garden", "color"], dominant: "#f97316", secondary: "#7c2d12" },
  { id: 23, slug: "taco-sunset", title: "Taco Sunset", category: "food", tags: ["food", "mexican", "sunset"], dominant: "#ea580c", secondary: "#431407" },
  { id: 24, slug: "sushi-wave", title: "Sushi Wave", category: "food", tags: ["food", "japanese", "ocean"], dominant: "#06b6d4", secondary: "#164e63" },
  { id: 25, slug: "pixel-dawn", title: "Pixel Dawn", category: "games", tags: ["games", "pixel", "8bit"], dominant: "#22c55e", secondary: "#052e16" },
  { id: 26, slug: "boss-rush", title: "Boss Rush", category: "games", tags: ["games", "boss", "action"], dominant: "#ef4444", secondary: "#450a0a" },
  { id: 27, slug: "sunset-fade", title: "Sunset Fade", category: "gradients", tags: ["gradients", "sunset", "smooth"], dominant: "#f59e0b", secondary: "#451a03" },
  { id: 28, slug: "ocean-glow", title: "Ocean Glow", category: "gradients", tags: ["gradients", "ocean", "blue"], dominant: "#0ea5e9", secondary: "#082f49" },
  { id: 29, slug: "render-7", title: "Render 7", category: "cgi", tags: ["cgi", "render", "3d"], dominant: "#a855f7", secondary: "#3b0764" },
  { id: 30, slug: "poly-haven", title: "Poly Haven", category: "cgi", tags: ["cgi", "3d", "studio"], dominant: "#6366f1", secondary: "#1e1b4b" },
  { id: 31, slug: "urban-quiet", title: "Urban Quiet", category: "lifestyle", tags: ["lifestyle", "city", "minimal"], dominant: "#94a3b8", secondary: "#1e293b" },
  { id: 32, slug: "morning-light", title: "Morning Light", category: "lifestyle", tags: ["lifestyle", "morning", "home"], dominant: "#fbbf24", secondary: "#451a03" },
  { id: 33, slug: "heartbeat", title: "Heartbeat", category: "love", tags: ["love", "heart", "red"], dominant: "#f43f5e", secondary: "#4c0519" },
  { id: 34, slug: "adore", title: "Adore", category: "love", tags: ["love", "couple", "soft"], dominant: "#fb7185", secondary: "#500724" },
  { id: 35, slug: "tactical-dusk", title: "Tactical Dusk", category: "military", tags: ["military", "tactical", "army"], dominant: "#475569", secondary: "#0f172a" },
  { id: 36, slug: "iron-horizon", title: "Iron Horizon", category: "military", tags: ["military", "army", "armor"], dominant: "#64748b", secondary: "#1e1b3b" },
  { id: 37, slug: "mono-silence", title: "Mono Silence", category: "minimal", tags: ["minimal", "mono", "black"], dominant: "#94a3b8", secondary: "#1e293b" },
  { id: 38, slug: "bare-space", title: "Bare Space", category: "minimal", tags: ["minimal", "space", "calm"], dominant: "#a8a29e", secondary: "#292524" },
  { id: 39, slug: "reel-shadow", title: "Reel Shadow", category: "movies", tags: ["movies", "cinema", "night"], dominant: "#334155", secondary: "#020617" },
  { id: 40, slug: "silver-screen", title: "Silver Screen", category: "movies", tags: ["movies", "film", "classic"], dominant: "#94a3b8", secondary: "#334155" },
  { id: 41, slug: "bassline", title: "Bassline", category: "music", tags: ["music", "bass", "energy"], dominant: "#8b5cf6", secondary: "#2e1065" },
  { id: 42, slug: "vinyl-haze", title: "Vinyl Haze", category: "music", tags: ["music", "vinyl", "retro"], dominant: "#d946ef", secondary: "#4a044e" },
  { id: 43, slug: "misty-ridge", title: "Misty Ridge", category: "nature", tags: ["nature", "mountain", "fog"], dominant: "#38bdf8", secondary: "#0c4a6e" },
  { id: 44, slug: "forest-whisper", title: "Forest Whisper", category: "nature", tags: ["nature", "forest", "green"], dominant: "#16a34a", secondary: "#052e16" },
  { id: 45, slug: "studio-light", title: "Studio Light", category: "people", tags: ["people", "portrait", "light"], dominant: "#f472b6", secondary: "#500724" },
  { id: 46, slug: "crowd-glow", title: "Crowd Glow", category: "people", tags: ["people", "city", "night"], dominant: "#fb923c", secondary: "#431407" },
  { id: 47, slug: "golden-hour", title: "Golden Hour", category: "photography", tags: ["photography", "golden", "sunset"], dominant: "#f59e0b", secondary: "#451a03" },
  { id: 48, slug: "aperture", title: "Aperture", category: "photography", tags: ["photography", "camera", "lens"], dominant: "#60a5fa", secondary: "#1e3a8a" },
  { id: 49, slug: "still-words", title: "Still Words", category: "quotes", tags: ["quotes", "minimal", "peace"], dominant: "#a8a29e", secondary: "#292524" },
  { id: 50, slug: "silent-echo", title: "Silent Echo", category: "quotes", tags: ["quotes", "poetry", "calm"], dominant: "#818cf8", secondary: "#312e81" },
  { id: 51, slug: "starship-drift", title: "Starship Drift", category: "scifi", tags: ["scifi", "space", "ship"], dominant: "#38bdf8", secondary: "#083344" },
  { id: 52, slug: "cyber-dawn", title: "Cyber Dawn", category: "scifi", tags: ["scifi", "cyberpunk", "neon"], dominant: "#22d3ee", secondary: "#083344" },
  { id: 53, slug: "orbital-glow", title: "Orbital Glow", category: "space", tags: ["space", "planet", "glow"], dominant: "#818cf8", secondary: "#1e1b4b" },
  { id: 54, slug: "cosmic-dust", title: "Cosmic Dust", category: "space", tags: ["space", "galaxy", "stars"], dominant: "#c084fc", secondary: "#3b0764" },
  { id: 55, slug: "velocity", title: "Velocity", category: "sports", tags: ["sports", "speed", "track"], dominant: "#ef4444", secondary: "#450a0a" },
  { id: 56, slug: "final-sprint", title: "Final Sprint", category: "sports", tags: ["sports", "running", "energy"], dominant: "#f97316", secondary: "#431407" },
  { id: 57, slug: "circuit-glow", title: "Circuit Glow", category: "technology", tags: ["technology", "circuit", "tech"], dominant: "#4f46e5", secondary: "#1e1b4b" },
  { id: 58, slug: "data-stream", title: "Data Stream", category: "technology", tags: ["technology", "data", "flow"], dominant: "#60a5fa", secondary: "#1e3a8a" },
  { id: 59, slug: "terra-nova", title: "Terra Nova", category: "world", tags: ["world", "earth", "planet"], dominant: "#34d399", secondary: "#064e3b" },
  { id: 60, slug: "global-echo", title: "Global Echo", category: "world", tags: ["world", "global", "community"], dominant: "#facc15", secondary: "#713f12" },
];

// Escena por categoría; las variaciones dentro de la categoría salen del seed.
const SCENES = {
  abstract: { type: "orb" },
  animals: { type: "ridges" },
  anime: { type: "aurora" },
  architecture: { type: "citygrid" },
  bikes: { type: "streaks" },
  "black-dark": { type: "mono" },
  cars: { type: "streaks" },
  celebrations: { type: "bloom", extra: "confetti" },
  cute: { type: "bloom", extra: "hearts" },
  fantasy: { type: "aurora", night: true },
  flowers: { type: "bloom" },
  food: { type: "bloom" },
  games: { type: "citygrid", pixel: true },
  gradients: { type: "aurora" },
  cgi: { type: "orb" },
  lifestyle: { type: "streaks" },
  love: { type: "bloom", extra: "hearts" },
  military: { type: "ridges", night: true },
  minimal: { type: "mono" },
  movies: { type: "streaks", letterbox: true },
  music: { type: "aurora", night: true },
  nature: { type: "ridges" },
  people: { type: "bloom" },
  photography: { type: "orb" },
  quotes: { type: "mono" },
  scifi: { type: "orb", stars: true },
  space: { type: "orb", stars: true },
  sports: { type: "streaks" },
  technology: { type: "citygrid" },
  world: { type: "ridges" },
};

// ------------------------------------------------------------ utilidades ---
function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;
}

function mixHex(a, b, t) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

function rgbToHsl(r, g, b) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let hh = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === rn) hh = ((gn - bn) / d) % 6;
    else if (max === gn) hh = (bn - rn) / d + 2;
    else hh = (rn - gn) / d + 4;
  }
  return [((hh * 60) + 360) % 360, s, l];
}

function hslToHex(hDegree, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((hDegree % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const [r1, g1, b1] =
    hp < 1 ? [c, x, 0] : hp < 2 ? [x, c, 0] : hp < 3 ? [0, c, x] : hp < 4 ? [0, x, c] : hp < 5 ? [x, 0, c] : [c, 0, x];
  const m = l - c / 2;
  return rgbToHex((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255);
}

function rotateHue(hex, degrees) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  return hslToHex(h + degrees, s, l);
}

const lighten = (hex, t) => mixHex(hex, "#ffffff", t);
const darken = (hex, t) => mixHex(hex, "#000000", t);
const num = (v, decimals = 1) => Number(v.toFixed(decimals)).toString();

function blurFilter(id, std) {
  return `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${num(std)}"/></filter>`;
}

function vignette(w, h) {
  return `<radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.5"/></radialGradient><rect width="${w}" height="${h}" fill="url(#vig)"/>`;
}

function grainOverlay(w, h, seed, opacity) {
  return `<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="${w}" height="${h}" filter="url(#grain)" opacity="${opacity}" style="mix-blend-mode:overlay"/>`;
}

function starsLayer(w, h, u, rng, count, maxY) {
  const parts = [];
  for (let i = 0; i < count; i++) {
    parts.push(
      `<circle cx="${num(rng() * w)}" cy="${num(rng() * h * maxY)}" r="${num(u * (0.4 + rng() * 1.2), 2)}" fill="#ffffff" opacity="${num(0.08 + rng() * 0.3, 2)}"/>`,
    );
  }
  return `<g>${parts.join("")}</g>`;
}

// --------------------------------------------------------------- escenas ---
function drawAurora({ w, h, u, rng, cA, cB, cT, scene }) {
  const parts = [
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${darken(cB, 0.55)}"/><stop offset="1" stop-color="${darken(cB, 0.12)}"/></linearGradient>`,
    `<linearGradient id="curtain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cT}" stop-opacity="0"/><stop offset="0.26" stop-color="${cT}" stop-opacity="0.45"/><stop offset="0.52" stop-color="${cA}" stop-opacity="0.8"/><stop offset="0.82" stop-color="${cA}" stop-opacity="0.28"/><stop offset="1" stop-color="${cA}" stop-opacity="0"/></linearGradient>`,
    `<filter id="curtainBlur" x="-80%" y="-20%" width="260%" height="140%"><feGaussianBlur stdDeviation="${num(7 * u, 2)}"/></filter></defs>`,
    `<rect width="${w}" height="${h}" fill="url(#bg)"/>`,
  ];
  if (scene.night) parts.push(starsLayer(w, h, u, rng, 70, 0.75));

  // glow atmosférico general
  parts.push(
    `<ellipse cx="${num(w * (0.45 + rng() * 0.25))}" cy="${num(h * 0.34)}" rx="${num(w * 0.45)}" ry="${num(h * 0.32)}" fill="${cA}" opacity="0.16" filter="url(#blurBig)"/>`,
  );

  // cortina continua: cintas verticales largas y superpuestas hasta cubrir
  // el ancho completo (una vez generadas se reescalan sobre 0..1).
  const bands = 16 + Math.floor(rng() * 5);
  const layouts = [];
  let cursor = -0.02 + rng() * 0.03;
  for (let i = 0; i < bands; i++) {
    const width = 0.018 + rng() * 0.055;
    layouts.push({ x: cursor + rng() * 0.01, width, opacity: 0.45 + rng() * 0.4 });
    cursor += width * (0.5 + rng() * 1.1);
  }
  for (const band of layouts) {
    const cx = band.x / cursor;
    const width = band.width / cursor;
    const topY = h * (0.0 + rng() * 0.28);
    const bh = h * (0.5 + rng() * 0.34);
    const skew = (rng() - 0.5) * 18;
    parts.push(
      `<rect x="0" y="0" width="${num(w * width)}" height="${num(bh)}" fill="url(#curtain)" opacity="${num(band.opacity, 2)}" transform="translate(${num(w * cx - (w * width) / 2)} ${num(topY)}) skewX(${num(skew, 1)})" filter="url(#curtainBlur)"/>`,
    );
  }

  // cintas finas brillantes para definición central
  for (let i = 0; i < 4; i++) {
    const width = w * (0.006 + rng() * 0.012);
    const topY = h * (0.04 + rng() * 0.12);
    const bh = h * (0.45 + rng() * 0.3);
    const skew = (rng() - 0.5) * 18;
    parts.push(
      `<rect x="0" y="0" width="${num(width)}" height="${num(bh)}" fill="${cT}" transform="translate(${num(w * rng())} ${num(topY)}) skewX(${num(skew, 1)})" opacity="${num(0.3 + rng() * 0.35, 2)}" filter="url(#curtainBlur)"/>`,
    );
  }

  // onda baja sutil que ancla la cortina al horizonte
  const waveY = h * (0.66 + rng() * 0.1);
  parts.push(
    `<path d="M0 ${num(waveY)} C ${num(w * 0.3)} ${num(waveY - h * 0.04)} ${num(w * 0.7)} ${num(waveY + h * 0.03)} ${w} ${num(waveY - h * 0.02)} L ${w} ${h} L 0 ${h} Z" fill="${cA}" opacity="0.12" filter="url(#blurSoft)"/>`,
  );

  // glow de horizonte
  parts.push(
    `<ellipse cx="${num(w * (0.35 + rng() * 0.3))}" cy="${num(h * 0.78)}" rx="${num(w * 0.38)}" ry="${num(h * 0.12)}" fill="${cA}" opacity="0.14" filter="url(#blurBig)"/>`,
  );
  return parts.join("\n");
}

function drawOrb({ w, h, u, rng, cA, cB, cT, deep, scene }) {
  const cx = w * (0.3 + rng() * 0.4);
  const cy = h * (0.28 + rng() * 0.2);
  const r = w * (0.09 + rng() * 0.05);
  const parts = [
    `<defs><radialGradient id="bg" cx="50%" cy="40%" r="80%"><stop offset="0" stop-color="${mixHex(cB, cA, 0.25)}"/><stop offset="1" stop-color="${darken(cB, 0.5)}"/></radialGradient>`,
    `<radialGradient id="core" cx="35%" cy="30%" r="90%"><stop offset="0" stop-color="${lighten(cA, 0.35)}"/><stop offset="0.6" stop-color="${cA}"/><stop offset="1" stop-color="${darken(cA, 0.35)}"/></radialGradient>`,
    `<linearGradient id="floorFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixHex(cB, "#000000", 0.3)}" stop-opacity="0"/><stop offset="1" stop-color="${mixHex(cB, "#000000", 0.3)}" stop-opacity="0.65"/></linearGradient></defs>`,
    `<rect width="${w}" height="${h}" fill="url(#bg)"/>`,
  ];
  if (scene.stars) parts.push(starsLayer(w, h, u, rng, 60, 1));
  parts.push(`<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r * 2.2)}" fill="${cA}" opacity="0.35" filter="url(#blurBig)"/>`);
  parts.push(`<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}" fill="url(#core)"/>`);
  parts.push(
    `<ellipse cx="${num(cx)}" cy="${num(cy)}" rx="${num(r * 1.9)}" ry="${num(r * 0.55)}" fill="none" stroke="${cT}" stroke-width="${num(1.5 * u, 2)}" opacity="0.45" transform="rotate(${num(-18 + rng() * 36)} ${num(cx)} ${num(cy)})" filter="url(#blurSoft)"/>`,
  );
  parts.push(
    `<rect x="0" y="${num(h * 0.55)}" width="${w}" height="${num(h * 0.45)}" fill="url(#floorFade)"/>`,
  );
  return parts.join("\n");
}

function drawRidges({ w, h, u, rng, cA, cB, cT, deep, scene }) {
  const parts = [
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lighten(cA, 0.25)}"/><stop offset="0.55" stop-color="${cB}"/><stop offset="1" stop-color="${darken(cB, 0.3)}"/></linearGradient></defs>`,
    `<rect width="${w}" height="${h}" fill="url(#bg)"/>`,
  ];
  if (scene.night) parts.push(starsLayer(w, h, u, rng, 55, 0.5));

  const sunX = w * (0.25 + rng() * 0.5);
  const sunY = h * (0.2 + rng() * 0.14);
  const sunR = w * (0.05 + rng() * 0.03);
  parts.push(`<circle cx="${num(sunX)}" cy="${num(sunY)}" r="${num(sunR * 2.4)}" fill="${cA}" opacity="0.4" filter="url(#blurBig)"/>`);
  parts.push(`<circle cx="${num(sunX)}" cy="${num(sunY)}" r="${num(sunR)}" fill="${cT}" opacity="0.9"/>`);

  for (let i = 0; i < 4; i++) {
    const baseY = h * (0.55 + i * 0.11);
    const amp = h * 0.06;
    const step = w / 8;
    const points = [];
    for (let k = 0; k <= 8; k++) {
      const jx = k * step;
      const jy = baseY - (k % 2 === 0 ? rng() * amp : amp * 0.4 + rng() * amp * 0.6);
      points.push(`${num(jx)} ${num(jy)}`);
    }
    const fill = darken(cB, 0.15 + i * 0.22);
    parts.push(`<polygon points="${points.join(", ")} ${w} ${h} 0 ${h}" fill="${fill}" opacity="0.96"/>`);
    if (i < 3) {
      parts.push(
        `<rect x="0" y="${num(baseY - h * 0.01)}" width="${w}" height="${num(h * 0.02)}" fill="#ffffff" opacity="0.04" filter="url(#blurMid)"/>`,
      );
    }
  }
  return parts.join("\n");
}

function drawCitygrid({ w, h, u, rng, cA, cB, cT, deep, scene }) {
  const horizon = h * 0.7;
  const parts = [
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lighten(cB, 0.08)}"/><stop offset="1" stop-color="${darken(cB, 0.65)}"/></linearGradient></defs>`,
    `<rect width="${w}" height="${h}" fill="url(#bg)"/>`,
    `<ellipse cx="${num(w * 0.5)}" cy="${num(horizon)}" rx="${num(w * 0.45)}" ry="${num(h * 0.16)}" fill="${cA}" opacity="0.45" filter="url(#blurBig)"/>`,
    `<rect x="0" y="${num(horizon)}" width="${w}" height="${num(h - horizon)}" fill="#050508" opacity="0.65"/>`,
  ];

  let x = -w * 0.02;
  while (x < w) {
    const bw = w * (0.02 + rng() * 0.05);
    const bh = h * (0.12 + rng() * 0.4);
    const fill = mixHex(deep, "#000000", rng() * 0.35);
    if (scene.pixel) {
      const steps = 2 + Math.floor(rng() * 2);
      let topY = horizon - bh;
      let blockW = bw;
      for (let s = 0; s < steps; s++) {
        parts.push(`<rect x="${num(x)}" y="${num(topY)}" width="${num(blockW)}" height="${num(bh / steps)}" fill="${fill}" opacity="0.95"/>`);
        topY += bh / steps;
        blockW -= bw * (0.1 + rng() * 0.2);
      }
    } else {
      parts.push(`<rect x="${num(x)}" y="${num(horizon - bh)}" width="${num(bw)}" height="${num(bh)}" fill="${fill}" opacity="0.95"/>`);
      if (rng() > 0.35) {
        parts.push(`<rect x="${num(x + bw * 0.35)}" y="${num(horizon - bh)}" width="${num(2 * u)}" height="${num(bh)}" fill="${cA}" opacity="0.4"/>`);
      }
    }
    x += bw + w * (0.005 + rng() * 0.02);
  }

  const gridParts = [];
  for (let i = 0; i <= 12; i++) {
    const gx = (i / 12) * w;
    gridParts.push(`<line x1="${num(w * 0.5)}" y1="${num(horizon)}" x2="${num(gx)}" y2="${h}" stroke="${cA}" stroke-width="${num(1.2 * u, 2)}" opacity="0.14"/>`);
  }
  for (let i = 1; i <= 6; i++) {
    const gy = horizon + (h - horizon) * Math.pow(i / 6, 1.8);
    gridParts.push(`<line x1="0" y1="${num(gy)}" x2="${w}" y2="${num(gy)}" stroke="${cA}" stroke-width="${num(1.2 * u, 2)}" opacity="0.12"/>`);
  }
  parts.push(`<g>${gridParts.join("")}</g>`);
  return parts.join("\n");
}

function drawBloom({ w, h, u, rng, cA, cB, cT, deep, scene }) {
  const parts = [
    `<defs><radialGradient id="bg" cx="50%" cy="32%" r="85%"><stop offset="0" stop-color="${lighten(cB, 0.12)}"/><stop offset="1" stop-color="${darken(cB, 0.35)}"/></radialGradient></defs>`,
    `<rect width="${w}" height="${h}" fill="url(#bg)"/>`,
  ];
  for (let i = 0; i < 12; i++) {
    parts.push(
      `<circle cx="${num(rng() * w)}" cy="${num(rng() * h * 0.7)}" r="${num(w * (0.02 + rng() * 0.05))}" fill="${mixHex(cA, "#ffffff", rng() * 0.4)}" opacity="${num(0.1 + rng() * 0.22, 2)}" filter="url(#blurBig)"/>`,
    );
  }

  if (scene.extra === "confetti") {
    for (let i = 0; i < 26; i++) {
      const size = (8 + rng() * 12) * u;
      parts.push(
        `<rect x="${num(rng() * w)}" y="${num(rng() * h)}" width="${num(size, 2)}" height="${num(size * 0.6, 2)}" fill="${mixHex(cA, "#ffffff", rng() * 0.5)}" opacity="${num(0.4 + rng() * 0.35, 2)}" transform="rotate(${num(rng() * 180)} ${num(rng() * w)} ${num(rng() * h)})"/>`,
      );
    }
  } else if (scene.extra === "hearts") {
    const heartD = "M0 6 C0 1 6 0 9 3 C12 0 18 1 18 6 C18 11 9 17 9 17 C9 17 0 11 0 6 Z";
    for (let i = 0; i < 6; i++) {
      const scale = (2.2 + rng() * 2.4) * u * 6;
      const hx = w * (0.12 + rng() * 0.76);
      const hy = h * (0.25 + rng() * 0.55);
      parts.push(
        `<path d="${heartD}" fill="${lighten(cA, rng() * 0.25)}" opacity="${num(0.55 + rng() * 0.35, 2)}" transform="translate(${num(hx - scale)} ${num(hy - scale)}) scale(${num(scale, 2)}) rotate(${num((rng() - 0.5) * 24)} )"/>`,
      );
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const fx = w * (0.15 + rng() * 0.7);
      const fy = h * (0.3 + rng() * 0.55);
      const fr = w * (0.03 + rng() * 0.04);
      const petals = [];
      for (let k = 0; k < 6; k++) {
        const angle = (k / 6) * 360;
        petals.push(
          `<ellipse cx="0" cy="${num(-fr * 1.1)}" rx="${num(fr * 0.55)}" ry="${num(fr * 1.1)}" fill="${lighten(cA, k / 12)}" opacity="0.85" transform="rotate(${angle})"/>`,
        );
      }
      parts.push(`<g transform="translate(${num(fx)} ${num(fy)})">${petals.join("")}<circle r="${num(fr * 0.35)}" fill="${cT}"/></g>`);
    }
  }
  return parts.join("\n");
}

function drawStreaks({ w, h, u, rng, cA, cB, cT, deep, scene }) {
  const parts = [
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${darken(cB, 0.25)}"/><stop offset="1" stop-color="${deep}"/></linearGradient>`,
    `<linearGradient id="streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${lighten(cA, 0.2)}" stop-opacity="0"/><stop offset="0.35" stop-color="${cA}" stop-opacity="1"/><stop offset="0.85" stop-color="${cT}" stop-opacity="0.6"/><stop offset="1" stop-color="${cT}" stop-opacity="0"/></linearGradient></defs>`,
    `<rect width="${w}" height="${h}" fill="url(#bg)"/>`,
    `<ellipse cx="${num(w * (0.3 + rng() * 0.4))}" cy="${num(h * (0.35 + rng() * 0.3))}" rx="${num(w * 0.3)}" ry="${num(h * 0.18)}" fill="${cA}" opacity="0.3" filter="url(#blurBig)"/>`,
  ];

  for (let i = 0; i < 9; i++) {
    const y = h * (0.08 + rng() * 0.78);
    const len = w * (0.25 + rng() * 0.55);
    const th = Math.max(2, (2 + rng() * 7) * u);
    const rot = (rng() - 0.5) * 8;
    parts.push(
      `<rect x="${num(w * rng() * 0.6 - len * 0.1)}" y="${num(y)}" width="${num(len)}" height="${num(th, 2)}" rx="${num(th / 2, 2)}" fill="url(#streak)" opacity="${num(0.25 + rng() * 0.5, 2)}" transform="rotate(${num(rot, 2)} ${num(w / 2)} ${num(y)})"${rng() < 0.3 ? ' filter="url(#blurSoft)"' : ""}/>`,
    );
  }
  for (let i = 0; i < 14; i++) {
    const y = h * rng();
    parts.push(
      `<rect x="${num(w * rng() * 0.5)}" y="${num(y)}" width="${num(w * (0.35 + rng() * 0.45))}" height="${num(Math.max(1, 1.4 * u), 2)}" fill="#ffffff" opacity="${num(0.04 + rng() * 0.05, 2)}" transform="rotate(${num((rng() - 0.5) * 12, 2)} ${w / 2} ${num(y)})"/>`,
    );
  }
  if (scene.letterbox) {
    parts.push(`<rect x="0" y="0" width="${w}" height="${num(h * 0.075)}" fill="#000000" opacity="0.96"/>`);
    parts.push(`<rect x="0" y="${num(h * 0.925)}" width="${w}" height="${num(h * 0.075)}" fill="#000000" opacity="0.96"/>`);
  }
  return parts.join("\n");
}

function drawMono({ w, h, u, rng, cA, cB, cT, deep, scene }) {
  const parts = [
    `<rect width="${w}" height="${h}" fill="${deep}"/>`,
    `<path d="M0 ${num(h * 0.42)} L ${w} ${num(h * 0.24)} L ${w} ${h} L 0 ${h} Z" fill="${darken(cB, 0.45)}" opacity="0.8"/>`,
    `<circle cx="${num(w * 0.66)}" cy="${num(h * 0.38)}" r="${num(h * 0.3)}" fill="none" stroke="${cT}" stroke-width="${num(2.2 * u, 2)}" opacity="0.55"/>`,
    `<circle cx="${num(w * 0.66)}" cy="${num(h * 0.38)}" r="${num(h * 0.3 * 0.62)}" fill="none" stroke="${cT}" stroke-width="${num(1.4 * u, 2)}" opacity="0.2"/>`,
    `<rect x="${num(w * 0.2)}" y="${num(h * 0.3)}" width="${num(h * 0.08)}" height="${num(h * 0.08)}" fill="${cA}" opacity="0.8" transform="rotate(14 ${num(w * 0.2)} ${num(h * 0.3)})"/>`,
    `<rect x="0" y="${num(h * 0.62)}" width="${w}" height="${num(2.5 * u)}" fill="${cT}" opacity="0.22"/>`,
  ];
  return parts.join("\n");
}

const SCENE_FN = {
  aurora: drawAurora,
  orb: drawOrb,
  ridges: drawRidges,
  citygrid: drawCitygrid,
  bloom: drawBloom,
  streaks: drawStreaks,
  mono: drawMono,
};

// ------------------------------------------------------------ composición ---
function buildSvg(item, w, h) {
  const scene = SCENES[item.category];
  if (!scene) throw new Error(`Categoría sin escena: ${item.category}`);
  const rng = mulberry32(item.id * 2689 + 7);
  const grainRng = mulberry32(item.id * 7877 + 11);
  const u = w / 1920;
  const dominant = rotateHue(item.dominant, ((item.id * 11) % 9) - 4);
  const secondary = rotateHue(item.secondary, ((item.id * 7) % 7) - 3);
  const tertiary = lighten(dominant, 0.55);
  const deep = darken(secondary, 0.5);
  const grainSeed = Math.floor(grainRng() * 400);

  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`,
    blurFilter("blurSoft", 6 * u),
    blurFilter("blurMid", 30 * u),
    blurFilter("blurBig", 90 * u),
    SCENE_FN[scene.type]({ w, h, u, rng, cA: dominant, cB: secondary, cT: tertiary, deep, scene }),
    grainOverlay(w, h, grainSeed, scene.type === "mono" ? 0.06 : 0.045),
    vignette(w, h),
    "</svg>",
  ];
  return parts.join("\n");
}

function wrapHtml(item, w, h) {
  const svg = buildSvg(item, w, h);
  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#000;overflow:hidden}</style></head><body><div style="width:${w}px;height:${h}px;overflow:hidden">${svg}</div></body></html>`;
}

// ------------------------------------------------------------ validaciones ---
if (rawItems.length !== 60) throw new Error(`Se esperaban 60 items, hay ${rawItems.length}`);
if (new Set(rawItems.map((item) => item.category)).size !== 30) throw new Error("Se esperaban 30 categorías");
if (new Set(rawItems.map((item) => item.id)).size !== 60) throw new Error("Ids duplicados");
for (const item of rawItems) {
  if (!SCENES[item.category]) throw new Error(`Categoría sin escena: ${item.category}`);
}

// ------------------------------------------------------------------- main ---
async function main() {
  const { chromium } = await import("@playwright/test");

  mkdirSync(thumbsDir, { recursive: true });
  mkdirSync(fullDir, { recursive: true });

  let removed = 0;
  for (const dir of [fullDir, thumbsDir]) {
    if (existsSync(dir)) {
      for (const file of readdirSync(dir)) {
        if (file.endsWith(".svg")) {
          rmSync(join(dir, file));
          removed++;
        }
      }
    }
  }
  if (removed > 0) console.log(`Eliminados ${removed} SVG obsoletos`);

  const browser = await chromium.launch({
    args: ["--force-color-profile=srgb", "--disable-lcd-text"],
  });
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  const page = await context.newPage();

  const jobs = [];
  for (const item of rawItems) {
    jobs.push({ item, w: THUMB_W, h: THUMB_H, quality: 78, out: join(thumbsDir, `${item.id}${JPEG_EXT}`) });
    for (const resolution of RESOLUTIONS) {
      jobs.push({
        item,
        w: resolution.width,
        h: resolution.height,
        quality: resolution.quality,
        out: join(fullDir, `${item.slug}-${resolution.width}x${resolution.height}-${item.id}${JPEG_EXT}`),
      });
    }
  }

  let done = 0;
  for (const job of jobs) {
    await page.setViewportSize({ width: job.w, height: job.h });
    await page.setContent(wrapHtml(job.item, job.w, job.h));
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.screenshot({ path: job.out, type: "jpeg", quality: job.quality });
    done++;
    if (done % 20 === 0) console.log(`render ${done}/${jobs.length}...`);
  }

  await browser.close();

  const wallpapers = rawItems.map((item) => {
    const resolutions = RESOLUTIONS.map((resolution) => ({
      label: resolution.label,
      width: resolution.width,
      height: resolution.height,
      url: `/walls/full/${item.slug}-${resolution.width}x${resolution.height}-${item.id}${JPEG_EXT}`,
    }));
    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.category,
      tags: item.tags,
      width: DEFAULT_RESOLUTION.width,
      height: DEFAULT_RESOLUTION.height,
      thumb: `/walls/thumbs/${item.id}${JPEG_EXT}`,
      full: resolutions[1].url,
      resolutions,
      dominant: item.dominant,
    };
  });

  for (const wallpaper of wallpapers) {
    for (const resolution of [wallpaper.full, wallpaper.thumb, ...wallpaper.resolutions.map((r) => r.url)]) {
      const path = join(rootDir, "public", resolution.replace(/^\//, "").split("?")[0]);
      if (!existsSync(path)) throw new Error(`Falta el asset: ${path}`);
    }
  }

  writeFileSync(join(rootDir, "data", "wallpapers.json"), JSON.stringify(wallpapers, null, 2) + "\n", "utf8");

  let bytes = 0;
  for (const dir of [thumbsDir, fullDir]) {
    for (const file of readdirSync(dir)) {
      bytes += statSync(join(dir, file)).size;
    }
  }
  console.log(
    `T-013: ${wallpapers.length} items × ${RESOLUTIONS.length + 1} renders (thumb + full) = ${jobs.length} JPEG · ${(bytes / 1024 / 1024).toFixed(1)} MB · data/wallpapers.json actualizado`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
