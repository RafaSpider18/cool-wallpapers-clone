"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CategoryMenu from "./CategoryMenu";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();

  // Se lee en el cliente (sin useSearchParams) para no forzar un bailout a CSR,
  // que retrasaba el header y provocaba un layout shift grande (CLS).
  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <div className="mx-auto flex max-w-container flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center">
        <Link
          href="/cool-wallpapers"
          className="text-lg font-semibold tracking-tight text-text"
        >
          <span className="text-accent">4K</span> Wallpapers
        </Link>

        <form
          action="/search"
          method="get"
          className="flex w-full items-center gap-2 sm:flex-1"
        >
          <input
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar wallpapers"
            aria-label="Buscar wallpapers"
            className="w-full rounded-button border border-border bg-surface-2 px-3 py-2 text-text placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-button bg-accent px-4 py-2 text-sm font-semibold text-bg"
          >
            Buscar
          </button>
        </form>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="category-menu"
            className="rounded-button border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
          >
            Categories
          </button>
          <CategoryMenu open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}
