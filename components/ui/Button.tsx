"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline" | "danger";
type Size    = "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
  className?: string;
}

const base = "inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-[#0062AD] hover:bg-[#005499] text-white border border-[#004f8a]",
  ghost:   "bg-transparent text-[#71717a] border border-[#2a2a36] hover:bg-[#111115] hover:text-[#f4f4f5]",
  outline: "bg-transparent text-[#f4f4f5] border border-[#3f3f46] hover:bg-[rgba(255,255,255,0.04)]",
  danger:  "bg-[#ef4444] hover:bg-[#dc2626] text-white border border-[#dc2626]",
};

const sizes: Record<Size, string> = {
  sm: "h-8  px-3  text-[13px] rounded-lg  gap-1.5",
  md: "h-10 px-4  text-[14px] rounded-xl  gap-2",
  lg: "h-12 px-5  text-[15px] rounded-xl  gap-2",
  xl: "h-13 px-7  text-[15px] rounded-2xl gap-2 font-semibold",
};

export function Button({
  children, variant = "primary", size = "md",
  onClick, disabled, fullWidth, type = "button", className = "",
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </motion.button>
  );
}
