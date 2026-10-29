import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ResolutionPicker } from "@/components/ResolutionPicker";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { getByTag, slugifyTag, wallpapers } from "@/lib/wallpapers";

type DetailPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

function parseIdFromSlug(slug: string): number | null {
  const suffix = ".html";
  if (!slug.endsWith(suffix)) return null;
  const stem = slug.slice(0, slug.length - suffix.length);
  const idx = stem.lastIndexOf("-");
  const idPart = stem.slice(idx + 1);
  if (idPart === "") return null;
  const num = Number(idPart);
  if (String(num) !== idPart) return null;
  return num;
}

export function generateStaticParams() {
  return wallpapers.map((w) => ({
    category: w.category,
    slug: `${w.slug}-${w.id}.html`,
  }));
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const id = parseIdFromSlug(slug);
  const item = id === null ? undefined : wallpapers.find((w) => w.id === id);

  return {
    title: item ? `${item.title} | Cool Wallpapers` : "Cool Wallpapers",
    description: item ? `Wallpaper ${item.title} de la categoría ${item.category}.` : "Wallpaper 4K.",
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { category, slug } = await params;
  const id = parseIdFromSlug(slug);
  const item = id === null ? undefined : wallpapers.find((w) => w.id === id);

  if (!item || item.category !== category) {
    notFound();
  }

  const related = wallpapers
    .filter((w) => w.category === category && w.id !== item.id)
    .slice(0, 4);

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main className="mx-auto w-full max-w-container px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/cool-wallpapers" },
          { label: categoryLabel, href: `/${category}` },
          { label: item.title },
        ]}
      />
      <article>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.thumb}
          alt={item.title}
          width={item.width}
          height={item.height}
          loading="lazy"
          style={{ backgroundColor: item.dominant }}
          className="aspect-video w-full rounded-[12px] object-cover"
        />
        <h1 className="mt-4 text-3xl font-bold">{item.title}</h1>
        <p className="mt-2 text-muted">Categoría: {item.category}</p>
        {item.source ? (
          <p className="mt-2 text-sm text-muted">
            Foto de {item.source.author} · licencia {item.source.license} ·{" "}
            <a
              href={item.source.page}
              target="_blank"
              rel="noreferrer nosponsored noopener"
              className="underline decoration-border underline-offset-2 hover:text-text"
            >
              Origen (Wikimedia Commons)
            </a>
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Link
              key={tag}
              href={getByTag(slugifyTag(tag)) ? `/tag/${slugifyTag(tag)}` : `/search?q=${encodeURIComponent(tag)}`}
              className="rounded-[8px] border border-[var(--border)] px-3 py-1 text-sm text-[var(--text)] transition-colors hover:border-accent hover:text-accent"
            >
              {tag}
            </Link>
          ))}
        </div>
        <ResolutionPicker slug={item.slug} resolutions={item.resolutions} />
      </article>
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Relacionados</h2>
        <WallpaperGrid wallpapers={related} />
      </section>
    </main>
  );
}
