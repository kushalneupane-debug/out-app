import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Terms of Service — Out" };

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", color: "var(--t1)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--t4)", textDecoration: "none", fontSize: "0.875rem", marginBottom: 40 }}>
          <ArrowLeft size={14} /> Back to Out
        </Link>

        <h1 style={{ fontSize: "var(--step-4)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 8, color: "var(--t1)" }}>Terms of Service</h1>
        <p style={{ fontSize: "0.82rem", color: "var(--t4)", marginBottom: 48, fontFamily: "var(--font-mono)" }}>Last updated: May 28, 2025</p>

        <Section title="Using Out">
          <p>You must be 18+ to use Out. By using the app you agree to treat other users with respect. Out is for real, in-person meetups — not harassment, spam, or any kind of abuse.</p>
        </Section>

        <Section title="Your behavior">
          <p>You agree not to: harass, threaten, or stalk other users; create fake accounts; share your location under false pretenses; use the app for any illegal purpose; or attempt to reverse-engineer or disrupt the service.</p>
        </Section>

        <Section title="Safety">
          <p>Out has a 3-strike system. Three reports within 24 hours triggers an automatic suspension and human review. We reserve the right to permanently ban users at any time for violations of these terms.</p>
        </Section>

        <Section title="Ephemeral data">
          <p>Location data is deleted the moment you go offline. Chat messages exist only in memory and are not persisted. Do not use Out to share information you want to keep permanently.</p>
        </Section>

        <Section title="No guarantees">
          <p>Out is provided as-is. We do not guarantee uptime, accuracy of location, or that you will find someone nearby. Meet people in public, well-lit places. Use common sense.</p>
        </Section>

        <Section title="Limitation of liability">
          <p>To the fullest extent permitted by law, Out and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including personal injury, property damage, or harm arising from in-person meetings arranged through the app. Your use of Out and any resulting in-person interactions are entirely at your own risk. Our total liability to you for any claim shall not exceed $100 USD.</p>
        </Section>

        <Section title="Indemnification">
          <p>You agree to indemnify, defend, and hold harmless Out and its operators from any claims, liabilities, damages, losses, or expenses (including legal fees) arising out of your use of the app, your violation of these terms, or your interactions with other users, whether online or in person.</p>
        </Section>

        <Section title="Governing law">
          <p>These terms are governed by the laws of the State of Texas, United States, without regard to conflict of law principles. You consent to the exclusive jurisdiction of the courts located in Texas for any dispute arising from these terms or your use of Out.</p>
        </Section>

        <Section title="Dispute resolution">
          <p>Any dispute arising out of or relating to these terms or the Out service shall first be attempted to be resolved through good-faith negotiation by emailing <a href="mailto:hi@meetspont.com" style={{ color: "#0062AD", textDecoration: "none" }}>hi@meetspont.com</a>. If unresolved within 30 days, disputes shall be resolved by binding arbitration in Texas under the rules of the American Arbitration Association, on an individual basis. You waive any right to participate in a class action lawsuit or class-wide arbitration.</p>
        </Section>

        <Section title="Changes">
          <p>We may update these terms. Continued use of Out after changes means you accept the new terms. Material changes will be communicated via the app.</p>
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
