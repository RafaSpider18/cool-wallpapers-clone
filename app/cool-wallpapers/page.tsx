import type { Metadata } from "next";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { CollectionsStrip } from "@/components/CollectionsStrip";
import { wallpapers } from "@/lib/wallpapers";

export const metadata: Metadata = {
  title: "Cool Wallpapers",
  description: "Wallpapers 4K inspiradores para tu pantalla.",
};

export default async function CoolWallpapersPage() {
  return (
    <main className="mx-auto w-full max-w-container px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Cool Wallpapers</h1>
        <p className="mt-2 text-muted">Los mejores wallpapers 4K para tu pantalla.</p>
      </header>
      <CollectionsStrip />
      {/* Ruta estática (T-014): el servidor pre-renderiza página 1 y CategoryBrowser
          resuelve ?page=N tras montar, para que el <head> incluya title/description. */}
      <CategoryBrowser items={wallpapers} />
    </main>
  );
}
