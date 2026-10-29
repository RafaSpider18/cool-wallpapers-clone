import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { getByTag, publishedTags } from "@/lib/wallpapers";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

// T-018: páginas estáticas por tag (SEO long-tail), página 1 prerenderizada.
export async function generateStaticParams() {
  return publishedTags().map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag: slug } = await params;
  const entry = getByTag(slug);

  if (!entry) return {};

  const title = entry.tag.charAt(0).toUpperCase() + entry.tag.slice(1);
  return {
    title: `${title} wallpapers | Cool Wallpapers`,
    description: `${entry.items.length} wallpapers con el tag "${entry.tag}" para tu pantalla.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: slug } = await params;
  const entry = getByTag(slug);

  if (!entry) {
    notFound();
  }

  const title = entry.tag.charAt(0).toUpperCase() + entry.tag.slice(1);

  return (
    <main className="mx-auto w-full max-w-container px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/cool-wallpapers" },
          { label: "Tags", href: "/tags" },
          { label: title },
        ]}
      />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{title} wallpapers</h1>
        <p className="mt-2 text-muted">
          {entry.items.length} wallpapers con el tag «{entry.tag}».
        </p>
      </header>
      {/* SSG (T-014/T-018): página 1 en el HTML y ?page=N resuelto tras montar. */}
      <CategoryBrowser items={entry.items} />
    </main>
  );
}
