import type { SkillCategory } from "@/lib/types";
import GlowBorderCard from "./GlowBorderCard";
import ScrambleText from "./ScrambleText";

interface SkillsProps {
  skills: SkillCategory[];
  title?: string;
}

// ---------------------------------------------------------------------------
// Palette — sepia ink on warm parchment, matching the rest of the site.
// ---------------------------------------------------------------------------
const INK = "#2C1A0E";
const INK_SOFT = "rgba(44, 26, 14, 0.65)";
const INK_HAIR = "rgba(44, 26, 14, 0.22)";
const PARCHMENT = "#D4C4A0";
const PARCHMENT_DEEP = "#C8B890";
const STROKE = "#8B7355";
const STROKE_LIGHT = "#A89070";
const STROKE_FAINT = "#C4AA88";
const STEP_DOT = "#8B1A1A";
const TAG_BG = "rgba(139,115,85,0.12)";

// ---------------------------------------------------------------------------
// Category icons (sepia line-art). Each icon is keyed by category name, so
// adding/reordering categories in the data file automatically picks up the
// correct illustration. Unknown categories fall back to the languages icon.
// ---------------------------------------------------------------------------
type IconComponent = () => React.JSX.Element;

function IconLanguages() {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="60"
        y="68"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="52"
        stroke={STROKE}
        strokeWidth="1.4"
        fill="none"
      >
        {"</>"}
      </text>
    </svg>
  );
}

function IconFrontend() {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="18" width="92" height="66" rx="4" stroke={STROKE} strokeWidth="1.3" />
      <line x1="14" y1="32" x2="106" y2="32" stroke={STROKE} strokeWidth="1.3" />
      <circle cx="24" cy="25" r="3" stroke={STROKE} strokeWidth="1" />
      <circle cx="34" cy="25" r="3" stroke={STROKE} strokeWidth="1" />
      <circle cx="44" cy="25" r="3" stroke={STROKE} strokeWidth="1" />
      <rect x="22" y="40" width="76" height="36" rx="2" stroke={STROKE} strokeWidth="0.8" strokeDasharray="3 2" />
      <rect x="28" y="46" width="28" height="14" rx="1.5" stroke={STROKE} strokeWidth="0.8" />
      <rect x="62" y="46" width="30" height="14" rx="1.5" stroke={STROKE} strokeWidth="0.8" />
      <rect x="28" y="65" width="64" height="7" rx="1.5" stroke={STROKE_LIGHT} strokeWidth="0.7" />
    </svg>
  );
}

function IconBackend() {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="b-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <rect x="8" y="30" width="36" height="22" rx="5" stroke={STROKE} strokeWidth="1.2" />
      <text x="26" y="45" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={STROKE}>
        Client
      </text>
      <rect x="76" y="30" width="36" height="22" rx="5" stroke={STROKE} strokeWidth="1.2" />
      <text x="94" y="45" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={STROKE}>
        Server
      </text>
      <line x1="44" y1="37" x2="76" y2="37" stroke={STROKE} strokeWidth="1" markerEnd="url(#b-arr)" />
      <line x1="76" y1="45" x2="44" y2="45" stroke={STROKE} strokeWidth="1" markerEnd="url(#b-arr)" />
      <rect x="40" y="65" width="40" height="18" rx="4" stroke={STROKE_LIGHT} strokeWidth="0.9" strokeDasharray="3 2" />
      <text x="60" y="77" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={STROKE_LIGHT}>
        Middleware
      </text>
      <line x1="60" y1="52" x2="60" y2="65" stroke={STROKE_FAINT} strokeWidth="0.8" strokeDasharray="3 2" />
    </svg>
  );
}

function IconDatabase() {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="28" rx="34" ry="10" stroke={STROKE} strokeWidth="1.3" />
      <line x1="26" y1="28" x2="26" y2="54" stroke={STROKE} strokeWidth="1.3" />
      <line x1="94" y1="28" x2="94" y2="54" stroke={STROKE} strokeWidth="1.3" />
      <path d="M26 54 Q60 66 94 54" stroke={STROKE} strokeWidth="1.3" />
      <ellipse cx="60" cy="54" rx="34" ry="10" stroke={STROKE} strokeWidth="1" />
      <line x1="26" y1="54" x2="26" y2="74" stroke={STROKE} strokeWidth="1" />
      <line x1="94" y1="54" x2="94" y2="74" stroke={STROKE} strokeWidth="1" />
      <path d="M26 74 Q60 86 94 74" stroke={STROKE} strokeWidth="1" />
      <ellipse cx="60" cy="74" rx="34" ry="10" stroke={STROKE_LIGHT} strokeWidth="0.8" />
    </svg>
  );
}

function IconInfrastructure() {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="i-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke={STROKE_LIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <path
        d="M30 68 Q18 68 18 56 Q18 46 28 44 Q28 32 40 30 Q46 20 60 22 Q70 14 80 22 Q92 20 94 32 Q106 34 106 46 Q112 48 112 58 Q112 68 100 68 Z"
        stroke={STROKE}
        strokeWidth="1.2"
      />
      <circle cx="44" cy="52" r="7" stroke={STROKE} strokeWidth="1" />
      <circle cx="60" cy="44" r="7" stroke={STROKE} strokeWidth="1" />
      <circle cx="76" cy="52" r="7" stroke={STROKE} strokeWidth="1" />
      <line x1="51" y1="50" x2="53" y2="48" stroke={STROKE_LIGHT} strokeWidth="0.9" markerEnd="url(#i-arr)" />
      <line x1="67" y1="48" x2="69" y2="50" stroke={STROKE_LIGHT} strokeWidth="0.9" markerEnd="url(#i-arr)" />
    </svg>
  );
}

function IconTools() {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="60" y1="10" x2="60" y2="92" stroke={STROKE} strokeWidth="1.5" />
      <circle cx="60" cy="18" r="5" stroke={STROKE} strokeWidth="1.3" fill="none" />
      <circle cx="60" cy="42" r="5" stroke={STROKE} strokeWidth="1.3" fill="none" />
      <circle cx="60" cy="74" r="5" stroke={STROKE} strokeWidth="1.3" fill="none" />
      <path
        d="M60 42 Q86 42 86 58 L86 58 Q86 74 60 74"
        stroke={STROKE_LIGHT}
        strokeWidth="1.1"
        strokeDasharray="4 2.5"
      />
      <circle cx="86" cy="58" r="5" stroke={STROKE_LIGHT} strokeWidth="1.1" fill="none" />
    </svg>
  );
}

const ICON_BY_CATEGORY: Record<string, IconComponent> = {
  Languages: IconLanguages,
  Frontend: IconFrontend,
  Backend: IconBackend,
  Databases: IconDatabase,
  Infrastructure: IconInfrastructure,
  "Tools & Practices": IconTools,
};

function pickIcon(name: string): IconComponent {
  return ICON_BY_CATEGORY[name] ?? IconLanguages;
}

// ---------------------------------------------------------------------------
// ProcessCard — editorial parchment card, sepia line-art icon at top.
// ---------------------------------------------------------------------------
function ProcessCard({
  index,
  title,
  skills,
  Icon,
}: {
  index: number;
  title: string;
  skills: string[];
  Icon: IconComponent;
}) {
  const step = String(index + 1).padStart(2, "0");

  return (
    <article
      className="group relative flex flex-col overflow-hidden"
      style={{
        backgroundColor: PARCHMENT,
        border: `1px solid ${STROKE}`,
        borderRadius: 4,
        boxShadow: "6px 6px 0 rgba(44, 26, 14, 0.18)",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* Icon panel — paper grid backdrop */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: PARCHMENT_DEEP,
          backgroundImage: `
            linear-gradient(${STROKE_FAINT} 1px, transparent 1px),
            linear-gradient(90deg, ${STROKE_FAINT} 1px, transparent 1px)
          `,
          backgroundSize: "16px 16px",
          borderBottom: `1px solid ${STROKE}`,
          minHeight: 144,
          padding: "16px",
        }}
      >
        <div
          className="relative transition-transform duration-300 ease-out group-hover:scale-[1.05]"
          style={{ width: 110, height: 90, opacity: 0.92 }}
        >
          <Icon />
        </div>
      </div>

      {/* Text area */}
      <div className="relative" style={{ padding: "12px 14px 14px" }}>
        {/* Step label */}
        <div
          className="flex items-center gap-2"
          style={{ marginBottom: 4 }}
        >
          <span
            aria-hidden
            className="step-dot"
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              backgroundColor: STEP_DOT,
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              color: "#5C3D1E",
              letterSpacing: "0.08em",
            }}
          >
            STEP {step}
          </span>
        </div>

        {/* Title */}
        <h2
          className="font-mono"
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: INK,
            margin: "0 0 10px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {title.toUpperCase()}
        </h2>

        {/* Tags */}
        <div className="flex flex-wrap" style={{ gap: 5 }}>
          {skills.map((tag) => (
            <span
              key={tag}
              className="font-mono"
              style={{
                fontSize: 9,
                border: `1px solid ${STROKE}`,
                color: "#4A3520",
                padding: "2px 6px",
                borderRadius: 2,
                letterSpacing: "0.05em",
                backgroundColor: TAG_BG,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
export default function Skills({ skills, title = "Skills" }: SkillsProps) {
  return (
    <section id="skills" className="relative px-6 pt-10 pb-10">
      {/* Blueprint grid backdrop — sits behind the cards, transparent section
          bg, so the parchment cards stay readable on top. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blueprint-grid"
      />
      {/* Ruler ticks along top and bottom */}
      <div aria-hidden className="blueprint-ticks-top">
        <span className="ruler-cap ruler-cap-left" />
        <span className="ruler-cap ruler-cap-right" />
      </div>
      <div aria-hidden className="blueprint-ticks-bottom">
        <span className="ruler-cap ruler-cap-left" />
        <span className="ruler-cap ruler-cap-right" />
      </div>
      {/* Corner crosshairs on the section frame */}
      <span aria-hidden className="crosshair cross-tl" />
      <span aria-hidden className="crosshair cross-tr" />
      <span aria-hidden className="crosshair cross-bl" />
      <span aria-hidden className="crosshair cross-br" />

      <style>{`
        /* Blueprint grid — same technique as the reference:
           two repeating-linear-gradients, one per axis, layered. */
        .blueprint-grid {
          background-image:
            repeating-linear-gradient(
              to right,
              rgba(28, 18, 10, 0.14) 0 1px,
              transparent 1px 48px
            ),
            repeating-linear-gradient(
              to bottom,
              rgba(28, 18, 10, 0.14) 0 1px,
              transparent 1px 48px
            );
        }

        /* Ruler — a drafted engineering edge: two guide rails + a tick row
           of three densities, with circular markers on every major tick.
           Built entirely with stacked repeating-linear-gradients so it
           tiles edge-to-edge with no image assets. */
        .blueprint-ticks-top,
        .blueprint-ticks-bottom {
          position: absolute;
          left: 0;
          right: 0;
          height: 22px;
          pointer-events: none;
        }

        /* Inner tick-row container — sits inside the guide rails, so the
           ticks grow downward from the top rail. */
        .blueprint-ticks-top    { top: 0; }
        .blueprint-ticks-bottom { bottom: 0; }

        .blueprint-ticks-top::before,
        .blueprint-ticks-bottom::before,
        .blueprint-ticks-top::after,
        .blueprint-ticks-bottom::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
        }

        /* ── TOP RULER ──────────────────────────────────────────────
           ::before = top guide rail (thin)
           ::after  = the tick field below it. Three superimposed
                     gradients produce minor / medium / major ticks. */
        .blueprint-ticks-top::before {
          top: 0;
          height: 1px;
          background: rgba(28, 18, 10, 0.55);
        }
        .blueprint-ticks-top::after {
          top: 1px;
          height: 18px;
          background-image:
            /* minor ticks — every 16px, 4px tall */
            repeating-linear-gradient(
              to bottom,
              rgba(28, 18, 10, 0.55) 0 1px,
              transparent 1px 5px
            ),
            /* major-tick columns — every 96px, full-height dark stroke */
            repeating-linear-gradient(
              to right,
              transparent 0 95px,
              rgba(28, 18, 10, 0.7) 95px 96px,
              transparent 96px 191px
            ),
            /* major-tick dot — a 3px circle centered on every 96px column */
            radial-gradient(
              circle at 96px 2px,
              rgba(28, 18, 10, 0.85) 0 1.6px,
              transparent 2px
            );
          background-size: 16px 100%, 192px 100%, 96px 100%;
          background-repeat: repeat-x, repeat-x, repeat-x;
          background-position: 0 0, 0 0, 0 0;
          mask-image: linear-gradient(to bottom, #000 0 4px, transparent 4px 100%);
          -webkit-mask-image: linear-gradient(to bottom, #000 0 4px, transparent 4px 100%);
        }

        /* ── BOTTOM RULER ───────────────────────────────────────────
           Mirrored: the two guide rails + tick field rise from below. */
        .blueprint-ticks-bottom::before {
          bottom: 0;
          height: 1px;
          background: rgba(28, 18, 10, 0.55);
        }
        .blueprint-ticks-bottom::after {
          bottom: 1px;
          height: 18px;
          background-image:
            repeating-linear-gradient(
              to top,
              rgba(28, 18, 10, 0.55) 0 1px,
              transparent 1px 5px
            ),
            repeating-linear-gradient(
              to right,
              transparent 0 95px,
              rgba(28, 18, 10, 0.7) 95px 96px,
              transparent 96px 191px
            ),
            radial-gradient(
              circle at 96px 2px,
              rgba(28, 18, 10, 0.85) 0 1.6px,
              transparent 2px
            );
          background-size: 16px 100%, 192px 100%, 96px 100%;
          background-repeat: repeat-x, repeat-x, repeat-x;
          background-position: 0 0, 0 0, 0 0;
          mask-image: linear-gradient(to top, #000 0 4px, transparent 4px 100%);
          -webkit-mask-image: linear-gradient(to top, #000 0 4px, transparent 4px 100%);
        }

        /* End-cap dots on the very left/right of each ruler.
           Sits inside the .blueprint-ticks-* container. */
        .ruler-cap {
          position: absolute;
          top: 50%;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(28, 18, 10, 0.7);
          transform: translateY(-50%);
          z-index: 1;
        }
        .ruler-cap-left  { left: 4px; }
        .ruler-cap-right { right: 4px; }

        /* Corner crosshairs — small "+" at the section's four corners. */
        .crosshair {
          position: absolute;
          width: 14px;
          height: 14px;
          pointer-events: none;
          z-index: 2;
        }
        .crosshair::before,
        .crosshair::after {
          content: "";
          position: absolute;
          background: rgba(28, 18, 10, 0.85);
        }
        .crosshair::before { top: 50%; left: 0; right: 0; height: 1px; transform: translateY(-50%); }
        .crosshair::after  { left: 50%; top: 0; bottom: 0; width: 1px; transform: translateX(-50%); }
        .cross-tl { top: 4px;    left: 4px; }
        .cross-tr { top: 4px;    right: 4px; }
        .cross-bl { bottom: 4px; left: 4px; }
        .cross-br { bottom: 4px; right: 4px; }

        @media (prefers-reduced-motion: reduce) {
          .step-dot,
          [aria-hidden][class*="pointer-events-none"] {
            animation: none !important;
          }
        }
      `}</style>
      <div className="relative mx-auto max-w-6xl">
        {/* Editorial section header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              color: INK_SOFT,
              letterSpacing: "0.4em",
            }}
          >
            // plate i — capabilities
          </span>
          <h2
            className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl"
            style={{ color: INK, letterSpacing: "0.02em" }}
          >
            <ScrambleText text={title} duration={1000} />
          </h2>
          <div className="mt-3" style={{ width: 80, height: 1, backgroundColor: INK }} />
        </div>

        {/* Editorial pull-quote — mirrors the one in Expertise so both
            editorial sections open onto the same rhythm. The blueprint
            grid shows through behind it, the same as the cards. */}
        <blockquote
          className="relative mx-auto mb-12 max-w-3xl px-10 text-center font-display italic"
          style={{
            color: INK,
            fontSize: 18,
            lineHeight: 1.55,
            letterSpacing: "0.01em",
          }}
        >
          <span
            aria-hidden
            className="absolute select-none"
            style={{
              top: -10,
              left: 0,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 72,
              lineHeight: 1,
              color: STROKE_FAINT,
            }}
          >
            &ldquo;
          </span>
          <span
            aria-hidden
            className="absolute select-none"
            style={{
              bottom: -28,
              right: 0,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 72,
              lineHeight: 1,
              color: STROKE_FAINT,
            }}
          >
            &rdquo;
          </span>
          What we have to learn to do, we learn by doing.
          <footer
            className="mt-3 font-mono not-italic"
            style={{
              fontSize: 11,
              color: INK_SOFT,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            — Aristotle
          </footer>
          <span
            aria-hidden
            className="mt-4 block"
            style={{
              width: 40,
              height: 1,
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: STROKE,
            }}
          />
        </blockquote>

        {/* Cards: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((category, i) => (
            <GlowBorderCard
              key={category.name}
              delay={-i * 0.65}
              className="h-full"
              style={{
                backgroundColor: PARCHMENT,
                border: "none",
                boxShadow: "none",
                padding: 0,
                color: INK,
              }}
            >
              <ProcessCard
                index={i}
                title={category.name}
                skills={category.skills}
                Icon={pickIcon(category.name)}
              />
            </GlowBorderCard>
          ))}
        </div>
      </div>
    </section>
  );
}
