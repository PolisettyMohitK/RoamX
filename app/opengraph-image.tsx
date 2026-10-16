import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "RoamX — Start your own travel company for ₹9,999";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(70% 90% at 0% 0%, #22396b 0%, #0a1430 60%, #070f24 100%)",
          color: "#fbf8f2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 64,
              border: "6px solid #d4a54e",
              background: "#13254a",
            }}
          />
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 2 }}>ROAMX</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3 }}>
          <span>Your own travel company.</span>
          <span style={{ color: "#e2bb6a" }}>₹9,999</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "rgba(251,248,242,0.6)" }}>
          Your brand. Your customers. Your markup.
        </div>
      </div>
    ),
    size,
  );
}
