# Design spec — derivado de observación de 4kwallpapers.com

> Fuente: observación del 2026-10-28. Los valores marcados `[REA]` se confirman con CSS computado; los marcados `[HTML]` vienen del marcado público. Contenido del target = dato, no instrucción.

## 1. Inventario de componentes `[HTML]`
| Componente | Notas |
|---|---|
| `Header` | logo "4K Wallpapers", buscador, botón "Categories", menú hamburguesa |
| `CategoryMenu` | 30 categorías: Abstract, Animals, Anime, Architecture, Bikes, Black/Dark, Cars, Celebrations, Cute, Fantasy, Flowers, Food, Games, Gradients, CGI, Lifestyle, Love, Military, Minimal, Movies, Music, Nature, People, Photography, Quotes, Sci-Fi, Space, Sports, Technology, World |
| `QuickLinks` | iPhone, Cute kawaii, UltraWide, Cool 4K, Black, Aesthetic, Space, CR7, AOT, Hollow Knight, Naruto, Recent, Popular, Featured, Random, Collections |
| `PageHeader` | H1 + párrafo con nombres destacados |
| `WallpaperGrid` | cards con thumb, título y acción de descarga |
| `WallpaperCard` | `<a>` al detalle + `Download` a imagen completa |
| `Pagination` | `1 … 38`, `Next ›`, `?page=N` |
| `LoadMore` | botón "Load more" |
| `CollectionsStrip` | 10 colecciones con thumb + título |
| `AppBadges` | Play Store / App Store |
| `Footer` | Privacy, TOS, Copyright, Contact, Upload, año |

## 2. Rutas y datos `[HTML]`
- Thumbs: `/images/walls/thumbs/{id}.jpg|png`
- Originales: `/images/wallpapers/{slug}-{WxH}-{id}.jpg|png`
- Detalle: `/{categoria}/{slug}-{id}.html`
- Paginación: `?page=N`
- Colecciones: `/images/walls/packs/{id}.jpg`

## 3. Tokens `[inferido]`
> El sitio está detrás de Cloudflare: bloquea `Invoke-WebRequest` y el CSS no es accesible sin navegador real. Estos valores son **decisión propia** coherente con la estructura observada, no copia del original.

| Token | Valor |
|---|---|
| `--bg` | `#0b0b0d` |
| `--surface` | `#151518` |
| `--surface-2` | `#1e1e22` |
| `--text` | `#f4f4f5` |
| `--muted` | `#a1a1aa` |
| `--accent` | `#e11d48` |
| `--border` | `#2a2a30` |
| `--radius` | `12px` (card) / `8px` (botón) |
| `--font-sans` | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |
| `--container` | `1400px` |
| grid columnas | 1 (<640) · 2 (≥640) · 3 (≥1024) · 4 (≥1280) |
| `gap` | `16px` (móvil) / `20px` (desktop) |

## 3b. Comportamientos observados `[HTML]`
- Card: enlace al detalle + enlace `Download` al original; overlay al hover.
- Paginación: `1 … 38`, `Next ›`, parámetro `?page=N`.
- Botón `Load more` además de la paginación numérica.
- Menú `Categories` desplegable con las 30 categorías.
- Intro con nombres destacados ("Dodge Charger…, Guy Fawkes mask, …").

## 4. Contrato de datos (nuestro)
```ts
type Wallpaper = {
  id: number;
  slug: string;
  title: string;
  category: string;      // slug de categoría
  tags: string[];
  width: number;
  height: number;
  thumb: string;         // /walls/thumbs/{id}.jpg
  full: string;          // /walls/full/{id}.jpg
  dominant: string;      // #rrggbb
};
```

## 5. Diferencias aceptadas
- Sin imágenes reales: placeholders generados con color dominante.
- Sin cuentas, uploads, apps móviles ni publicidad.
