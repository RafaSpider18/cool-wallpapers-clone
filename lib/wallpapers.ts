import rawWallpapers from "@/data/wallpapers.json";

export type WallpaperResolution = {
  label: string;
  width: number;
  height: number;
  url: string;
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
};

export const wallpapers: Wallpaper[] = rawWallpapers as unknown as Wallpaper[];

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

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const p = Math.max(1, Math.floor(page));
  const size = Math.max(1, Math.floor(perPage));
  const start = (p - 1) * size;
  return items.slice(start, start + size);
}
