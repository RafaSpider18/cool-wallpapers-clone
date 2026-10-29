import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { getByCategory } from "@/lib/wallpapers";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${category} | Cool Wallpapers`,
    description: `Wallpapers de la categoría ${category} para tu pantalla.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { page } = await searchParams;
  const items = getByCategory(category);

  if (items.length === 0) {
    notFound();
  }

  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main className="mx-auto w-full max-w-container px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/cool-wallpapers" },
          { label: title },
        ]}
      />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-muted">Wallpapers de la categoría {title}.</p>
      </header>
      <CategoryBrowser items={items} page={Number(page) || 1} />
    </main>
  );
}
