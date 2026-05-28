import { useState, useEffect, useRef } from 'react';
import socket from '../socket';

export default function ChatScreen({ chatData, myName, onEnd }) {
  var [messages, setMessages] = useState([]);
  var [text, setText]         = useState('');
  var [typing, setTyping]     = useState(false);
  var bottomRef = useRef(null);
  var typingTimeout = useRef(null);

  useEffect(function() {
    socket.on('chat_message', function(data) {
      if (data.chatId !== chatData.chatId) return;
      setMessages(function(prev) {
        return prev.concat({ from: data.from, text: data.text, ts: data.ts });
      });
    });
    socket.on('chat:typing', function(data) {
      if (data.chatId !== chatData.chatId) return;
      setTyping(data.typing);
    });
    return function() {
      socket.off('chat_message');
      socket.off('chat:typing');
    };
  }, [chatData.chatId]);

  useEffect(function() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function send() {
    var t = text.trim();
    if (!t) return;
    socket.emit('chat_message', { chatId: chatData.chatId, text: t });
    setText('');
  }

  function onInput(e) {
    setText(e.target.value);
    socket.emit('chat:typing', { chatId: chatData.chatId, typing: true });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(function() {
      socket.emit('chat:typing', { chatId: chatData.chatId, typing: false });
    }, 1500);
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div className="bg-mesh" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '440px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '52px 20px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '14px', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(109,40,217,0.1))',
            border: '1px solid rgba(124,58,237,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
          }}>
            👋
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.02em' }}>
              {chatData.withName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <span className="live-dot" style={{ width: '6px', height: '6px' }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                nearby · just connected
              </span>
            </div>
          </div>
          <button className="btn-ghost" onClick={onEnd}
            style={{ padding: '7px 14px', fontSize: '0.775rem', color: 'rgba(255,255,255,0.45)' }}>
            End
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }} className="fade-up">
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 16px',
                background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
              }}>
                ✨
              </div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                You matched with {chatData.withName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: '1.6' }}>
                Figure out where to meet →
              </div>
            </div>
          )}

          {messages.map(function(msg, i) {
            var isMe = msg.from === socket.id;
            return (
              <div key={i} className="card-in"
                style={{
                  display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start',
                  animationDelay: '0s'
                }}>
                <div className={isMe ? 'bubble-me' : 'bubble-them'}
                  style={{ maxWidth: '72%', padding: '11px 16px', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: '400' }}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {typing && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div className="bubble-them" style={{ padding: '12px 16px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', animation: 'pulseSoft 1s 0s ease-in-out infinite' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', animation: 'pulseSoft 1s 0.2s ease-in-out infinite' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', animation: 'pulseSoft 1s 0.4s ease-in-out infinite' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Ephemeral note */}
        <div style={{
          margin: '0 20px',
          padding: '10px 14px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', textAlign: 'center', lineHeight: '1.5'
        }}>
          Chat disappears when you both go offline
        </div>

        {/* Input */}
        <div style={{
          display: 'flex', gap: '10px', padding: '14px 20px 28px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: '10px'
        }}>
          <input
            className="input"
            value={text}
            onChange={onInput}
            onKeyDown={function(e) { if (e.key === 'Enter') send(); }}
            placeholder="Where should we meet?"
            style={{ flex: 1, padding: '13px 18px', fontSize: '0.9rem' }}
          />
          <button
            className="btn-primary"
            onClick={send}
            disabled={!text.trim()}
            style={{ padding: '13px 18px', borderRadius: '16px', fontSize: '1rem', flexShrink: 0 }}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
