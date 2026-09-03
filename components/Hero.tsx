"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ScrambleText from "./ScrambleText";

const INK = "#171411";
const ACCENT = "#9A5A25";
const GREEN = "#8BBF65";
const YELLOW = "#D8A96B";
const COPPER = "#B86A32";
const PAPER = "#F2E4CF";
const CREAM = "#F6E8D3";

const cards = [
  { label: "Frontend", icon: "◈", color: GREEN },
  { label: "Backend", icon: "▣", color: INK, dark: true },
  { label: "Database", icon: "⬡", color: YELLOW },
  { label: "Cloud", icon: "◇", color: COPPER },
  { label: "Mobile Dev", icon: "◉", color: CREAM },
  { label: "AI & ML", icon: "✦", color: ACCENT, dark: true },
];

const stack = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Docker",
  "AWS",
  "Python",
  "AWS Bedrock",
  "Unsloth",
  "Evals",
  "Multi-Agentic Systems",
  "Voice & Speech AI",
  "AI Evaluation & Safety",
  "RAG & Vector Search",
  "LLM & GenAI Applications",
];

const fallingWords = [
  { text: "reliable", y: 16, rotate: -5 },
  { text: "AI", y: 22, rotate: 5 },
  { text: "products", y: 18, rotate: -3 },
];

export default function Hero({ hero }: { hero: any }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
      style={{
        paddingTop: "80px",
        backgroundColor: "transparent",
      }}
    >
      {/* feDisplacementMap softening layer. The body's grunge webp
         + dot grid is very high-contrast, which competes with the
         Hero text. This absolute layer sits behind the content and
         runs the SVG #paper-grunge filter from app/layout.tsx,
         bending the underlying texture's highlights so the noise
         reads as paper grain rather than pixel grit. `pointer-events:
         none` keeps it from intercepting clicks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 paper-grunge"
        style={{
          background:
            "linear-gradient(180deg, rgba(200,178,147,0.55) 0%, rgba(242,228,207,0.35) 60%, rgba(200,178,147,0.55) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Side rails — editorial */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 hidden h-full w-12 border-r-2 border-[#171411]/10 md:flex md:flex-col md:items-center md:justify-between md:py-32">
        <div className="rotate-180 font-mono text-[10px] font-bold uppercase tracking-widest text-[#171411]/50" style={{ writingMode: "vertical-rl" }}>
          AveeckPandey — Software & AI Engineer
        </div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#171411]/50" style={{ writingMode: "vertical-rl" }}>
          Scroll ↓
        </div>
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-20 hidden h-full w-12 border-l-2 border-[#171411]/10 md:flex md:flex-col md:items-center md:justify-between md:py-32">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#171411]/50" style={{ writingMode: "vertical-rl" }}>
          Folio 2026 / Edition 01
        </div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#171411]/50" style={{ writingMode: "vertical-rl" }}>
          © AP
        </div>
      </div>

      {/* Top meta row — pushed up to sit above the section, only a sliver visible at the top */}
      <div
        className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between border-b-2 border-[#171411]/15 bg-[#F2E4CF]/95 px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#171411]/60 backdrop-blur-sm md:px-20"
        style={{ transform: "translateY(calc(-100% + 12px))" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: COPPER, animation: "hero-ping 2s ease-out infinite" }}
            aria-hidden="true"
          />
          <span>Available for Software & AI Engineering · Q3 2026</span>
        </div>
        <div className="hidden md:block">N° 001 — Introduction</div>
        <div className="hidden md:block">A. Pandey</div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 py-16 md:px-20 md:py-20">

        {/* Main two-column */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* LEFT — Name + identity */}
          <div className="lg:col-span-7">
            <div
              className="relative -ml-3 -mt-3 px-6 py-8 md:-ml-6 md:px-10 md:py-10"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(8px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
            {/* Eyebrow */}
            <div
              className="mb-6 inline-flex items-center gap-2 border-2 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{
                borderColor: INK,
                backgroundColor: CREAM,
                color: INK,
                boxShadow: `3px 3px 0 ${INK}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(-8px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              <span style={{ color: ACCENT }}>★</span> <ScrambleText text="Software & AI Engineer · Building Scalable Products" duration={1100} />
            </div>

            {/* Name — huge editorial type */}
            <h1
              className="mb-2 font-sans font-black uppercase leading-[0.85] tracking-[-0.04em] text-on-grunge"
              style={{ color: INK, fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
            >
              <span className="block overflow-hidden">
                <span
                  className="block"
                  style={{ transform: mounted ? "translateY(0)" : "translateY(110%)", transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}
                >
                  Aveeck
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block italic"
                  style={{ color: ACCENT, transform: mounted ? "translateY(0)" : "translateY(110%)", transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s" }}
                >
                  Pandey.
                </span>
              </span>
            </h1>

            {/* Underline + role */}
            <div
              className="mb-6 flex items-center gap-4"
              style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.7s" }}
            >
              <div className="h-[3px] w-16" style={{ backgroundColor: INK }} />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-on-grunge" style={{ color: INK }}>
                <ScrambleText text="Engineer · Problem Solver · Builder" duration={1000} />
              </span>
            </div>

            <div
              className="-ml-6 mb-8 max-w-xl md:-ml-20"
              style={{
                filter: `drop-shadow(4px 4px 0 ${INK})`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.7s ease 0.9s",
              }}
            >
              <img
                src="/assets/paper-tear-clean.webp"
                alt=""
                aria-hidden="true"
                className="-mb-1 block h-7 w-full object-fill"
              />
              <p
                className="border-x-2 px-4 py-2 font-serif text-lg leading-[1.6] md:text-xl"
                style={{
                  color: INK,
                  borderColor: INK,
                  backgroundColor: "#FFFFFF",
                }}
              >
                I build <FallingHighlight /> — thoughtful frontends, resilient backend systems, well-structured data, cloud-ready experiences that scale, and intelligent AI features powered by RAG.
              </p>
              <img
                src="/assets/paper-tear-clean.webp"
                alt=""
                aria-hidden="true"
                className="-mt-1 block h-7 w-full -scale-y-100 object-fill"
              />
            </div>

            {/* Capabilities chips */}
            <div
              className="mb-10 flex flex-wrap gap-2"
              style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)", transition: "all 0.7s ease 1.05s" }}
            >
              {["FRONTEND", "BACKEND", "DATABASE", "CLOUD", "AI & ML", "MOBILE DEVELOPMENT"].map((t, i) => (
                <span
                  key={t}
                  className="border-2 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    borderColor: INK,
                    backgroundColor: i === 0 ? GREEN : i === 2 ? YELLOW : i === 3 ? COPPER : i === 4 ? ACCENT : CREAM,
                    color: (i === 3 || i === 4) ? PAPER : INK,
                    boxShadow: `2px 2px 0 ${INK}`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="flex flex-wrap items-center gap-3"
              style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)", transition: "all 0.7s ease 1.2s" }}
            >
              <a
                href={hero.ctaHref}
                onClick={(e) => handleSmoothScroll(e, hero.ctaHref)}
                className="group inline-flex items-center gap-2 border-2 px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                style={{ borderColor: INK, backgroundColor: INK, color: PAPER, boxShadow: `5px 6px 0 ${ACCENT}` }}
              >
                {hero.cta}
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
              <a
                href="/assets/Software.pdf"
                download="Aveeck-Pandey-Resume.pdf"
                className="inline-flex items-center gap-2 border-2 px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-1"
                style={{ borderColor: INK, backgroundColor: GREEN, color: INK, boxShadow: `5px 6px 0 ${INK}` }}
              >
                ↓ Resume
              </a>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, "#contact")}
                className="inline-flex items-center gap-2 border-2 px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                style={{ borderColor: INK, backgroundColor: "transparent", color: INK, boxShadow: `5px 6px 0 ${INK}` }}
              >
                ✉ Contact
              </a>
            </div>

            </div>
          </div>

          {/* RIGHT — Visual collage */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto h-[560px] w-full max-w-md">
              {/* Photo with editorial frame */}
              <div
                className="absolute"
                style={{
                  top: "60px",
                  left: "40px",
                  width: "220px",
                  zIndex: 5,
                  animation: "hero-float-photo 6s ease-in-out infinite",
                }}
              >
                <div
                  className="relative border-[3px]"
                  style={{ borderColor: INK, boxShadow: `6px 7px 0 ${ACCENT}`, transform: "rotate(-1.5deg)", backgroundColor: INK, padding: "6px" }}
                >
                  <Image
                    src="/assets/personal.png.webp"
                    alt="Aveeck Pandey"
                    width={440}
                    height={540}
                    sizes="(max-width: 768px) 60vw, 220px"
                    className="block h-auto w-full"
                  />
                  {/* Photo label */}
                  <div
                    className="absolute -top-3 left-3 border-2 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
                    style={{ borderColor: INK, backgroundColor: YELLOW, color: INK }}
                  >
                    Fig. 01 — THE THINKING
                  </div>
                </div>
                <div className="mt-3 text-center font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: INK, opacity: 0.6 }}>
                  ↳ Auguste Rodin, 1904
                </div>
              </div>

              {/* Floating cards */}
              {[
                { ...cards[0], top: "20px", left: "240px", rotate: "3deg" },
                { ...cards[1], top: "110px", left: "20px", rotate: "-2deg" },
                { ...cards[2], top: "220px", left: "260px", rotate: "-3deg" },
                { ...cards[3], top: "330px", left: "10px", rotate: "2deg" },
                { ...cards[4], top: "430px", left: "240px", rotate: "-2deg" },
                { ...cards[5], top: "480px", left: "20px", rotate: "3deg" },
              ].map((c, i) => (
                <div
                  key={c.label}
                  className="absolute"
                  style={{
                    top: c.top,
                    left: c.left,
                    zIndex: 10 + i,
                    animation: `hero-float-${(i % 4) + 1} ${5 + (i % 3)}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  <div
                    className="border-2 px-3 py-2 transition-all duration-300"
                    style={{
                      borderColor: INK,
                      backgroundColor: c.color,
                      color: c.dark ? PAPER : INK,
                      boxShadow: `3px 4px 0 ${INK}`,
                      transform: `rotate(${c.rotate})`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `5px 6px 0 ${ACCENT}`;
                      e.currentTarget.style.transform = "rotate(0deg) translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `3px 4px 0 ${INK}`;
                      e.currentTarget.style.transform = `rotate(${c.rotate})`;
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{c.icon}</span>
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider">{c.label}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Annotation — editorial arrow */}
              <div
                className="absolute font-mono text-[9px] font-bold uppercase tracking-wider"
                style={{ top: "200px", left: "-10px", color: INK, opacity: 0.5, transform: "rotate(-90deg)", transformOrigin: "left top" }}
              >
                ✦ Specialized In →
              </div>
            </div>
          </div>
        </div>

        {/* Bottom marquee — full-width ticker-tape with grunge fades and seamless loop */}
        <div
          className="relative mt-16 h-[54px] w-screen overflow-hidden"
          style={{
            backgroundColor: "#111",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 1.6s",
          }}
        >
          {/* Left grunge fade */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-[2] h-full w-[120px]"
            style={{ background: "linear-gradient(to right, rgba(180, 140, 80, 0.38), transparent)" }}
          />
          {/* Right grunge fade */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 z-[2] h-full w-[120px]"
            style={{ background: "linear-gradient(to left, rgba(180, 140, 80, 0.38), transparent)" }}
          />

          {/* Scrolling track — duplicated for seamless loop */}
          <div
            className="flex h-full items-center whitespace-nowrap"
            style={{ animation: "ticker-scroll 45s linear infinite", willChange: "transform" }}
          >
            {[...stack, ...stack].map((s, i) => (
              <span
                key={i}
                className="flex shrink-0 items-center px-[36px] font-mono text-[12px] font-bold uppercase text-white"
                style={{ letterSpacing: "3.5px" }}
              >
                <span className="mr-[10px]">★</span>
                {s}
                <span
                  aria-hidden="true"
                  className="ml-[36px] text-[10px] leading-none"
                  style={{ color: "#d4862a" }}
                >
                  ●
                </span>
              </span>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}

function FallingHighlight() {
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
    resetTimer.current = setTimeout(fallApart, 2600);
  };

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  return (
    <span
      data-falling-highlight
      className="inline-flex min-h-[3.35rem] cursor-default items-start whitespace-nowrap align-top font-semibold"
      style={{ backgroundColor: YELLOW, padding: "0 7px" }}
      onPointerEnter={reassemble}
      onPointerLeave={fallApart}
    >
      {fallingWords.map((word, index) => (
        <motion.span
          key={word.text}
          className="inline-block origin-bottom"
          initial={{ y: word.y, rotate: word.rotate }}
          animate={isAssembled ? { y: 0, rotate: 0 } : { y: word.y, rotate: word.rotate }}
          transition={
            isAssembled
              ? {
                  type: "spring",
                  stiffness: 480,
                  damping: 17,
                  mass: 0.55,
                  delay: index * 0.025,
                }
              : {
                  type: "tween",
                  duration: 0.44,
                  delay: index * 0.05,
                  ease: "easeIn",
                }
          }
        >
          {word.text}
          {index < fallingWords.length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
