

import type { ExperienceItem } from "@/lib/types";
import ScrambleText from "./ScrambleText";

interface ExperienceProps {
  experience: ExperienceItem[];
}

export default function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h2
            className="font-display text-3xl font-bold uppercase sm:text-4xl"
            style={{ color: "var(--fg)" }}
          >
            <ScrambleText text="Experience" duration={1000} />
          </h2>
          <div
            className="neo-border mt-3 inline-block h-1 w-16"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </div>

        {/* Pull-quote — Heraclitus + the Learning→Mastery cycle.
            Sits between the section header and the cards so the cards
            read as the proof of the cycle, not the other way around. */}
        <blockquote
          className="mb-12 border-l-2 pl-5"
          style={{ borderColor: "var(--accent)" }}
        >
          <p
            className="font-display italic"
            style={{
              color: "var(--fg)",
              fontSize: 20,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Much learning does not teach understanding.
            <span
              className="ml-2 not-italic font-mono"
              style={{
                color: "var(--muted-fg)",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Heraclitus
            </span>
          </p>

          {/* Learning → Mastery cycle.
              Each step is its own bordered cell so the arrows and labels
              align on a single horizontal rail, even when the line wraps
              on narrow viewports. */}
          <ol
            className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-0"
            aria-label="Learning to Mastery cycle"
          >
            {[
              "Learning",
              "Building",
              "Failing",
              "Understanding",
              "Mastery",
            ].map((step, i, arr) => (
              <li
                key={step}
                className="flex items-center font-mono text-[11px] font-bold uppercase sm:flex-none"
                style={{ color: "var(--fg)" }}
              >
                <span
                  className="neo-border inline-block px-2 py-1"
                  style={{
                    backgroundColor: "var(--surface)",
                    color: "var(--fg)",
                    letterSpacing: "0.14em",
                  }}
                >
                  {step}
                </span>
                {i < arr.length - 1 ? (
                  <span
                    aria-hidden
                    className="px-2 select-none sm:px-3"
                    style={{ color: "var(--accent)" }}
                  >
                    &rarr;
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </blockquote>

        <div className="space-y-8">
          {experience.map((item, i) => (
            <div
              key={i}
              className="neo-card p-6 transition-all duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:neo-shadow-lg"
              style={{ backgroundColor: "var(--card)", color: "var(--card-fg)" }}
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3
                    className="font-mono text-base font-bold uppercase"
                    style={{ color: "var(--fg)" }}
                  >
                    <ScrambleText text={item.role} duration={800} />
                  </h3>
                  <p
                    className="font-mono text-sm font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    {item.company}
                  </p>
                </div>
                <span
                  className="neo-border inline-block px-3 py-1 font-mono text-[10px] font-bold uppercase"
                  style={{ backgroundColor: "var(--surface)", color: "var(--muted-fg)" }}
                >
                  {item.period}
                </span>
              </div>
              <p
                className="mb-4 font-mono text-xs leading-relaxed"
                style={{ color: "var(--muted-fg)" }}
              >
                {item.description}
              </p>
              <ul className="space-y-2">
                {item.highlights.map((h, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 font-mono text-xs"
                    style={{ color: "var(--fg)" }}
                  >
                    <span
                      className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
