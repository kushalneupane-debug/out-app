"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shield, X, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useOutStore } from "@/lib/store";
import { getSocket, destroySocket } from "@/lib/socket";

const VIBE_EMOJI: Record<string, string> = {
  coffee: "☕", walk: "🚶", chill: "😌", food: "🍕",
  talk: "💬", study: "📚",
};

interface MatchedUser {
  id: string;
  name: string;
  vibe: string;
  distMiles: number;
  matchScore: number;
  since: number;
}

type ChatData = { chatId: string; withName: string };

function timeAgo(since: number) {
  const mins = Math.floor((Date.now() - since) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function ScoreBadge({ score, isTop }: { score: number; isTop: boolean }) {
  const color = score >= 80 ? "#22c55e" : score >= 55 ? "#0062AD" : "#888";
  const bg    = score >= 80 ? "rgba(34,197,94,0.1)" : score >= 55 ? "rgba(0,98,173,0.1)" : "rgba(136,136,136,0.08)";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
      {isTop && (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em", color: "#22c55e", textTransform: "uppercase" }}>
          Top
        </span>
      )}
      <div style={{ padding: "2px 8px", borderRadius: 9999, background: bg, border: `1px solid ${color}33`, fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, color }}>
        {score}
      </div>
    </div>
  );
}

export default function AppPage() {
  const router       = useRouter();
  const session      = useOutStore(s => s.session);
  const clearSession = useOutStore(s => s.clearSession);

  const [isOut, setIsOut]       = useState(false);
  const [matches, setMatches]   = useState<MatchedUser[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, setPending]   = useState<Record<string, true>>({});
  const [incoming, setIncoming] = useState<{ reqId: string; from: string; name: string; vibe: string; matchScore: number } | null>(null);
  const [declined, setDeclined]       = useState(false);
  const [reported, setReported]       = useState<Record<string, true>>({});
  const [chat, setChat]               = useState<ChatData | null>(null);
  const [chatMsgs, setChatMsgs]       = useState<{ from: string; text: string; ts: number }[]>([]);
  const [chatText, setChatText]       = useState("");
  const [error, setError]             = useState("");
  const [socketDown, setSocketDown]   = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.name) router.push("/join");
  }, [session, router]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  const refresh = useCallback(() => {
    getSocket().emit("refresh_nearby", { radiusKm: 5 });
  }, []);

  const goOffline = useCallback(() => {
    getSocket().emit("go_offline");
    destroySocket();
    setIsOut(false);
    setMatches([]);
    setSelected(null);
    setChat(null);
    setChatMsgs([]);
    setPending({});
  }, []);

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect",          () => setSocketDown(false));
    socket.on("disconnect",       () => { if (isOut) setSocketDown(true); });
    socket.on("match_list",      (list: MatchedUser[]) => setMatches(list));
    socket.on("nearby_changed",  () => refresh());
    socket.on("incoming_connect", (d: { reqId: string; from: string; name: string; vibe: string; matchScore: number }) => setIncoming(d));
    socket.on("connect_expired", () => setIncoming(null));
    socket.on("connect_error",   (e: { message: string }) => setError(e.message));
    socket.on("connect_declined", () => {
      setPending({});
      setDeclined(true);
      setTimeout(() => setDeclined(false), 3500);
    });
    socket.on("chat_started", (d: ChatData) => {
      setChat(d);
      setSelected(null);
      setChatMsgs([]);
    });
    socket.on("chat_message", (d: { chatId: string; from: string; text: string; ts: number }) => {
      setChatMsgs(prev => [...prev, d]);
    });

    const ri = setInterval(refresh, 15000);
    return () => {
      socket.off("connect"); socket.off("disconnect");
      socket.off("match_list"); socket.off("nearby_changed");
      socket.off("incoming_connect"); socket.off("connect_expired");
      socket.off("connect_error"); socket.off("connect_declined");
      socket.off("chat_started"); socket.off("chat_message");
      clearInterval(ri);
    };
  }, [refresh, isOut]);

  function toggleOut() {
    if (isOut) { goOffline(); return; }
    if (!session) return;
    const lat = session.lat, lng = session.lng;
    if (!lat || !lng) { setError("Location not found — please re-join."); return; }
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
      socket.once("connect", () => {
        socket.emit("go_live", { name: session.name, vibe: session.vibe, lat, lng, radiusKm: 5 });
      });
    } else {
      socket.emit("go_live", { name: session.name, vibe: session.vibe, lat, lng, radiusKm: 5 });
    }
    setIsOut(true);
  }

  function sendConnect(user: MatchedUser) {
    getSocket().emit("connect_request", { toId: user.id, matchScore: user.matchScore });
    setPending(p => ({ ...p, [user.id]: true }));
    setSelected(null);
  }

  function reportUser(user: MatchedUser) {
    getSocket().emit("report_user", { reportedId: user.id });
    setReported(r => ({ ...r, [user.id]: true }));
    setSelected(null);
  }

  function acceptIncoming() {
    if (!incoming) return;
    getSocket().emit("accept_connect", { reqId: incoming.reqId });
    setIncoming(null);
  }

  function declineIncoming() {
    if (!incoming) return;
    getSocket().emit("decline_connect", { reqId: incoming.reqId });
    setIncoming(null);
  }

  function sendChatMsg() {
    if (!chatText.trim() || !chat) return;
    getSocket().emit("chat_message", { chatId: chat.chatId, text: chatText.trim() });
    setChatText("");
  }

  function endChat() {
    goOffline();
    setChat(null);
    router.push("/");
  }

  function handleLogout() {
    goOffline();
    clearSession();
    router.push("/");
  }

  const selectedUser = matches.find(u => u.id === selected);

  // ── Chat screen ─────────────────────────────────────────────────────────────
  if (chat) {
    const socketId = getSocket().id;
    return (
      <div style={{ height: "100dvh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
        <div className="ambient" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 520, width: "100%", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 16px 14px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0,98,173,0.12)", border: "1px solid rgba(0,98,173,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
              💬
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--t1)" }}>{chat.withName}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--t3)" }}>matched nearby · just connected</div>
            </div>
            <button onClick={endChat} style={{ background: "none", border: "none", color: "var(--t4)", cursor: "pointer", padding: 6 }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {chatMsgs.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--t4)", fontSize: "0.875rem" }}>
                You matched! Say hey — figure out where to meet.
              </div>
            )}
            {chatMsgs.map((msg, i) => {
              const isMe = msg.from === socketId;
              return (
                <div key={i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "72%", padding: "10px 14px",
                    borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: isMe ? "#0062AD" : "var(--surface)",
                    border: isMe ? "none" : "1px solid var(--border)",
                    fontSize: "0.9rem", color: "var(--t1)", lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          <div style={{ padding: "10px 14px 24px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              value={chatText}
              onChange={e => setChatText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendChatMsg(); }}
              placeholder="Where should we meet?"
              style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, padding: "11px 14px", color: "var(--t1)", fontSize: "0.9rem", outline: "none", fontFamily: "var(--font-sans)" }}
              onFocus={e => { e.target.style.borderColor = "#0062AD"; }}
              onBlur={e =>  { e.target.style.borderColor = "var(--border-2)"; }}
            />
            <button onClick={sendChatMsg} disabled={!chatText.trim()}
              style={{ padding: "11px 16px", borderRadius: 12, background: "#0062AD", border: "none", color: "#fff", cursor: "pointer", fontSize: "1rem", opacity: !chatText.trim() ? 0.4 : 1 }}>
              →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main screen ─────────────────────────────────────────────────────────────
  return (
    <div style={{ height: "100dvh", background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="ambient" />

      {/* Top bar */}
      <header style={{ height: 56, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0, background: "rgba(9,9,11,0.92)", backdropFilter: "blur(12px)", zIndex: 20, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0062AD", boxShadow: "0 0 6px rgba(0,98,173,0.7)", display: "block", animation: "dot-blink 2.5s ease-in-out infinite" }} />
          <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.04em" }}>Out</span>
          {isOut && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 9999, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", animation: "glow-pulse 2s infinite", display: "block" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#22c55e", fontWeight: 600 }}>LIVE</span>
            </motion.div>
          )}
        </div>

        <motion.button onClick={toggleOut} whileTap={{ scale: 0.97 }}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 9999,
            background: isOut ? "rgba(0,98,173,0.15)" : "var(--surface)",
            border: `1px solid ${isOut ? "rgba(0,98,173,0.5)" : "var(--border-2)"}`,
            cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.2s",
          }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: isOut ? "var(--t1)" : "var(--t3)" }}>
            {isOut ? "I'm Out" : "I'm In"}
          </span>
        </motion.button>

        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button title="To report someone, open their profile from the match list"
            style={{ width: 34, height: 34, borderRadius: 8, background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t4)", cursor: "default" }}>
            <Shield size={16} />
          </button>
          <button onClick={handleLogout} title="Sign out"
            style={{ width: 34, height: 34, borderRadius: 8, background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t4)", cursor: "pointer" }}
            onMouseOver={e => { e.currentTarget.style.color = "#ef4444"; }}
            onMouseOut={e =>  { e.currentTarget.style.color = "var(--t4)"; }}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* Sidebar — matches list */}
        <aside style={{ width: 320, flexShrink: 0, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--t5)" }}>
              {isOut ? "Matches" : "Nearby"}
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {isOut && <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#22c55e" }}>{matches.length} found</span>}
              {isOut && (
                <button onClick={refresh} style={{ background: "none", border: "none", color: "var(--t4)", cursor: "pointer", display: "flex" }}>
                  <RefreshCw size={13} />
                </button>
              )}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
            {!isOut ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "2rem", marginBottom: 16 }}>📡</div>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--t2)", marginBottom: 6 }}>Go Out to find matches nearby</p>
                <p style={{ fontSize: "0.8rem", color: "var(--t4)", lineHeight: 1.6 }}>Toggle the button above</p>
              </div>
            ) : matches.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "2rem", marginBottom: 14 }}>🔍</div>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--t2)", marginBottom: 6 }}>No matches nearby right now</p>
                <p style={{ fontSize: "0.8rem", color: "var(--t4)", lineHeight: 1.6 }}>People join throughout the day</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {matches.map((user, i) => (
                  <motion.button key={user.id}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => setSelected(s => s === user.id ? null : user.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 11, cursor: "pointer",
                      background: selected === user.id ? "rgba(0,98,173,0.1)" : "transparent",
                      border: `1px solid ${selected === user.id ? "rgba(0,98,173,0.3)" : "transparent"}`,
                      fontFamily: "var(--font-sans)", textAlign: "left", width: "100%", transition: "all 0.12s",
                    }}
                    onMouseOver={e => { if (selected !== user.id) e.currentTarget.style.background = "var(--surface)"; }}
                    onMouseOut={e =>  { if (selected !== user.id) e.currentTarget.style.background = "transparent"; }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "rgba(0,98,173,0.1)", border: "1px solid rgba(0,98,173,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                      {VIBE_EMOJI[user.vibe] ?? "👋"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--t1)" }}>{user.name}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--t5)" }}>{user.distMiles} mi</span>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--t4)" }}>
                        {user.vibe} · {timeAgo(user.since)}
                      </div>
                    </div>
                    <ScoreBadge score={user.matchScore} isTop={i === 0} />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Map area */}
        <main style={{ flex: 1, position: "relative", overflow: "hidden", background: "#0a0a0f" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "44px 44px", opacity: 0.3 }} />

          {!isOut ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--t4)", letterSpacing: "-0.02em", marginBottom: 6 }}>Map activates when you&apos;re Out</p>
              <Button onClick={toggleOut}>I&apos;m Out →</Button>
            </div>
          ) : (
            <>
              {matches.map((user, i) => {
                const positions = [
                  { top: "28%", left: "60%" }, { top: "58%", left: "26%" },
                  { top: "38%", left: "70%" }, { top: "65%", left: "52%" },
                  { top: "22%", left: "38%" }, { top: "72%", left: "33%" },
                ];
                const pos = positions[i % positions.length];
                const isTopMatch = i === 0;
                return (
                  <motion.div key={user.id}
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 280 }}
                    onClick={() => setSelected(s => s === user.id ? null : user.id)}
                    style={{ position: "absolute", top: pos.top, left: pos.left, transform: "translate(-50%,-50%)", cursor: "pointer", zIndex: 5 }}>
                    <motion.div
                      animate={{ boxShadow: [`0 0 0 0 rgba(0,98,173,0.5)`, `0 0 0 14px rgba(0,98,173,0)`, `0 0 0 0 rgba(0,98,173,0)`] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      style={{ width: 38, height: 38, borderRadius: "50%", background: isTopMatch ? "rgba(34,197,94,0.18)" : "rgba(0,98,173,0.18)", border: `2px solid ${isTopMatch ? "rgba(34,197,94,0.7)" : "rgba(0,98,173,0.7)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", color: isTopMatch ? "#22c55e" : "#1d84d4" }}>
                      {user.name[0]}
                    </motion.div>
                    {isTopMatch && (
                      <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "#22c55e", fontWeight: 700, whiteSpace: "nowrap", letterSpacing: "0.05em" }}>TOP MATCH</div>
                    )}
                  </motion.div>
                );
              })}

              {/* You */}
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 250 }}
                style={{ position: "absolute", top: "50%", left: "47%", transform: "translate(-50%,-50%)", zIndex: 6 }}>
                <motion.div
                  animate={{ boxShadow: ["0 0 0 0 rgba(34,197,94,0.6)", "0 0 0 18px rgba(34,197,94,0)", "0 0 0 0 rgba(34,197,94,0)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(34,197,94,0.2)", border: "2px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#22c55e" }} />
                </motion.div>
                <div style={{ position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#22c55e", fontWeight: 600, whiteSpace: "nowrap" }}>YOU</div>
              </motion.div>
            </>
          )}

          <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", padding: "6px 14px", borderRadius: 9999, background: "rgba(9,9,11,0.85)", border: "1px solid var(--border)", fontSize: "0.68rem", color: "var(--t4)", fontFamily: "var(--font-mono)", backdropFilter: "blur(8px)", whiteSpace: "nowrap" }}>
            Sorted by proximity &amp; vibe
          </div>
        </main>
      </div>

      {/* Server disconnected banner */}
      <AnimatePresence>
        {socketDown && (
          <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
            style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 60, padding: "10px 20px", background: "rgba(239,68,68,0.12)", borderBottom: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8rem", color: "#fca5a5", fontFamily: "var(--font-mono)" }}>Connection lost — reconnecting…</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incoming connect banner */}
      <AnimatePresence>
        {incoming && (
          <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}
            style={{ position: "fixed", top: 64, left: "50%", transform: "translateX(-50%)", zIndex: 50, width: "90%", maxWidth: 400, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: "1.3rem" }}>{VIBE_EMOJI[incoming.vibe] ?? "👋"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--t1)" }}>{incoming.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--t3)" }}>wants to connect · {incoming.matchScore} match</div>
            </div>
            <Button size="sm" onClick={acceptIncoming}>Accept</Button>
            <Button size="sm" variant="ghost" onClick={declineIncoming}>Pass</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Declined toast */}
      <AnimatePresence>
        {declined && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 50, padding: "10px 18px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", fontSize: "0.82rem", color: "var(--t3)" }}>
            They passed — keep looking
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onClick={() => setError("")}
            style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 50, padding: "10px 18px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", fontSize: "0.82rem", color: "#fca5a5", cursor: "pointer" }}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User detail sheet */}
      <AnimatePresence>
        {selected && selectedUser && (
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, background: "rgba(17,17,21,0.97)", border: "1px solid var(--border)", borderRadius: "20px 20px 0 0", padding: "16px 20px 32px", backdropFilter: "blur(16px)" }}>
            <div style={{ width: 36, height: 3, borderRadius: 2, background: "var(--border-2)", margin: "0 auto 20px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(0,98,173,0.12)", border: "1px solid rgba(0,98,173,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>
                  {VIBE_EMOJI[selectedUser.vibe] ?? "👋"}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em", color: "var(--t1)", marginBottom: 3 }}>{selectedUser.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--t4)" }}>
                    {selectedUser.vibe} · ~{selectedUser.distMiles} mi away · {timeAgo(selectedUser.since)}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ScoreBadge score={selectedUser.matchScore} isTop={matches[0]?.id === selectedUser.id} />
                <button onClick={() => setSelected(null)} style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t3)" }}>
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Match score breakdown */}
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", marginBottom: 14, display: "flex", gap: 20, fontSize: "0.78rem" }}>
              <div>
                <div style={{ color: "var(--t5)", marginBottom: 2, fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.06em" }}>DISTANCE</div>
                <div style={{ fontWeight: 700, color: "var(--t2)" }}>{selectedUser.distMiles} mi</div>
              </div>
              <div style={{ width: 1, background: "var(--border)" }} />
              <div>
                <div style={{ color: "var(--t5)", marginBottom: 2, fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.06em" }}>VIBE</div>
                <div style={{ fontWeight: 700, color: "var(--t2)" }}>{VIBE_EMOJI[selectedUser.vibe]} {selectedUser.vibe}</div>
              </div>
              <div style={{ width: 1, background: "var(--border)" }} />
              <div>
                <div style={{ color: "var(--t5)", marginBottom: 2, fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.06em" }}>SCORE</div>
                <div style={{ fontWeight: 700, color: selectedUser.matchScore >= 80 ? "#22c55e" : selectedUser.matchScore >= 55 ? "#0062AD" : "var(--t2)" }}>{selectedUser.matchScore}/100</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {pending[selectedUser.id]
                ? <Button fullWidth size="lg" variant="outline" disabled>Request sent ✓</Button>
                : <Button fullWidth size="lg" onClick={() => sendConnect(selectedUser)}>Connect →</Button>
              }
              {reported[selectedUser.id] ? (
                <button disabled
                  style={{ padding: "0 18px", borderRadius: 12, background: "none", border: "1px solid var(--border-2)", color: "var(--t5)", fontSize: "0.8rem", cursor: "default", fontFamily: "var(--font-sans)" }}>
                  Reported ✓
                </button>
              ) : (
                <button onClick={() => reportUser(selectedUser)}
                  style={{ padding: "0 18px", borderRadius: 12, background: "none", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: "0.8rem", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                  Report
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
