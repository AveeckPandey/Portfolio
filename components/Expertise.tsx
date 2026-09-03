import type { ExpertiseItem } from "@/lib/types";
import GlowBorderCard from "./GlowBorderCard";
import ScrambleText from "./ScrambleText";

interface ExpertiseProps {
  expertise: ExpertiseItem[];
  title?: string;
}

// ---------------------------------------------------------------------------
// Palette — identical to Skills so the two sections read as one system.
// ---------------------------------------------------------------------------
const INK = "#2C1A0E";
const INK_SOFT = "rgba(44, 26, 14, 0.65)";
const PARCHMENT = "#D4C4A0";
const PARCHMENT_DEEP = "#C8B890";
const STROKE = "#8B7355";
const STROKE_LIGHT = "#A89070";
const STROKE_FAINT = "#C4AA88";
const STEP_DOT = "#8B1A1A";

// ---------------------------------------------------------------------------
// Category icons (sepia line-art). Same set as Skills; items with an
// unrecognized title fall back to the languages icon.
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
        <marker id="ex-b-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
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
      <line x1="44" y1="37" x2="76" y2="37" stroke={STROKE} strokeWidth="1" markerEnd="url(#ex-b-arr)" />
      <line x1="76" y1="45" x2="44" y2="45" stroke={STROKE} strokeWidth="1" markerEnd="url(#ex-b-arr)" />
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
        <marker id="ex-i-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
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
      <line x1="51" y1="50" x2="53" y2="48" stroke={STROKE_LIGHT} strokeWidth="0.9" markerEnd="url(#ex-i-arr)" />
      <line x1="67" y1="48" x2="69" y2="50" stroke={STROKE_LIGHT} strokeWidth="0.9" markerEnd="url(#ex-i-arr)" />
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

function IconAI() {
  // Stylised neural-net: three columns of nodes with weighted edges.
  // Matches the sepia line-art language of the other icons.
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Layer 1 (input) */}
      <circle cx="22" cy="28" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
      <circle cx="22" cy="50" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
      <circle cx="22" cy="72" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
      {/* Layer 2 (hidden) */}
      <circle cx="60" cy="22" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
      <circle cx="60" cy="50" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
      <circle cx="60" cy="78" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
      {/* Layer 3 (output) */}
      <circle cx="98" cy="38" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
      <circle cx="98" cy="62" r="4" stroke={STROKE} strokeWidth="1.2" fill="none" />
      {/* Edges L1 → L2 */}
      <line x1="26" y1="28" x2="56" y2="22" stroke={STROKE_FAINT} strokeWidth="0.7" />
      <line x1="26" y1="28" x2="56" y2="50" stroke={STROKE_FAINT} strokeWidth="0.7" />
      <line x1="26" y1="50" x2="56" y2="22" stroke={STROKE_FAINT} strokeWidth="0.7" />
      <line x1="26" y1="50" x2="56" y2="50" stroke={STROKE_FAINT} strokeWidth="0.7" />
      <line x1="26" y1="50" x2="56" y2="78" stroke={STROKE_FAINT} strokeWidth="0.7" />
      <line x1="26" y1="72" x2="56" y2="50" stroke={STROKE_FAINT} strokeWidth="0.7" />
      <line x1="26" y1="72" x2="56" y2="78" stroke={STROKE_FAINT} strokeWidth="0.7" />
      {/* Edges L2 → L3 */}
      <line x1="64" y1="22" x2="94" y2="38" stroke={STROKE_FAINT} strokeWidth="0.7" />
      <line x1="64" y1="50" x2="94" y2="38" stroke={STROKE_FAINT} strokeWidth="0.7" />
      <line x1="64" y1="50" x2="94" y2="62" stroke={STROKE_FAINT} strokeWidth="0.7" />
      <line x1="64" y1="78" x2="94" y2="62" stroke={STROKE_FAINT} strokeWidth="0.7" />
    </svg>
  );
}

function IconVoice() {
  // Microphone + sound waves — voice / speech recognition.
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mic capsule */}
      <rect x="52" y="18" width="16" height="34" rx="8" stroke={STROKE} strokeWidth="1.3" fill="none" />
      {/* Mic stand arc */}
      <path d="M40 50 Q40 70 60 70 Q80 70 80 50" stroke={STROKE} strokeWidth="1.3" fill="none" />
      {/* Mic stand pole */}
      <line x1="60" y1="70" x2="60" y2="84" stroke={STROKE} strokeWidth="1.3" />
      {/* Mic base */}
      <line x1="46" y1="84" x2="74" y2="84" stroke={STROKE} strokeWidth="1.3" />
      {/* Sound waves (right) */}
      <path d="M86 36 Q94 50 86 64" stroke={STROKE_LIGHT} strokeWidth="1" fill="none" />
      <path d="M94 28 Q106 50 94 72" stroke={STROKE_FAINT} strokeWidth="0.9" fill="none" />
      {/* Sound waves (left) */}
      <path d="M34 36 Q26 50 34 64" stroke={STROKE_LIGHT} strokeWidth="1" fill="none" />
      <path d="M26 28 Q14 50 26 72" stroke={STROKE_FAINT} strokeWidth="0.9" fill="none" />
    </svg>
  );
}

function IconShield() {
  // Shield + checkmark — evaluation, safety, guardrails.
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M60 14 L92 24 L92 54 Q92 78 60 90 Q28 78 28 54 L28 24 Z"
        stroke={STROKE}
        strokeWidth="1.3"
        fill="none"
      />
      {/* Inner dashed border */}
      <path
        d="M60 22 L84 30 L84 54 Q84 72 60 82 Q36 72 36 54 L36 30 Z"
        stroke={STROKE_FAINT}
        strokeWidth="0.8"
        strokeDasharray="3 2"
        fill="none"
      />
      {/* Checkmark */}
      <path
        d="M46 52 L56 62 L74 42"
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// Substring → icon. We use case-insensitive substring matching so the
// same component works whether the title is "Backend Systems",
// "Backend", or "Backend Engineering".
const ICON_RULES: ReadonlyArray<[string, IconComponent]> = [
  ["language", IconLanguages],
  ["frontend", IconFrontend],
  ["backend", IconBackend],
  ["api", IconBackend],
  ["database", IconDatabase],
  ["data", IconDatabase],
  ["cloud", IconInfrastructure],
  ["infra", IconInfrastructure],
  ["devops", IconTools],
  ["tool", IconTools],
  ["voice", IconVoice],
  ["speech", IconVoice],
  ["safety", IconShield],
  ["eval", IconShield],
  ["llm", IconAI],
  ["genai", IconAI],
  ["agent", IconAI],
  ["ai ", IconAI],
  [" ai", IconAI],
];

function pickIcon(title: string): IconComponent {
  const t = title.toLowerCase();
  for (const [needle, Icon] of ICON_RULES) {
    if (t.includes(needle)) return Icon;
  }
  return IconLanguages;
}

// ---------------------------------------------------------------------------
// ExpertiseCard — same structure and visual language as Skills' ProcessCard.
// The body is the `description` text instead of skill tags.
// ---------------------------------------------------------------------------
function ExpertiseCard({
  index,
  title,
  description,
  Icon,
}: {
  index: number;
  title: string;
  description: string;
  Icon: IconComponent;
}) {
  const step = String(index + 1).padStart(2, "0");

  return (
    <article
      className="group relative flex flex-col overflow-hidden card-rise"
      style={{
        backgroundColor: PARCHMENT,
        border: `1px solid ${STROKE}`,
        borderRadius: 4,
        boxShadow: "6px 6px 0 rgba(44, 26, 14, 0.18)",
        fontFamily: "'Courier New', Courier, monospace",
        animationDelay: `${index * 80}ms`,
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
        <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
          <span
            aria-hidden
            className="step-dot"
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              backgroundColor: STEP_DOT,
              flexShrink: 0,
              animation: `ex-step-pulse 2.6s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`,
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
            margin: "0 0 8px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <ScrambleText text={title.toUpperCase()} duration={700} />
        </h2>

        {/* Description — replaces the skill tags from Skills */}
        <p
          className="font-mono"
          style={{
            fontSize: 11,
            color: INK_SOFT,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
export default function Expertise({ expertise, title = "Expertise" }: ExpertiseProps) {
  return (
    <section id="expertise" className="relative px-4 pt-10 pb-10 sm:px-6 lg:px-8">
      {/* Blueprint grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 ex-blueprint-grid"
      />
      {/* Ruler ticks along top and bottom */}
      <div aria-hidden className="ex-ruler ex-ruler-top">
        <span className="ex-ruler-cap ex-ruler-cap-left" />
        <span className="ex-ruler-cap ex-ruler-cap-right" />
      </div>
      <div aria-hidden className="ex-ruler ex-ruler-bottom">
        <span className="ex-ruler-cap ex-ruler-cap-left" />
        <span className="ex-ruler-cap ex-ruler-cap-right" />
      </div>
      {/* Corner crosshairs */}
      <span aria-hidden className="ex-cross ex-cross-tl" />
      <span aria-hidden className="ex-cross ex-cross-tr" />
      <span aria-hidden className="ex-cross ex-cross-bl" />
      <span aria-hidden className="ex-cross ex-cross-br" />

      <style>{`
        /* Faint grid — same technique as Skills, scoped to ex- prefix
           so it doesn't collide with any other section's CSS. */
        .ex-blueprint-grid {
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

        /* Ruler — outer guide rail + tick field, with major-tick dots. */
        .ex-ruler {
          position: absolute;
          left: 0;
          right: 0;
          height: 22px;
          pointer-events: none;
        }
        .ex-ruler-top    { top: 0; }
        .ex-ruler-bottom { bottom: 0; }
        .ex-ruler::before {
          content: "";
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: rgba(28, 18, 10, 0.55);
        }
        .ex-ruler-top::before    { top: 0; }
        .ex-ruler-bottom::before { bottom: 0; }
        .ex-ruler::after {
          content: "";
          position: absolute;
          left: 0; right: 0;
          height: 18px;
          background-image:
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
          background-size: 192px 100%, 96px 100%;
          background-repeat: repeat-x, repeat-x;
        }
        .ex-ruler-top::after {
          top: 1px;
          background-image:
            repeating-linear-gradient(
              to bottom,
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
          mask-image: linear-gradient(to bottom, #000 0 4px, transparent 4px 100%);
          -webkit-mask-image: linear-gradient(to bottom, #000 0 4px, transparent 4px 100%);
        }
        .ex-ruler-bottom::after {
          bottom: 1px;
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
          mask-image: linear-gradient(to top, #000 0 4px, transparent 4px 100%);
          -webkit-mask-image: linear-gradient(to top, #000 0 4px, transparent 4px 100%);
        }
        .ex-ruler-cap {
          position: absolute;
          top: 50%;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(28, 18, 10, 0.7);
          transform: translateY(-50%);
          z-index: 1;
        }
        .ex-ruler-cap-left  { left: 4px; }
        .ex-ruler-cap-right { right: 4px; }

        /* Corner crosshairs */
        .ex-cross {
          position: absolute;
          width: 14px;
          height: 14px;
          pointer-events: none;
          z-index: 2;
        }
        .ex-cross::before, .ex-cross::after {
          content: "";
          position: absolute;
          background: rgba(28, 18, 10, 0.85);
        }
        .ex-cross::before { top: 50%; left: 0; right: 0; height: 1px; transform: translateY(-50%); }
        .ex-cross::after  { left: 50%; top: 0; bottom: 0; width: 1px; transform: translateX(-50%); }
        .ex-cross-tl { top: 4px;    left: 4px; }
        .ex-cross-tr { top: 4px;    right: 4px; }
        .ex-cross-bl { bottom: 4px; left: 4px; }
        .ex-cross-br { bottom: 4px; right: 4px; }

        /* Card animations — prefixed so they don't collide with Skills' rules. */
        @keyframes ex-step-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(0.82); }
        }
        @keyframes ex-card-rise {
          0%   { opacity: 0; transform: translateY(12px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-rise {
          animation: ex-card-rise 0.7s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .card-rise,
          .step-dot,
          [aria-hidden][class*="pointer-events-none"] {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative">
        {/* Editorial section header — same shape as Skills */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              color: INK_SOFT,
              letterSpacing: "0.4em",
            }}
          >
            // plate ii — capabilities
          </span>
          <h2
            className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl"
            style={{ color: INK, letterSpacing: "0.02em" }}
          >
            <ScrambleText text={title} duration={1000} />
          </h2>
          <div className="mt-3" style={{ width: 80, height: 1, backgroundColor: INK }} />
        </div>

        {/* Editorial pull-quote — sits between the header and the cards.
            No background of its own so the blueprint grid shows through. */}
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
          He who sweats more in training bleeds less in war.
          <footer
            className="mt-3 font-mono not-italic"
            style={{
              fontSize: 11,
              color: INK_SOFT,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            — Spartan
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

        {/* Cards: 1 col mobile, 2 col small tablet, 3 col tablet+ */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6">
          {expertise.map((item, i) => (
            <GlowBorderCard
              key={item.title}
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
              <ExpertiseCard
                index={i}
                title={item.title}
                description={item.description}
                Icon={pickIcon(item.title)}
              />
            </GlowBorderCard>
          ))}
        </div>
      </div>
    </section>
  );
}
