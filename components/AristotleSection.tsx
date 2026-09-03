"use client";

import { useEffect, useState } from "react";

/**
 * Presentational Aristotle plate. No <section> wrapper, no heading — this
 * component is designed to be embedded INSIDE the About Me interaction
 * container as a back layer (lowest z-index) behind the three paper-stack
 * papers. The wire + clips + papers physically sit on top of it; once the
 * three papers fall away, the plate is revealed as the user continues
 * scrolling down through the About section.
 *
 * The plate keeps the same physical language as the papers above:
 *   - same `paper-ruled` ruled background
 *   - same border + box-shadow treatment
 *   - a small hanging string + tape tab at the top, suggesting the sheet
 *     hangs from the same wire system used by the three About-Me papers.
 *   - same header row (FIG. 02 — ARISTOTLE / PLATE N° 00)
 *   - same classical portrait + quote composition
 */
export default function AristotleSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div
      data-aristotle-plate
      className="relative mx-auto"
      style={{ maxWidth: "1200px" }}
    >
      <article
        data-paper-id="aristotle"
        className="paper-ruled aristotle-sheet relative mx-auto"
        style={{
          // Wide horizontal sheet, same physical language as the
          // other papers in the stack. Full-page height so once the
          // three papers fall, the plate fills the viewport.
          width: "min(1180px, calc(100vw - 32px))",
          minHeight: isMobile ? "min(620px, 80vh)" : "min(720px, 100vh)",
          transform: "rotate(-0.4deg)",
          transformOrigin: "center top",
          backgroundColor: "#EBDDC2",
          border: "1.5px solid rgba(23, 20, 17, 0.85)",
          borderRadius: "2px",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.12), 0 14px 28px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.25)",
          padding: isMobile ? "28px 32px" : "40px 56px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HANGING STRING — thin vertical line above the tape
            tab, suggesting the sheet hangs from the same wire
            system used by the three About-Me papers above. */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -top-[60px]"
          style={{
            width: "1px",
            height: "60px",
            background:
              "linear-gradient(to bottom, #171411 0%, rgba(23,20,17,0.55) 100%)",
            transform: "translateX(-50%)",
            opacity: 0.7,
          }}
        />

        {/* TAPE STRIP — bridges the sheet to its hanging
            string. */}
        <div
          aria-hidden="true"
          className="absolute -top-3 left-1/2"
          style={{
            width: "100px",
            height: "22px",
            background: "rgba(216, 169, 107, 0.55)",
            border: "1px solid rgba(23,20,17,0.2)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            transform: `translateX(-50%) rotate(0.6deg)`,
          }}
        />

        {/* HEADER ROW — FIG. 02 label, plate number. */}
        <header
          className="flex items-center justify-between border-b-2 border-dashed pb-3"
          style={{ borderColor: "rgba(23,20,17,0.25)" }}
        >
          <span
            className="font-mono font-bold uppercase tracking-[0.4em]"
            style={{
              color: "var(--muted-fg)",
              fontSize: "11px",
              whiteSpace: "nowrap",
            }}
          >
            FIG. 02 &nbsp;—&nbsp; ARISTOTLE
          </span>
          <span
            className="font-mono uppercase tracking-widest"
            style={{ color: "var(--muted-fg)", fontSize: "9px" }}
          >
            PLATE &nbsp;·&nbsp; N° 00
          </span>
        </header>

        {/* MAIN COMPOSITION — fills the rest of the sheet
            height. Two-column on desktop, stacked on mobile. */}
        <div
          className="flex flex-1 flex-col items-stretch gap-6 md:flex-row md:items-stretch md:gap-12"
          style={{ paddingTop: isMobile ? "20px" : "32px" }}
        >
          {/* ARTWORK — classical portrait on the left. */}
          <div
            className="flex flex-shrink-0 items-center md:items-start"
            style={{ width: isMobile ? "100%" : "min(600px, 55%)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/new-About-me.webp"
              alt="Aristotle — engraved classical portrait of the philosopher"
              className="block h-auto w-full"
              style={{
                objectFit: "contain",
                filter: "contrast(1.04) sepia(0.10)",
                maxHeight: isMobile ? "420px" : "540px",
                boxShadow:
                  "0 4px 8px rgba(0,0,0,0.18), 0 16px 30px rgba(0,0,0,0.14)",
              }}
            />
          </div>

          {/* RIGHT COLUMN — arrow + quote. */}
          <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
            {/* HORIZONTAL arrow (desktop) — hand-drawn from the
                artwork to the start of the quote. */}
            <svg
              aria-hidden="true"
              className="mb-5 hidden md:block"
              viewBox="0 0 180 60"
              width="160"
              height="54"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 4 50 C 40 50, 80 8, 120 12 S 170 20, 176 24"
                fill="none"
                stroke="#171411"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
              <path
                d="M 166 18 L 178 24 L 166 34"
                fill="none"
                stroke="#171411"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
            </svg>

            {/* VERTICAL arrow (mobile) */}
            <svg
              aria-hidden="true"
              className="mx-auto mb-4 block md:hidden"
              viewBox="0 0 50 60"
              width="36"
              height="44"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 25 4 C 28 24, 22 40, 25 50"
                fill="none"
                stroke="#171411"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M 19 44 L 25 54 L 31 44"
                fill="none"
                stroke="#171411"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
            </svg>

            {/* QUOTE — large editorial typography. */}
            <blockquote
              className="font-serif"
              style={{ margin: 0, padding: 0 }}
            >
              <p
                className="leading-[1.2]"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(1.75rem, 3.4vw, 3rem)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.2,
                }}
              >
                <span style={{ fontStyle: "italic" }}>&ldquo;</span>Knowing
                yourself is the beginning of all wisdom.
                <span style={{ fontStyle: "italic" }}>&rdquo;</span>
              </p>
              <cite
                className="mt-6 block font-serif not-italic"
                style={{
                  color: "var(--muted-fg)",
                  fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
                  letterSpacing: "0.02em",
                }}
              >
                &mdash; Aristotle
              </cite>
            </blockquote>
          </div>
        </div>
      </article>
    </div>
  );
}
