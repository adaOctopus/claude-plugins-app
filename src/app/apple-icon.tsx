import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

async function loadPlayfairBold() {
  const res = await fetch(
    "https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQ.ttf"
  );
  return res.arrayBuffer();
}

/** Apple touch icon — pv. monogram on cream tile. */
export default async function AppleIcon() {
  const fontData = await loadPlayfairBold();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F9F8F6",
          borderRadius: 40,
          border: "2px solid #E5E0D8",
          boxShadow: "0 2px 8px rgba(45, 41, 38, 0.08)",
          color: "#2D2926",
          fontSize: 68,
          fontWeight: 700,
          fontFamily: "Playfair",
          letterSpacing: "-0.06em",
        }}
      >
        pv.
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Playfair", data: fontData, weight: 700, style: "normal" }],
    }
  );
}
