"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Coffee, Wind, Footprints, BookOpen, MessageCircle, Utensils, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useOutStore } from "@/lib/store";

const VIBES = [
  { id: "coffee", label: "Coffee",  icon: <Coffee     size={20} />, color: "#f59e0b" },
  { id: "walk",   label: "Walk",    icon: <Footprints size={20} />, color: "#22c55e" },
  { id: "chill",  label: "Chill",   icon: <Wind       size={20} />, color: "#60a5fa" },
  { id: "food",   label: "Food",    icon: <Utensils   size={20} />, color: "#f97316" },
  { id: "talk",   label: "Talk",    icon: <MessageCircle size={20} />, color: "#0062AD" },
  { id: "study",  label: "Study",   icon: <BookOpen   size={20} />, color: "#8b5cf6" },
];

const STEP_LABELS = ["Name", "Vibe", "Location"];

export default function JoinPage() {
  const router = useRouter();
  const setSession = useOutStore(s => s.setSession);

  const [step, setStep]           = useState(0);
  const [name, setName]           = useState("");
  const [vibe, setVibe]           = useState("");
  const [locGranted, setLocGranted] = useState<boolean | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [ageOk, setAgeOk]         = useState(false);
  const [tosOk, setTosOk]         = useState(false);

  const progress = (step / (STEP_LABELS.length - 1)) * 100;

  function requestLocation() {
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      pos => {
        setSession({
          phone: "",
          name:  name.trim(),
          vibe,
          lat:   pos.coords.latitude,
          lng:   pos.coords.longitude,
        });
        setLocGranted(true);
        setLoading(false);
        setTimeout(() => router.push("/app"), 600);
      },
      () => {
        setLoading(false);
        setLocGranted(false);
        setError("Location access denied. Enable it in browser settings and try again.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const slide = {
    enter:  { x: 32,  opacity: 0 },
    center: { x: 0,   opacity: 1 },
    exit:   { x: -32, opacity: 0 },
  };

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" }}>
      <div className="ambient" />

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "var(--border)", zIndex: 50 }}>
        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{ height: "100%", background: "#0062AD" }} />
      </div>

      {/* Back to home */}
      <div style={{ position: "fixed", top: 16, left: 16, zIndex: 10 }}>
        <Link href="/">
          <button style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "var(--t3)", fontSize: "0.85rem", cursor: "pointer", fontFamily: "var(--font-sans)" }}
            onMouseOver={e => (e.currentTarget.style.color = "var(--t1)")}
            onMouseOut={e  => (e.currentTarget.style.color = "var(--t3)")}>
            <ArrowLeft size={14} /> Back
          </button>
        </Link>
      </div>

      {/* Step dots */}
      <div style={{ position: "fixed", top: 18, right: 16, display: "flex", gap: 5, zIndex: 10 }}>
        {STEP_LABELS.map((_, i) => (
          <div key={i} style={{
            width: step > i ? 16 : 6, height: 6, borderRadius: 3,
            background: step === i ? "#0062AD" : step > i ? "#22c55e" : "var(--border-2)",
            transition: "all 0.25s",
          }} />
        ))}
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} variants={slide} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}>

            {/* Step 0: Name */}
            {step === 0 && (
              <div>
                <StepHead step="01/03" title="What should we call you?" sub="First name only. Max 12 characters." />
                <input
                  value={name}
                  onChange={e => { setName(e.target.value.slice(0, 12)); setError(""); }}
                  onKeyDown={e => { if (e.key === "Enter" && name.trim()) setStep(1); }}
                  placeholder="Your first name"
                  autoFocus
                  style={{
                    width: "100%", background: "var(--surface)",
                    border: "1px solid var(--border-2)", borderRadius: 12,
                    padding: "14px 16px", color: "var(--t1)", fontSize: "1rem",
                    fontWeight: 600, outline: "none", fontFamily: "var(--font-sans)",
                    marginBottom: 8, transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#0062AD"; e.target.style.boxShadow = "0 0 0 2px rgba(0,98,173,0.15)"; }}
                  onBlur={e  => { e.target.style.borderColor = "var(--border-2)"; e.target.style.boxShadow = "none"; }}
                />
                <div style={{ textAlign: "right", marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--t4)" }}>{name.length}/12</span>
                </div>

                {/* Age verification */}
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={ageOk} onChange={e => setAgeOk(e.target.checked)}
                    style={{ marginTop: 2, accentColor: "#0062AD", flexShrink: 0, width: 15, height: 15 }} />
                  <span style={{ fontSize: "0.82rem", color: "var(--t3)", lineHeight: 1.5 }}>
                    I am 18 years of age or older
                  </span>
                </label>

                {/* Terms + Privacy consent */}
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 24, cursor: "pointer" }}>
                  <input type="checkbox" checked={tosOk} onChange={e => setTosOk(e.target.checked)}
                    style={{ marginTop: 2, accentColor: "#0062AD", flexShrink: 0, width: 15, height: 15 }} />
                  <span style={{ fontSize: "0.82rem", color: "var(--t3)", lineHeight: 1.5 }}>
                    I agree to the{" "}
                    <a href="/terms" target="_blank" style={{ color: "#0062AD", textDecoration: "none" }}>Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" target="_blank" style={{ color: "#0062AD", textDecoration: "none" }}>Privacy Policy</a>
                  </span>
                </label>

                <Button fullWidth size="lg" disabled={!name.trim() || !ageOk || !tosOk} onClick={() => setStep(1)}>
                  That&apos;s me <ArrowRight size={15} style={{ marginLeft: 5 }} />
                </Button>
              </div>
            )}

            {/* Step 1: Vibe */}
            {step === 1 && (
              <div>
                <StepHead step="02/03" title="What are you up for?" sub="People see this next to your name. Pick one." />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 28 }}>
                  {VIBES.map(v => (
                    <button key={v.id} onClick={() => setVibe(v.id)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        padding: "18px 10px", borderRadius: 12, cursor: "pointer",
                        background: "var(--surface)",
                        border: `1px solid ${vibe === v.id ? v.color + "66" : "var(--border-2)"}`,
                        fontFamily: "var(--font-sans)", transition: "border-color 0.15s",
                        outline: "none",
                      }}>
                      <span style={{ color: vibe === v.id ? v.color : "var(--t3)" }}>{v.icon}</span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: vibe === v.id ? "var(--t1)" : "var(--t3)" }}>{v.label}</span>
                    </button>
                  ))}
                </div>
                <Button fullWidth size="lg" disabled={!vibe} onClick={() => setStep(2)}>
                  Continue <ArrowRight size={15} style={{ marginLeft: 5 }} />
                </Button>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div>
                <StepHead step="03/03" title="Last thing — your location" sub="We need this to show you nearby people. Fuzzy by default." />
                <div className="card" style={{ padding: "20px", marginBottom: 20 }}>
                  {[
                    ["📍", "Fuzzy, not exact",  "We add ±0.5mi noise. Your precise coordinates are never saved."],
                    ["⏱",  "Ephemeral",          "Location auto-deletes the moment you go offline."],
                    ["🔒", "Never sold",          "Your location is never shared with third parties. Ever."],
                  ].map(([icon, title, body]) => (
                    <div key={title as string} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                      <span style={{ fontSize: "1rem", flexShrink: 0 }}>{icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--t1)", marginBottom: 2 }}>{title}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--t4)", lineHeight: 1.6 }}>{body}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#fca5a5", fontSize: "0.82rem", marginBottom: 14 }}>
                    {error}
                  </div>
                )}

                {locGranted === true ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "20px 0" }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}
                      style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e" }}>
                      <Check size={22} />
                    </motion.div>
                    <p style={{ fontWeight: 600, color: "#22c55e", fontSize: "0.9rem" }}>Location enabled — going in…</p>
                  </div>
                ) : (
                  <Button fullWidth size="lg" onClick={requestLocation} disabled={loading}>
                    {loading
                      ? "Getting location…"
                      : <><MapPin size={15} style={{ marginRight: 5 }} />Enable location</>}
                  </Button>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {step > 0 && step < 2 && (
          <button onClick={() => setStep(s => s - 1)}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "var(--t4)", fontSize: "0.8rem", cursor: "pointer", margin: "18px auto 0", fontFamily: "var(--font-sans)" }}>
            <ArrowLeft size={12} /> Back
          </button>
        )}
      </div>
    </div>
  );
}

function StepHead({ step, title, sub }: { step: string; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--t5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>{step}</div>
      <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--step-3)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1, marginBottom: 8, color: "var(--t1)" }}>{title}</h1>
      <p style={{ fontSize: "var(--step-0)", color: "var(--t3)", lineHeight: 1.6 }}>{sub}</p>
    </div>
  );
}
