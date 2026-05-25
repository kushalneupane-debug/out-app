import { useEffect, useState, useCallback } from 'react';
import socket from '../socket';

var VIBE_EMOJI = {
  'coffee':         '☕',
  'walk':           '🚶',
  'just chill':     '😌',
  'gym':            '💪',
  'study together': '📚',
  'talk':           '💬',
};

function timeAgo(since) {
  var mins = Math.floor((Date.now() - since) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  return Math.floor(mins / 60) + 'h ago';
}

export default function NearbyScreen({ me, onChatStarted, onGoOffline }) {
  var [nearby, setNearby]     = useState([]);
  var [sentTo, setSentTo]     = useState(null);
  var [incoming, setIncoming] = useState(null);
  var [declined, setDeclined] = useState(false);
  var [tick, setTick]         = useState(0);

  var refresh = useCallback(function() {
    socket.emit('refresh_nearby', { radiusKm: 5 });
  }, []);

  useEffect(function() {
    socket.on('nearby_list',      function(list) { setNearby(list); });
    socket.on('nearby_changed',   function()     { refresh(); });
    socket.on('incoming_request', function(data) { setIncoming(data); });
    socket.on('invite_expired',   function()     { setIncoming(null); });
    socket.on('request_error',    function(e)    { setSentTo(null); });
    socket.on('request_declined', function() {
      setSentTo(null);
      setDeclined(true);
      setTimeout(function() { setDeclined(false); }, 3500);
    });
    socket.on('chat_started', function(data) { onChatStarted(data); });

    var ri = setInterval(refresh, 15000);
    var ti = setInterval(function() { setTick(function(t) { return t + 1; }); }, 60000);
    return function() {
      socket.off('nearby_list'); socket.off('nearby_changed');
      socket.off('incoming_request'); socket.off('invite_expired');
      socket.off('request_error'); socket.off('request_declined');
      socket.off('chat_started');
      clearInterval(ri); clearInterval(ti);
    };
  }, [refresh, onChatStarted]);

  function sendRequest(toId) {
    setSentTo(toId);
    socket.emit('send_request', { toId: toId });
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div className="bg-mesh" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '440px', width: '100%', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '52px 0 24px'
        }}>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: '700', letterSpacing: '-0.03em', color: '#fff' }}>
              Hey {me.name} 👋
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span className="live-dot" />
              <span style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.5)', fontWeight: '400' }}>
                you're out · {me.vibe}
              </span>
            </div>
          </div>
          <button className="btn-ghost" onClick={onGoOffline}
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            Go offline
          </button>
        </div>

        {/* Incoming invite */}
        {incoming && (
          <div className="fade-up" style={{
            marginBottom: '16px',
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.35)',
            borderRadius: '20px',
            padding: '18px 20px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
              }}>
                {VIBE_EMOJI[incoming.vibe] || '👋'}
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>
                  {incoming.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
                  wants to {incoming.vibe}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '0.875rem', borderRadius: '14px' }}
                onClick={function() { socket.emit('accept_request', { reqId: incoming.reqId }); setIncoming(null); }}>
                Accept
              </button>
              <button className="btn-ghost" style={{ flex: 1, padding: '12px', fontSize: '0.875rem' }}
                onClick={function() { socket.emit('decline_request', { reqId: incoming.reqId }); setIncoming(null); }}>
                Pass
              </button>
            </div>
          </div>
        )}

        {/* Declined toast */}
        {declined && (
          <div className="fade-up" style={{
            marginBottom: '14px', padding: '12px 16px', borderRadius: '14px', textAlign: 'center',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <span style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.45)' }}>
              They passed — keep looking
            </span>
          </div>
        )}

        {/* Nearby list */}
        <div style={{ flex: 1 }}>
          {nearby.length === 0
            ? <EmptyState />
            : (
              <>
                <div style={{ fontSize: '0.75rem', fontWeight: '500', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '14px' }}>
                  {nearby.length} {nearby.length === 1 ? 'person' : 'people'} within 3 miles
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {nearby.map(function(person, i) {
                    var isSent = sentTo === person.id;
                    var emoji  = VIBE_EMOJI[person.vibe] || '👋';
                    return (
                      <div key={person.id} className="person-card card-in"
                        style={{ animationDelay: (i * 0.06) + 's' }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '16px', flexShrink: 0,
                          background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem'
                        }}>
                          {emoji}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#fff', letterSpacing: '-0.01em' }}>
                            {person.name}
                          </div>
                          <div style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                            {person.vibe} · {person.distMiles} mi · {timeAgo(person.since)}
                          </div>
                        </div>
                        {isSent
                          ? <div style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.3)', padding: '8px 12px' }}>
                              Sent ✓
                            </div>
                          : <button className="btn-primary"
                              onClick={function() { sendRequest(person.id); }}
                              style={{ padding: '9px 18px', fontSize: '0.825rem', borderRadius: '12px', flexShrink: 0 }}>
                              I'm down
                            </button>
                        }
                      </div>
                    );
                  })}
                </div>
              </>
            )
          }
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.18)', padding: '24px 0 20px', letterSpacing: '-0.01em' }}>
          Refreshes every 15s · Only visible while you're out
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '24px' }}>
        <span className="pulse-ring" />
        <span className="pulse-ring-2" />
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 1, fontSize: '1.8rem'
        }}>
          📡
        </div>
      </div>
      <div style={{ fontWeight: '600', fontSize: '1rem', color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
        No one nearby right now
      </div>
      <div style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.35)', lineHeight: '1.6', maxWidth: '240px' }}>
        People join throughout the day.<br />Check back in a bit.
      </div>
    </div>
  );
}
