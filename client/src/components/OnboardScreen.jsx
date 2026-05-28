import { useState } from 'react';

var VIBES = [
  { label: 'coffee',         emoji: '☕' },
  { label: 'walk',           emoji: '🚶' },
  { label: 'just chill',     emoji: '😌' },
  { label: 'gym',            emoji: '💪' },
  { label: 'study together', emoji: '📚' },
  { label: 'talk',           emoji: '💬' },
];

export default function OnboardScreen({ onReady }) {
  var [name, setName]       = useState('');
  var [vibe, setVibe]       = useState('just chill');
  var [locating, setLocating] = useState(false);
  var [error, setError]     = useState('');

  function handleGo() {
    if (!name.trim()) { setError('What should we call you?'); return; }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        setLocating(false);
        onReady({ name: name.trim(), vibe, lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      function() {
        setLocating(false);
        setError('Location access is needed to find people near you.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
      <div className="bg-mesh" />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>

        {/* Logo mark */}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '44px' }}>
          <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '20px' }}>
            <span className="pulse-ring" />
            <span className="pulse-ring-2" />
            <div style={{
              width: '64px', height: '64px', borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(109,40,217,0.1))',
              border: '1px solid rgba(124,58,237,0.35)',
              backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              position: 'relative', zIndex: 1
            }}>
              <div className="pulse-soft" style={{
                width: '18px', height: '18px', borderRadius: '50%',
                background: 'radial-gradient(circle, #a78bfa 0%, #7c3aed 100%)',
                boxShadow: '0 0 16px rgba(167,139,250,0.7)'
              }} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>Out</div>
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontWeight: '400', letterSpacing: '-0.01em' }}>
            find someone near you, right now
          </div>
        </div>

        {/* Form */}
        <div className="glass fade-up-delay-1" style={{ padding: '28px 24px', borderRadius: '24px' }}>

          {/* Name */}
          <div style={{ marginBottom: '22px' }}>
            <span className="label">Your name</span>
            <input
              className="input"
              value={name}
              onChange={function(e) { setName(e.target.value); setError(''); }}
              onKeyDown={function(e) { if (e.key === 'Enter') handleGo(); }}
              placeholder="Just your first name"
              maxLength={20}
              autoFocus
            />
          </div>

          {/* Vibe */}
          <div style={{ marginBottom: '26px' }}>
            <span className="label">What are you up for?</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {VIBES.map(function(v) {
                return (
                  <button key={v.label}
                    onClick={function() { setVibe(v.label); }}
                    className={'vibe-chip' + (vibe === v.label ? ' active' : '')}>
                    {v.emoji} {v.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '12px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '0.825rem', color: '#fca5a5'
            }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleGo}
            disabled={locating}
            style={{ width: '100%', padding: '16px', fontSize: '0.95rem', borderRadius: '16px' }}>
            {locating
              ? <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Spinner /> Finding your location…
                </span>
              : "I'm Out →"
            }
          </button>
        </div>

        {/* Privacy note */}
        <p className="fade-up-delay-2" style={{
          textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.22)',
          marginTop: '20px', lineHeight: '1.6', letterSpacing: '-0.01em'
        }}>
          📍 Location is fuzzy and deleted the moment you go offline
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
    </svg>
  );
}
