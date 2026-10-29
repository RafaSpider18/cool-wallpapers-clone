import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Subir un wallpaper",
  description:
    "Requisitos previstos para enviar wallpapers. La subida no está habilitada en esta demo.",
};

export default function UploadPage() {
  return (
    <InfoPage
      title="Subir un wallpaper"
      intro="La subida de contenido no está habilitada en esta demo. No hay formulario, almacenamiento ni revisión de archivos."
    >
      <div className="rounded-card border border-border bg-surface p-5">
        <p className="text-text">
          <strong>Estado:</strong> función pendiente. Esta página documenta los
          requisitos que tendría una versión real para que el flujo sea
          transparente.
        </p>
      </div>

      <h2>Requisitos previstos</h2>
      <ul>
        <li>Resolución mínima de 3840 × 2160 píxeles y orientación horizontal.</li>
        <li>Formato JPG, PNG o WebP, con un máximo de 25 MB por archivo.</li>
        <li>Contenido original o con permiso explícito del autor.</li>
        <li>Sin marcas de agua, logotipos de terceros ni material protegido.</li>
        <li>Sin contenido violento, sexual, discriminatorio o engañoso.</li>
      </ul>

      <h2>Qué ocurriría después</h2>
      <p>
        En una versión real, cada envío pasaría por una revisión manual antes de
        publicarse. El autor conservaría la titularidad y concedería al sitio
        una licencia para mostrarlo y distribuirlo. La ficha indicaría la
        categoría, las etiquetas y la resolución disponible.
      </p>

      <h2>Mientras tanto</h2>
      <p>
        Puedes explorar el catálogo actual y descargar cualquier wallpaper en su
        resolución completa.
      </p>
      <p>
        <Link
          href="/cool-wallpapers"
          className="inline-block rounded-button bg-accent px-4 py-2 text-sm font-semibold text-bg"
        >
          Ver todos los wallpapers
        </Link>
      </p>
    </InfoPage>
  );
}
