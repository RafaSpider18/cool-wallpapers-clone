"use client";

type LoadMoreProps = {
  onLoadMore: () => void;
  loading?: boolean;
  hasMore?: boolean;
};

export function LoadMore({ onLoadMore, loading = false, hasMore = true }: LoadMoreProps) {
  if (!hasMore) return null;

  return (
    <button
      type="button"
      onClick={onLoadMore}
      disabled={loading}
      className="rounded-[8px] bg-accent px-6 py-3 text-sm font-semibold text-bg disabled:opacity-40"
    >
      {loading ? "Loading…" : "Load more"}
    </button>
  );
}
