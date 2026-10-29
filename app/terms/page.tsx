import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Términos de uso",
  description:
    "Condiciones de uso de esta demo de catálogo de wallpapers 4K.",
};

export default function TermsPage() {
  return (
    <InfoPage
      title="Términos de uso"
      intro="Al navegar por esta demo aceptas las condiciones que se describen a continuación. El sitio se ofrece tal cual, con fines demostrativos."
    >
      <h2>Objeto</h2>
      <p>
        Esta aplicación reproduce la experiencia de un catálogo de wallpapers:
        grid paginado, categorías, búsqueda, página de detalle y descarga. Todo
        el arte incluido es original y se generó para la demo.
      </p>

      <h2>Uso permitido</h2>
      <ul>
        <li>Explorar el catálogo y descargar los wallpapers para uso personal.</li>
        <li>Enlazar a las páginas del sitio indicando su origen.</li>
        <li>Usar el código como referencia si la licencia del repositorio lo permite.</li>
      </ul>

      <h2>Uso no permitido</h2>
      <ul>
        <li>Revender los wallpapers o distribuirlos como un producto propio.</li>
        <li>Automatizar peticiones masivas que degraden el servicio.</li>
        <li>Suplantar la identidad del sitio o de sus autores.</li>
      </ul>

      <h2>Disponibilidad y garantías</h2>
      <p>
        La demo puede cambiar o dejar de estar disponible sin aviso. No se
        garantiza que el servicio sea ininterrumpido ni que esté libre de
        errores. No se ofrece soporte ni compensación por pérdidas derivadas
        del uso del sitio.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        Los textos, el arte y el código de esta demo pertenecen a sus autores.
        Los detalles sobre licencias y reclamaciones están en la página de{" "}
        <Link href="/copyright">copyright</Link>.
      </p>

      <h2>Cambios</h2>
      <p>
        Estos términos pueden actualizarse cuando cambie el alcance de la demo.
        La versión vigente será siempre la publicada en esta ruta.
      </p>
    </InfoPage>
  );
}
