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
    category: "Full-Stack Beauty E-commerce",
    year: "MMXXV",
    description:
      "Built and deployed a full-stack beauty e-commerce platform with a Next.js/TypeScript frontend, Go commerce backend, and Python FastAPI service. Covered end-to-end shopping features product catalogues, authentication, cart, checkout, payments, orders, inventory, and reviews. Designed a scalable AWS architecture using CloudFront, ALB, private EC2s, RDS Multi-AZ, S3, and VPC networking. Implemented Lambda functions for post-signup welcome coupons and order-confirmation emails via SES, with Secrets Manager, IAM, CloudWatch monitoring, and CI/CD pipelines throughout.",
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
    points: [
      "Built responsive storefront and dashboards with Next.js + TypeScript, backed by a Go commerce service and Python FastAPI for ancillary workflows",
      "Developed product catalogues, auth, carts, checkout, payment, orders, inventory, reviews, and personalised storefronts end-to-end",
      "Designed a multi-AZ AWS deployment with CloudFront, ALB, private EC2, RDS, S3, Secrets Manager, IAM, CloudWatch, and VPC",
      "Implemented AWS Lambda for Cognito post-sign-up welcome coupons and order-confirmation emails via Amazon SES",
      "Hardened APIs, data, and IAM with encryption, secrets management, and continuous monitoring",
      "Automated build, test, and deploy with a CI/CD pipeline wired into the AWS estate",
    ],
    link: { label: "View project", href: "#" },
  },
  {
    id: "hopebox",
    numeral: "II",
    name: "HOPEBOX",
    category: "Full-Stack Mobile · NGO Logistics",
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
    points: [
      "Built the cross-platform mobile app with React Native, Expo, and TypeScript for NGO field operations",
      "Developed an admin-configurable commodity catalogue (food, medical, hygiene, therapeutic, agricultural) with reusable box templates",
      "Implemented QR-based box creation, label printing, camera scanning, and full lifecycle tracking",
      "Used Firestore real-time sync + atomic transactions to prevent negative stock and concurrent dispatch conflicts",
      "Added real-time dashboards, batch & expiry tracking, authentication, offline-aware behaviour, and dark mode",
      "Delivered English/Hindi and additional-language localization with broad error handling and Jest unit tests",
    ],
    link: { label: "View project", href: "#" },
  },
  {
    id: "nexussecure",
    numeral: "III",
    name: "NEXUS SECURE",
    category: "Full-Stack Mobile · Cloud · E2EE",
    year: "MMXXV",
    description:
      "Built a cross-platform zero-knowledge mobile messaging app using React Native, Expo, and NativeWind with C++ JSI bindings. Implemented on-device end-to-end encryption via X25519 key exchange, AES-256-GCM, Android Keystore, and iOS Keychain — the server routes ciphertext only. Developed WebSocket-based real-time messaging and designed stateless AWS infrastructure with EC2, ElastiCache Redis, S3, VPC, IAM, and CloudWatch. Automated native build validation, APK/AAB generation, and delivery using EAS Build and EAS Workflows.",
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
    points: [
      "Built cross-platform mobile interfaces, real-time WebSocket communication, and device-native workflows with React Native + Expo",
      "Designed stateless AWS infrastructure (EC2, ElastiCache Redis, S3, IAM, CloudWatch, VPC) for hosting, connection state, and access control",
      "Implemented on-device E2EE with X25519 key exchange, Diffie-Hellman shared-secret derivation, and AES-256-GCM encryption",
      "Secured device keys with Android Keystore and iOS Keychain — the server routes ciphertext only",
      "Hardened application and infrastructure security across JSI crypto, device keystores, IAM, and network isolation",
      "Automated native build validation, APK/AAB generation, dependency compilation, and delivery with EAS Build + EAS Workflows",
    ],
    link: { label: "View project", href: "#" },
  },
  {
    id: "rag-assistant",
    numeral: "IV",
    name: "RAG KNOWLEDGE ASSISTANT",
    category: "AI · Backend · Production",
    year: "MMXXVI",
    description:
      "Built a production-ready RAG assistant using Python, FastAPI, PostgreSQL with pgvector, Redis, and Amazon Bedrock. Designed a full ingestion-to-response pipeline with semantic chunking, vector retrieval, reranking, and citation-based answers. Added safeguards for relevance thresholds, prompt-injection filtering, conflict detection, and deterministic fallbacks. Secured multi-tenant access via PostgreSQL Row-Level Security and implemented circuit breakers, LLM failover, and automated evaluation suites for production reliability.",
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Redis",
      "Amazon Bedrock",
      "Reranking",
      "Row-Level Security",
      "Evaluation Harness",
    ],
    points: [
      "Built the end-to-end RAG pipeline: approved document ingestion, semantic chunking, embedding, metadata-filtered retrieval, reranking, and citation-based responses",
      "Hardened answer quality with relevance thresholds, grounded-answer validation, conflict detection, prompt-injection filtering, document revocation, and deterministic fallbacks",
      "Implemented secure multi-tenant access via signed tenant identity, PostgreSQL Row-Level Security, tenant-aware cache keys, and private internal APIs",
      "Improved reliability and scale with caching, request coalescing, concurrency limits, circuit breakers, and LLM/database failover",
      "Instrumented the system with telemetry and ran automated evaluation suites before promoting to production",
      "Deployed on AWS using Amazon Bedrock for model access, with Redis and pgvector as the working memory layers",
    ],
    link: { label: "View project", href: "#" },
  },
  {
    id: "support-inbox",
    numeral: "V",
    name: "AUTOMATED SUPPORT TRIAGE",
    category: "Automation · AI · n8n",
    year: "MMXXVI",
    description:
      "Supplier support inbox received high volumes of unstructured emails daily, requiring manual triage that slowed response times. I built an n8n automation pipeline, self-hosted on AWS EC2 with Docker, that watches the shared inbox via webhook, parses incoming emails, and runs AI-powered classification to label each ticket by intent — payment queries, onboarding issues, technical errors. Classified tickets are instantly routed to the correct queue before any human intervention. This eliminated manual first-touch triage for common categories, improved response consistency, and gave the support team a structured data foundation for future auto-reply and sentiment-tracking automations.",
    stack: [
      "n8n",
      "Docker",
      "Amazon EC2",
      "Webhook",
      "AI Classification",
      "Email Parsing",
    ],
    points: [
      "Identified manual triage as the bottleneck and designed an n8n automation pipeline as the fix",
      "Self-hosted n8n on AWS EC2 with Docker; webhooks watch the shared support inbox in real time",
      "Parsed incoming emails and ran AI-powered classification to label each ticket by intent (payment, onboarding, technical)",
      "Routed classified tickets to the correct queue before any human intervention",
      "Eliminated manual first-touch triage for common categories and improved response consistency",
      "Established a structured data foundation for downstream auto-reply and sentiment-tracking automations",
    ],
    link: { label: "View project", href: "#" },
  },
  {
    id: "linkedin-automation",
    numeral: "VI",
    name: "LINKEDIN JOB AUTOMATION",
    category: "Automation · n8n",
    year: "MMXXVI",
    description:
      "Manually publishing job listings across platforms is repetitive and error-prone at scale. I built an end-to-end automation pipeline using n8n that pulls structured job data from a source, formats it into platform-ready content, and automatically publishes listings to LinkedIn — without any manual intervention. The pipeline runs on a self-hosted AWS EC2 instance behind Docker and Caddy, triggered on demand or on schedule. Post formatting, field mapping, and publishing logic are fully automated, reducing time-to-publish from hours to seconds. The system is modular by design, making it straightforward to extend to additional job boards or social platforms.",
    stack: [
      "n8n",
      "Docker",
      "Caddy",
      "Amazon EC2",
      "LinkedIn API",
    ],
    points: [
      "Replaced repetitive, error-prone manual posting with an end-to-end n8n automation pipeline",
      "Pulled structured job data from a source and formatted it into platform-ready LinkedIn content",
      "Published listings to LinkedIn without any manual intervention",
      "Self-hosted n8n on AWS EC2 with Docker and Caddy; triggered on demand or on a schedule",
      "Reduced time-to-publish from hours to seconds by automating formatting, field mapping, and publishing",
      "Designed the system modularly so new job boards or social platforms can be added with minimal change",
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
  // Gate the continuous Lenis animation to the nearby section. The
  // ScrollTriggers themselves are deliberately kept alive below: their pin
  // spacer must exist before a navbar jump crosses this section, otherwise
  // the document height changes in the middle of that smooth scroll.
  const active = useAnimationGate(rootRef, { rootMargin: "200px" });

  useEffect(() => {
    if (typeof window === "undefined") return;
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
  }, []);

  useEffect(() => {
    if (!active) return;

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
  }, [active]);

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
