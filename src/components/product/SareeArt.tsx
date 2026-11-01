import type { Colorway, Motif } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * Placeholder saree artwork drawn in SVG from a colourway + motif.
 * "drape" shows a folded saree with pleats, border and pallu.
 * "pallu" is a close-up of the richly woven end piece.
 * Swap for real photography later without changing callers.
 */
type SareeArtProps = {
  colorway: Colorway;
  motif: Motif;
  view?: "drape" | "pallu";
  uid: string; // keeps SVG pattern ids unique on the page
  className?: string;
};

function MotifTile({ motif, color, accent }: { motif: Motif; color: string; accent: string }) {
  switch (motif) {
    case "buta":
      return (
        <g fill={color}>
          <path d="M20 9c3 3 3 7 0 10-3-3-3-7 0-10Z" />
          <path d="M20 19c-3 0-6-2-7-5 3 0 6 2 7 5Zm0 0c3 0 6-2 7-5-3 0-6 2-7 5Z" opacity="0.85" />
          <circle cx="20" cy="22" r="1.2" fill={accent} />
          <circle cx="0" cy="0" r="1" /><circle cx="40" cy="0" r="1" />
          <circle cx="0" cy="40" r="1" /><circle cx="40" cy="40" r="1" />
        </g>
      );
    case "checks":
      return (
        <g stroke={color} strokeWidth="0.8" fill="none" opacity="0.8">
          <path d="M0 20H40M20 0V40" />
          <circle cx="10" cy="10" r="1.3" fill={accent} stroke="none" />
          <circle cx="30" cy="30" r="1.3" fill={accent} stroke="none" />
        </g>
      );
    case "stripes":
      return (
        <g fill={color}>
          <rect x="4" y="0" width="1.2" height="40" opacity="0.9" />
          <rect x="7" y="0" width="0.6" height="40" opacity="0.6" />
          <rect x="24" y="0" width="2.4" height="40" fill={accent} opacity="0.35" />
        </g>
      );
    case "jaal":
      return (
        <g stroke={color} strokeWidth="0.9" fill="none">
          <path d="M20 0 L40 20 L20 40 L0 20 Z" />
          <path d="M20 12c2 2 2 6 0 8-2-2-2-6 0-8Z" fill={color} stroke="none" />
          <circle cx="20" cy="26" r="1" fill={accent} stroke="none" />
        </g>
      );
    case "temple":
      return (
        <g fill={color}>
          <path d="M14 26 L20 14 L26 26 Z" opacity="0.9" />
          <rect x="13" y="26" width="14" height="1.2" />
          <circle cx="20" cy="11" r="1.2" fill={accent} />
        </g>
      );
    case "paisley":
      return (
        <g fill="none" stroke={color} strokeWidth="1">
          <path d="M22 10c6 2 8 10 3 15-4 4-11 3-12-2-1-4 3-6 6-4 2 1 2 4 0 5" />
          <circle cx="23" cy="17" r="1.4" fill={accent} stroke="none" />
          <circle cx="6" cy="34" r="0.9" fill={color} stroke="none" />
        </g>
      );
  }
}

function BorderBand({ motif, color, accent }: { motif: Motif; color: string; accent: string }) {
  // A 40×24 tile repeated along the border
  if (motif === "temple" || motif === "buta") {
    return (
      <g>
        <rect width="40" height="24" fill={color} />
        <path d="M0 18 L5 8 L10 18 L15 8 L20 18 L25 8 L30 18 L35 8 L40 18 Z" fill={accent} opacity="0.85" />
        <rect y="20" width="40" height="1" fill={accent} />
        <rect y="3" width="40" height="0.8" fill={accent} opacity="0.7" />
      </g>
    );
  }
  return (
    <g>
      <rect width="40" height="24" fill={color} />
      <rect y="4" width="40" height="1" fill={accent} />
      <rect y="19" width="40" height="1" fill={accent} />
      <path d="M0 12 Q5 7 10 12 T20 12 T30 12 T40 12" stroke={accent} fill="none" strokeWidth="1.2" />
    </g>
  );
}

/** Rough luminance check so light sarees get darker motifs. */
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 160;
}

export function SareeArt({ colorway, motif, view = "drape", uid, className }: SareeArtProps) {
  const id = uid.replace(/[^a-zA-Z0-9_-]/g, "");
  const light = isLight(colorway.base);
  const motifColor = light ? colorway.border : colorway.accent;
  const pleats = 7;

  return (
    <svg
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`${colorway.name} saree`}
    >
      <defs>
        <pattern id={`m-${id}`} width={view === "pallu" ? 26 : 40} height={view === "pallu" ? 26 : 40} patternUnits="userSpaceOnUse" viewBox="0 0 40 40">
          <MotifTile motif={motif} color={motifColor} accent={colorway.accent} />
        </pattern>
        <pattern id={`pm-${id}`} width="22" height="22" patternUnits="userSpaceOnUse" viewBox="0 0 40 40">
          <MotifTile motif={motif === "stripes" ? "buta" : motif} color={colorway.accent} accent={colorway.border} />
        </pattern>
        <pattern id={`b-${id}`} width="40" height="24" patternUnits="userSpaceOnUse">
          <BorderBand motif={motif} color={colorway.border} accent={colorway.accent} />
        </pattern>
        {/* Pleat shading: alternating light and shadow, like fabric folds */}
        <linearGradient id={`f-${id}`} x1="0" x2="1" y1="0" y2="0">
          {Array.from({ length: pleats * 2 + 1 }).map((_, i) => (
            <stop
              key={i}
              offset={`${(i / (pleats * 2)) * 100}%`}
              stopColor={i % 2 ? "#000" : "#fff"}
              stopOpacity={i % 2 ? 0.32 : 0.08}
            />
          ))}
        </linearGradient>
        <linearGradient id={`s-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id={`v-${id}`} cx="50%" cy="40%" r="75%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
        </radialGradient>
      </defs>

      {view === "drape" ? (
        <g>
          {/* Body */}
          <rect width="300" height="400" fill={colorway.base} />
          <rect width="300" height="400" fill={`url(#m-${id})`} opacity={light ? 0.55 : 0.4} />
          {/* Pallu falling across the top, slightly angled */}
          <g transform="rotate(-8 150 60)">
            <rect x="-40" y="-20" width="380" height="120" fill={colorway.border} />
            <rect x="-40" y="-20" width="380" height="120" fill={`url(#pm-${id})`} opacity="0.7" />
            <rect x="-40" y="96" width="380" height="24" fill={`url(#b-${id})`} />
          </g>
          {/* Pleated border at the hem */}
          <rect y="352" width="300" height="48" fill={`url(#b-${id})`} />
          <rect y="348" width="300" height="2" fill={colorway.accent} opacity="0.8" />
          {/* Fold and sheen */}
          <rect y="130" width="300" height="270" fill={`url(#f-${id})`} />
          <rect width="300" height="400" fill={`url(#s-${id})`} />
        </g>
      ) : (
        <g>
          {/* Close-up of the pallu */}
          <rect width="300" height="400" fill={colorway.border} />
          <rect width="300" height="400" fill={`url(#pm-${id})`} opacity="0.85" />
          {[70, 190, 310].map((y) => (
            <rect key={y} y={y} width="300" height="24" fill={`url(#b-${id})`} />
          ))}
          <rect width="300" height="400" fill={`url(#s-${id})`} />
        </g>
      )}
      <rect width="300" height="400" fill={`url(#v-${id})`} />
    </svg>
  );
}
