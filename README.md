# proyecto-1 — clon funcional de 4kwallpapers ("Cool")

Réplica de **UX, rutas y flujo** de la categoría Cool de `4kwallpapers.com`
(navegar → grid paginado → detalle → descargar), con **catálogo y arte propios**.
No se copian imágenes, marca ni contenido del original (ADR-4). El arte es:
1. **Raster JPEG generativo determinista** (60 items / 30 categorías) y
2. **Fotografía real** de Wikimedia Commons con licencias abiertas
   (Public domain / CC0 / CC BY(-SA)), siempre con autor y licencia en ficha
   (T-019, ver `/credits`).

## Stack

- **Next.js 15** (App Router) + TypeScript estricto + Tailwind CSS
- Datos en `data/wallpapers.json` (60 items / 30 categorías / 10 colecciones)
- Arte: `scripts/gen-assets.mjs` — 7 escenas SVG renderizadas a **JPEG
  determinista** con Playwright/Chromium (thumbs 640×360 + full 1080p/4K)
- Tests: Playwright (13 humos E2E) · CI en GitHub Actions

## Quickstart

```powershell
npm install
npm run dev        # http://localhost:3000 → /cool-wallpapers
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo |
| `npm run build` | build de producción (bloquea si fallan tipos/lint) |
| `npm run start` | sirve el build (`next start`) |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright contra el build (15 casos) |
| `npm run gen:assets` | regenera las imágenes generativas + `data/wallpapers.json` |
| `npm run process:photos` | curación+procesado de fotos (Commons) → `data/photos.json` |

## Variables de entorno

| Variable | Obligatoria | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | solo en despliegue | URL absoluta de sitemap, robots, `/random` y metadatos OG/Twitter (`lib/site.ts`). Fallback: `http://localhost:3000`. |

Copia `.env.example` a `.env.local` y descomenta/ajusta.

## Estructura

```
app/
  cool-wallpapers/          listado (ruta estática)
  [category]/               listados por categoría (30, SSG)
  [category]/[slug]/        detalle ({slug}-{id}.html, 60, SSG)
  search/, random/          búsqueda y redirect aleatorio
  not-found, sitemap, robots, opengraph-image, twitter-image
components/                 grid, card, picker de resolución, migas, etc.
data/                       catálogo + colecciones (JSON)
scripts/gen-assets.mjs      generador del arte (escenas + render Chromium)
docs/                       design-spec, plan, qa-report (JSON de Lighthouse)
.agents/                    tareas/roles/reglas del flujo de trabajo
evidence/                   evidencia de reconocimiento
```

## Rutas

| Ruta | Contenido |
|---|---|
| `/` | redirige a `/cool-wallpapers` |
| `/cool-wallpapers` | listado principal (paginación, colecciones) |
| `/{categoria}` | listado filtrado |
| `/{categoria}/{slug}-{id}.html` | detalle + selector 1080p/4K + descarga |
| `/tags` · `/tag/<tag>` | hub de temas y listado por tag (SSG) |
| `/search?q=` | resultados (noindex) |
| `/random` | redirect a un item aleatorio |
| `/credits` | atribución de la fotografía (autor/licencia/origen) |
| `/privacy` `/terms` `/copyright` `/contact` `/upload` | páginas del footer |

## Despliegue (checklist)

1. **Repo**: sube el proyecto a GitHub (`git remote add origin …` + push).
2. **Vercel**: importa el repo; framework Next.js detectado; el comando de build es el default (`next build`).
3. **Env**: añade `NEXT_PUBLIC_SITE_URL = https://tu-dominio` (o la URL `.vercel.app`) en Project Settings → Environment Variables.
4. **Deploy + verifica**:
   - `GET /sitemap.xml` lista las URLs absolutas con tu dominio.
   - `GET /random` redirige (307) con `Location` absoluta del dominio.
   - OG image: `GET /opengraph-image` responde PNG.
   - Lighthouse con todas las categorías en listado/categoría/detalle (base local: 100×4, CLS 0).
5. **Dominio propio** (opcional): conectar en Vercel y volver a apuntar `NEXT_PUBLIC_SITE_URL`.

> Consejo: tras reconstruir y relanzar `next start` localmente, mata los procesos
> `node` anteriores (`next*start`) para no servir HTML de un build viejo.

## Alcance / límites

- Catálogo híbrido: 60 rasters generativos propios + ~28 fotos de Commons con
  crédito visible (sin contenido de 4kwallpapers.com).
- La curación de fotos es determinista (orden de relevancia de la API de
  Commons + filtros); ajustar temas en `scripts/process-photos.mjs`.
- Detalles de QA y métricas: `docs/qa-report.md`.
