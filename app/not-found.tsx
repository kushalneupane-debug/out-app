import Link from "next/link";

export const metadata = { title: "Page not found — Out" };

export default function NotFound() {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      <div className="ambient" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--t5)", marginBottom: 16 }}>404</div>
        <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--step-4)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--t1)", marginBottom: 12 }}>
          Nothing here
        </h1>
        <p style={{ fontSize: "var(--step-0)", color: "var(--t4)", marginBottom: 36, lineHeight: 1.6 }}>
          This page doesn&apos;t exist. Maybe the link is wrong, or the page was moved.
        </p>
        <Link href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 9999, background: "#0062AD", color: "#fff", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", fontFamily: "var(--font-sans)" }}>
          Go home
        </Link>
      </div>
    </div>
  );
}
