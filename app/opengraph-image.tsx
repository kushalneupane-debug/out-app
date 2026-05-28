import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Out — Find someone near you, right now";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,98,173,0.18) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Logo dot + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#0062AD",
              boxShadow: "0 0 24px rgba(0,98,173,0.8)",
            }}
          />
          <span style={{ fontSize: 40, fontWeight: 800, color: "#f4f4f5", letterSpacing: "-0.04em" }}>
            Out
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#f4f4f5",
            letterSpacing: "-0.05em",
            lineHeight: 1.05,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          You&apos;re free right now.
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#52525b",
            letterSpacing: "-0.05em",
            lineHeight: 1.05,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          So is someone near you.
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: 26,
            color: "#52525b",
            letterSpacing: "-0.01em",
            textAlign: "center",
          }}
        >
          No profiles. No swiping. No history.
        </div>
      </div>
    ),
    { ...size }
  );
}
