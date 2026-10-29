import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Cómo contactar con el proyecto. La demo no dispone de soporte real.",
};

export default function ContactPage() {
  return (
    <InfoPage
      title="Contacto"
      intro="Esta demo no tiene un formulario conectado ni un equipo de soporte. Si necesitas escribir, usa la dirección de ejemplo que aparece abajo."
    >
      <h2>Dirección de ejemplo</h2>
      <p>
        <a href="mailto:contact@example.com">contact@example.com</a>
      </p>
      <p>
        El dominio <strong>example.com</strong> está reservado por la IANA para
        documentación, así que la dirección no pertenece a ninguna persona y no
        se monitoriza. Sirve solo para mostrar dónde iría el canal de contacto
        en una instalación real.
      </p>

      <h2>Qué incluir en un mensaje real</h2>
      <ul>
        <li>La URL exacta de la página o del wallpaper afectado.</li>
        <li>Una descripción breve del problema o de la reclamación.</li>
        <li>Un medio de respuesta, si esperas contestación.</li>
      </ul>

      <h2>Temas frecuentes</h2>
      <p>
        Para reclamaciones de derechos de autor, consulta la página de{" "}
        <Link href="/copyright">copyright</Link>. Para saber qué datos trata el sitio,
        consulta la <Link href="/privacy">política de privacidad</Link>. Las
        condiciones generales están en los <Link href="/terms">términos de uso</Link>.
      </p>

      <h2>Subidas</h2>
      <p>
        La subida de wallpapers no está habilitada en esta demo. Puedes leer los
        requisitos previstos en la página de <Link href="/upload">upload</Link>.
      </p>
    </InfoPage>
  );
}
