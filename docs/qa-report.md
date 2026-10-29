# QA — proyecto-1 (clon 4kwallpapers / "Cool")

**Fecha:** 2026-10-28 · **Tarea:** T-012 · **Entorno:** Windows, Node 24.21, Next.js 15.5.28, build de producción (`next start`).

## 1. Suite E2E (Playwright)

```powershell
npm run build
npm run test:e2e
```

Resultado: **13/13 en verde** (`tests/e2e/smoke.spec.ts`, Chromium headless). Los casos 1–8 son el MVP; 9–13 cubren la ampliación post-cierre (A1/A2 y B4–B6).

| # | Caso | Verifica |
|---|---|---|
| 1 | `/` redirige | URL final `/cool-wallpapers` + H1 |
| 2 | Listado | 12 cards en página 1 + `nav[aria-label=Pagination]` |
| 3 | `?page=2` | 12 cards y primer `href` distinto al de página 1 |
| 4 | `/abstract` | todas las cards apuntan a `/abstract/...` |
| 5 | Detalle | H1, resolución, tags y `article a[download]` con `href^="/walls/full/"` |
| 6 | Búsqueda | `?q=anime` con contador y resultados; `?q=zzzz` con estado vacío |
| 7 | `/random` | `307` + `Location` absoluta hacia `/{categoria}/{slug}-{id}.html` |
| 8 | Responsive | sin scroll horizontal a 390 px (`scrollWidth - clientWidth ≤ 1`) |
| 9 | Footer | las 5 rutas informativas responden y muestran su H1 |
| 10 | SEO/404 | 404 propio, `sitemap.xml` con categorías/detalles, `robots.txt` y meta OG/Twitter |
| 11 | Resoluciones | el selector cambia `href`/`download` entre 1080p, 4K y 8K; el SVG 8K responde 200 |
| 12 | Breadcrumbs/tags | migas con `aria-current` y tag que navega a `/search?q=gradient` con resultados |
| 13 | Random UI | el enlace `Random` del header termina en un detalle válido |

## 2. Lighthouse (desktop, headless Chrome)

| Página | Performance | Accessibility | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|
| `/cool-wallpapers` | **100** | **100** | 0.2 s | 0.5 s | 0 ms | 0 |
| `/abstract/aurora-veil-1.html` | **100** | **100** | 0.2 s | 0.2 s | 0 ms | 0 |

JSON crudo: `docs/lighthouse.json`, `docs/lighthouse-detail.json`.

```powershell
npx lighthouse http://localhost:3000/cool-wallpapers --preset=desktop `
  --only-categories=performance,accessibility `
  --chrome-flags="--headless=new" --output=json --output-path=docs/lighthouse.json
```

## 3. Defectos encontrados y corregidos

| # | Defecto | Causa | Corrección |
|---|---|---|---|
| 1 | `/random` devolvía **500** | `NextResponse.redirect()` con URL relativa (Next exige absoluta) | `new URL(path, request.url)` |
| 2 | `?page=2` repetía el primer card | `CategoryBrowser` mezclaba paginación y "Load more": el grid crecía desde el item 1 | offset `(page-1)*12` + contador de "Load more" independiente |
| 3 | CLS 0.382 → Performance 82 | `Header` (y el grid) caían en *bailout* a CSR por `useSearchParams`; el contenido se desplazaba al hidratar | el header lee `?q=` de `window.location`; `page` se resuelve en el servidor y se pasa como prop |
| 4 | Contraste AA insuficiente (A11y 96) | `--accent #e11d48` sobre `--bg` = 4.18; `text-text` sobre accent = 4.27 | `--accent #f43f5e` + botones con `text-bg` (5.37:1) |

## 4. Límites conocidos

- El catálogo es de 60 placeholders SVG (30 categorías) con 3 variantes nominales cada uno (1080p/4K/8K); no hay imágenes raster ni CDN.
- `/random` no es determinista por diseño (307 en cada visita).
- `next lint` está deprecado en Next 15 (aviso del propio CLI); no afecta al build.
- La paridad de tokens con el sitio original es aproximada: Cloudflare bloquea la lectura del CSS público (ADR-5).
