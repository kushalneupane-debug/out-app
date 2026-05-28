import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Privacy Policy — Out" };

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", color: "var(--t1)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--t4)", textDecoration: "none", fontSize: "0.875rem", marginBottom: 40, transition: "color 0.15s" }}
          onMouseOver={undefined} onMouseOut={undefined}>
          <ArrowLeft size={14} /> Back to Out
        </Link>

        <h1 style={{ fontSize: "var(--step-4)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 8, color: "var(--t1)" }}>Privacy Policy</h1>
        <p style={{ fontSize: "0.82rem", color: "var(--t4)", marginBottom: 48, fontFamily: "var(--font-mono)" }}>Last updated: May 28, 2025</p>

        <Section title="The short version">
          <p>We collect the absolute minimum. Your precise location is never stored. When you go offline, everything deletes. We don&apos;t sell your data. We never will.</p>
        </Section>

        <Section title="What we collect">
          <p>Phone number (for verification only), first name, vibe preference, and a fuzzy version of your location (±0.5mi noise added). That&apos;s it.</p>
        </Section>

        <Section title="What we don't collect">
          <p>No email. No profile photo. No browsing history. No device fingerprint. No exact GPS coordinates. No behavioral data. No ad tracking.</p>
        </Section>

        <Section title="Location">
          <p>When you go Out, we store a fuzzed version of your coordinates (±0.5 miles added). Your exact location never hits our servers. When you go offline, the fuzzed location is deleted immediately — no logs, no archive, nothing.</p>
        </Section>

        <Section title="Phone number">
          <p>Your phone number is used only to verify you are a real person. We do not share it with anyone and do not use it for marketing.</p>
        </Section>

        <Section title="Third parties">
          <p>We use Supabase (auth + database). It does not receive your exact location or usage patterns beyond what is strictly necessary for the service to function.</p>
        </Section>

        <Section title="Data deletion">
          <p>Email <a href="mailto:hi@meetspont.com" style={{ color: "#0062AD", textDecoration: "none" }}>hi@meetspont.com</a> to delete your account and all associated data. We will process requests within 7 days.</p>
        </Section>

        <Section title="Contact">
          <p><a href="mailto:hi@meetspont.com" style={{ color: "#0062AD", textDecoration: "none" }}>hi@meetspont.com</a></p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--t1)", marginBottom: 10, letterSpacing: "-0.02em" }}>{title}</h2>
      <div style={{ fontSize: "0.9rem", color: "var(--t3)", lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}
