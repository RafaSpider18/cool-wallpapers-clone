import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Qué datos trata esta demo de catálogo de wallpapers y cuáles no recoge.",
};

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Política de privacidad"
      intro="Esta es una demo técnica de un catálogo de wallpapers. La política describe lo que hace el sitio y, sobre todo, lo que deliberadamente no hace."
    >
      <h2>Qué datos no recogemos</h2>
      <ul>
        <li>No hay cuentas, registro ni inicio de sesión.</li>
        <li>No usamos cookies de analítica, publicidad ni seguimiento.</li>
        <li>No vendemos ni compartimos datos con terceros.</li>
        <li>Las búsquedas no se almacenan: se resuelven contra el catálogo local y desaparecen al cerrar la página.</li>
      </ul>

      <h2>Registros técnicos</h2>
      <p>
        Como cualquier sitio web, el servidor que aloja la demo puede registrar
        la dirección IP, la fecha, la ruta solicitada y el agente de usuario
        para diagnosticar errores y prevenir abusos. Esos registros son
        técnicos, no se cruzan con otros datos y no se usan para perfilar
        visitantes.
      </p>

      <h2>Enlaces externos</h2>
      <p>
        El catálogo no carga imágenes ni recursos de dominios de terceros. Si
        en el futuro se añaden enlaces externos, cada destino tendrá su propia
        política de privacidad.
      </p>

      <h2>Menores</h2>
      <p>
        El sitio no está dirigido a menores y no solicita datos personales de
        ningún visitante.
      </p>

      <h2>Cambios</h2>
      <p>
        Si la demo incorpora funciones que impliquen tratamiento de datos
        (por ejemplo, un formulario de subida real), esta página se actualizará
        antes de activarlas.
      </p>

      <h2>Contacto</h2>
      <p>
        Para dudas sobre privacidad, consulta la página de{" "}
        <Link href="/contact">contacto</Link>. Ten en cuenta que la demo no dispone de
        soporte real.
      </p>
    </InfoPage>
  );
}
