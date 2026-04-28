import faguLogo from "../assets/LOGO1.png";

/* -------------------------------------------------------------------------- */
/* FaguBadge — circular FAGU mark                                             */
/* -------------------------------------------------------------------------- */
/* Wraps the brand logo in a perfectly round container so it always reads    */
/* as a "stamp" regardless of the surrounding layout. Use it anywhere we     */
/* need the FAGU mark with a consistent shape and treatment.                 */
/*                                                                            */
/* Props:                                                                     */
/*   size:    xs | sm | md | lg | xl   (Tailwind h/w utilities)              */
/*   variant: dark | light | yellow    (background + ring color)             */
/*   className: extra Tailwind classes                                       */
/* -------------------------------------------------------------------------- */

const SIZES = {
  xs: "h-10 w-10",
  sm: "h-14 w-14",
  md: "h-20 w-20",
  lg: "h-28 w-28",
  xl: "h-36 w-36",
};

const VARIANTS = {
  dark: "bg-brand-dark ring-brand-yellow/50",
  light: "bg-white ring-brand-yellow/40",
  yellow: "bg-brand-yellow ring-white/40",
  transparent: "bg-transparent ring-white/35",
};

const PADDING = {
  xs: "p-1",
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5",
  xl: "p-3",
};

export default function FaguBadge({
  size = "md",
  variant = "dark",
  tight = false,
  bare = false,
  className = "",
  alt = "FAGU Home Services",
}) {
  if (bare) {
    return (
      <span className={`inline-block shrink-0 ${SIZES[size]} ${className}`}>
        <img src={faguLogo} alt={alt} className="h-full w-full object-contain" />
      </span>
    );
  }

  return (
    <span
      className={`inline-grid place-items-center rounded-full overflow-hidden shrink-0 ring-2 shadow-lg ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      aria-hidden={alt ? undefined : true}
    >
      <img
        src={faguLogo}
        alt={alt}
        className={`h-full w-full object-contain ${tight ? "p-0.5" : PADDING[size]} drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]`}
      />
    </span>
  );
}
