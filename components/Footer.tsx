"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { motion } from "framer-motion";
import styles from "./footer.module.css";

// ---------------------------------------------------------------------------
// Footer — 4-column grid (Quick Links, Connect, Let's Build, Location).
//
// Background-2 sits behind the columns and is dimmed via three layers:
//   1. The painting itself, at low opacity so it reads as texture.
//   2. A blur on the image so the hands recede, not the letterforms.
//   3. A dark sepia-to-black scrim that gives the columns a consistent
//      dark canvas to sit on.
// Type uses a high-luminance off-white (#F5F0E8) with a soft black
// text-shadow so every glyph lifts off the dimmed image regardless of
// which part of the painting sits behind it. Each column has a thin
// sepia border + slight dark fill so the four blocks read as a set.
// ---------------------------------------------------------------------------

const GOLD = "#C4A060";
const INK = "#1a1108";
const INK_SOFT = "rgba(26, 17, 8, 0.78)";
// Reusable text-shadow — soft white halo so the now-dark type stays
// legible against any part of the painting showing through the cards.
const LIFT = "0 1px 2px rgba(255, 248, 224, 0.65)";
// Glow — layered warm-gold halos of increasing radius and decreasing
// opacity, used by the pull-quote. Paired with a slow opacity-pulse
// animation in CSS so the glow gently breathes.
const GLOW =
  "0 0 6px rgba(255, 220, 140, 0.95), " +
  "0 0 14px rgba(255, 200, 110, 0.7), " +
  "0 0 28px rgba(255, 180, 90, 0.45)";



function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.5 0h4.37v1.91h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V22h-4.56v-6.5c0-1.55-.03-3.54-2.16-3.54-2.16 0-2.49 1.69-2.49 3.43V22H7.72V8z" />
    </svg>
  );
}

function GitHubGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function MailGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <rect x="2.5" y="5" width="19" height="14" rx="1" />
      <path d="M2.5 6 L12 13 L21.5 6" />
    </svg>
  );
}

function PinGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M12 2C7.5 2 4 5.5 4 10c0 6 8 12 8 12s8-6 8-12c0-4.5-3.5-8-8-8z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

// (Card panels removed — columns now read directly off the scrim.)

// ---------------------------------------------------------------------------
// Frost filter — a layered SVG filter applied to the .glassFrost layer of
// each column card. Three primitives combine to give the noise real
// spatial structure (so it reads as a frosty surface, not just static):
//
//   1. <feTurbulence>  — produces a procedural noise field. baseFrequency
//      is low (~0.012) so the cells are large, like real frost crystals.
//      numOctaves=2 layers two scales of noise for richness.
//   2. <feDisplacementMap> — uses the noise as a vector field to push the
//      pixels of the underlying source (the .glassFrost fill) by a few
//      pixels. The scale is small (~3) so the surface looks disturbed
//      rather than shattered.
//   3. <feColorMatrix> — re-tints the displaced pixels to a warm off-white
//      with low alpha, so the frost reads as a subtle warm grain rather
//      than a hard pattern.
//
// The filter is declared once in the SVG <defs> at the top of the footer
// and referenced by `url(#frost)` from each .glassFrost layer.
// ---------------------------------------------------------------------------
const FOOTER_FILTERS = (
  <svg
    aria-hidden
    focusable="false"
    width="0"
    height="0"
    style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
  >
    <defs>
      <filter id="frost" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012"
          numOctaves="2"
          seed="7"
          stitchTiles="stitch"
        />
        <feDisplacementMap in="SourceGraphic" scale="3" />
        <feColorMatrix
          values="0 0 0 0 0.96
                  0 0 0 0 0.94
                  0 0 0 0 0.88
                  0 0 0 0.55 0"
        />
      </filter>
    </defs>
  </svg>
);

// ---------------------------------------------------------------------------
// TiltCard — wraps each column with a 3D-tilt + lift on hover.
//
// Reads the cursor's position relative to the card on every mousemove and
// converts that into a `rotateX` / `rotateY` transform. The card lifts a
// few pixels on hover and the rotation amount is capped (~7°) so the
// effect reads as "the card tilted toward you" instead of spinning. A
// small specular highlight is positioned via CSS variables from the same
// mousemove so the light spot follows the cursor under the surface.
//
// Respects prefers-reduced-motion: when set, the wrapper is static and
// only the lift (translateY) animates via CSS — no rotation, no
// rAF-driven transform.
// ---------------------------------------------------------------------------
const TILT_MAX_DEG = 7;     // peak rotation in each axis
const TILT_LIFT_PX = 6;     // how far the card lifts on hover
const TILT_GLOSS = 0.18;    // max opacity of the cursor highlight

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Normalize cursor position to [-1, 1] from the card center.
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({
      ry: nx * TILT_MAX_DEG,                      // left/right → rotateY
      rx: -ny * TILT_MAX_DEG,                     // up/down → rotateX
      gx: ((nx + 1) / 2) * 100,                   // specular x in %
      gy: ((ny + 1) / 2) * 100,                   // specular y in %
    });
  };

  const handleEnter = () => setHover(true);
  const handleLeave = () => {
    setHover(false);
    // Ease back to flat when the cursor leaves the card.
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  const style: CSSProperties = {
    transform: hover
      ? `translateY(-${TILT_LIFT_PX}px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
      : "translateY(0) rotateX(0) rotateY(0)",
    // Set as CSS vars on the element so the gloss layer (in the CSS
    // module) can read them via var(--gx) / var(--gy).
    ["--gx" as string]: `${tilt.gx}%`,
    ["--gy" as string]: `${tilt.gy}%`,
    ["--gloss" as string]: hover ? String(TILT_GLOSS) : "0",
  };

  return (
    <div
      ref={ref}
      className={styles.tiltWrap}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={style}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FallingByline — broken/scrambled effect for the "— AVEECK" byline.
//
// Same idea as the "reliable software products" highlight in the hero:
// each glyph starts at its own (y, rotate) offset, so at rest the
// byline reads as scattered letterforms. On hover, every glyph springs
// back to (0, 0) — assembling the line. After 2.6s the spring snaps
// back to scattered, and pointer-leave scatters immediately.
//
// Per-glyph offsets are pre-computed once from the seed (avoids
// Math.random on every render and keeps the rest state stable across
// hot reloads). All uppercase to match the byline's tracked-out style.
// ---------------------------------------------------------------------------
const BYLINE = "AVEECK";

// Deterministic pseudo-random based on the index — used so the broken
// offsets are stable but look scattered.
const bylineSeed = (i: number): number => {
  // Simple sin-based hash; output is a stable number in [0, 1).
  const x = Math.sin(i * 9.13 + 4.7) * 43758.5453;
  return x - Math.floor(x);
};

const BYLINE_OFFSETS = BYLINE.split("").map((_, i) => ({
  y: (bylineSeed(i * 2 + 1) - 0.5) * 36,       // ±18px
  rotate: (bylineSeed(i * 2 + 2) - 0.5) * 60,   // ±30°
}));

function FallingByline() {
  const [isAssembled, setIsAssembled] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fallApart = () => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
    setIsAssembled(false);
  };

  const reassemble = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setIsAssembled(true);
    // Auto-fall-apart after 2.6s so the hover doesn't get stuck.
    resetTimer.current = setTimeout(fallApart, 2600);
  };

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  return (
    <span
      className={`inline-flex cursor-default items-baseline whitespace-nowrap ${styles.bylineBroken}`}
      onPointerEnter={reassemble}
      onPointerLeave={fallApart}
    >
      <span aria-hidden style={{ marginRight: 6 }}>
        —
      </span>
      {BYLINE.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ display: "inline-block" }}
          initial={{ y: BYLINE_OFFSETS[i].y, rotate: BYLINE_OFFSETS[i].rotate }}
          animate={
            isAssembled
              ? { y: 0, rotate: 0 }
              : { y: BYLINE_OFFSETS[i].y, rotate: BYLINE_OFFSETS[i].rotate }
          }
          transition={
            isAssembled
              ? {
                  type: "spring",
                  stiffness: 360,
                  damping: 14,
                  mass: 0.7,
                  delay: i * 0.03,
                }
              : {
                  type: "tween",
                  duration: 0.6,
                  delay: i * 0.06,
                  ease: "easeIn",
                }
          }
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
export default function Footer() {
  const router = useRouter();

  // Back-to-top: from "/" this just smooth-scrolls to the top.
  // From "/ai" we also navigate home so the user lands on the
  // hero, not at the bottom of the AI page.
  const handleBackToTop = () => {
    if (typeof window === "undefined") return;
    const isHome = window.location.pathname === "/";
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <footer
      // No borderTop — the seam between the tear divider and the
      // footer's dark scrim is now blended by a parchment→scrim
      // gradient at the top (see "Tear seam layer" below), so a
      // hard 2px rule would only re-introduce the line we just
      // removed.
      className="relative px-6 py-16"
    >
      {FOOTER_FILTERS}
      {/* Tear seam layer — sits at the very top of the footer
          and dissolves the footer's dark scrim into the warm
          parchment of the tear divider above. A 120px tall
          vertical gradient: top is the same warm cream as the
          tear's parchment, bottom is fully transparent so the
          normal scrim takes over from ~120px down. Without this
          the bright tear landed on a hard black line. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{
          height: 120,
          background:
            "linear-gradient(to bottom, #1a1108 0%, rgba(26, 17, 8, 0.85) 35%, rgba(26, 17, 8, 0.45) 70%, rgba(26, 17, 8, 0) 100%)",
        }}
      />
      {/* Layer 1: Background-2 image, dialed back a notch from the
          "vivid with cards" setting because the column cards are
          gone — the scrim below is now the only thing between the
          painting and the text. 4px blur + saturate(150%) keeps
          the hands visible as mood without the detail competing
          with the letterforms. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/assets/Background-2.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.55,
          filter: "blur(4px) saturate(150%)",
          transform: "scale(1.05)", // hide the soft edge from the blur
        }}
      />
      {/* Layer 2: dark scrim removed — the painting is now visible
          through the glass cards' backdrop-filter blur alone, so the
          column text reads on the warm tone of the painting rather
          than a black canvas. */}

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Quick Links */}
          <TiltCard>
            <div className={styles.glassCard}>
              <div className={styles.glassFrost} style={{ filter: "url(#frost)" }} />
              <h3
                className="mb-6 text-center font-mono text-[11px] font-extrabold uppercase sm:text-left"
                style={{
                  color: INK,
                  letterSpacing: "0.32em",
                  textShadow: LIFT,
                }}
              >
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "#home", label: "Home" },
                  { href: "#about", label: "About" },
                  { href: "#expertise", label: "Expertise" },
                  { href: "#projects", label: "Projects" },
                  { href: "#experience", label: "Experience" },
                  { href: "#contact", label: "Contact" },
                ].map((link) => (
                  <li key={link.href} className="flex items-center gap-3">
                    <span
                      aria-hidden
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        background: GOLD,
                        transform: "rotate(45deg)",
                        flexShrink: 0,
                        boxShadow: LIFT,
                      }}
                    />
                    <a
                      href={link.href}
                      className="font-mono text-[11px] font-semibold uppercase transition-colors hover:opacity-80"
                      style={{
                        color: INK,
                        letterSpacing: "0.2em",
                        textShadow: LIFT,
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard>

          {/* Column 2 — Connect */}
          <TiltCard>
            <div className={styles.glassCard}>
              <div className={styles.glassFrost} style={{ filter: "url(#frost)" }} />
              <h3
                className="mb-6 text-center font-mono text-[11px] font-extrabold uppercase sm:text-left"
                style={{
                  color: INK,
                  letterSpacing: "0.32em",
                  textShadow: LIFT,
                }}
              >
                Connect
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  {
                    href: "https://linkedin.com/in/aveeck-pandey",
                    label: "LinkedIn",
                    handle: "Aveeck Pandey",
                    Glyph: LinkedInGlyph,
                  },
                  {
                    href: "https://github.com/AveeckPandey",
                    label: "GitHub",
                    handle: "@AveeckPandey",
                    Glyph: GitHubGlyph,
                  },
                  {
                    href: "mailto:hello@buildwithaveeck.com",
                    label: "Email",
                    handle: "hello@buildwithaveeck.com",
                    Glyph: MailGlyph,
                  },
                ].map(({ href, label, handle, Glyph }) => (
                  <li key={href} className="flex items-center gap-3">
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={label}
                      className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-transform hover:-translate-y-[2px]"
                      style={{
                        border: `1.5px solid ${INK}`,
                        color: INK,
                        background: "rgba(255, 255, 255, 0.35)",
                        textShadow: LIFT,
                      }}
                    >
                      <Glyph />
                    </a>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-mono text-[11px] transition-colors hover:opacity-80"
                      style={{
                        color: INK,
                        letterSpacing: "0.06em",
                        textShadow: LIFT,
                        wordBreak: "break-all",
                      }}
                    >
                      {handle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard>

          {/* Column 3 — Let's Build */}
          <TiltCard>
            <div className={styles.glassCard}>
              <div className={styles.glassFrost} style={{ filter: "url(#frost)" }} />
              <h3
                className="mb-6 text-center font-mono text-[11px] font-extrabold uppercase sm:text-left"
                style={{
                  color: INK,
                  letterSpacing: "0.32em",
                  textShadow: LIFT,
                }}
              >
                Let&apos;s Build
              </h3>
              <p
                className="mb-6 text-center font-mono text-[11px] leading-relaxed sm:text-left"
                style={{
                  color: INK_SOFT,
                  textShadow: LIFT,
                }}
              >
                I&apos;m always open to discussing new ideas,
                <br />
                collaborations or opportunities.
              </p>
              <div className="flex justify-center sm:justify-start">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase transition-all hover:-translate-y-[1px]"
                  style={{
                    color: INK,
                    border: `1.2px solid ${INK}`,
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    padding: "10px 18px",
                    letterSpacing: "0.24em",
                    textDecoration: "none",
                    textShadow: LIFT,
                  }}
                >
                  Get in touch
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </TiltCard>

          {/* Column 4 — Location */}
          <TiltCard>
            <div className={styles.glassCard}>
              <div className={styles.glassFrost} style={{ filter: "url(#frost)" }} />
              <h3
                className="mb-6 text-center font-mono text-[11px] font-extrabold uppercase sm:text-left"
                style={{
                  color: INK,
                  letterSpacing: "0.32em",
                  textShadow: LIFT,
                }}
              >
                Location
              </h3>
              <div
                className="mb-3 flex items-center gap-2 font-mono text-[12px] font-bold"
                style={{ color: INK, textShadow: LIFT }}
              >
                <PinGlyph />
                <span>Bengaluru, India</span>
              </div>
              <p
                className="font-mono text-[11px] leading-relaxed"
                style={{
                  color: INK_SOFT,
                  textShadow: LIFT,
                }}
              >
                Open to Remote
                <br />
                Opportunities Worldwide
              </p>
            </div>
          </TiltCard>
        </div>

        {/* Bottom row: back-to-top on the left, pull-quote on the
            right. The back-to-top is a circular off-white button
            with an up-arrow + "Top" label so it reads as an
            affordance, not just a glyph. The pull-quote stays
            right-aligned. */}
        <div className="mt-12 flex items-end justify-between gap-6">
          <button
            type="button"
            onClick={handleBackToTop}
            aria-label="Back to top"
            className="group inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase transition-all duration-150 hover:-translate-y-[2px]"
            style={{
              color: INK,
              border: `1.2px solid ${INK}`,
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              padding: "10px 16px",
              letterSpacing: "0.24em",
              textShadow: LIFT,
              cursor: "pointer",
            }}
          >
            <span
              aria-hidden
              className="inline-block transition-transform duration-200 group-hover:-translate-y-[2px]"
            >
              ↑
            </span>
            Top
          </button>
          {/* Pull-quote — right-aligned in the bottom corner, below
            the four columns. Off-white + LIFT so it reads on the
            scrimmed painting, italic display face to match the
            editorial register of the other section quotes. */}
        <p
          className={`text-right font-display italic ${styles.glowText}`}
          style={{
            color: INK_SOFT,
            fontSize: 13,
            lineHeight: 1.55,
            letterSpacing: "0.02em",
            textShadow: GLOW,
            maxWidth: 480,
          }}
        >
          Make happiness work for you, not you work for happiness.
          <span
            className={`mt-2 block font-mono not-italic ${styles.glowByline}`}
            style={{
              color: INK_SOFT,
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              opacity: 0.85,
              textShadow: GLOW,
            }}
          >
            <FallingByline />
          </span>
        </p>
        </div>
      </div>
    </footer>
  );
}
