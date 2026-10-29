# Plan — clon funcional de 4kwallpapers (categoría "Cool")

## Objetivo
Replicar el comportamiento de `https://4kwallpapers.com/cool-wallpapers`: navegar categorías, ver grid paginado, abrir detalle, buscar y descargar. Con catálogo propio.

## Fases
| Fase | Contenido | Estado |
|---|---|---|
| 0 | Reconocimiento REA → `docs/design-spec.md` | done (tokens inferidos, ADR-5) |
| 1 | Scaffold + tokens (T-001, T-002) | done |
| 2 | Datos + placeholders (T-003) | done |
| 3 | Layout: header, menú, footer (T-004) | done |
| 4 | Grid y card (T-005, T-006) | done |
| 5 | Rutas: categoría, detalle, búsqueda (T-007, T-008, T-009) | done |
| 6 | Responsive + a11y (T-010) | done |
| 7 | Colecciones, random, QA (T-011, T-012) | done — ver `docs/qa-report.md` |
| 8 | A1: páginas del footer (privacidad, términos, copyright, contacto, upload) | done |
| 9 | A2: 404 propio, sitemap, robots, Open Graph/Twitter e icono | done |
| 10 | C7: CI en GitHub Actions (build + tipos + lint + E2E) | done |
| 11 | B4: selector 1080p/4K/8K · B5: breadcrumbs y tags · B6: Random en header | done |
| 12 | T-013: arte raster propio (JPEG determinista, thumbs + full 1080p/4K; 8K retirado) | done — ver `.agents/tasks/T-013.result.md` |
| 13 | T-014: rutas estáticas (listado/categorías) para `meta` en `<head>`; SEO 92→100 | done — ver `.agents/tasks/T-014.result.md` |

## Rutas
| Ruta | Contenido |
|---|---|
| `/` | redirect a `/cool-wallpapers` |
| `/cool-wallpapers` | H1 + intro + grid + paginación + colecciones |
| `/{categoria}` | igual, filtrado por categoría |
| `/{categoria}/{slug}-{id}.html` | detalle + selector 1080p/4K (JPEG) + descarga |
| `/search?q=` | resultados |
| `/random` | redirect a un item aleatorio |
| `/privacy`, `/terms`, `/copyright`, `/contact`, `/upload` | páginas informativas del footer |
| `/sitemap.xml`, `/robots.txt` | SEO técnico |

## Criterios de aceptación (MVP)
1. Paridad visual en 390 / 768 / 1440 px (±8 px en bloques principales).
2. Paginación real con `?page=N` y `Load more`.
3. Detalle con botón de descarga funcional.
4. Búsqueda devuelve resultados y estado vacío.
5. `npm run build` sin errores ni warnings de tipo.
6. Lighthouse desktop ≥ 90 en Performance y Accessibility.
7. Cero requests a dominios de `4kwallpapers.com`.

## Riesgos
- **Legal:** no se copian imágenes ni marca. Solo estructura y UX.
- **OneDrive:** `node_modules`/`.next` sincronizados pueden bloquear archivos. Si pasa, junction a `C:\dev\cache\proyecto-1`.
- **Paridad de tokens:** si REA no puede observar CSS computado, se aproxima desde el stylesheet público y se anota en `design-spec.md`.
