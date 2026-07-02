import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

async function loadPlayfairBold() {
  const res = await fetch(
    "https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQ.ttf"
  );
  return res.arrayBuffer();
}

/** Favicon — pv. monogram on cream tile. */
export default async function Icon() {
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
          borderRadius: 9,
          border: "1px solid #E5E0D8",
          boxShadow: "0 1px 2px rgba(45, 41, 38, 0.07)",
          color: "#2D2926",
          fontSize: 12,
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
