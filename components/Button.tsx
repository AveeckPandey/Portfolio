"use client";

import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "accent";

const baseStyles =
  "inline-flex items-center justify-center gap-2 border-2 border-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-150 ease-in-out cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-60";

const sizeStyles = {
  md: "px-5 py-3",
  sm: "px-4 py-2.5",
} as const;

const variantStyles: Record<Variant, string> = {
  primary: "bg-[#171715] text-white hover:bg-black",
  secondary: "bg-[#F5F1E8] text-black hover:bg-white",
  accent: "bg-[#c0f442] text-black hover:bg-[#c8ff58]",
};

const variantShadow = {
  primary: "shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000]",
  secondary: "shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000]",
  accent: "shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000]",
};

interface ButtonProps {
  variant?: Variant;
  size?: keyof typeof sizeStyles;
  icon?: ReactNode;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  href,
  onClick,
  type = "button",
  className = "",
  ariaLabel,
}: ButtonProps) {
  const classes = [
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    variantShadow[variant],
    "hover:-translate-x-[2px] hover:-translate-y-[2px]",
    "active:translate-x-[2px] active:translate-y-[2px]",
    "rounded-[2px]",
    className,
  ].join(" ");

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes} aria-label={ariaLabel}>
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {icon}
      {children}
    </button>
  );
}
