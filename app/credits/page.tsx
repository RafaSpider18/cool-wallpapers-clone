import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { wallpapers } from "@/lib/wallpapers";

export const metadata: Metadata = {
  title: "Créditos de fotografía | Cool Wallpapers",
  description:
    "Atribución de las fotografías incluidas en el catálogo: autor, licencia y origen (Wikimedia Commons).",
};

// T-019: listado completo de créditos de la fotografía con licencia libre.
export default function CreditsPage() {
  const photos = wallpapers.filter((item) => item.source);

  return (
    <main className="mx-auto w-full max-w-container px-4 py-10">
      <Breadcrumbs items={[{ label: "Inicio", href: "/cool-wallpapers" }, { label: "Créditos" }]} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Créditos de fotografía</h1>
        <p className="mt-2 text-muted">
          Las fotografías de este sitio provienen de Wikimedia Commons con
          licencias abiertas (Public domain / CC0 / CC BY(-SA)). Cada imagen
          indica su autor y licencia, tal y como exigen sus términos.
        </p>
      </header>
      <ul className="space-y-4">
        {photos.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 rounded-card border border-border bg-surface p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumb}
              alt={item.title}
              width={96}
              height={54}
              loading="lazy"
              style={{ backgroundColor: item.dominant }}
              className="h-[54px] w-[96px] rounded-[8px] object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-text">
                {item.title}{" "}
                <span className="font-normal text-muted">
                  ({item.category}) — por {item.source!.author} ·{" "}
                  {item.source!.license} ·{" "}
                  <a
                    href={item.source!.page}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-border underline-offset-2 hover:text-text"
                  >
                    origen
                  </a>
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
