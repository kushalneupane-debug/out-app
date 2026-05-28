import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Privacy Policy — Out" };

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", color: "var(--t1)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--t4)", textDecoration: "none", fontSize: "0.875rem", marginBottom: 40 }}>
          <ArrowLeft size={14} /> Back to Out
        </Link>

        <h1 style={{ fontSize: "var(--step-4)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 8, color: "var(--t1)" }}>Privacy Policy</h1>
        <p style={{ fontSize: "0.82rem", color: "var(--t4)", marginBottom: 48, fontFamily: "var(--font-mono)" }}>Last updated: May 28, 2025</p>

        <Section title="The short version">
          <p>We collect the absolute minimum. Your precise location is never stored. When you go offline, everything deletes. We don&apos;t sell your data. We never will.</p>
        </Section>

        <Section title="What we collect">
          <p>First name and vibe preference (what you enter at signup), and a fuzzy version of your current location (±0.5 mi noise added) while you are active in the app. That&apos;s it. We do <strong>not</strong> collect email addresses, phone numbers, profile photos, or any other identifying information.</p>
        </Section>

        <Section title="What we don't collect">
          <p>No email. No phone number. No profile photo. No browsing history. No device fingerprint. No exact GPS coordinates. No behavioral analytics. No ad tracking of any kind.</p>
        </Section>

        <Section title="Location">
          <p>When you go Out, we store a fuzzed version of your coordinates (±0.5 miles added via random noise). Your exact location never hits our servers. When you go offline, the fuzzed location is deleted immediately — no logs, no archive, nothing retained.</p>
        </Section>

        <Section title="Local storage">
          <p>Out stores your first name and vibe preference in your browser&apos;s localStorage so the app remembers you between sessions. This data stays on your device only and is cleared when you sign out. We do not use cookies for tracking or advertising.</p>
        </Section>

        <Section title="Third parties">
          <p>We use Supabase for infrastructure. Supabase does not receive your exact location or personal identifiers beyond what is strictly necessary for the service to function. We do not share, sell, or rent your data to any third party for any purpose, including advertising.</p>
        </Section>

        <Section title="Data retention">
          <p>Location data is ephemeral — deleted the moment you go offline. Name and vibe are retained only in your browser&apos;s localStorage on your own device. We retain server-side logs (without location or identity) for up to 30 days for security purposes only.</p>
        </Section>

        <Section title="We do not sell your data">
          <p>Out does not sell, share, or monetize personal information. Full stop. There are no advertising partners, data brokers, or third-party analytics providers receiving your information.</p>
        </Section>

        <Section title="Your rights (Texas TDPSA)">
          <p>If you are a Texas resident, you have rights under the Texas Data Privacy and Security Act (TDPSA), including the right to:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 6 }}>Know what personal data we process about you</li>
            <li style={{ marginBottom: 6 }}>Correct inaccurate personal data</li>
            <li style={{ marginBottom: 6 }}>Delete personal data we hold about you</li>
            <li style={{ marginBottom: 6 }}>Opt out of the sale of personal data (we don&apos;t sell it, but this right applies)</li>
            <li style={{ marginBottom: 6 }}>Non-discrimination for exercising these rights</li>
          </ul>
          <p style={{ marginTop: 10 }}>To exercise any of these rights, email <a href="mailto:hi@meetspont.com" style={{ color: "#0062AD", textDecoration: "none" }}>hi@meetspont.com</a>. We will respond within 45 days.</p>
        </Section>

        <Section title="Children">
          <p>Out is intended for users 18 years of age and older. We do not knowingly collect data from anyone under 18. If you believe a minor has created an account, contact us immediately and we will delete it.</p>
        </Section>

        <Section title="Data deletion">
          <p>Email <a href="mailto:hi@meetspont.com" style={{ color: "#0062AD", textDecoration: "none" }}>hi@meetspont.com</a> to delete your account and all associated data. We will process requests within 7 days.</p>
        </Section>

        <Section title="Changes to this policy">
          <p>We may update this policy. The &quot;Last updated&quot; date at the top will change when we do. Continued use of Out after changes constitutes acceptance of the updated policy.</p>
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
