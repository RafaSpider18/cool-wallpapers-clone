import rawWallpapers from "@/data/wallpapers.json";
import rawPhotos from "@/data/photos.json";

export type WallpaperResolution = {
  label: string;
  width: number;
  height: number;
  url: string;
};

/** Crédito de fotografía real (T-019): fuente Wikimedia Commons con licencia abierta. */
export type PhotoSource = {
  author: string;
  license: string;
  page: string;
};

export type Wallpaper = {
  id: number;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  width: number;
  height: number;
  thumb: string;
  full: string;
  resolutions: WallpaperResolution[];
  dominant: string;
  source?: PhotoSource;
};

// Catálogo total: arte generativo propio (wallpapers.json) + fotografía de
// Wikimedia Commons con licencia abierta (photos.json, T-019).
export const wallpapers: Wallpaper[] = [
  ...(rawWallpapers as unknown as Wallpaper[]),
  ...(rawPhotos as unknown as Wallpaper[]),
];

export function getByCategory(category: string): Wallpaper[] {
  const key = category.trim().toLowerCase();
  return wallpapers.filter((w) => w.category.toLowerCase() === key);
}

export function getById(id: number): Wallpaper | undefined {
  return wallpapers.find((w) => w.id === id);
}

export function search(query: string): Wallpaper[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const haystack = (w: Wallpaper) =>
    [w.title, w.slug, w.category, ...w.tags].join(" ").toLowerCase();
  return wallpapers.filter((w) => haystack(w).includes(q));
}

// T-018 — índice de tags y utilidades para las rutas /tag/[tag] y /tags.
export type TagEntry = { tag: string; slug: string; count: number };

const TAG_MIN_COUNT = 2;

export function slugifyTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

export function tagIndex(): Map<string, Wallpaper[]> {
  const map = new Map<string, Wallpaper[]>();
  for (const wallpaper of wallpapers) {
    for (const tag of wallpaper.tags) {
      const list = map.get(tag);
      if (list) list.push(wallpaper);
      else map.set(tag, [wallpaper]);
    }
  }
  return map;
}

/** Tags publicados (con páginas propias): Count >= 2, ordenados por popularidad. */
export function publishedTags(): TagEntry[] {
  return [...tagIndex().entries()]
    .filter(([, list]) => list.length >= TAG_MIN_COUNT)
    .map(([tag, list]) => ({ tag, slug: slugifyTag(tag), count: list.length }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getByTag(slug: string): { tag: string; items: Wallpaper[] } | undefined {
  const entry = publishedTags().find((candidate) => candidate.slug === slug);
  if (!entry) return undefined;
  return { tag: entry.tag, items: tagIndex().get(entry.tag) ?? [] };
}

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const p = Math.max(1, Math.floor(page));
  const size = Math.max(1, Math.floor(perPage));
  const start = (p - 1) * size;
  return items.slice(start, start + size);
}
