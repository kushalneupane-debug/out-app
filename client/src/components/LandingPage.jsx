import { useState, useEffect, useRef } from 'react';

var STEPS = [
  {
    n: '01',
    title: 'Tap "I\'m Out"',
    body: 'Tell us your vibe — coffee, walk, study, whatever. Your location is shared as a rough area, never your exact spot.',
  },
  {
    n: '02',
    title: 'See who\'s nearby',
    body: 'Real people within 3 miles who are also free right now. No profiles, no photos, no algorithm deciding for you.',
  },
  {
    n: '03',
    title: 'Send one invite',
    body: 'Tap "I\'m down". They accept. You get a chat to pick a spot. The chat disappears after. That\'s the whole thing.',
  },
];

var WHY = [
  { icon: '🚫', text: 'No profile to build' },
  { icon: '🚫', text: 'No swiping' },
  { icon: '🚫', text: 'No algorithm' },
  { icon: '🚫', text: 'No data stored after you leave' },
  { icon: '✓',  text: 'Location fuzzy by default' },
  { icon: '✓',  text: 'Chat is ephemeral' },
  { icon: '✓',  text: 'One-tap block and report' },
  { icon: '✓',  text: 'Phone-verified users only' },
];

export default function LandingPage({ onGetStarted, onShowPrivacy, onShowTerms }) {
  var [scrolled, setScrolled] = useState(false);
  var [mobileOpen, setMobileOpen] = useState(false);
  var heroRef = useRef(null);

  useEffect(function() {
    function onScroll() { setScrolled(window.scrollY > 40); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return function() { window.removeEventListener('scroll', onScroll); };
  }, []);

  function scrollTo(id) {
    setMobileOpen(false);
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      <div className="mesh" />

      {/* ── Nav ── */}
      <nav className={'nav ' + (scrolled ? 'scrolled' : '')} style={{ padding: '0 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="radar-ring" style={{ animationDelay: '0s' }} />
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 10px rgba(167,139,250,0.8)', display: 'block', animation: 'blink 2.4s ease-in-out infinite' }} />
              </div>
            </div>
            <span style={{ fontWeight: '800', fontSize: '1.15rem', letterSpacing: '-0.04em', color: '#fff' }}>Out</span>
          </div>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
            {[['How it works', 'how'], ['Why Out', 'why'], ['Safety', 'safety']].map(function(item) {
              return (
                <button key={item[0]} onClick={function() { scrollTo(item[1]); }}
                  style={{ padding: '8px 14px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', borderRadius: '10px', transition: 'color 0.15s, background 0.15s', fontFamily: 'Inter, sans-serif' }}
                  onMouseOver={function(e) { e.target.style.color='#fff'; e.target.style.background='rgba(255,255,255,0.05)'; }}
                  onMouseOut={function(e) { e.target.style.color='rgba(255,255,255,0.55)'; e.target.style.background='none'; }}>
                  {item[0]}
                </button>
              );
            })}
            <button className="btn btn-md" onClick={onGetStarted} style={{ marginLeft: '8px' }}>
              I'm Out →
            </button>
          </div>

          {/* Hamburger */}
          <button onClick={function() { setMobileOpen(function(o){return !o;}); }} className="md:hidden"
            style={{ width: '40px', height: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '10px' }}>
            {[0,1,2].map(function(i) {
              return <span key={i} style={{ display: 'block', width: '20px', height: '1.5px', background: 'rgba(255,255,255,0.7)', borderRadius: '2px' }} />;
            })}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: 'rgba(4,4,11,0.97)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 20px 20px' }}>
            {[['How it works', 'how'], ['Why Out', 'why'], ['Safety', 'safety']].map(function(item) {
              return (
                <button key={item[0]} onClick={function() { scrollTo(item[1]); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 4px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  {item[0]}
                </button>
              );
            })}
            <button className="btn btn-md" onClick={onGetStarted} style={{ width: '100%', marginTop: '8px', padding: '14px' }}>
              I'm Out →
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', position: 'relative', zIndex: 1, textAlign: 'center' }}>

        {/* Pill badge */}
        <div className="fu" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 14px', borderRadius: '50px', border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.1)', marginBottom: '32px', backdropFilter: 'blur(10px)' }}>
          <span className="ldot" />
          <span style={{ fontSize: '0.78rem', fontWeight: '500', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.01em' }}>Available in your city right now</span>
        </div>

        {/* Headline */}
        <h1 className="fu1" style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', fontWeight: '800', letterSpacing: '-0.05em', lineHeight: '1.04', maxWidth: '780px', marginBottom: '24px' }}>
          <span className="grad-text">Find someone near you,</span>
          <br />right now.
        </h1>

        {/* Subhead */}
        <p className="fu2" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(255,255,255,0.55)', maxWidth: '520px', lineHeight: '1.65', fontWeight: '400', marginBottom: '40px', letterSpacing: '-0.01em' }}>
          No profiles. No swiping. No algorithm.
          Just real people within 3 miles who are free right now — same as you.
        </p>

        {/* CTAs */}
        <div className="fu3" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '64px' }}>
          <button className="btn btn-lg" onClick={onGetStarted}>
            I'm Out →
          </button>
          <button className="btn-outline btn-md" onClick={function() { scrollTo('how'); }}
            style={{ padding: '14px 28px', borderRadius: '16px' }}>
            See how it works
          </button>
        </div>

        {/* Radar visual */}
        <div className="fu4" style={{ position: 'relative', width: '280px', height: '280px', margin: '0 auto' }}>
          {/* Rings */}
          {[0, 0.9, 1.8].map(function(delay, i) {
            var size = [280, 200, 140][i];
            return (
              <div key={i} style={{ position: 'absolute', width: size + 'px', height: size + 'px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '1px solid rgba(124,58,237,' + [0.12, 0.18, 0.25][i] + ')' }}>
                <span style={{ position: 'absolute', inset: '-1px', borderRadius: '50%', border: '1px solid rgba(124,58,237,0.35)', animation: 'ringOut 3s ' + delay + 's ease-out infinite', display: 'block' }} />
              </div>
            );
          })}
          {/* Center dot (you) */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(109,40,217,0.2))', border: '1px solid rgba(124,58,237,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, backdropFilter: 'blur(10px)' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 16px rgba(167,139,250,0.8)', display: 'block', animation: 'blink 2s ease-in-out infinite' }} />
          </div>
          {/* Nearby people dots */}
          {[
            { top: '22%', left: '68%', delay: '0.3s', label: 'Alex · coffee' },
            { top: '65%', left: '25%', delay: '0.7s', label: 'Sam · walk' },
            { top: '30%', left: '20%', delay: '1.2s', label: 'Jordan · chill' },
          ].map(function(dot, i) {
            return (
              <div key={i} style={{ position: 'absolute', top: dot.top, left: dot.left, transform: 'translate(-50%,-50%)', zIndex: 4 }}>
                <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                  <span style={{ position: 'absolute', inset: '-1px', borderRadius: '50%', border: '1px solid rgba(124,58,237,0.4)', animation: 'ringOut 2.5s ' + dot.delay + ' ease-out infinite', display: 'block' }} />
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', backdropFilter: 'blur(10px)' }}>
                    👤
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '36px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontWeight: '500', background: 'rgba(4,4,11,0.8)', padding: '3px 7px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {dot.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
          <span>scroll to learn more</span>
          <span style={{ fontSize: '1rem', animation: 'float 2s ease-in-out infinite' }}>↓</span>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="lbl" style={{ justifyContent: 'center', display: 'flex', marginBottom: '12px' }}>How it works</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1.1' }}>
              Three steps. No bullshit.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {STEPS.map(function(step, i) {
              return (
                <div key={i} className="glass" style={{ borderRadius: '20px', padding: '28px 24px' }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.1em', color: 'rgba(124,58,237,0.8)', marginBottom: '14px' }}>{step.n}</div>
                  <div style={{ fontWeight: '700', fontSize: '1.05rem', letterSpacing: '-0.02em', marginBottom: '10px', color: '#fff' }}>{step.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.65', fontWeight: '400' }}>{step.body}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Out ── */}
      <section id="why" style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div className="lbl">Why Out</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1.1', marginBottom: '20px' }}>
              Built different<br />on purpose.
            </h2>
            <p style={{ fontSize: '0.925rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', fontWeight: '400', maxWidth: '360px' }}>
              Dating apps aren't for this. Friend apps are awkward. Out is the only thing that just asks one question: who's free near me right now?
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {WHY.map(function(item, i) {
              var isCheck = item.icon === '✓';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.8rem', flexShrink: 0, marginTop: '1px', color: isCheck ? '#10b981' : '#f87171' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500', lineHeight: '1.4' }}>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Safety ── */}
      <section id="safety" style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="glass" style={{ borderRadius: '24px', padding: '40px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <div className="lbl">Safety & Privacy</div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: '1.15', marginBottom: '16px' }}>
                We take this seriously.
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', fontWeight: '400' }}>
                Out was designed with privacy as the default, not an add-on. We keep as little data as possible and delete the rest the moment you go offline.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                ['📍', 'Fuzzy location only', 'We jitter your coords by ~200m before storing anything.'],
                ['🔒', 'Phone-verified only',  'Every user is verified by SMS. No anonymous accounts.'],
                ['💬', 'Ephemeral chat',       'Messages are never written to disk. Gone when you leave.'],
                ['🚨', 'One-tap report',       'Anyone can block or report in two taps. Action within 2h.'],
              ].map(function(item, i) {
                return (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '2px' }}>{item[0]}</span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#fff', marginBottom: '2px' }}>{item[1]}</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>{item[2]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '80px 24px 120px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '800', letterSpacing: '-0.045em', lineHeight: '1.08', marginBottom: '20px' }}>
            <span className="grad-text">Stop waiting.</span><br />Go be out there.
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', marginBottom: '36px', lineHeight: '1.65' }}>
            Someone near you is also bored, also free, also wondering if anything's going on.
          </p>
          <button className="btn btn-lg" onClick={onGetStarted} style={{ fontSize: '1.05rem', padding: '18px 44px' }}>
            I'm Out →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontWeight: '800', fontSize: '0.95rem', letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.5)' }}>Out</div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              ['Privacy Policy', onShowPrivacy],
              ['Terms of Service', onShowTerms],
            ].map(function(item) {
              return (
                <button key={item[0]} onClick={item[1]}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.38)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500', transition: 'color 0.15s' }}
                  onMouseOver={function(e) { e.target.style.color = 'rgba(255,255,255,0.7)'; }}
                  onMouseOut={function(e) { e.target.style.color = 'rgba(255,255,255,0.38)'; }}>
                  {item[0]}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.22)' }}>
            © {new Date().getFullYear()} Out. Built for humans.
          </div>
        </div>
      </footer>
    </div>
  );
}
