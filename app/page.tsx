"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Zap, MapPin, EyeOff, Lock, Users } from "lucide-react";
import { Radar } from "@/components/landing/Radar";
import { LiveCounter } from "@/components/landing/LiveCounter";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "How it works", id: "how" },
  { label: "Why Out",      id: "why" },
  { label: "Safety",       id: "safety" },
];

const STEPS = [
  {
    n: "01", icon: <MapPin size={18} />,
    title: "Signal you're free",
    body: "Tap once. Pick a vibe. Your fuzzy location (±0.5mi) is shared and you appear on nearby maps within seconds.",
    bodyShort: "Tap once. Pick a vibe. You appear on the map.",
  },
  {
    n: "02", icon: <Users size={18} />,
    title: "See who's nearby",
    body: "Real people within 3 miles who are available right now. A name, a vibe, and a distance. Nothing more.",
    bodyShort: "Real people nearby, available right now.",
  },
  {
    n: "03", icon: <Zap size={18} />,
    title: "Wave. Show up.",
    body: "Send a wave. They wave back. You both know. Pick a spot, walk over. The app's job ends there.",
    bodyShort: "Send a wave. They wave back. Go meet them.",
  },
];

const COMPARE = [
  { feature: "Setup time",       out: "10 seconds",   them: "30 minutes" },
  { feature: "Profile required", out: "No",           them: "Required" },
  { feature: "Swiping required", out: "No",           them: "Core mechanic" },
  { feature: "Stores history",   out: "Never",        them: "Forever" },
  { feature: "Exact location",   out: "Never stored", them: "Logged & sold" },
  { feature: "Monetizes you",    out: "No",           them: "Everything" },
  { feature: "Algorithm",        out: "None",         them: "Runs your life" },
];

const CITIES = [
  "New York", "Los Angeles", "Chicago", "Austin", "Denver", "Seattle",
];

const SAFETY = [
  { icon: <MapPin size={17} />, title: "Fuzzy location", body: "We add ±0.5mi noise before storing. Your exact GPS never touches our servers.", bodyShort: "±0.5mi noise. Exact GPS never stored." },
  { icon: <EyeOff size={17} />, title: "Zero history",   body: "When you go In, your location deletes instantly. No logs. No trace. Nothing.", bodyShort: "Go In → location deleted instantly." },
  { icon: <Lock size={17} />,   title: "Real people only", body: "3-strike ban system removes bad actors fast. No anonymous throwaway accounts.", bodyShort: "3-strike system. Bad actors removed fast." },
  { icon: <Shield size={17} />, title: "3-strike ban",   body: "Three reports in 24h triggers auto-suspension. Human review follows.", bodyShort: "3 reports = auto-suspension." },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="relative min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="ambient" />

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={scrolled ? {
          background: "rgba(9,9,11,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        } : {}}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 10, height: 10, borderRadius: "50%", background: "#0062AD",
              boxShadow: "0 0 8px rgba(0,98,173,0.7)",
              display: "block", animation: "dot-blink 2.5s ease-in-out infinite",
            }} />
            <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.04em", color: "var(--t1)" }}>Out</span>
          </div>

          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV_LINKS.map(l => (
                <button key={l.label} onClick={() => scrollTo(l.id)}
                  style={{ padding: "7px 12px", borderRadius: 8, background: "none", border: "none", color: "var(--t3)", fontSize: "0.875rem", cursor: "pointer", fontFamily: "var(--font-sans)", transition: "color 0.15s" }}
                  onMouseOver={e => (e.currentTarget.style.color = "var(--t1)")}
                  onMouseOut={e =>  (e.currentTarget.style.color = "var(--t3)")}>
                  {l.label}
                </button>
              ))}
            </nav>
          )}

          <Link href="/join"><Button size="sm">I&apos;m Out <ArrowRight size={13} style={{ marginLeft: 4 }} /></Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "90px 20px 64px", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "relative", zIndex: 1, width: "100%", maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 9999, background: "rgba(0,98,173,0.1)", border: "1px solid rgba(0,98,173,0.3)", color: "#1d84d4", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 32 }}>
            <MapPin size={10} /> Live in your city
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
            style={{ fontFamily: "var(--font-sans)", fontSize: "var(--step-6)", fontWeight: 800, letterSpacing: "-0.048em", lineHeight: 1.02, marginBottom: 22 }}>
            <span style={{ color: "var(--t1)" }}>You&apos;re free right now.</span>
            <br />
            <span style={{ color: "var(--t3)" }}>So is someone near you.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
            style={{ fontSize: "var(--step-1)", color: "var(--t3)", maxWidth: 480, lineHeight: 1.65, marginBottom: 36, fontWeight: 400 }}>
            {isMobile
              ? "No profiles. No swiping. No history."
              : <> No profiles. No swiping. No history.<br />Just real people who are free right now, within miles of you.</>
            }
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
            <Link href="/join"><Button size="xl">I&apos;m Out <ArrowRight size={16} style={{ marginLeft: 6 }} /></Button></Link>
            <Button variant="outline" size="xl" onClick={() => scrollTo("how")}>How it works</Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }} style={{ marginBottom: 56 }}>
            <LiveCounter />
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.42 }}>
            <Radar />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)" }}>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
            style={{ width: 1, height: 32, background: "linear-gradient(to bottom, var(--border-2), transparent)" }} />
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how" style={{ position: "relative", zIndex: 1, padding: isMobile ? "60px 20px" : "100px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Label>How it works</Label>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--step-4)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 12 }}>
            Three steps.<br />No bullshit.
          </h2>
          {!isMobile && (
            <p style={{ color: "var(--t3)", fontSize: "var(--step-0)", maxWidth: 380, marginBottom: 48, lineHeight: 1.65 }}>
              Every product decision that added friction has been removed.
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 10, marginTop: isMobile ? 24 : 0 }}>
            {STEPS.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,98,173,0.1)", border: "1px solid rgba(0,98,173,0.25)", color: "#1d84d4" }}>
                    {s.icon}
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--t5)", letterSpacing: "0.1em" }}>{s.n}</span>
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8, color: "var(--t1)" }}>{s.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--t3)", lineHeight: 1.65 }}>{isMobile ? s.bodyShort : s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Out */}
      <section id="why" style={{ position: "relative", zIndex: 1, padding: isMobile ? "60px 20px" : "100px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Label>Why Out</Label>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--step-4)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 12 }}>
            Built different<br />on purpose.
          </h2>
          {!isMobile && (
            <p style={{ color: "var(--t3)", fontSize: "var(--step-0)", maxWidth: 400, marginBottom: 48, lineHeight: 1.65 }}>
              Every other social app wants your data, your attention, your time. Out just wants you to go outside.
            </p>
          )}
          <div style={{ borderRadius: 14, border: "1px solid var(--border)", overflow: "hidden", overflowX: isMobile ? "auto" : "visible", marginTop: isMobile ? 24 : 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                  {["Feature", "Out ↗", "Dating Apps"].map((h, i) => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: i === 0 ? "left" : "center", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: i === 1 ? "#1d84d4" : "var(--t4)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < COMPARE.length - 1 ? "1px solid var(--border)" : "none", background: i % 2 === 1 ? "rgba(255,255,255,0.006)" : "transparent" }}>
                    <td style={{ padding: "12px 20px", fontSize: "0.875rem", color: "var(--t2)", fontWeight: 500 }}>{row.feature}</td>
                    <td style={{ padding: "12px 20px", textAlign: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 9999, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", fontSize: "0.75rem", fontWeight: 600 }}>✓ {row.out}</span>
                    </td>
                    <td style={{ padding: "12px 20px", textAlign: "center", fontSize: "0.8rem", color: "var(--t4)" }}>{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section id="safety" style={{ position: "relative", zIndex: 1, padding: isMobile ? "60px 20px" : "100px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Label>Safety &amp; Privacy</Label>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--step-4)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 48 }}>
            Paranoid by design.<br /><span style={{ color: "var(--t3)" }}>Trusting you anyway.</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
            {SAFETY.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.35, delay: i * 0.07 }}
                className="card" style={{ padding: "22px" }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,98,173,0.1)", border: "1px solid rgba(0,98,173,0.22)", color: "#1d84d4", marginBottom: 14 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 7, color: "var(--t1)" }}>{item.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--t4)", lineHeight: 1.65 }}>{isMobile ? item.bodyShort : item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section style={{ position: "relative", zIndex: 1, padding: isMobile ? "50px 20px" : "70px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Label>Early access</Label>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--step-3)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 32 }}>
            Launching in
          </h2>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
            {CITIES.map((city, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card" style={{ flexShrink: 0, padding: "14px 18px", minWidth: 120 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0062AD", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--t5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Soon</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", letterSpacing: "-0.02em", color: "var(--t1)" }}>{city}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ position: "relative", zIndex: 1, padding: isMobile ? "70px 20px" : "120px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--step-5)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.04, marginBottom: 18 }}>
              <span style={{ color: "var(--t1)" }}>Stop waiting.</span>
              <br /><span style={{ color: "var(--t3)" }}>Go be out there.</span>
            </h2>
            {!isMobile && (
              <p style={{ color: "var(--t4)", fontSize: "var(--step-0)", marginBottom: 36, lineHeight: 1.7 }}>
                Someone near you is also bored, also free, also wondering if anything&apos;s happening.
              </p>
            )}
            <Link href="/join" style={{ marginTop: isMobile ? 18 : 0, display: "inline-block" }}><Button size="xl">I&apos;m Out <ArrowRight size={16} style={{ marginLeft: 6 }} /></Button></Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid var(--border)", padding: "32px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.04em", color: "var(--t5)" }}>Out</span>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Safety", "#safety"], ["Contact", "mailto:hi@meetspont.com"]].map(([label, href]) => (
              <a key={label} href={href}
                style={{ fontSize: "0.8rem", color: "var(--t5)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseOver={e => (e.target as HTMLElement).style.color = "var(--t2)"}
                onMouseOut={e =>  (e.target as HTMLElement).style.color = "var(--t5)"}>
                {label}
              </a>
            ))}
          </div>
          <span style={{ fontSize: "0.7rem", color: "var(--t5)", fontFamily: "var(--font-mono)" }}>
            © {new Date().getFullYear()} Out. Built for humans.
          </span>
        </div>
      </footer>
    </div>
  );
}

function Label({ children }: { children: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 9999, background: "rgba(0,98,173,0.08)", border: "1px solid rgba(0,98,173,0.22)", marginBottom: 16 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0062AD", display: "block" }} />
      <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1d84d4" }}>{children}</span>
    </div>
  );
}
