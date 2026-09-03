"use client";

/**
 * GlowBorderCard
 * ──────────────
 * A reusable card with an animated golden border trail + ambient glow.
 *
 * Effect design (inspired by the active-state animation on high-end
 * SaaS landing pages):
 *
 *   1. A conic-gradient with a single tight gold "comet" travels
 *      around the card perimeter via `rotate` animation. The card's
 *      own background hides the center of the conic, leaving only a
 *      ~6px-wide lit arc on the border.
 *   2. The same conic gradient is rendered as a `drop-shadow` filter
 *      on the trail layer, scaled up and blurred — that's the
 *      ambient glow that leaks outside the card.
 *   3. On hover, the trail rotates faster and the ambient glow
 *      intensifies. Reduced-motion users get a static, evenly-lit
 *      gold border instead.
 *
 * The component is self-contained (own CSS module) so it can be
 * dropped into any page without leaking styles.
 */

import type { ReactNode, CSSProperties, MouseEvent } from "react";
import { useRef, useState } from "react";
import styles from "./glow-border-card.module.css";
import { useAnimationGate } from "@/lib/hooks/useAnimationGate";

// ---------------------------------------------------------------------------
// Tunables — exposed as constants so the look can be tweaked per-instance
// without editing the CSS.
// ---------------------------------------------------------------------------
const GOLD_LIT = "rgba(255, 215, 0, 1)";        // peak trail color
const GOLD_TRAIL = "rgba(255, 200, 60, 0.6)";   // fading edge of the trail
const CARD_BG = "rgba(20, 14, 6, 0.95)";        // inner card fill — opaque
                                                  // enough to mask the
                                                  // conic gradient center
const TRAIL_THICKNESS = 1.5;                    // px — the lit arc width
const TRAIL_SPEED_S = 5;                        // seconds per full revolution
const GLOW_BLUR = 24;                           // px — ambient drop-shadow
const GLOW_OPACITY = 0.55;                      // 0..1 — ambient intensity
const HOVER_SPEED_S = 2.4;                      // faster spin on hover
const HOVER_GLOW_OPACITY = 0.95;                // brighter ambient on hover

export interface GlowBorderCardProps {
  children: ReactNode;
  /** Extra classes for the inner content wrapper. */
  className?: string;
  /** Inline style override for the inner content wrapper. */
  style?: CSSProperties;
  /** Optional click handler. */
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  /** Offsets the moving trail so adjacent cards do not animate in lockstep. */
  delay?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function GlowBorderCard({
  children,
  className,
  style,
  onClick,
  delay = 0,
}: GlowBorderCardProps) {
  const [hover, setHover] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  // Pause the conic-gradient rotation when the card is off-screen
  // or the tab is hidden. `rootMargin: "200px"` keeps the trail
  // warm just before the card enters the viewport.
  const active = useAnimationGate(rootRef, { rootMargin: "200px" });

  // CSS custom properties that the .glowTrail and .glowAmbient layers
  // read from. We drive them inline so the same keyframe can run at
  // different speeds / opacities for hover.
  const cssVars: CSSProperties = {
    // Trail duration (consumed by .glowTrail animation).
    ["--trail-duration" as string]: `${hover ? HOVER_SPEED_S : TRAIL_SPEED_S}s`,
    // Ambient glow intensity (consumed by .glowAmbient).
    ["--glow-opacity" as string]: String(hover ? HOVER_GLOW_OPACITY : GLOW_OPACITY),
    ["--trail-delay" as string]: `${delay}s`,
  };

  return (
    <div
      ref={rootRef}
      className={styles.card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      data-animating={active ? "true" : "false"}
      style={cssVars}
    >
      {/* Ambient glow — sits behind the card and bleeds out via a
          drop-shadow on a duplicate of the trail. Visually this is
          the "halo" you see around the card. */}
      <div aria-hidden className={styles.ambient} />

      {/* Border trail — a conic-gradient rotated continuously. The
          inner .face layer masks the center, leaving only a thin
          lit arc on the perimeter. */}
      <div aria-hidden className={styles.trail} />

      {/* Card face — solid background, rounded, with the actual
          content on top. The trail shows through only along the
          edge because the face covers the center. */}
      <div className={`${styles.face} ${className ?? ""}`} style={style}>
        {children}
      </div>
    </div>
  );
}
