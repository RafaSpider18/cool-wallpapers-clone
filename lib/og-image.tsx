import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogAlt = "4K Wallpapers — Cool";

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b0b0d",
          padding: "72px",
          color: "#f4f4f5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              backgroundColor: "#f43f5e",
            }}
          />
          <div style={{ fontSize: "28px", color: "#a1a1aa" }}>Catálogo propio</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "104px", fontWeight: 700, lineHeight: 1.05 }}>
            4K Wallpapers
          </div>
          <div style={{ marginTop: "20px", fontSize: "44px", color: "#f43f5e" }}>
            Cool · Abstract · Anime · Nature
          </div>
        </div>

        <div style={{ display: "flex", fontSize: "26px", color: "#a1a1aa" }}>
          Grid paginado, búsqueda, detalle y descarga
        </div>
      </div>
    ),
    ogSize,
  );
}
