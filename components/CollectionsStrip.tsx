import Link from "next/link";
import collections from "@/data/collections.json";

type Collection = {
  slug: string;
  title: string;
  category: string;
  thumb: string;
};

const COLLECTIONS = collections as Collection[];

export function CollectionsStrip() {
  return (
    <section className="mt-12" aria-label="Colecciones">
      <h2 className="mb-4 text-xl font-semibold text-text">Colecciones</h2>
      <ul className="flex gap-4 overflow-x-auto pb-2">
        {COLLECTIONS.map((collection) => (
          <li key={collection.slug} className="shrink-0">
            <Link
              href={`/${collection.category}`}
              className="block w-56 rounded-card border border-border bg-surface p-3 transition-colors hover:bg-surface-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={collection.thumb}
                alt={collection.title}
                loading="lazy"
                className="aspect-video w-full rounded-button object-cover"
              />
              <p className="mt-2 truncate text-sm font-medium text-text">
                {collection.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
