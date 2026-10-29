"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LoadMore } from "./LoadMore";
import { Pagination } from "./Pagination";
import { WallpaperGrid } from "./WallpaperGrid";
import { type Wallpaper } from "@/lib/wallpapers";

const PER_PAGE = 12;

type CategoryBrowserProps = {
  items: Wallpaper[];
};

export function CategoryBrowser({ items }: CategoryBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();

  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  // Prerender: siempre página 1. ?page=N se lee tras montar desde
  // window.location (no useSearchParams) para mantener las rutas estáticas
  // y que el <head> incluya title/description (T-014).
  const [page, setPage] = useState(1);

  useEffect(() => {
    const wanted = Number(new URLSearchParams(window.location.search).get("page")) || 1;
    setPage(Math.min(Math.max(1, wanted), totalPages));
    // totalPages depende solo de `items` (prop estable).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  // "Load more" acumula sobre la página actual; se reinicia al navegar con Pagination.
  const [extra, setExtra] = useState({ page: 1, count: 0 });
  const added = extra.page === page ? extra.count : 0;

  const start = (page - 1) * PER_PAGE;
  const end = Math.min(start + PER_PAGE + added, items.length);
  const visibleItems = useMemo(() => items.slice(start, end), [items, start, end]);
  const hasMore = end < items.length;

  const onPageChange = (next: number) => {
    const target = Math.min(Math.max(1, next), totalPages);
    setPage(target);
    setExtra({ page: target, count: 0 });
    router.replace(target <= 1 ? pathname : `${pathname}?page=${target}`);
  };

  const onLoadMore = () => {
    setExtra({ page, count: added + PER_PAGE });
  };

  return (
    <div>
      <WallpaperGrid wallpapers={visibleItems} />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <LoadMore onLoadMore={onLoadMore} hasMore={hasMore} />
        </div>
      ) : null}
    </div>
  );
}
