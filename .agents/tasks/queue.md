# Cola de tareas

Estados: `pendiente` · `en curso` · `done` · `blocked` · `failed`
Dueño: `W1` · `W2` · `creador`

| ID | Tarea | Depende de | Estado | Dueño | Verificación |
|---|---|---|---|---|---|
| T-001 | Scaffold Next.js 15 + TS + Tailwind | — | done | creador | `npm run build` |
| T-002 | Tokens de diseño | T-001 | done | creador | `npm run build` |
| T-003 | Data layer + placeholders | T-001 | done | ses_e7aebf | `node scripts/gen-assets.mjs` |
| T-004 | Header + menú + footer | T-002 | done | ses_e7aebe | `npm run build` |
| T-005 | Grid + card | T-002, T-003 | done | ses_e7aebf | `npm run build` |
| T-006 | Paginación + Load more | T-005 | done | ses_e7aebf | `npm run build` |
| T-007 | Ruta categoría | T-004, T-005 | done | ses_e7aebf | `npm run build` |
| T-008 | Ruta detalle | T-005, T-007 | done | ses_e7aebf | `npm run build` |
| T-009 | Búsqueda | T-003, T-004 | done | ses_e7aebe | `npm run build` |
| T-010 | Responsive + a11y | T-007, T-008 | done | ses_e7aebf | `npx tsc --noEmit` |
| T-011 | Colecciones + random | T-005, T-007 | done | ses_e7aebe | `npm run build` |
| T-012 | QA: Playwright + Lighthouse | T-010, T-011 | done | supervisor | `npm run test:e2e` |

## Bitácora
| Fecha | ID | Evento |
|---|---|---|
| 2026-10-28 | — | Cola creada |
| 2026-10-28 | T-001 | done — scaffold Next 15.5.28 + TS estricto + Tailwind; build OK |
| 2026-10-28 | T-012 | reintentada por el supervisor (el worker salió sin ejecutar); Playwright 8/8 + Lighthouse 100/100 |
| 2026-10-28 | — | fixes de QA: /random URL absoluta, `?page=N` en servidor, CLS 0, contraste AA |
