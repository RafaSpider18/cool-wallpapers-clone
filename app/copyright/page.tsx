import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Copyright",
  description:
    "Licencia del arte y del código de esta demo, y cómo notificar un uso indebido.",
};

export default function CopyrightPage() {
  return (
    <InfoPage
      title="Copyright"
      intro="Todo el contenido visual de esta demo es propio. No se han copiado imágenes, marca ni estilos del sitio de referencia."
    >
      <h2>Arte del catálogo</h2>
      <p>
        Los wallpapers son degradados y composiciones generadas para este
        proyecto. Se distribuyen para uso personal: puedes descargarlos y
        usarlos como fondo de pantalla en tus dispositivos.
      </p>
      <p>
        No se permite revenderlos, incluirlos en packs de pago ni reclamar su
        autoría. Para cualquier otro uso, consulta la página de{" "}
        <Link href="/contact">contacto</Link>.
      </p>

      <h2>Marca y sitio de referencia</h2>
      <p>
        &quot;4K Wallpapers — Cool&quot; es el nombre de esta demo. No existe
        afiliación, patrocinio ni asociación con 4kwallpapers.com ni con sus
        titulares. Las rutas y la estructura de navegación se inspiran en la
        experiencia pública del sitio, pero el contenido es independiente.
      </p>

      <h2>Código</h2>
      <p>
        La aplicación está construida con Next.js, TypeScript y Tailwind CSS.
        Cada dependencia conserva su propia licencia, disponible en el
        repositorio del proyecto.
      </p>

      <h2>Notificaciones</h2>
      <p>
        Si consideras que algún contenido vulnera tus derechos, describe el
        material afectado, la URL y la base de tu reclamación a través de la
        página de contacto. Al ser una demo sin soporte real, la dirección
        indicada allí es de ejemplo y no está monitorizada; en un despliegue
        real se habilitaría un canal de reclamaciones.
      </p>
    </InfoPage>
  );
}
