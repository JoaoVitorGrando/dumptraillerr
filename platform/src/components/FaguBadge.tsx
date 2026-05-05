"use client";

const SIZES: Record<string, string> = {
  xs: "h-10 w-10",
  sm: "h-14 w-14",
  md: "h-20 w-20",
  lg: "h-28 w-28",
  xl: "h-36 w-36",
};

const VARIANTS: Record<string, string> = {
  dark: "bg-brand-dark ring-brand-yellow/50",
  light: "bg-white ring-brand-yellow/40",
  yellow: "bg-brand-yellow ring-white/40",
  transparent: "bg-transparent ring-white/35",
};

const PADDING: Record<string, string> = {
  xs: "p-1",
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5",
  xl: "p-3",
};

interface FaguBadgeProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "dark" | "light" | "yellow" | "transparent";
  tight?: boolean;
  bare?: boolean;
  className?: string;
  alt?: string;
}

export default function FaguBadge({
  size = "md",
  variant = "dark",
  tight = false,
  bare = false,
  className = "",
  alt = "FAGU Home Services",
}: FaguBadgeProps) {
  if (bare) {
    return (
      <span className={`inline-block shrink-0 ${SIZES[size]} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/LOGO1.png" alt={alt} className="h-full w-full object-contain" />
      </span>
    );
  }

  return (
    <span
      className={`inline-grid place-items-center rounded-full overflow-hidden shrink-0 ring-2 shadow-lg ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      aria-hidden={alt ? undefined : true}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/LOGO1.png"
        alt={alt}
        className={`h-full w-full object-contain ${tight ? "p-0.5" : PADDING[size]} drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]`}
      />
    </span>
  );
}
