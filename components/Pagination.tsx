"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageItem = number | "…";

function pageWindow(current: number, total: number): PageItem[] {
  const first = 1;
  const last = total;
  if (total <= 1) return [first];
  if (current <= first || current >= last) return [first, "…", last];
  const pages = new Set<number>([first, current, last]);
  [current - 1, current, current + 1].forEach((p) => {
    if (p >= first && p <= last) pages.add(p);
  });
  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];
  let prev: number | null = null;
  for (const p of sorted) {
    if (prev !== null && p - prev > 1) items.push("…");
    items.push(p);
    prev = p;
  }
  return items;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = pageWindow(currentPage, totalPages);
  const goTo = (page: number) => onPageChange(Math.min(Math.max(1, page), totalPages));

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-[8px] border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] disabled:opacity-40"
      >
        « Prev
      </button>
      {pages.map((item, index) =>
        item === "…" ? (
          <span key={`ellipsis-${index}`} className="px-1 text-[var(--muted)]">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => goTo(item)}
            disabled={item === currentPage}
            className={`rounded-[8px] px-3 py-2 text-sm ${
              item === currentPage ? "bg-accent text-bg" : "text-[var(--text)]"
            }`}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-[8px] border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] disabled:opacity-40"
      >
        Next ›
      </button>
    </nav>
  );
}
