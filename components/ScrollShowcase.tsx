"use client";

/**
 * ScrollShowcase — Greco-Roman classical folio
 * ---------------------------------------------
 * A single pinned section that scrubs through project folios one at a time.
 * The aesthetic borrows from a museum-quality codex: aged parchment, Roman
 * numerals, wax-seal rings, gold rules, Cinzel + Cormorant Garamond type.
 *
 * Each project folio is rendered as a *glass card* — a translucent
 * parchment-tinted panel with a blurred backdrop and a soft sepia border,
 * matching the footer cards. The intro hero ("Welcome to the project
 * section") is also a glass card so the whole section reads as a single
 * consistent treatment.
 *
 * Lenis (smooth scroll) drives GSAP's ScrollTrigger, which scrubs the
 * project index as the user scrolls. GSAP's ticker is paused while the
 * tab is hidden to avoid pointless rAF work.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useAnimationGate } from "@/lib/hooks/useAnimationGate";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import ScrambleText from "./ScrambleText";
import styles from "./scroll-showcase.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── project data ────────────────────────────────────────────────────────────

interface Project {
  id: string;
  numeral: string;
  name: string;
  category: string;
  year: string;
  description: string;
  stack: string[];
  points: string[];
  link: { label: string; href: string };
  demoLink?: { label: string; href: string };
}

const PROJECTS: ReadonlyArray<Project> = [
  {
    id: "yafavanam",
    numeral: "I",
    name: "YAFA VANAM",
    category: "Full-Stack Beauty E-commerce Platform",
    year: "MMXXV",
    description:
      "Built and deployed YAFA VANAM, a full-stack beauty e-commerce platform with a responsive Next.js and TypeScript frontend, Go commerce backend, Python FastAPI service, PostgreSQL databases, Redis, and AWS infrastructure. Developed product catalogues, customer authentication, carts, checkout, payment workflows, orders, inventory, reviews, and personalised storefront experiences. Built secure APIs for product information, payment verification, order processing, and account management. Designed a scalable AWS deployment using CloudFront, Application Load Balancer, private EC2 services, RDS Multi-AZ, S3, Secrets Manager, IAM, CloudWatch, and VPC networking. Implemented AWS Lambda functions for Cognito post-sign-up welcome coupons and order-confirmation emails delivered through Amazon SES, with CI/CD, encryption, monitoring.",
    stack: [
      "Next.js",
      "TypeScript",
      "Go",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Amazon CloudFront",
      "Amazon ALB",
      "Amazon EC2",
      "Amazon RDS",
      "Amazon S3",
      "AWS Lambda",
      "Amazon SES",
      "Amazon Cognito",
      "AWS IAM",
      "AWS CloudWatch",
      "AWS VPC",
      "AWS Secrets Manager",
    ],
    points: [],
    link: { label: "View project", href: "https://github.com/AveeckPandey/Yafa-Vanam" },
    demoLink: { label: "Demo Video", href: "https://x.com/BuildWithAveeck/status/2098317702322610570?s=20" },
  },
  {
    id: "hopebox",
    numeral: "II",
    name: "HOPEBOX",
    category: "NGO Inventory & QR Logistics Management System",
    year: "MMXXV",
    description:
      "Built HopeBox, a full-stack mobile inventory and QR logistics application for NGOs and relief organisations using React Native, Expo, TypeScript, Firebase Authentication, and Cloud Firestore. Developed an admin-configurable commodity catalogue covering food, medical, hygiene, therapeutic, and agricultural supplies, with reusable box templates, batch and expiry tracking, and real-time inventory visibility. Implemented QR-based box creation, label printing, camera scanning, and lifecycle tracking from storage through dispatch and return. Used Firestore real-time synchronization and atomic transactions to maintain stock accuracy, prevent negative inventory, and avoid concurrent dispatch conflicts. Added dashboards, authentication, offline-aware behaviour, dark mode, English/Hindi and More Languages support, error handling, and Jest tests.",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Firebase Auth",
      "Cloud Firestore",
      "QR Scanning",
      "Label Printing",
      "Jest",
    ],
    points: [],
    link: { label: "View project", href: "https://github.com/AveeckPandey/HopeBox" },
    demoLink: { label: "Demo Video", href: "https://x.com/BuildWithAveeck/status/2098317702322610570?s=20" },
  },
  {
    id: "nexussecure",
    numeral: "III",
    name: "NEXUS SECURE",
    category: "Full-Stack Mobile & Cloud Developer",
    year: "MMXXV",
    description:
      "Developed Nexus Secure, a cross-platform, zero-knowledge mobile messaging app using React Native, Expo, NativeWind, C++ JSI bindings, and AWS. Built reusable mobile interfaces, WebSocket-based real-time communication, and device-native workflows for secure encrypted messaging. Designed stateless AWS infrastructure with EC2, ElastiCache Redis, S3, IAM, CloudWatch, and VPC for hosting, connection state, monitoring, access control, and network isolation. Implemented on-device end-to-end encryption using X25519 key exchange, Diffie-Hellman shared-secret derivation, AES-256-GCM encryption, Android Keystore, and iOS Keychain. The server routes ciphertext only, preserving private communication between users. Automated native build validation, APK/AAB generation, dependency compilation, and delivery using EAS Build and EAS Workflows.",
    stack: [
      "React Native",
      "Expo",
      "NativeWind",
      "C++ JSI",
      "X25519",
      "AES-256-GCM",
      "Android Keystore",
      "iOS Keychain",
      "Amazon EC2",
      "Amazon ElastiCache",
      "Amazon S3",
      "AWS IAM",
      "AWS CloudWatch",
      "AWS VPC",
      "EAS Build",
      "EAS Workflows",
    ],
    points: [],
    link: { label: "View project", href: "https://github.com/AveeckPandey/Nexus" },
    demoLink: { label: "Demo Video", href: "https://x.com/BuildWithAveeck/status/2098317702322610570?s=20" },
  },
];

// ─── upcoming (no scrubbing — these are rendered as a static grid) ─────

interface Upcoming {
  id: string;
  name: string;
  blurb: string;
  status: string;
  link?: { href: string };
}

const UPCOMING: ReadonlyArray<Upcoming> = [
  {
    id: "macroiq",
    name: "MacroIQ",
    blurb:
      "MacroIQ is a fine-tuned AI chatbot that answers macroeconomic questions using real historical data. Ask how Fed rate hikes affect gold, or what oil shocks do to equities — it retrieves relevant past events from a vector database and explains the causal chain in plain language.",
    status: "Live",
    link: { href: "https://github.com/AveeckPandey/MacroIQ-" },
  },
  {
    id: "preppilot",
    name: "PrepPilot",
    blurb:
      "PrepPilot is an AI-powered voice interview coach that helps job seekers prepare smarter. Upload your resume, and PrepPilot generates personalized interview questions based on your experience and target role. You answer by speaking — just like a real interview — and PrepPilot listens, evaluates your responses, and tells you exactly where you excelled and where you need to improve.",
    status: "Live",
    link: { href: "https://github.com/AveeckPandey/PrepPilot" },
  },
  {
    id: "zootopia",
    name: "Zootopia",
    blurb:
      "Zootopia is a cloud-powered ticketing platform that helps wildlife parks manage admissions effortlessly. Visitors select their desired date and time online, and Zootopia instantly generates secure digital QR tickets right on their phones. Guests simply scan their screens at the gate — skipping the box office entirely — while Zootopia works behind the scenes to validate entry, prevent double-booking in real time, and automatically scale on AWS to handle massive holiday crowds without breaking a sweat.",
    status: "Live",
    link: { href: "https://github.com/AveeckPandey/Zootopia" },
  },
];

// ─── component ───────────────────────────────────────────────────────────────

export default function ScrollShowcase() {
  const rootRef = useRef<HTMLElement | null>(null);
  const sceneStickyRef = useRef<HTMLDivElement | null>(null);
  const folioRefs = useRef<Array<HTMLElement | null>>([]);
  const progressRefs = useRef<Array<HTMLLIElement | null>>([]);
  const currentIdxRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const isMobile = useIsMobile();
  // Gate the continuous Lenis animation to the nearby section. The
  // ScrollTriggers themselves are deliberately kept alive below: their pin
  // spacer must exist before a navbar jump crosses this section, otherwise
  // the document height changes in the middle of that smooth scroll.
  const active = useAnimationGate(rootRef, { rootMargin: "200px" });

  useEffect(() => {
    if (typeof window === "undefined" || isMobile) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Pin the sticky scene inside the section while the user
      // scrolls through the folios. We allocate 0.6 viewport of
      // scroll per transition (not a full viewport). This trigger stays
      // mounted even when the section is off-screen so its spacer keeps
      // anchor destinations stable during long navbar scrolls.
      ScrollTrigger.create({
        trigger: root.querySelector("[data-scene-wrapper]") as HTMLElement,
        start: "top top",
        end: () => `+=${(PROJECTS.length - 1) * window.innerHeight * 0.6}`,
        pin: sceneStickyRef.current ?? false,
        scrub: 0.6,
        onUpdate: (self) => {
          const idx = Math.min(
            PROJECTS.length - 1,
            Math.floor(self.progress * PROJECTS.length)
          );
          if (idx !== currentIdxRef.current) {
            currentIdxRef.current = idx;
            // Update the timeline indicator on the left rail.
            // `progressFraction` (0..1) drives the active mark's
            // vertical position; `idx` flips the "active" attribute
            // for both the marks and the folios.
            progressRefs.current.forEach((el, i) => {
              if (!el) return;
              el.dataset.active = i === idx ? "true" : "false";
            });
            folioRefs.current.forEach((el, i) => {
              if (!el) return;
              el.dataset.active = i === idx ? "true" : "false";
            });
          }
          // Drive the moving indicator along the rail. The active
          // dot sits at (idx / (n - 1)) of the rail height.
          const railEl = root.querySelector("[data-timeline-rail]") as HTMLElement | null;
          if (railEl) {
            const frac = PROJECTS.length > 1 ? idx / (PROJECTS.length - 1) : 0;
            railEl.style.setProperty("--progress", String(frac));
          }
        },
      });

      // Tell the global Navbar that the user is currently inside the
      // pinned projects section. The pinned wrapper's bounding box
      // is fixed at one viewport, so the navbar's IntersectionObserver
      // (which keys off viewport overlap) can't see the four
      // viewport-heights of scrubbing the user actually does inside
      // the pin. This ScrollTrigger watches the *wrapper's* top
      // against the viewport and dispatches a window event the
      // Navbar listens to.
      ScrollTrigger.create({
        trigger: root,
        start: "top 30%",
        end: "bottom 70%",
        onToggle: (self) => {
          if (typeof window === "undefined") return;
          window.dispatchEvent(
            new CustomEvent("portfolio:active-section", {
              detail: self.isActive ? "projects" : null,
            })
          );
        },
      });

      // 3D-style intro + upcoming headings — scrubbed in as the user
      // scrolls each one into view. Each heading has its own
      // ScrollTrigger so they fire independently; both share the
      // same data attribute so the CSS keyframe is identical.
      const headings = Array.from(
        root.querySelectorAll<HTMLElement>("[data-3d-heading]")
      );
      headings.forEach((heading) => {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 60, scale: 0.88, rotateX: -18 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              end: "top 30%",
              scrub: 0.5,
            },
          }
        );
      });
    }, root);

    // Create the pin spacer immediately, before a navbar link can start a
    // long smooth scroll past this section.
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [isMobile]);

  useEffect(() => {
    if (!active || isMobile) return;

    // Keep the smooth-scroll loop scoped to the nearby project scene; the
    // permanent ScrollTriggers above preserve the layout while it is idle.
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (lenisRef.current === lenis) {
        lenisRef.current = null;
      }
    };
  }, [active, isMobile]);

  return (
    <section id="projects" ref={rootRef} className={styles.demoRoot}>
      {/* 3D-style intro that scrubs in before the pinned folio scene engages. */}
      <div className={styles.introBackdrop}>
        <p className={styles.introSub}>Scroll down to reveal</p>
        <h1 data-3d-heading className={styles.introHeading}>
          <ScrambleText text="Welcome to the project section" duration={1100} />
        </h1>
        <blockquote data-3d-heading className={styles.introQuote}>
          <span className={styles.introQuoteMark} aria-hidden="true">
            “
          </span>
          <p className={styles.introQuoteText}>
            Day by day, what you choose, what you think and what you do is who
            you become.
          </p>
          <cite className={styles.introQuoteCite}>— Heraclitus</cite>
        </blockquote>
      </div>

      {/* Mobile Projects Stack vs Desktop Pinned Scene */}
      {isMobile ? (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8 md:hidden font-mono" aria-label="Projects">
          <div className="flex items-center justify-between border-b-2 border-dashed border-[#171411]/25 pb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#9A5A25]">
              Projects · MMXXV
            </span>
            <span className="font-mono text-xs font-bold uppercase text-[#171411]/60">
              {PROJECTS.length} Built
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {PROJECTS.map((p) => (
              <article
                key={p.id}
                className="neo-border neo-shadow p-5 flex flex-col gap-4"
                style={{ backgroundColor: "#F2E4CF", borderColor: "#171411" }}
              >
                <header className="flex items-center justify-between border-b-2 border-dashed border-[#171411]/25 pb-2 text-[10px] font-bold uppercase text-[#9A5A25]">
                  <span>{p.category} · N° {p.numeral}</span>
                  <span className="text-[#171411]/60">{p.year}</span>
                </header>

                <h3 className="font-mono text-xl font-bold uppercase tracking-tight text-[#171411]">
                  {p.name}
                </h3>

                <p className="text-xs text-[#3D2B1D] leading-relaxed">
                  {p.description}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.map((tech) => (
                    <span
                      key={tech}
                      className="border border-[#171411] bg-[#E9DCB8] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#171411] neo-shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Link CTA Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 mt-2">
                  <a
                    href={p.link.href}
                    target={p.link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="neo-border neo-shadow inline-flex items-center justify-center gap-2 bg-[#171411] px-4 py-2.5 font-mono text-xs font-bold uppercase text-[#F6E8D3] hover:bg-[#9A5A25] transition-colors"
                  >
                    {p.link.label} →
                  </a>
                  {p.demoLink && (
                    <a
                      href={p.demoLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neo-border neo-shadow inline-flex items-center justify-center gap-2 bg-[#171411] px-4 py-2.5 font-mono text-xs font-bold uppercase text-[#F6E8D3] hover:bg-[#9A5A25] transition-colors"
                    >
                      {p.demoLink.label} →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <section data-scene-wrapper className={styles.sceneWrapper}>
        <div data-scene-sticky ref={sceneStickyRef} className={styles.sceneSticky}>
          <div className={styles.sectionLabel}>
            <span>Projects · MMXXV</span>
          </div>

          {/*
            Vertical timeline rail (left side of the pinned scene).
            Reads like a film projector or an audio-wave timeline:
            a column of evenly-spaced dashes that the active dot
            travels along as the user scrolls. The rail is one
            element; the dashes are a CSS background, and the
            moving indicator is a single element positioned by
            `top: calc(var(--progress) * 100%)` — GSAP writes the
            CSS var from the ScrollTrigger onUpdate above.
          */}
          <nav
            className={styles.timeline}
            aria-label="Project progress"
          >
            <div
              data-timeline-rail
              className={styles.timelineRail}
              style={{ ["--progress" as string]: "0" }}
            >
              {/* The active indicator slides along the rail. */}
              <div className={styles.timelineIndicator} aria-hidden="true" />
            </div>

            <ul className={styles.timelineList}>
              {PROJECTS.map((p, i) => (
                <li
                  key={p.id}
                  ref={(el) => {
                    progressRefs.current[i] = el;
                  }}
                  className={styles.timelineItem}
                  data-active={i === 0 ? "true" : "false"}
                >
                  <span className={styles.timelineNumeral}>{p.numeral}</span>
                  <span className={styles.timelineName}>{p.name}</span>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.folioStack}>
            {PROJECTS.length === 0 ? (
              <div className={styles.folioEmpty}>No projects yet.</div>
            ) : (
              PROJECTS.map((p, i) => (
                <article
                  key={p.id}
                  ref={(el) => {
                    folioRefs.current[i] = el;
                  }}
                  className={styles.folio}
                  data-active={i === 0 ? "true" : "false"}
                  aria-label={`Project ${p.numeral} of ${toRoman(PROJECTS.length)}`}
                >
                  <header className={styles.folioHeader}>
                    <span className={styles.folioCategory}>
                      {p.category} · N° {p.numeral}
                    </span>
                    <span className={styles.folioYear}>{p.year}</span>
                  </header>

                  <h2 className={styles.folioTitle}>{p.name}</h2>

                  <p className={styles.folioDescription}>{p.description}</p>

                  <div className={styles.folioStack}>
                    {p.stack.map((tech) => (
                      <span key={tech} className={styles.folioTag}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  {p.points && p.points.length > 0 && (
                    <ul className={styles.folioPoints}>
                      {p.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}

                  <div className={styles.folioActions}>
                    <a
                      href={p.link.href}
                      target={p.link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={styles.folioLink}
                    >
                      {p.link.label} →
                    </a>
                    {p.demoLink && (
                      <a
                        href={p.demoLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.folioLink}
                      >
                        {p.demoLink.label} →
                      </a>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
      )}

      {/* ----------------------------------------------------------------
       * Upcoming Projects — non-pinned. The "Upcoming Projects" label
       * uses the same 3D-scrub animation as the intro heading so the
       * section feels like a continuation rather than a new page.
       *
       * The three cards are rendered as a static grid: no scrubbing,
       * no GSAP. Each is a glass card with the same paper grain as
       * the folios, but a quieter "draft" treatment (dashed border,
       * a status pill instead of a wax-seal, no points/links).
       * ---------------------------------------------------------------- */}
      <section data-upcoming className={styles.upcoming}>
        <p className={styles.upcomingSub}>In the workshop</p>
        <h2 data-3d-heading className={styles.upcomingHeading}>
          <ScrambleText text="Upcoming Projects" duration={1000} />
        </h2>

        <ul className={styles.upcomingGrid}>
          {UPCOMING.map((u) => (
            <li key={u.id} className={styles.upcomingCard}>
              <header className={styles.upcomingHeader}>
                <span className={styles.upcomingStatus}>{u.status}</span>
                <span className={styles.upcomingNumeral}>·</span>
              </header>
              <h3 className={styles.upcomingTitle}>{u.name}</h3>
              <p className={styles.upcomingBlurb}>{u.blurb}</p>
              {u.link && (
                <a
                  href={u.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.upcomingLink}
                >
                  View on GitHub →
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

// Convert an integer to a Roman numeral string (1..20 covers our range).
function toRoman(n: number): string {
  const map: ReadonlyArray<[number, string]> = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let remaining = n;
  for (const [value, symbol] of map) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}
