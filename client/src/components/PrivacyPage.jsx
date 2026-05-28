export default function PrivacyPage({ onBack }) {
  var updated = 'May 25, 2026';

  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      <div className="mesh" />
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 24px 80px', position: 'relative', zIndex: 1 }}>

        <button onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500', marginBottom: '40px', padding: 0 }}
          onMouseOver={function(e) { e.currentTarget.style.color='rgba(255,255,255,0.8)'; }}
          onMouseOut={function(e)  { e.currentTarget.style.color='rgba(255,255,255,0.45)'; }}>
          ← Back
        </button>

        <div style={{ marginBottom: '8px', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(124,58,237,0.8)' }}>Legal</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.04em', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', marginBottom: '48px' }}>Last updated: {updated}</p>

        <div className="div" style={{ marginBottom: '48px' }} />

        <Legal>
          <Section title="1. What We Collect">
            <P>We collect the minimum possible data to make Out work.</P>
            <ul>
              <Li><B>Phone number</B> — used only to verify your identity via one-time passcode. We store a one-way hash (SHA-256 + secret salt) of your number, not the number itself. The raw number is held in memory only during the 10-minute OTP verification window, then discarded.</Li>
              <Li><B>First name</B> — the name you enter. No last name, no username, no handle.</Li>
              <Li><B>Location</B> — when you tap "I'm Out", your device sends your GPS coordinates. We add ±200m of random noise before storing anything. We never log your exact coordinates. Location data is stored only in Redis with a 60-minute TTL and is deleted immediately when you go offline or when the TTL expires.</Li>
              <Li><B>Vibe selection</B> — coffee, walk, etc. Stored only for the duration of your active session.</Li>
              <Li><B>Chat messages</B> — messages you send in a matched chat are relayed in real-time and held in Redis for a maximum of 60 seconds after both users disconnect. They are never written to any persistent database.</Li>
            </ul>
          </Section>

          <Section title="2. What We Do Not Collect">
            <ul>
              <Li>Photos or profile images</Li>
              <Li>Email address</Li>
              <Li>Precise GPS coordinates (we fuzz them)</Li>
              <Li>Chat history after your session ends</Li>
              <Li>Device identifiers (IDFA, GAID)</Li>
              <Li>Browsing history or cross-app tracking</Li>
              <Li>Any data from your contacts, calendar, or microphone</Li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <P>Your data is used solely to operate the Out service:</P>
            <ul>
              <Li>To verify your phone number and create your account</Li>
              <Li>To show you nearby users who are also currently active</Li>
              <Li>To connect you with another user when both accept an invite</Li>
              <Li>To relay chat messages during an active matched session</Li>
            </ul>
            <P>We do not use your data for advertising. We do not sell your data. We do not share your data with third parties except as described in Section 5.</P>
          </Section>

          <Section title="4. Data Retention">
            <P>We follow an ephemeral-by-design approach:</P>
            <ul>
              <Li><B>Location data</B> — deleted on go-offline or after 60-minute TTL, whichever comes first</Li>
              <Li><B>Chat messages</B> — deleted 60 seconds after both users disconnect, never persisted to disk</Li>
              <Li><B>Invite data</B> — deleted after 30 seconds (accepted, declined, or expired)</Li>
              <Li><B>Phone hash + name</B> — retained while your account is active. Deleted within 30 days of account deletion request.</Li>
              <Li><B>Reports / moderation logs</B> — retained for 30 days for safety purposes, then deleted</Li>
            </ul>
          </Section>

          <Section title="5. Third-Party Services">
            <P>We use the following third-party services:</P>
            <ul>
              <Li><B>Twilio Verify</B> — for phone number OTP verification. Twilio receives your phone number to send the SMS. See Twilio's privacy policy at twilio.com/legal/privacy.</Li>
              <Li><B>Render</B> — our hosting provider. Servers are located in the US. Render does not have access to your application data.</Li>
              <Li><B>Upstash / Redis</B> — ephemeral session data is stored in Redis. All keys have TTLs and are encrypted at rest.</Li>
            </ul>
            <P>No analytics platforms, advertising networks, or data brokers receive any data from Out.</P>
          </Section>

          <Section title="6. Security">
            <P>We apply the following technical safeguards:</P>
            <ul>
              <Li>All data in transit is encrypted using TLS 1.3</Li>
              <Li>Phone numbers are stored as HMAC-SHA256 hashes with a server-side secret — we cannot reverse them</Li>
              <Li>Location coordinates are jittered before storage and never returned to clients in coordinate form (only distance in miles)</Li>
              <Li>JWT tokens expire after 7 days and are signed with RS256</Li>
              <Li>Rate limiting is applied to all endpoints (OTP: 3/hour, invites: 20/hour)</Li>
              <Li>Redis keys use per-key TTLs — no session data persists beyond expiry</Li>
              <Li>CORS is restricted to the Out domain in production</Li>
            </ul>
            <P>Despite our safeguards, no system is 100% secure. If you discover a vulnerability, please report it to security@getout.app.</P>
          </Section>

          <Section title="7. Your Rights">
            <P>Depending on where you live, you may have the following rights:</P>
            <ul>
              <Li><B>Access</B> — request a copy of the data we hold about you</Li>
              <Li><B>Deletion</B> — request deletion of your account and associated data</Li>
              <Li><B>Correction</B> — update your name at any time in the app</Li>
              <Li><B>Portability</B> — receive your data in a machine-readable format</Li>
              <Li><B>Objection</B> — object to processing in limited circumstances</Li>
            </ul>
            <P>To exercise any right, contact us at privacy@getout.app. We respond within 30 days.</P>
            <P>California residents: Out does not sell personal information and does not share it for cross-context behavioral advertising. You have the rights described under CCPA.</P>
            <P>EU/EEA residents: Our lawful basis for processing is contract performance (to provide the Out service). You have the rights described under GDPR Article 15–22.</P>
          </Section>

          <Section title="8. Children">
            <P>Out is not intended for anyone under 18 years of age. We do not knowingly collect personal information from anyone under 18. If you believe a minor has created an account, contact us immediately at privacy@getout.app and we will delete the account.</P>
          </Section>

          <Section title="9. Changes to This Policy">
            <P>We will notify you of material changes via an in-app notification at least 14 days before changes take effect. Continued use of Out after the effective date constitutes acceptance of the updated policy.</P>
          </Section>

          <Section title="10. Contact">
            <P>For privacy-related questions or requests:</P>
            <ul>
              <Li>Email: privacy@getout.app</Li>
              <Li>Response time: within 5 business days for general questions, 30 days for formal rights requests</Li>
            </ul>
          </Section>
        </Legal>
      </div>
    </div>
  );
}

function Legal({ children }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>{children}</div>;
}
function Section({ title, children }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.05rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '14px', color: '#fff' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{children}</div>
    </div>
  );
}
function P({ children }) {
  return <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: '1.75', fontWeight: '400' }}>{children}</p>;
}
function Li({ children }) {
  return <li style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: '1.75', marginLeft: '18px', listStyleType: 'disc' }}>{children}</li>;
}
function B({ children }) {
  return <strong style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>{children}</strong>;
}
