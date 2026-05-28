"use client";
import { motion } from "framer-motion";

const PEOPLE = [
  { cx: "62%", cy: "28%", delay: 0,   label: "Alex · coffee" },
  { cx: "25%", cy: "58%", delay: 0.4, label: "Sam · walk" },
  { cx: "75%", cy: "65%", delay: 0.8, label: "Jordan" },
  { cx: "40%", cy: "20%", delay: 1.2, label: "Riley" },
  { cx: "82%", cy: "38%", delay: 0.6, label: "Casey" },
];

const RING_SIZES = [320, 220, 130];

export function Radar() {
  return (
    <div className="relative w-full max-w-[380px] aspect-square mx-auto select-none">
      {/* Static rings */}
      {[320, 240, 160, 88].map((s, i) => (
        <div key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: s, height: s, border: `1px solid rgba(0,98,173,${[0.1, 0.14, 0.2, 0.28][i]})` }}
        />
      ))}

      {/* Animated pulses */}
      {RING_SIZES.map((s, i) => (
        <motion.div key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: s, height: s, border: "1px solid rgba(0,98,173,0.5)" }}
          initial={{ scale: 0.3, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 3, delay: i * 0.9, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* You */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,98,173,0.18)", border: "1.5px solid rgba(0,98,173,0.7)" }}
          animate={{ boxShadow: ["0 0 0 0 rgba(0,98,173,0.5)", "0 0 0 14px rgba(0,98,173,0)", "0 0 0 0 rgba(0,98,173,0)"] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-4 h-4 rounded-full bg-[#0062AD]" style={{ boxShadow: "0 0 10px rgba(0,98,173,0.7)" }} />
        </motion.div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-widest text-[#1d84d4]"
          style={{ fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>YOU</div>
      </div>

      {/* People */}
      {PEOPLE.map((p, i) => (
        <motion.div key={i} className="absolute z-10"
          style={{ top: p.cy, left: p.cx, transform: "translate(-50%,-50%)" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: p.delay + 0.5, type: "spring", stiffness: 280 }}
        >
          <motion.div
            className="relative w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,98,173,0.12)", border: "1px solid rgba(0,98,173,0.45)" }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2.5 + i * 0.3, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-[#0062AD]" />
            <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium px-1.5 py-0.5 rounded pointer-events-none"
              style={{ background: "#111115", border: "1px solid #1e1e26", color: "#a1a1aa" }}>
              {p.label}
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Vignette */}
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, transparent 45%, #09090b 80%)" }} />
    </div>
  );
}
