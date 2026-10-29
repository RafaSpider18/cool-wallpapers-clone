import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const wallsDir = join(rootDir, "public", "walls");

const FULL_W = 1920;
const FULL_H = 1080;
const THUMB_W = 640;
const THUMB_H = 360;

function buildSvg(dominant, secondary, width, height, index) {
  const gradId = `grad${index}`;
  const cx = Math.round(width * (0.65 + ((index * 37) % 20) / 100));
  const cy = Math.round(height * (0.3 + ((index * 53) % 30) / 100));
  const r = Math.round(width * (0.18 + ((index * 29) % 15) / 100));
  const cx2 = Math.round(width * (0.15 + ((index * 41) % 25) / 100));
  const cy2 = Math.round(height * (0.6 + ((index * 17) % 30) / 100));
  const r2 = Math.round(width * (0.22 + ((index * 13) % 20) / 100));
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    "  <defs>",
    `    <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">`,
    `      <stop offset="0" stop-color="${dominant}" />`,
    `      <stop offset="1" stop-color="${secondary}" />`,
    "    </linearGradient>",
    "  </defs>",
    `  <rect width="${width}" height="${height}" fill="url(#${gradId})" />`,
    `  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" opacity="0.10" />`,
    `  <circle cx="${cx2}" cy="${cy2}" r="${r2}" fill="#000000" opacity="0.12" />`,
    "</svg>",
    "",
  ].join("\n");
}

const rawItems = [
  { id: 1, slug: "aurora-veil", title: "Aurora Veil", category: "abstract", tags: ["abstract", "gradient", "minimal"], width: FULL_W, height: FULL_H, dominant: "#7c3aed", secondary: "#312e81" },
  { id: 2, slug: "prism-drift", title: "Prism Drift", category: "abstract", tags: ["abstract", "color", "hd"], width: FULL_W, height: FULL_H, dominant: "#06b6d4", secondary: "#164e63" },
  { id: 3, slug: "wild-echo", title: "Wild Echo", category: "animals", tags: ["animals", "wildlife", "nature"], width: FULL_W, height: FULL_H, dominant: "#65a30d", secondary: "#1a2e05" },
  { id: 4, slug: "gentle-paw", title: "Gentle Paw", category: "animals", tags: ["animals", "cute", "pet"], width: FULL_W, height: FULL_H, dominant: "#f59e0b", secondary: "#451a03" },
  { id: 5, slug: "neon-ronin", title: "Neon Ronin", category: "anime", tags: ["anime", "neon", "samurai"], width: FULL_W, height: FULL_H, dominant: "#ec4899", secondary: "#500724" },
  { id: 6, slug: "star-kami", title: "Star Kami", category: "anime", tags: ["anime", "space", "divine"], width: FULL_W, height: FULL_H, dominant: "#8b5cf6", secondary: "#2e1065" },
  { id: 7, slug: "steel-skyline", title: "Steel Skyline", category: "architecture", tags: ["architecture", "city", "urban"], width: FULL_W, height: FULL_H, dominant: "#64748b", secondary: "#0f172a" },
  { id: 8, slug: "glass-spire", title: "Glass Spire", category: "architecture", tags: ["architecture", "minimal", "tower"], width: FULL_W, height: FULL_H, dominant: "#38bdf8", secondary: "#082f49" },
  { id: 9, slug: "midnight-ride", title: "Midnight Ride", category: "bikes", tags: ["bikes", "motorcycle", "night"], width: FULL_W, height: FULL_H, dominant: "#ef4444", secondary: "#450a0a" },
  { id: 10, slug: "coastal-dash", title: "Coastal Dash", category: "bikes", tags: ["bikes", "coast", "sport"], width: FULL_W, height: FULL_H, dominant: "#14b8a6", secondary: "#042f2e" },
  { id: 11, slug: "void-pulse", title: "Void Pulse", category: "black-dark", tags: ["black", "dark", "night"], width: FULL_W, height: FULL_H, dominant: "#1e293b", secondary: "#020617" },
  { id: 12, slug: "nocturne", title: "Nocturne", category: "black-dark", tags: ["black", "blue", "dark"], width: FULL_W, height: FULL_H, dominant: "#312e81", secondary: "#0c0a1d" },
  { id: 13, slug: "redline-dream", title: "Redline Dream", category: "cars", tags: ["cars", "supercar", "sport"], width: FULL_W, height: FULL_H, dominant: "#dc2626", secondary: "#450a0a" },
  { id: 14, slug: "midnight-gt", title: "Midnight GT", category: "cars", tags: ["cars", "gt", "night"], width: FULL_W, height: FULL_H, dominant: "#334155", secondary: "#0f172a" },
  { id: 15, slug: "festival-glow", title: "Festival Glow", category: "celebrations", tags: ["celebrations", "party", "glow"], width: FULL_W, height: FULL_H, dominant: "#f97316", secondary: "#431407" },
  { id: 16, slug: "fireworks-night", title: "Fireworks Night", category: "celebrations", tags: ["celebrations", "fireworks", "night"], width: FULL_W, height: FULL_H, dominant: "#eab308", secondary: "#422006" },
  { id: 17, slug: "kawaii-day", title: "Kawaii Day", category: "cute", tags: ["cute", "kawaii", "anime"], width: FULL_W, height: FULL_H, dominant: "#f472b6", secondary: "#500724" },
  { id: 18, slug: "bunny-halo", title: "Bunny Halo", category: "cute", tags: ["cute", "animal", "spring"], width: FULL_W, height: FULL_H, dominant: "#fb7185", secondary: "#4c0519" },
  { id: 19, slug: "dragon-haze", title: "Dragon's Haze", category: "fantasy", tags: ["fantasy", "dragon", "magic"], width: FULL_W, height: FULL_H, dominant: "#a855f7", secondary: "#3b0764" },
  { id: 20, slug: "arcane-grove", title: "Arcane Grove", category: "fantasy", tags: ["fantasy", "forest", "magic"], width: FULL_W, height: FULL_H, dominant: "#22c55e", secondary: "#052e16" },
  { id: 21, slug: "petal-storm", title: "Petal Storm", category: "flowers", tags: ["flowers", "nature", "wind"], width: FULL_W, height: FULL_H, dominant: "#e11d48", secondary: "#881337" },
  { id: 22, slug: "rose-circuit", title: "Rose Circuit", category: "flowers", tags: ["flowers", "garden", "color"], width: FULL_W, height: FULL_H, dominant: "#f97316", secondary: "#7c2d12" },
  { id: 23, slug: "taco-sunset", title: "Taco Sunset", category: "food", tags: ["food", "mexican", "sunset"], width: FULL_W, height: FULL_H, dominant: "#ea580c", secondary: "#431407" },
  { id: 24, slug: "sushi-wave", title: "Sushi Wave", category: "food", tags: ["food", "japanese", "ocean"], width: FULL_W, height: FULL_H, dominant: "#06b6d4", secondary: "#164e63" },
  { id: 25, slug: "pixel-dawn", title: "Pixel Dawn", category: "games", tags: ["games", "pixel", "8bit"], width: FULL_W, height: FULL_H, dominant: "#22c55e", secondary: "#052e16" },
  { id: 26, slug: "boss-rush", title: "Boss Rush", category: "games", tags: ["games", "boss", "action"], width: FULL_W, height: FULL_H, dominant: "#ef4444", secondary: "#450a0a" },
  { id: 27, slug: "sunset-fade", title: "Sunset Fade", category: "gradients", tags: ["gradients", "sunset", "smooth"], width: FULL_W, height: FULL_H, dominant: "#f59e0b", secondary: "#451a03" },
  { id: 28, slug: "ocean-glow", title: "Ocean Glow", category: "gradients", tags: ["gradients", "ocean", "blue"], width: FULL_W, height: FULL_H, dominant: "#0ea5e9", secondary: "#082f49" },
  { id: 29, slug: "render-7", title: "Render 7", category: "cgi", tags: ["cgi", "render", "3d"], width: FULL_W, height: FULL_H, dominant: "#a855f7", secondary: "#3b0764" },
  { id: 30, slug: "poly-haven", title: "Poly Haven", category: "cgi", tags: ["cgi", "3d", "studio"], width: FULL_W, height: FULL_H, dominant: "#6366f1", secondary: "#1e1b4b" },
  { id: 31, slug: "urban-quiet", title: "Urban Quiet", category: "lifestyle", tags: ["lifestyle", "city", "minimal"], width: FULL_W, height: FULL_H, dominant: "#94a3b8", secondary: "#1e293b" },
  { id: 32, slug: "morning-light", title: "Morning Light", category: "lifestyle", tags: ["lifestyle", "morning", "home"], width: FULL_W, height: FULL_H, dominant: "#fbbf24", secondary: "#451a03" },
  { id: 33, slug: "heartbeat", title: "Heartbeat", category: "love", tags: ["love", "heart", "red"], width: FULL_W, height: FULL_H, dominant: "#f43f5e", secondary: "#4c0519" },
  { id: 34, slug: "adore", title: "Adore", category: "love", tags: ["love", "couple", "soft"], width: FULL_W, height: FULL_H, dominant: "#fb7185", secondary: "#500724" },
  { id: 35, slug: "tactical-dusk", title: "Tactical Dusk", category: "military", tags: ["military", "tactical", "army"], width: FULL_W, height: FULL_H, dominant: "#475569", secondary: "#0f172a" },
  { id: 36, slug: "iron-horizon", title: "Iron Horizon", category: "military", tags: ["military", "army", "armor"], width: FULL_W, height: FULL_H, dominant: "#64748b", secondary: "#1e293b" },
  { id: 37, slug: "mono-silence", title: "Mono Silence", category: "minimal", tags: ["minimal", "mono", "black"], width: FULL_W, height: FULL_H, dominant: "#94a3b8", secondary: "#1e293b" },
  { id: 38, slug: "bare-space", title: "Bare Space", category: "minimal", tags: ["minimal", "space", "calm"], width: FULL_W, height: FULL_H, dominant: "#a8a29e", secondary: "#292524" },
  { id: 39, slug: "reel-shadow", title: "Reel Shadow", category: "movies", tags: ["movies", "cinema", "night"], width: FULL_W, height: FULL_H, dominant: "#334155", secondary: "#020617" },
  { id: 40, slug: "silver-screen", title: "Silver Screen", category: "movies", tags: ["movies", "film", "classic"], width: FULL_W, height: FULL_H, dominant: "#94a3b8", secondary: "#334155" },
  { id: 41, slug: "bassline", title: "Bassline", category: "music", tags: ["music", "bass", "energy"], width: FULL_W, height: FULL_H, dominant: "#8b5cf6", secondary: "#2e1065" },
  { id: 42, slug: "vinyl-haze", title: "Vinyl Haze", category: "music", tags: ["music", "vinyl", "retro"], width: FULL_W, height: FULL_H, dominant: "#d946ef", secondary: "#4a044e" },
  { id: 43, slug: "misty-ridge", title: "Misty Ridge", category: "nature", tags: ["nature", "mountain", "fog"], width: FULL_W, height: FULL_H, dominant: "#38bdf8", secondary: "#0c4a6e" },
  { id: 44, slug: "forest-whisper", title: "Forest Whisper", category: "nature", tags: ["nature", "forest", "green"], width: FULL_W, height: FULL_H, dominant: "#16a34a", secondary: "#052e16" },
  { id: 45, slug: "studio-light", title: "Studio Light", category: "people", tags: ["people", "portrait", "light"], width: FULL_W, height: FULL_H, dominant: "#f472b6", secondary: "#500724" },
  { id: 46, slug: "crowd-glow", title: "Crowd Glow", category: "people", tags: ["people", "city", "night"], width: FULL_W, height: FULL_H, dominant: "#fb923c", secondary: "#431407" },
  { id: 47, slug: "golden-hour", title: "Golden Hour", category: "photography", tags: ["photography", "golden", "sunset"], width: FULL_W, height: FULL_H, dominant: "#f59e0b", secondary: "#451a03" },
  { id: 48, slug: "aperture", title: "Aperture", category: "photography", tags: ["photography", "camera", "lens"], width: FULL_W, height: FULL_H, dominant: "#60a5fa", secondary: "#1e3a8a" },
  { id: 49, slug: "still-words", title: "Still Words", category: "quotes", tags: ["quotes", "minimal", "peace"], width: FULL_W, height: FULL_H, dominant: "#a8a29e", secondary: "#292524" },
  { id: 50, slug: "silent-echo", title: "Silent Echo", category: "quotes", tags: ["quotes", "poetry", "calm"], width: FULL_W, height: FULL_H, dominant: "#818cf8", secondary: "#312e81" },
  { id: 51, slug: "starship-drift", title: "Starship Drift", category: "scifi", tags: ["scifi", "space", "ship"], width: FULL_W, height: FULL_H, dominant: "#38bdf8", secondary: "#082f49" },
  { id: 52, slug: "cyber-dawn", title: "Cyber Dawn", category: "scifi", tags: ["scifi", "cyberpunk", "neon"], width: FULL_W, height: FULL_H, dominant: "#22d3ee", secondary: "#083344" },
  { id: 53, slug: "orbital-glow", title: "Orbital Glow", category: "space", tags: ["space", "planet", "glow"], width: FULL_W, height: FULL_H, dominant: "#818cf8", secondary: "#1e1b4b" },
  { id: 54, slug: "cosmic-dust", title: "Cosmic Dust", category: "space", tags: ["space", "galaxy", "stars"], width: FULL_W, height: FULL_H, dominant: "#c084fc", secondary: "#3b0764" },
  { id: 55, slug: "velocity", title: "Velocity", category: "sports", tags: ["sports", "speed", "track"], width: FULL_W, height: FULL_H, dominant: "#ef4444", secondary: "#450a0a" },
  { id: 56, slug: "final-sprint", title: "Final Sprint", category: "sports", tags: ["sports", "running", "energy"], width: FULL_W, height: FULL_H, dominant: "#f97316", secondary: "#431407" },
  { id: 57, slug: "circuit-glow", title: "Circuit Glow", category: "technology", tags: ["technology", "circuit", "tech"], width: FULL_W, height: FULL_H, dominant: "#4f46e5", secondary: "#1e1b4b" },
  { id: 58, slug: "data-stream", title: "Data Stream", category: "technology", tags: ["technology", "data", "flow"], width: FULL_W, height: FULL_H, dominant: "#60a5fa", secondary: "#1e3a8a" },
  { id: 59, slug: "terra-nova", title: "Terra Nova", category: "world", tags: ["world", "earth", "planet"], width: FULL_W, height: FULL_H, dominant: "#34d399", secondary: "#064e3b" },
  { id: 60, slug: "global-echo", title: "Global Echo", category: "world", tags: ["world", "global", "community"], width: FULL_W, height: FULL_H, dominant: "#facc15", secondary: "#713f12" },
];

const wallpapers = rawItems.map((it) => ({
  id: it.id,
  slug: it.slug,
  title: it.title,
  category: it.category,
  tags: it.tags,
  width: it.width,
  height: it.height,
  thumb: `/walls/thumbs/${it.id}.svg`,
  full: `/walls/full/${it.slug}-${it.width}x${it.height}-${it.id}.svg`,
  dominant: it.dominant,
}));

const categories = new Set(wallpapers.map((w) => w.category));
if (wallpapers.length !== 60) throw new Error(`Expected 60 items, got ${wallpapers.length}`);
if (categories.size !== 30) throw new Error(`Expected 30 categories, got ${categories.size}`);

const thumbsDir = join(wallsDir, "thumbs");
const fullDir = join(wallsDir, "full");
mkdirSync(thumbsDir, { recursive: true });
mkdirSync(fullDir, { recursive: true });

for (const it of rawItems) {
  writeFileSync(join(thumbsDir, `${it.id}.svg`), buildSvg(it.dominant, it.secondary, THUMB_W, THUMB_H, it.id));
  writeFileSync(join(fullDir, `${it.slug}-${it.width}x${it.height}-${it.id}.svg`), buildSvg(it.dominant, it.secondary, it.width, it.height, it.id));
}

writeFileSync(join(rootDir, "data", "wallpapers.json"), JSON.stringify(wallpapers, null, 2) + "\n", "utf8");

console.log(`T-003: generados ${wallpapers.length} placeholders y catálogo en data/wallpapers.json`);
