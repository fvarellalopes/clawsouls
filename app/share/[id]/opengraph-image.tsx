import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ClawSouls Personality";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the share data
  let soul: Record<string, unknown> = {};
  try {
    const res = await fetch(`https://clawsouls.hub/api/share?id=${id}`);
    if (res.ok) {
      const data = await res.json();
      soul = data.soul || {};
    }
  } catch {}

  const name = typeof soul.name === "string" ? soul.name : "Unknown Soul";
  const creature = typeof soul.creature === "string" ? soul.creature : "AI";
  const emoji = typeof soul.emoji === "string" ? soul.emoji : "✨";
  const vibe = typeof soul.vibe === "string" ? soul.vibe : "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0514 0%, #1a0f2e 50%, #0a0514 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>{emoji}</div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #a855f7, #fbbf24)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: "12px",
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: "28px", color: "#c084fc", marginBottom: "20px" }}>
            {creature}
          </div>
          {vibe && (
            <div
              style={{
                fontSize: "22px",
                color: "rgba(192, 132, 252, 0.5)",
                maxWidth: "800px",
                lineHeight: 1.4,
              }}
            >
              {vibe.slice(0, 120)}{vibe.length > 120 ? "..." : ""}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              fontSize: "16px",
              color: "rgba(168, 85, 247, 0.3)",
              letterSpacing: "0.2em",
            }}
          >
            CLAWSOULS
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
