import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { publishedTags } from "@/lib/wallpapers";

export const metadata: Metadata = {
  title: "Tags | Cool Wallpapers",
  description:
    "Explora los wallpapers por tema: anime, space, noche, minimalista y más tags de la colección.",
};

export default function TagsPage() {
  const tags = publishedTags();

  return (
    <main className="mx-auto w-full max-w-container px-4 py-10">
      <Breadcrumbs items={[{ label: "Inicio", href: "/cool-wallpapers" }, { label: "Tags" }]} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Tags</h1>
        <p className="mt-2 text-muted">
          Todos los temas de la colección. Toca un tag para ver sus wallpapers.
        </p>
      </header>
      <ul className="flex flex-wrap gap-3">
        {tags.map(({ slug, tag, count }) => (
          <li key={slug}>
            <Link
              href={`/tag/${slug}`}
              className="rounded-button border border-border bg-surface px-4 py-2 text-sm text-text hover:bg-surface-2"
            >
              {tag} <span className="text-muted">({count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
