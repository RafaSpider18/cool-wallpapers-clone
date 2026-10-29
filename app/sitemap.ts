import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { wallpapers } from "@/lib/wallpapers";

const INFO_ROUTES = ["/privacy", "/terms", "/copyright", "/contact", "/upload"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const categories = Array.from(
    new Set(wallpapers.map((wallpaper) => wallpaper.category)),
  ).sort();

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/${category}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const wallpaperEntries: MetadataRoute.Sitemap = wallpapers.map((wallpaper) => ({
    url: `${siteUrl}/${wallpaper.category}/${wallpaper.slug}-${wallpaper.id}.html`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const infoEntries: MetadataRoute.Sitemap = INFO_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    {
      url: `${siteUrl}/cool-wallpapers`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryEntries,
    ...wallpaperEntries,
    ...infoEntries,
  ];
}
