import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "TOS", href: "/terms" },
  { label: "Copyright", href: "/copyright" },
  { label: "Contact", href: "/contact" },
  { label: "Upload", href: "/upload" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-container px-6 py-8">
        <nav aria-label="Legal">
          <ul className="flex flex-wrap gap-6">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-6 text-sm text-muted">
          © {year} 4K Wallpapers — Cool. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
