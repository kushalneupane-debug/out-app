export default function TermsPage({ onBack }) {
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
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.04em', marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>Last updated: {updated}</p>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', marginBottom: '48px' }}>
          Please read these terms carefully before using Out. By creating an account or using Out, you agree to be bound by these terms.
        </p>

        <div className="div" style={{ marginBottom: '48px' }} />

        <Legal>
          <Section title="1. Eligibility">
            <P>You must be at least 18 years old to use Out. By using Out, you confirm that you are 18 or older. If we discover that a user is under 18, we will immediately terminate their account.</P>
            <P>Out is currently available to users in regions where the service has been launched. We reserve the right to restrict access by geography.</P>
          </Section>

          <Section title="2. Your Account">
            <P>You create an account by verifying your phone number via SMS. You are responsible for all activity that occurs through your account.</P>
            <P>You agree to:</P>
            <ul>
              <Li>Provide your real first name (not a pseudonym designed to deceive others)</Li>
              <Li>Use only one account per person</Li>
              <Li>Keep your phone number current and accessible</Li>
              <Li>Not share account access with anyone else</Li>
            </ul>
            <P>We may suspend or terminate your account at any time if we believe you are violating these terms.</P>
          </Section>

          <Section title="3. Acceptable Use">
            <P>Out is a tool for spontaneous, real-world social connection. You agree not to use it to:</P>
            <ul>
              <Li>Harass, threaten, stalk, or harm any other user</Li>
              <Li>Send unsolicited sexual content or explicit messages</Li>
              <Li>Impersonate another person or misrepresent your identity</Li>
              <Li>Use Out for commercial solicitation, advertising, or spam</Li>
              <Li>Attempt to scrape, extract, or reverse-engineer any part of Out</Li>
              <Li>Circumvent rate limits, block lists, or abuse detection systems</Li>
              <Li>Use Out while operating a vehicle or in any situation that requires your full attention</Li>
              <Li>Facilitate or engage in any illegal activity</Li>
            </ul>
            <P>Violations may result in immediate account suspension without notice. Serious violations (threats, harassment, illegal conduct) will be reported to law enforcement where required.</P>
          </Section>

          <Section title="4. Real-World Meetups — Your Responsibility">
            <P>Out facilitates the discovery of nearby people and a short in-app chat. What happens after that — including any real-world meeting — is entirely between you and the other person.</P>
            <P>We strongly encourage you to:</P>
            <ul>
              <Li>Meet in public places for first encounters</Li>
              <Li>Tell a trusted contact where you're going</Li>
              <Li>Trust your instincts — if something feels off, leave</Li>
              <Li>Use our in-app "I'm uncomfortable" feature to report concerning behavior</Li>
            </ul>
            <P><strong>Out is not responsible for any harm, injury, loss, or damage that arises from real-world meetings between users.</strong> Use common sense and personal judgment.</P>
          </Section>

          <Section title="5. Safety and Reporting">
            <P>Out provides a one-tap reporting system. When you report a user:</P>
            <ul>
              <Li>The report is reviewed by our team within 2 hours during operating hours</Li>
              <Li>The reported user is immediately hidden from your nearby list</Li>
              <Li>Users with 3 or more reports within 24 hours are automatically suspended pending review</Li>
              <Li>We maintain a hashed phone blocklist for users who are permanently banned</Li>
            </ul>
            <P>False or malicious reports made with intent to harm another user's account may result in your own account being suspended.</P>
          </Section>

          <Section title="6. Intellectual Property">
            <P>All code, design, copy, and brand assets in Out are owned by Out or its licensors. You may not reproduce, distribute, or create derivative works without our written permission.</P>
            <P>By using Out, you grant us a non-exclusive, royalty-free license to use your name and vibe selection solely to display them to nearby users during your active session. This license ends when your session ends.</P>
          </Section>

          <Section title="7. Disclaimers">
            <P>Out is provided "as is" and "as available" without any warranty, express or implied. We do not warrant that:</P>
            <ul>
              <Li>The service will be uninterrupted or error-free</Li>
              <Li>Results from using the service will meet your expectations</Li>
              <Li>Other users on the platform are who they say they are</Li>
            </ul>
            <P>To the maximum extent permitted by law, Out disclaims all implied warranties including merchantability, fitness for a particular purpose, and non-infringement.</P>
          </Section>

          <Section title="8. Limitation of Liability">
            <P>To the maximum extent permitted by law, Out's total liability to you for any claim arising out of or relating to these terms or your use of the service shall not exceed $100 USD.</P>
            <P>Out is not liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or personal injury, even if we have been advised of the possibility of such damages.</P>
          </Section>

          <Section title="9. Indemnification">
            <P>You agree to defend, indemnify, and hold harmless Out and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable legal fees) arising out of your use of Out, your violation of these terms, or your interaction with any other user.</P>
          </Section>

          <Section title="10. Governing Law">
            <P>These terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any dispute shall be resolved through binding arbitration in accordance with the American Arbitration Association rules, except that either party may seek injunctive relief in court for IP infringement or unauthorized access claims.</P>
          </Section>

          <Section title="11. Changes to These Terms">
            <P>We may update these terms from time to time. We will give you at least 14 days' notice of material changes via in-app notification. If you disagree with the updated terms, your only recourse is to stop using Out and delete your account.</P>
          </Section>

          <Section title="12. Contact">
            <P>For legal inquiries: legal@getout.app</P>
            <P>For abuse reports: safety@getout.app</P>
            <P>For general support: support@getout.app</P>
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
