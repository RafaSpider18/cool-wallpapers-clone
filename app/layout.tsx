import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "4K Wallpapers — Cool",
  description:
    "Catálogo propio de wallpapers 4K de la categoría Cool: grid paginado, detalle y descarga.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
