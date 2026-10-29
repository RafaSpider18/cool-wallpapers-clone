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

## DECISIONES
- **ADR-1** Next.js 15 + Tailwind + TS. Datos en `data/wallpapers.json`. Imágenes placeholder generadas.
- **ADR-2** Rutas espejo: `/cool-wallpapers`, `/{categoria}`, `/{categoria}/{slug}-{id}.html`, `?page=N`, `/search?q=`.
- **ADR-3** Workers = sesiones `opencode run -s <id> --agent worker`; 2 en paralelo.
- **ADR-4** Sin dependencias del CDN original; cero hotlinks.
- **ADR-5** Cloudflare bloquea HTTP directo al sitio; tokens propios inferidos y marcados en `docs/design-spec.md`. REA con navegador real queda como verificación opcional.
- **ADR-6** Escritor único de estado: los workers solo escriben `.agents/tasks/T-XXX.result.md`; `queue.md` y `MEMORIA.md` los tocan únicamente el delegador (con lock) y el supervisor.

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
1. Proyecto cerrado: 12/12 tareas done, build + E2E + Lighthouse en verde.
2. Opcional: `git init` + primer commit; sustituir placeholders SVG por arte propio si se publica.
