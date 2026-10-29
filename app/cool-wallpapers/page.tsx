import type { Metadata } from "next";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { CollectionsStrip } from "@/components/CollectionsStrip";
import { wallpapers } from "@/lib/wallpapers";

export const metadata: Metadata = {
  title: "Cool Wallpapers",
  description: "Wallpapers 4K inspiradores para tu pantalla.",
};

type CoolWallpapersPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function CoolWallpapersPage({ searchParams }: CoolWallpapersPageProps) {
  const { page } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-container px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Cool Wallpapers</h1>
        <p className="mt-2 text-muted">Los mejores wallpapers 4K para tu pantalla.</p>
      </header>
      <CollectionsStrip />
      <CategoryBrowser items={wallpapers} page={Number(page) || 1} />
    </main>
  );
}
