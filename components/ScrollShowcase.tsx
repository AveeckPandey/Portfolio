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
}

const PROJECTS: ReadonlyArray<Project> = [
  {
    id: "yafavanam",
    numeral: "I",
    name: "YAFA VANAM",
    category: "Full-Stack · AWS",
    year: "MMXXV",
    description:
      "Developed Yafa Vanam as a secure, scalable full-stack application using Next.js for responsive frontend development, server-side rendering, backend API routes, and application logic. Built reusable UI components and secure APIs for efficient communication between the frontend, backend, and cloud database.",
    stack: [
      "Next.js",
      "TypeScript",
      "Amazon EC2",
      "Amazon RDS",
      "Amazon S3",
      "AWS IAM",
      "AWS CloudWatch",
      "AWS VPC",
      "Jenkins",
    ],
    points: [
      "Built the frontend and backend with Next.js (SSR + API routes)",
      "Used EC2, RDS, S3, IAM, CloudWatch, and VPC for hosting, data storage, access control, monitoring, and network security",
      "Designed secure database schemas and optimized queries using Amazon RDS",
      "Implemented RAG-based AI functionality for intelligent, context-aware responses",
      "Applied application and cloud security practices across APIs, database access, and AWS IAM permissions",
      "Automated testing and deployment pipelines with Jenkins",
    ],
    link: { label: "View project", href: "#" },
  },
  {
    id: "hopebox",
    numeral: "II",
    name: "HOPE BOX",
    category: "Full-Stack Mobile · Firebase",
    year: "MMXXV",
    description:
      "Developed HopeBox as a comprehensive, cross-platform mobile inventory and supply chain platform for NGOs and relief organizations using React Native, Expo, and TypeScript for responsive mobile frontend development, device hardware integration, and type-safe application logic. Built reusable UI components and an intuitive admin-configurable dashboard to manage complex commodity catalogs—including food, medical, hygiene, therapeutic, and agricultural supplies—alongside dynamic box templates, batch tracking, and real-time expiration visibility.",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Firebase Auth",
      "Cloud Firestore",
      "Jest",
    ],
    points: [
      "Built the cross-platform mobile frontend and application logic with React Native (Expo) and TypeScript",
      "Used Firebase Authentication and Cloud Firestore for secure identity management, real-time data synchronization, and serverless NoSQL storage",
      "Designed atomic transaction workflows and offline-aware database schemas to guarantee inventory integrity and prevent concurrent dispatch errors",
      "Implemented device hardware integrations for camera-based QR scanning and automated label printing for complete supply chain lifecycle tracking",
      "Developed real-time analytics dashboards for stock target planning, box status monitoring, and shortage identification",
      "Applied comprehensive UI/UX practices including English/Hindi localization and dynamic theming for diverse field environments",
      "Automated unit testing for complex logistics algorithms, batch tracking, and inventory calculations using Jest",
    ],
    link: { label: "View project", href: "#" },
  },
  {
    id: "nexuschat",
    numeral: "III",
    name: "HARPOCRATES",
    category: "Full-Stack Mobile · AWS",
    year: "MMXXV",
    description:
      "Developed Harpocrates as a zero-knowledge, cross-platform mobile messaging application using React Native (Expo) for responsive mobile frontend development, device-native API integration, and high-performance application logic. Built reusable UI components with NativeWind and secure client-side workflows for efficient, encrypted communication between mobile devices and the cloud backend.",
    stack: [
      "React Native",
      "Expo",
      "NativeWind",
      "C++ JSI",
      "Amazon EC2",
      "Amazon ElastiCache",
      "Amazon S3",
      "AWS IAM",
      "AWS CloudWatch",
      "AWS VPC",
      "EAS Build",
    ],
    points: [
      "Built the cross-platform mobile frontend and client logic with React Native (Expo)",
      "Used EC2, ElastiCache, S3, IAM, CloudWatch, and VPC for stateless real-time hosting, connection management, access control, monitoring, and network security",
      "Designed a zero-knowledge WebSocket architecture to route messages strictly as ciphertext without server-side decryption capabilities",
      "Implemented on-device E2EE cryptographic functionality for mathematically secure, private communications",
      "Applied application and hardware security practices across device keystores, JSI cryptography, and AWS IAM permissions",
      "Automated native build compilation and deployment pipelines using Expo Application Services (EAS)",
    ],
    link: { label: "View project", href: "#" },
  },
  {
    id: "atlasledger",
    numeral: "IV",
    name: "ATLAS LEDGER",
    category: "Full-Stack Web · TypeScript",
    year: "MMXXVI",
    description:
      "Developed Atlas Ledger as a typed, end-to-end financial journaling platform using Next.js for server-rendered dashboards and React Server Components, with a strictly validated double-entry data model. Built reusable form primitives, optimistic mutation flows, and a real-time reconciliation engine that streams ledger deltas from a Postgres-backed event log.",
    stack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "tRPC",
      "Zod",
      "TanStack Query",
      "Tailwind CSS",
      "NextAuth",
      "Vercel",
    ],
    points: [
      "Built the server-rendered dashboard and route handlers with Next.js (App Router) and React Server Components",
      "Modeled a strictly-validated double-entry ledger in PostgreSQL with Prisma, enforced by Zod schemas at every API boundary",
      "Wired type-safe client ↔ server communication with tRPC and TanStack Query, including optimistic mutations for low-latency entry posting",
      "Designed a real-time reconciliation engine that streams ledger deltas from a Postgres event log and surfaces imbalance diffs inline",
      "Implemented authentication, role-based access, and audit trails using NextAuth alongside row-level guards in route handlers",
      "Automated type-checking, migration review, and preview deploys on Vercel with a single CI workflow",
    ],
    link: { label: "View project", href: "#" },
  },
  {
    id: "meridian",
    numeral: "V",
    name: "MERIDIAN",
    category: "Full-Stack · AI · Cloud",
    year: "MMXXVI",
    description:
      "Developed Meridian as a retrieval-augmented analytics workbench using Next.js for server-rendered report canvases and streaming chat, with a Python FastAPI service orchestrating embedding generation, vector retrieval, and structured tool calls. Built reusable chart primitives and a streaming agent runtime that grounds every answer in the user's connected data sources.",
    stack: [
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "OpenAI",
      "LangChain",
      "Redis",
      "Docker",
      "AWS ECS",
    ],
    points: [
      "Built the streaming report canvas and chat surface with Next.js (App Router) and React Server Components",
      "Designed a FastAPI orchestration service that owns embedding, retrieval, and tool-calling for the agent runtime",
      "Modeled retrieval indexes with pgvector and PostgreSQL, including metadata filters and hybrid lexical + vector scoring",
      "Wired LangChain tool-calling into a streaming agent that grounds responses in the user's connected data sources",
      "Implemented a Redis-backed job queue for long-running analyses with cancelable, retry-aware workers in Docker",
      "Deployed the FastAPI workers and Next.js app to AWS ECS behind an ALB with autoscaling and CloudWatch alarms",
    ],
    link: { label: "View project", href: "#" },
  },
];

// ─── upcoming (no scrubbing — these are rendered as a static grid) ─────

interface Upcoming {
  id: string;
  name: string;
  blurb: string;
  status: string;
}

const UPCOMING: ReadonlyArray<Upcoming> = [
  {
    id: "zootopia",
    name: "Zootopia",
    blurb:
      "An interactive bestiary that turns taxonomic data into explorable 3D habitats. Aimed at curious learners and classroom use.",
    status: "In design",
  },
  {
    id: "terminal",
    name: "Terminal",
    blurb:
      "A polished cross-platform terminal with split panes, command pipelines, and a plugin host for theme and tool extensions.",
    status: "Alpha",
  },
  {
    id: "moviemate",
    name: "MovieMate",
    blurb:
      "A watch-together app that syncs playback across rooms, queues suggestions from a small taste graph, and tracks what you actually finish.",
    status: "Prototyping",
  },
  {
    id: "cartograph",
    name: "Cartograph",
    blurb:
      "A personal map diary that pins the places you've lived to a hand-drawn world map, with a timeline you can scrub like a journey.",
    status: "In design",
  },
  {
    id: "penumbra",
    name: "Penumbra",
    blurb:
      "A focus timer that dims the screen based on your typing rhythm and layers adaptive ambient soundscapes onto the work session.",
    status: "Prototyping",
  },
  {
    id: "kitemark",
    name: "Kitemark",
    blurb:
      "A small reading companion that bookmarks long-form articles offline, estimates your finish time, and surfaces the lines you'll want to come back to.",
    status: "Alpha",
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
  // Gate that flips `true` while the section is on-screen and the
  // tab is visible. We use the boolean return value (not the
  // ref-write path) here because this effect needs to re-run when
  // the gate flips — Lenis/ScrollTrigger have to be (re)created
  // each time the section comes back into view, so a stable
  // `[]` dep array would leave them stuck uninitialized.
  const active = useAnimationGate(rootRef, { rootMargin: "200px" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;
    if (!active) {
      // Section is off-screen or the tab is hidden — skip the
      // Lenis + ScrollTrigger setup entirely. The rAF tick,
      // the Lenis instance, and the GSAP context are all
      // untouched; nothing runs.
      return;
    }

    const ctx = gsap.context(() => {
      // Lenis smooth scroll. Drives the GSAP ticker at 60fps.
      const lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Pin the sticky scene inside the section while the user
      // scrolls through the folios. One viewport per folio so the
      // progress is intuitive — scroll one screen, advance one project.
      ScrollTrigger.create({
        trigger: root.querySelector("[data-scene-wrapper]") as HTMLElement,
        start: "top top",
        end: () => `+=${(PROJECTS.length - 1) * window.innerHeight}`,
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

    return () => {
      const lenis = lenisRef.current;
      if (lenis) {
        gsap.ticker.remove((time) => lenis.raf(time * 1000));
        lenis.destroy();
        lenisRef.current = null;
      }
      ctx.revert();
    };
  }, [active]);

  return (
    <section id="projects" ref={rootRef} className={styles.demoRoot}>
      {/* 3D-style intro that scrubs in before the pinned folio scene engages. */}
      <div className={styles.introBackdrop}>
        <p className={styles.introSub}>Scroll down to reveal</p>
        <h1 data-3d-heading className={styles.introHeading}>
          <ScrambleText text="Welcome to the project section" duration={1100} />
        </h1>
      </div>

      {/* Pinned folio scene. */}
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

                  <ul className={styles.folioPoints}>
                    {p.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  <a
                    href={p.link.href}
                    className={styles.folioLink}
                    rel="noopener noreferrer"
                  >
                    {p.link.label} →
                  </a>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

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
