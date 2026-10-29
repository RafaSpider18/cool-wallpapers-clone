import type { Wallpaper } from "@/lib/wallpapers";

type WallpaperCardProps = {
  wallpaper: Wallpaper;
};

export function WallpaperCard({ wallpaper }: WallpaperCardProps) {
  const detailHref = `/${wallpaper.category}/${wallpaper.slug}-${wallpaper.id}.html`;

  return (
    <div className="group relative overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)]">
      <div className="relative">
        <a href={detailHref} className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={wallpaper.thumb}
            alt={wallpaper.title}
            width={wallpaper.width}
            height={wallpaper.height}
            loading="lazy"
            style={{ backgroundColor: wallpaper.dominant }}
            className="aspect-video w-full object-cover"
          />
        </a>
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <a
            href={wallpaper.full}
            download
            className="absolute bottom-3 right-3 rounded-[8px] bg-accent px-4 py-2 text-sm font-semibold text-bg"
          >
            Download
          </a>
        </div>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium text-[var(--text)]">{wallpaper.title}</p>
      </div>
    </div>
  );
}
