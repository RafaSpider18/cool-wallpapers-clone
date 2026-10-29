import Link from "next/link";
import { search } from "@/lib/wallpapers";
import { WallpaperGrid } from "@/components/WallpaperGrid";

const POPULAR_CATEGORIES = [
  { slug: "anime", label: "Anime" },
  { slug: "space", label: "Space" },
  { slug: "cute", label: "Cute" },
];

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? search(query) : [];

  const isEmpty = query ? results.length === 0 : true;

  return (
    <main className="mx-auto max-w-container px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-text">
        Búsqueda
      </h1>

      {query ? (
        <p className="mt-4 text-muted">
          {results.length} {results.length === 1 ? "resultado" : "resultados"} para &quot;{query}&quot;
        </p>
      ) : null}

      {isEmpty ? (
        <div className="mt-8 rounded-card border border-border bg-surface p-8 text-center">
          <p className="text-text">
            {query
              ? `No encontramos wallpapers para "${query}". Prueba con otro término.`
              : "Escribe un término en el buscador para explorar los wallpapers."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/cool-wallpapers"
              className="rounded-button bg-accent px-4 py-2 text-sm font-semibold text-bg"
            >
              Ver todos los wallpapers
            </Link>
            {POPULAR_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="rounded-button border border-border bg-surface px-4 py-2 text-sm text-text hover:bg-surface-2"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <WallpaperGrid wallpapers={results} />
      )}
    </main>
  );
}
