# MEMORIA — proyecto-1

> **Reglas:** máx 3 líneas por tarea · sin código, logs ni HTML · solo rutas · compactar al pasar 150 líneas.
> **Lectura por rol:** supervisor → `ESTADO` + `TAREAS` · worker → `ESTADO` + su `T-XXX`.

## ESTADO
- Fase 0: estructura de agentes creada. Reconocimiento REA pendiente.
- Workers: `W1=ses_e7aebf1e7ffed2Aa8Z877n0MQo` · `W2=ses_e7aebe11effe65pb2xAFI2B16j`
- T-001 done: scaffold Next 15.5.28 + TS estricto + Tailwind 3.4 en `app/`, `tsconfig.json`, `tailwind.config.ts`.
- T-003 done: data/wallpapers.json (60 items / 30 categorías) + lib/wallpapers.ts helpers + placeholders SVG en scripts/gen-assets.mjs.
- T-005 done: components/WallpaperGrid.tsx + components/WallpaperCard.tsx (grid responsive 1/2/3/4, hover overlay + Download).
- T-002 done: tokens como CSS vars en `app/globals.css` + theme en `tailwind.config.ts`.
- Base lista: `npm run build` OK, `npm run lint` OK, `npm run dev` → 200 en `/`.
- T-004 done: Header + CategoryMenu + Footer + layout; build OK.
- T-006 done: components/Pagination.tsx + components/LoadMore.tsx (ventana de páginas + load more incremental); build OK. Reporte en `.agents/tasks/T-006.result.md`.
- T-007 done: app/page.tsx (redirect) + app/cool-wallpapers/page.tsx + app/[category]/page.tsx + components/CategoryBrowser.tsx (`?page=N`, 12/pág); build OK (5 rutas).
- T-009 done: app/search/page.tsx (contador + estado vacío con sugerencias) + Header refleja `?q=`; build OK.
- T-008 done: app/[category]/[slug]/page.tsx (detalle SSG, 60 rutas, tags/resolución/download/relacionados); build OK sin warnings.
- T-011 done: data/collections.json (10) + components/CollectionsStrip.tsx + app/random/route.ts (307, force-dynamic); build OK.
- T-010 done: Header apila en móvil (390 px sin overflow) + foco visible global; `tsc` + build OK.
- T-012 done (supervisor): Playwright 8/8 + Lighthouse 100/100 en listado y detalle; informe en `docs/qa-report.md`.
- QA corrigió: `/random` 500 (URL absoluta), `?page=N` real (página resuelta en servidor), CLS 0 (sin bailout CSR), contraste AA (`--accent #f43f5e`).
- A1 done: 5 páginas del footer (`/privacy`, `/terms`, `/copyright`, `/contact`, `/upload`) con `components/InfoPage.tsx` y contenido honesto de demo; layout ya no duplica `<main>`.
- A2 done: `app/not-found.tsx` + `app/sitemap.ts` (30 categorías, 60 detalles, 5 info) + `app/robots.ts` + `metadataBase`/OG/Twitter + `opengraph-image`/`twitter-image` + `app/icon.svg`; base URL en `lib/site.ts` (`NEXT_PUBLIC_SITE_URL`, fallback localhost).
- C7 done: `.github/workflows/ci.yml` (Node 22, `npm ci`, tsc, lint, build, Chromium, E2E, artefacto de trazas si falla). E2E ampliado.
- B4 done: 60 items × 3 variantes SVG (1080p/4K/8K, 180 archivos) + `components/ResolutionPicker.tsx`; la descarga cambia de archivo y nombre.
- B5 done: `components/Breadcrumbs.tsx` en categoría y detalle + tags del detalle enlazan a `/search?q=<tag>`.
- B6 done: enlace `Random` en el header, junto a Categories; E2E 13/13.

## DECISIONES
- **ADR-1** Next.js 15 + Tailwind + TS. Datos en `data/wallpapers.json`. Imágenes placeholder generadas.
- **ADR-2** Rutas espejo: `/cool-wallpapers`, `/{categoria}`, `/{categoria}/{slug}-{id}.html`, `?page=N`, `/search?q=`.
- **ADR-3** Workers = sesiones `opencode run -s <id> --agent worker`; 2 en paralelo.
- **ADR-4** Sin dependencias del CDN original; cero hotlinks.
- **ADR-5** Cloudflare bloquea HTTP directo al sitio; tokens propios inferidos y marcados en `docs/design-spec.md`. REA con navegador real queda como verificación opcional.
- **ADR-6** Escritor único de estado: los workers solo escriben `.agents/tasks/T-XXX.result.md`; `queue.md` y `MEMORIA.md` los tocan únicamente el delegador (con lock) y el supervisor.
- **ADR-7** URL pública por `NEXT_PUBLIC_SITE_URL` con fallback `http://localhost:3000`; sitemap, robots y metadatos sociales se construyen desde `lib/site.ts`.
- **ADR-8** El arte es SVG vectorial: cada item tiene variantes nominales 1080p/4K/8K y el selector descarga el archivo elegido; no hay raster ni CDN.

## TAREAS
Ver `.agents/tasks/queue.md` (fuente única de verdad).

## ARCHIVOS CLAVE
| Ruta | Qué es |
|---|---|
| `docs/design-spec.md` | tokens y componentes derivados de REA |
| `docs/plan.md` | plan y criterios de aceptación |
| `data/wallpapers.json` | catálogo |
| `app/` | rutas Next.js |

## SIGUIENTE
1. Proyecto cerrado y mejorado: 12/12 tareas + A1, A2, C7 y B4–B6 done; build + 13/13 E2E en verde.
2. Antes de publicar: definir `NEXT_PUBLIC_SITE_URL` y sustituir los placeholders SVG por arte definitivo.
3. Sin pendientes funcionales acordados; próximos pasos serían despliegue y contenido real.
