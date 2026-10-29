import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe o ha cambiado de dirección.",
};

const POPULAR_CATEGORIES = [
  { slug: "abstract", label: "Abstract" },
  { slug: "anime", label: "Anime" },
  { slug: "nature", label: "Nature" },
  { slug: "space", label: "Space" },
];

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-container flex-col items-center px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        Error 404
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-text">
        Esta página no existe
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Puede que el enlace esté mal escrito o que el contenido se haya movido.
        Prueba con el catálogo completo o busca por categoría.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/cool-wallpapers"
          className="rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-bg"
        >
          Ver todos los wallpapers
        </Link>
        <Link
          href="/search"
          className="rounded-button border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text hover:bg-surface-2"
        >
          Buscar
        </Link>
      </div>

      <nav aria-label="Categorías populares" className="mt-12">
        <p className="text-sm text-muted">Categorías populares</p>
        <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {POPULAR_CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/${category.slug}`}
                className="text-sm text-accent underline-offset-4 hover:underline"
              >
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
