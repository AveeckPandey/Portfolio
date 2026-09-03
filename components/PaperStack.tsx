"use client";

import {
  AnimationEvent as ReactAnimationEvent,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AristotleSection from "./AristotleSection";
import ScrambleText from "./ScrambleText";
import {
  MatterPhysicsController,
  FallenPose,
} from "@/lib/MatterPhysicsController";

/**
 * Interactive 3-paper / 3-clip system for the About section, with a
 * back-layer Aristotle plate that physically sits behind the three
 * papers from the very beginning.
 *
 * Lifecycle (state machine):
 *
 *   STACKED
 *     ↓ scroll
 *   FALLING_1   (CSS paper-fall-1 keyframe)
 *     ↓ onAnimationEnd
 *   ONE_DOWN
 *     ↓ scroll
 *   FALLING_2   (CSS paper-fall-2 keyframe)
 *     ↓ onAnimationEnd
 *   TWO_DOWN
 *     ↓ scroll
 *   FALLING_3   (CSS paper-fall-3 keyframe)
 *     ↓ onAnimationEnd
 *   ALL_THREE_DOWN
 *     ↓ 10s timer
 *   RETURNING   (Matter.js takes over the DOM)
 *     ↓ allSettled
 *   STACKED     (back to start)
 *
 * The FALL phase is driven by CSS keyframes (`paper-fall-N` in
 * `app/globals.css`). Matter.js does not exist in memory during
 * the fall, the 10-second hold, or the brief pause before
 * RETURNING. It is instantiated only when the 10-second timer
 * completes, with one rigid body per paper placed at its current
 * (fallen) world-space position and a soft spring constraint
 * pulling it back to its original anchor on the wire. Once the
 * bodies settle near their anchors, the controller is disposed
 * and the cycle is ready to repeat.
 *
 * Aristotle is a back layer (z-index 5) below the three papers
 * and is never part of the physics simulation.
 *
 * Scroll model: the *page* scrolls normally at all times. The
 * PaperStack does NOT lock document.body scrolling. Instead, while
 * the 3-paper sequence is active (stage in {location, focus,
 * about}), the wheel + touchmove handlers attached to this
 * section call event.preventDefault() to absorb the scroll input
 * and route it into the paper-fall animation. As soon as the
 * third paper finishes falling (stage === "complete"), the
 * handlers stop absorbing input and the page scrolls naturally
 * down to the Aristotle plate and the rest of the site.
 */

// ─── stage machine ──────────────────────────────────────────────────────────

type PaperId = "location" | "focus" | "about";
type Stage = "location" | "focus" | "about" | "complete";
type SequenceState =
  | "stacked"
  | "falling"
  | "one-down"
  | "two-down"
  | "all-three-down"
  | "holding"
  | "returning"
  | "settled";
type PaperStageIndex = 0 | 1 | 2;

const STAGE_TO_INDEX: Record<Exclude<Stage, "complete">, PaperStageIndex> = {
  location: 0,
  focus: 1,
  about: 2,
};

const PAPER_STAGES: ReadonlyArray<Exclude<Stage, "complete">> = [
  "location",
  "focus",
  "about",
];

// ─── mobile detection ───────────────────────────────────────────────────────

function useMediaQuery(query: string): boolean {
  const getMatch = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };
  const [matches, setMatches] = useState<boolean>(getMatch);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, [query]);
  return matches;
}

// ─── paper definitions ──────────────────────────────────────────────────────

interface PaperConfig {
  id: PaperId;
  label: string;
  tagline: string;
  body: (isMobile: boolean) => React.ReactNode;
  width: number; // px at desktop
  height: number; // px at desktop
  clipXDesktop: number; // 0-100, % of the wire (desktop)
  clipXMobile: number; // 0-100, % of the wire (mobile)
  clipStringHeight: number; // px from wire to paper top
  rotation: number; // deg
  zIndex: number;
}

const PAPERS: ReadonlyArray<PaperConfig> = [
  {
    id: "location",
    label: "LOCATION",
    tagline: "Where I am & where I studied",
    body: (isMobile) => (
      <div
        className="font-mono leading-snug"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "105px 1fr",
          rowGap: isMobile ? "10px" : "9px",
          columnGap: "12px",
          color: "var(--fg)",
          fontSize: isMobile ? "13px" : "12px",
        }}
      >
        <span
          className="font-bold uppercase tracking-widest"
          style={{ color: "var(--accent)", fontSize: "10px" }}
        >
          Based in
        </span>
        <span className="font-bold">India · Bengaluru · Remote-friendly</span>

        <span
          className="font-bold uppercase tracking-widest"
          style={{ color: "var(--accent)", fontSize: "10px" }}
        >
          Current status
        </span>
        <span className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/unemplyed.png"
            alt="Unemployed"
            width={isMobile ? 22 : 24}
            height={isMobile ? 22 : 24}
            className="status-icon"
            style={{
              width: isMobile ? "22px" : "24px",
              height: isMobile ? "22px" : "24px",
              objectFit: "contain",
            }}
          />
          Unemployed
        </span>

        <span
          className="font-bold uppercase tracking-widest"
          style={{ color: "var(--accent)", fontSize: "10px" }}
        >
          Previous role
        </span>
        <span>
          <span className="font-bold">Software Engineer — Full-Stack</span>
          <br />
          <span style={{ color: "var(--muted-fg)" }}>
            Worked at Roster as a Full-Stack Junior Software Engineer
          </span>
        </span>

        <span
          className="font-bold uppercase tracking-widest"
          style={{ color: "var(--accent)", fontSize: "10px" }}
        >
          Education
        </span>
        <span>
          <span className="font-bold">Bachelor&apos;s in Computer Science</span>
          <br />
          <span style={{ color: "var(--muted-fg)" }}>SRM</span>
        </span>
      </div>
    ),
    width: 540,
    height: 340,
    clipXDesktop: 22,
    clipXMobile: 30,
    clipStringHeight: 36,
    rotation: -0.6,
    zIndex: 30,
  },
  {
    id: "focus",
    label: "FOCUS AREAS",
    tagline: "What I build with day to day",
    body: (isMobile) => (
      <div className="space-y-4">
        <p
          className="font-mono leading-relaxed"
          style={{
            color: "var(--muted-fg)",
            fontSize: isMobile ? "13px" : "14px",
          }}
        >
          Production systems across the stack — from UI down to infrastructure,
          with intelligent AI features built in. Comfortable owning a feature
          end to end.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "AI",
            "LLM & GenAI Applications",
            "RAG & Vector Search",
            "Voice & Speech",
            "AI Evaluation & Safety",
            "Full-Stack Dev",
            "Cloud Infra",
            "Next.js",
            "TypeScript",
            "Docker",
            "Retool",
            "MySQL",
          ].map((t) => (
            <span
              key={t}
              className={`border-2 font-mono font-bold uppercase tracking-wider ${
                isMobile ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[10px]"
              }`}
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
                color: "var(--fg)",
                boxShadow: "2px 2px 0 var(--shadow)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
    width: 660,
    height: 450,
    clipXDesktop: 50,
    clipXMobile: 55,
    clipStringHeight: 30,
    rotation: 0.4,
    zIndex: 20,
  },
  {
    id: "about",
    label: "ABOUT ME",
    tagline: "A short biography",
    body: () => (
      <div
        className="space-y-3 font-mono leading-relaxed"
        style={{ color: "var(--fg)", fontSize: "14px" }}
      >
        <p>
          I&apos;m a software &amp; AI engineer who thrives at the intersection
          of clean code, complex systems, and intelligent products. My work
          spans the full stack — from designing resilient backend architectures
          and crafting responsive, performant frontends, to building
          LLM-powered applications, RAG pipelines, and AI agents that ship to
          real users.
        </p>
        <p style={{ color: "var(--muted-fg)" }}>
          I care deeply about software and AI systems that work reliably in
          production. That means thoughtful system design, solid testing,
          infrastructure that scales without constant firefighting, and
          evaluation pipelines that keep AI features accurate and safe.
        </p>
      </div>
    ),
    width: 780,
    height: 560,
    clipXDesktop: 78,
    clipXMobile: 80,
    clipStringHeight: 42,
    rotation: -0.3,
    zIndex: 10,
  },
];

// Map id → config for O(1) lookup
const PAPER_BY_ID: Record<PaperId, PaperConfig> = PAPERS.reduce(
  (acc, p) => ({ ...acc, [p.id]: p }),
  {} as Record<PaperId, PaperConfig>,
);

// ─── constants ──────────────────────────────────────────────────────────────

const SCROLL_THRESHOLD = 80;
const FALL_DURATION_MS = 1400;
const RELEASE_TO_FALL_DELAY_MS = 150; // clip opens before paper falls
const ARMING_DELAY_MS = 400; // wait before scroll becomes active

// After the third paper finishes falling, hold the fallen state for
// this long before activating Matter.js. The user can scroll the
// page freely during this hold; the papers just sit in their
// fallen pose.
const POST_FALL_HOLD_MS = 10000;

// How long after the timer fires before we start the physics
// return. Tiny breath / pause for the eye to register the hold
// just ended.
const RETURN_START_DELAY_MS = 120;

// ─── main component ─────────────────────────────────────────────────────────

export default function PaperStack() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // ── state machine ───────────────────────────────────────────────────────
  // `stage` mirrors the active paper during the fall (location,
  // focus, about). `sequence` is the higher-level lifecycle state
  // that includes the post-fall hold and physics return.
  // `fallingId` is the paper whose CSS fall animation is currently
  // playing — the only one with `isFalling` true. Once its
  // onAnimationEnd fires, stage advances and fallingId clears.
  const [stage, setStage] = useState<Stage>("location");
  const [sequence, setSequence] = useState<SequenceState>("stacked");
  const [fallingId, setFallingId] = useState<PaperId | null>(null);
  const [fallenIds, setFallenIds] = useState<PaperId[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [interactionReady, setInteractionReady] = useState(false);
  const [dragEnabled, setDragEnabled] = useState(false);
  // Clip-release phase: between advanceLayer() and the paper
  // actually starting to fall, the active clip swings/opens.
  const [clipReleasingId, setClipReleasingId] = useState<PaperId | null>(null);

  // Refs to the DOM elements that the Matter.js controller will
  // drive during the RETURN phase. During FALL, HOLD and STACKED
  // these elements are unchanged (CSS controls them).
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<MatterPhysicsController | null>(null);
  const paperElRefs = useRef<Record<PaperId, HTMLElement | null>>({
    location: null,
    focus: null,
    about: null,
  });
  const stringElRefs = useRef<Record<PaperId, HTMLDivElement | null>>({
    location: null,
    focus: null,
    about: null,
  });
  const anchorPosesRef = useRef<Record<PaperId, FallenPose> | null>(null);
  const interactivePosesRef = useRef<Record<PaperId, FallenPose> | null>(null);
  const dragRef = useRef<{
    id: PaperId;
    pointerId: number;
  } | null>(null);

  // Scroll lock + accumulator
  const scrollAccumulator = useRef(0);

  // 10-second hold timer (only set when sequence transitions to
  // "holding").
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Brief pause after the timer fires before Matter.js starts.
  const returnStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  // RAF for polling `allSettled` so we know when to dispose the
  // controller and snap back to STACKED.
  const settleCheckRafRef = useRef<number | null>(null);

  // Ref-stored reference to the latest startReturn. The hold-timer
  // effect calls `startReturnRef.current?.()` to always invoke the
  // newest closure (avoids stale closure bugs).
  const startReturnRef = useRef<(() => void) | null>(null);

  // ── reduced motion ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const getPaperAngle = (element: HTMLElement) => {
    const transform = window.getComputedStyle(element).transform;
    // 2D form: matrix(a, b, c, d, e, f). The rotation is encoded in
    // the upper-left 2x2 submatrix.
    let match = transform.match(/^matrix\(([^)]+)\)$/);
    if (match) {
      const [a, b] = match[1]
        .split(",")
        .map((value) => parseFloat(value.trim()));
      return Number.isFinite(a) && Number.isFinite(b) ? Math.atan2(b, a) : 0;
    }
    // 3D form: matrix3d(a1, b1, 0, 0, a2, b2, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1).
    // Browsers serialize translate3d(...) and rotate(...) transforms as
    // matrix3d, with the rotation again in the first two columns.
    match = transform.match(/^matrix3d\(([^)]+)\)$/);
    if (match) {
      const parts = match[1]
        .split(",")
        .map((value) => parseFloat(value.trim()));
      const a = parts[0];
      const b = parts[1];
      return Number.isFinite(a) && Number.isFinite(b) ? Math.atan2(b, a) : 0;
    }
    return 0;
  };

  const captureAnchors = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const sceneRect = scene.getBoundingClientRect();
    const anchors = {} as Record<PaperId, FallenPose>;

    for (const paper of PAPERS) {
      const article = paperElRefs.current[paper.id];
      if (!article) return;
      const rect = article.getBoundingClientRect();
      anchors[paper.id] = {
        x: rect.left + rect.width / 2 - sceneRect.left,
        y: rect.top + rect.height / 2 - sceneRect.top,
        angle: getPaperAngle(article),
        width: rect.width,
        height: rect.height,
      };
    }
    anchorPosesRef.current = anchors;
  }, []);

  const applyPaperPose = useCallback((paper: PaperConfig, pose: FallenPose) => {
    const article = paperElRefs.current[paper.id];
    const anchor = anchorPosesRef.current?.[paper.id];
    const string = stringElRefs.current[paper.id];
    const scene = sceneRef.current;
    if (!article || !anchor) return;
    const x = pose.x - anchor.x;
    const y = pose.y - anchor.y;
    article.style.animation = "none";
    article.style.opacity = "1";
    article.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${(
      (pose.angle * 180) /
      Math.PI
    ).toFixed(3)}deg)`;

    // The paper remains visually connected to its clip while it returns.
    // Stretch and rotate the existing string toward the paper's top centre,
    // making the motion read as a suspended curtain rather than a floating card.
    if (string && scene) {
      const sceneRect = scene.getBoundingClientRect();
      const stringRect = string.getBoundingClientRect();
      const stringTopY = stringRect.top - sceneRect.top;
      const paperTopY = pose.y - pose.height / 2;
      const deltaY = paperTopY - stringTopY;
      const deltaX = pose.x - (stringRect.left + stringRect.width / 2 - sceneRect.left);
      const length = Math.max(12, Math.hypot(deltaX, deltaY));
      const angle = Math.atan2(deltaX, deltaY) * (180 / Math.PI);
      string.style.height = `${length.toFixed(2)}px`;
      string.style.transformOrigin = "top center";
      string.style.transform = `rotate(${angle.toFixed(3)}deg)`;
    }
  }, []);

  const captureInteractivePoses = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene || !anchorPosesRef.current) return;
    const sceneRect = scene.getBoundingClientRect();
    const poses = {} as Record<PaperId, FallenPose>;

    for (const paper of PAPERS) {
      const article = paperElRefs.current[paper.id];
      if (!article) return;
      const rect = article.getBoundingClientRect();
      poses[paper.id] = {
        x: rect.left + rect.width / 2 - sceneRect.left,
        y: rect.top + rect.height / 2 - sceneRect.top,
        angle: getPaperAngle(article),
        width: rect.width,
        height: rect.height,
      };
    }
    interactivePosesRef.current = poses;
    for (const paper of PAPERS) applyPaperPose(paper, poses[paper.id]);
  }, [applyPaperPose]);

  useEffect(() => {
    if (sequence !== "stacked") return;
    const timer = setTimeout(captureAnchors, reducedMotion ? 0 : 800);
    return () => clearTimeout(timer);
  }, [captureAnchors, isMobile, reducedMotion, sequence]);

  const onPaperPointerDown = useCallback(
    (id: PaperId, event: ReactPointerEvent<HTMLElement>) => {
      const scene = sceneRef.current;
      const controller = controllerRef.current;
      if (!dragEnabled || sequence !== "returning" || !scene || !controller) return;
      const article = event.currentTarget;
      article.setPointerCapture(event.pointerId);
      event.preventDefault();
      const sceneRect = scene.getBoundingClientRect();
      controller.beginDrag(id, {
        x: event.clientX - sceneRect.left,
        y: event.clientY - sceneRect.top,
      });
      dragRef.current = {
        id,
        pointerId: event.pointerId,
      };
    },
    [dragEnabled, sequence],
  );

  useEffect(() => {
    const stopDrag = () => {
      controllerRef.current?.endDrag();
      dragRef.current = null;
    };
    const movePaper = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const scene = sceneRef.current;
      if (!scene) return;
      const sceneRect = scene.getBoundingClientRect();
      controllerRef.current?.updateDrag({
        x: event.clientX - sceneRect.left,
        y: event.clientY - sceneRect.top,
      });
    };
    window.addEventListener("pointermove", movePaper);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
    return () => {
      window.removeEventListener("pointermove", movePaper);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };
  }, []);

  // ── shared advance function (click + scroll + touch) ────────────────────
  const advanceLayer = useCallback(() => {
    if (isAnimating) return;
    if (stage !== "location" && stage !== "focus" && stage !== "about") return;
    const idx = STAGE_TO_INDEX[stage];
    const id = PAPERS[idx].id;
    setIsAnimating(true);
    setSequence((s) => (s === "stacked" ? "falling" : s));
    setClipReleasingId(id);
    setTimeout(() => {
      setClipReleasingId(null);
      // The paper-fall CSS keyframe starts now. Mark the paper
      // as the actively-falling one so the article re-renders
      // with the animation and the render filter knows to mount
      // it (if it wasn't already).
      setFallingId(id);
    }, RELEASE_TO_FALL_DELAY_MS);
  }, [stage, isAnimating]);

  // ── animation end → unlock + advance state ──────────────────────────────
  const handlePaperAnimationEnd = useCallback(
    (id: PaperId) => {
      if (fallingId !== id) return;
      setFallenIds((current) =>
        current.includes(id) ? current : [...current, id],
      );
      setFallingId(null);
      setIsAnimating(false);
      setStage((current) => {
        const idx = STAGE_TO_INDEX[current as Exclude<Stage, "complete">] ?? -1;
        if (idx >= 0 && idx < PAPER_STAGES.length - 1) {
          scrollAccumulator.current = 0;
          const nextIdx = idx + 1;
          if (nextIdx === 1) setSequence("one-down");
          if (nextIdx === 2) setSequence("two-down");
          return PAPER_STAGES[nextIdx];
        }
        // Third paper fell. Mark the sequence complete and start
        // the 10-second hold. Matter.js does NOT run yet.
        setSequence("all-three-down");
        return "complete";
      });
    },
    [fallingId],
  );

  // NOTE: there is no document.body.style.overflow lock here. The
  // page remains a normally scrollable webpage at all times.
  // Scroll input is captured only by the wheel + touchmove
  // listeners below (which call event.preventDefault() while the
  // 3-paper sequence is active). Once the third paper falls and
  // stage === "complete", the listeners no longer absorb input
  // and the page scrolls naturally down to the Aristotle plate.

  // ── wheel handler ───────────────────────────────────────────────────────
  useEffect(() => {
    const node = sceneRef.current;
    if (!node) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0) return;
      if (!interactionReady) return;
      if (isAnimating) return;
      if (stage !== "location" && stage !== "focus" && stage !== "about") return;
      // Capture scroll input while the 3-paper sequence is active.
      event.preventDefault();
      scrollAccumulator.current += event.deltaY;
      if (scrollAccumulator.current >= SCROLL_THRESHOLD) {
        scrollAccumulator.current = 0;
        advanceLayer();
      }
    };

    const section = node.closest("section");
    const target = section ?? node;
    target.addEventListener("wheel", handleWheel, { passive: false });
    return () => target.removeEventListener("wheel", handleWheel);
  }, [isAnimating, stage, advanceLayer, interactionReady]);

  // ── touch handler (mobile) ──────────────────────────────────────────────
  useEffect(() => {
    const node = sceneRef.current;
    if (!node) return;
    const section = node.closest("section");
    const target = section ?? node;
    let lastY: number | null = null;

    const canAdvance = () =>
      interactionReady &&
      !isAnimating &&
      (stage === "location" || stage === "focus" || stage === "about");

    const onTouchStart = (event: ReactTouchEvent<HTMLElement> | TouchEvent) => {
      const t = "touches" in event ? event.touches[0] : null;
      if (t) lastY = t.clientY;
    };
    const onTouchMove = (event: ReactTouchEvent<HTMLElement> | TouchEvent) => {
      if (lastY === null) return;
      const t = "touches" in event ? event.touches[0] : null;
      if (!t) return;
      const y = t.clientY;
      const deltaY = lastY - y;
      lastY = y;
      if (deltaY <= 0) return;
      if (!canAdvance()) return;
      event.preventDefault();
      scrollAccumulator.current += deltaY;
      if (scrollAccumulator.current >= SCROLL_THRESHOLD) {
        scrollAccumulator.current = 0;
        advanceLayer();
      }
    };

    const ts = onTouchStart as EventListener;
    const tm = onTouchMove as EventListener;
    target.addEventListener("touchstart", ts, { passive: true });
    target.addEventListener("touchmove", tm, { passive: false });
    return () => {
      target.removeEventListener("touchstart", ts);
      target.removeEventListener("touchmove", tm);
    };
  }, [interactionReady, isAnimating, stage, advanceLayer]);

  // ── arming: when the section enters the viewport, wait before accepting ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = sceneRef.current;
    if (!node) return;
    const section = node.closest("section");
    const target = section ?? node;
    if (typeof IntersectionObserver === "undefined") {
      setInteractionReady(true);
      return;
    }
    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      scrollAccumulator.current = 0;
      setTimeout(() => setInteractionReady(true), ARMING_DELAY_MS);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            arm();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  // ── all-three-down → 10-second hold → activate Matter.js ────────────────
  // This is the ONLY place Matter.js is instantiated. Guards:
  //   - sequence MUST be "all-three-down"
  //   - the third paper's fall has fully completed
  //   - tenSecondTimerComplete (i.e. the setTimeout fired)
  //   - RETURNING hasn't already started
  useEffect(() => {
    if (sequence !== "all-three-down") return;
    setInteractionReady(false);
    captureInteractivePoses();
    setDragEnabled(false);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      // Begin the physics return. Brief breath, then start.
      if (returnStartTimerRef.current) clearTimeout(returnStartTimerRef.current);
      returnStartTimerRef.current = setTimeout(() => {
        startReturnRef.current?.();
      }, RETURN_START_DELAY_MS);
    }, POST_FALL_HOLD_MS);
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      if (returnStartTimerRef.current) {
        clearTimeout(returnStartTimerRef.current);
        returnStartTimerRef.current = null;
      }
    };
  }, [captureInteractivePoses, reducedMotion, sequence]);

  // ── physics-return start: snapshot fallen poses, build Matter.js bodies,
  //    drive DOM from them every frame, and dispose when settled.
  const startReturn = useCallback(() => {
    if (controllerRef.current) {
      // Already running — guard against double-starts.
      return;
    }
    if (typeof window === "undefined") return;
    const scene = sceneRef.current;
    if (!scene) return;
    setDragEnabled(false);
    dragRef.current = null;

    // Snapshot each paper's CURRENT visible position (its fallen
    // pose, which was held by the CSS `forwards` fill). The
    // visible top-left of the article is at the article's
    // bounding rect; the body's centre is at
    // (rect.left + w/2, rect.top + h/2) in *viewport* coords. We
    // need scene-local coords, so subtract the scene's bounding
    // rect.
    const sceneRect = scene.getBoundingClientRect();
    const fallens: Record<PaperId, FallenPose> = {
      location: { x: 0, y: 0, angle: 0, width: 0, height: 0 },
      focus: { x: 0, y: 0, angle: 0, width: 0, height: 0 },
      about: { x: 0, y: 0, angle: 0, width: 0, height: 0 },
    };
    const anchors: Record<PaperId, FallenPose> = {
      location: { x: 0, y: 0, angle: 0, width: 0, height: 0 },
      focus: { x: 0, y: 0, angle: 0, width: 0, height: 0 },
      about: { x: 0, y: 0, angle: 0, width: 0, height: 0 },
    };

    for (const paper of PAPERS) {
      const article = paperElRefs.current[paper.id];
      const interactivePose = interactivePosesRef.current?.[paper.id];
      if (!article) continue;
      const r = article.getBoundingClientRect();
      const cx = interactivePose?.x ?? r.left + r.width / 2 - sceneRect.left;
      const cy = interactivePose?.y ?? r.top + r.height / 2 - sceneRect.top;
      // Read the actual current transform on the article. The
      // CSS paper-fall-N keyframe leaves the paper at e.g.
      // -38deg / +32deg / -26deg with a 110vh translateY. We
      // parse the matrix() string back to a real angle in
      // radians. This is the "fallen" pose. If parsing fails
      // we fall back to the paper's STACKED rotation, which
      // is wrong but at least keeps the simulation running.
      let fallenAngle = interactivePose?.angle ?? (paper.rotation * Math.PI) / 180;
      const transform = window.getComputedStyle(article).transform;
      if (transform && transform !== "none") {
        const m = transform.match(/^matrix\(([^)]+)\)$/);
        if (m) {
          const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
          if (parts.length === 6) {
            const [a, b] = parts;
            fallenAngle = Math.atan2(b, a);
          }
        }
      }
      fallens[paper.id] = {
        x: cx,
        y: cy,
        angle: fallenAngle,
        width: paper.width,
        height: paper.height,
      };
      // Anchor: where the paper should rest at the end of the
      // return. Same x as the wire clip; y just below the wire
      // by clipStringHeight + paper.height/2 (so the top of the
      // paper is at the same place as the initial STACKED state).
      // The anchor angle is the paper's STACKED rotation, so
      // the body rotates from the fallen angle back to this.
      anchors[paper.id] = anchorPosesRef.current?.[paper.id] ?? {
        x: (isMobile ? paper.clipXMobile : paper.clipXDesktop) / 100 * sceneRect.width,
        y: paper.clipStringHeight + paper.height / 2,
        angle: (paper.rotation * Math.PI) / 180,
        width: paper.width,
        height: paper.height,
      };
    }

    // Build the controller. Full matter-js gravity (1.0) works
    // because the spring is stiff enough (k=0.015) to overcome
    // gravity and actually pull the body all the way to the
    // anchor within ~1s. The previous tuning (k=0.003, g=0.05)
    // needed reduced gravity to avoid the body settling in
    // equilibrium below the anchor; the new tuning does not.
    const controller = new MatterPhysicsController({
      gravity: reducedMotion ? 0 : 1.0,
      onStep: () => {
        // Sync the DOM every frame from the bodies. Only
        // happens during RETURNING.
        for (const paper of PAPERS) {
          const t = controller.getTransform(paper.id);
          if (!t) continue;
          const article = paperElRefs.current[paper.id];
          if (!article) continue;
          // Override the CSS animation's transform. The article's
          // top-left in scene-local coords is
          //   (body.x - w/2, body.y - h/2).
          applyPaperPose(paper, {
            x: t.x,
            y: t.y,
            angle: t.angle,
            width: paper.width,
            height: paper.height,
          });
        }
      },
    });
    controllerRef.current = controller;
    for (const paper of PAPERS) {
      const f = fallens[paper.id];
      const a = anchors[paper.id];
      controller.addPaper(paper.id, {
        fallen: f,
        anchor: a,
      });
    }
    setSequence("returning");
    setDragEnabled(!reducedMotion);
    controller.start();

    // Poll `allSettled` so we know when to dispose the controller
    // and snap the papers back to STACKED.
    const settleCheck = () => {
      if (!controllerRef.current) return;
      if (controllerRef.current.allSettled(2.0)) {
        // Snap and dispose.
        const final = controllerRef.current.snapAllAndDispose();
        // Apply the final snap to the DOM with the correct
        // anchor rotation (the controller's anchor rotation
        // is preserved in `anchors`).
        for (const paper of PAPERS) {
          const article = paperElRefs.current[paper.id];
          if (!article) continue;
          const a = anchors[paper.id];
          const f = final.get(paper.id);
          if (!f) continue;
          applyPaperPose(paper, a);
        }
        controllerRef.current = null;
        setSequence("settled");
        setDragEnabled(false);
        // Briefly hold "settled", then re-arm the STACKED state
        // and re-enable interaction so the cycle can repeat.
        setTimeout(() => {
          for (const paper of PAPERS) {
            const article = paperElRefs.current[paper.id];
            const string = stringElRefs.current[paper.id];
            if (!article) continue;
            article.style.animation = "";
            article.style.opacity = "";
            article.style.transform = "";
            if (string) {
              string.style.height = "";
              string.style.transform = "";
              string.style.transformOrigin = "";
            }
          }
          interactivePosesRef.current = null;
          setFallenIds([]);
          setSequence("stacked");
          setStage("location");
          setIsAnimating(false);
          setInteractionReady(true);
        }, 400);
        return;
      }
      settleCheckRafRef.current = requestAnimationFrame(settleCheck);
    };
    settleCheckRafRef.current = requestAnimationFrame(settleCheck);
  }, [applyPaperPose, isMobile, reducedMotion]);

  // Keep the ref in sync with the latest startReturn closure so
  // the hold-timer effect (which only depends on `sequence`) can
  // call the most recent version without going stale.
  useEffect(() => {
    startReturnRef.current = startReturn;
  }, [startReturn]);

  // ── keyboard handler ────────────────────────────────────────────────────
  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    paperIdx: PaperStageIndex,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (stage !== PAPER_STAGES[paperIdx]) return;
      if (isAnimating) return;
      advanceLayer();
    }
  };

  // Stages: 0=location, 1=focus, 2=about are paper stages; 3=complete
  // (sequence finished, lock released, user can scroll down to
  // Aristotle). During the physics-return phase, the papers stay
  // in the DOM so the controller can drive their transforms.
  const showPapers =
    stage === "location" ||
    stage === "focus" ||
    stage === "about" ||
    sequence === "all-three-down" ||
    sequence === "holding" ||
    sequence === "returning" ||
    sequence === "settled";

  // Live region message
  const liveMessage = useMemo(() => {
    if (sequence === "returning")
      return "Papers returning with physics.";
    if (sequence === "holding") return "Holding for restack.";
    if (sequence === "all-three-down") return "All three papers down.";
    if (sequence === "falling" && stage !== "complete")
      return `${PAPER_BY_ID[stage as Exclude<Stage, "complete">].label} paper falling.`;
    if (clipReleasingId !== null)
      return `${PAPER_BY_ID[clipReleasingId].label} paper releasing.`;
    if (sequence === "settled") return "Stack restored.";
    if (stage === "complete") return "Sequence complete. Scroll down to continue.";
    if (stage === "location" || stage === "focus" || stage === "about") {
      return `${PAPER_BY_ID[stage].label} clip is active.`;
    }
    return "";
  }, [clipReleasingId, stage, sequence]);

  // ── cleanup: cancel timers, stop controller, remove listeners ──────────
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (returnStartTimerRef.current) clearTimeout(returnStartTimerRef.current);
      if (settleCheckRafRef.current) cancelAnimationFrame(settleCheckRafRef.current);
      if (controllerRef.current) {
        controllerRef.current.stop();
        controllerRef.current = null;
      }
    };
  }, []);

  return (
    <section
      id="about"
      aria-label="About me — interactive paper stack. Scroll downward or click the active clip to advance."
      className="relative w-full overflow-hidden"
      style={{
        paddingTop: "120px",
        paddingBottom: isMobile ? "80px" : "120px",
        minHeight: isMobile ? "auto" : "min(150vh, 1500px)",
      }}
    >
      {/* Heading */}
      <div className="mx-auto mb-12 max-w-4xl px-6 text-center">
        <h2
          className="font-display text-3xl font-bold uppercase sm:text-4xl"
          style={{ color: "var(--fg)" }}
        >
          <ScrambleText text="About Me" duration={1000} />
        </h2>
        <div
          className="neo-border mx-auto mt-3 inline-block h-1 w-16"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <p
          className="mx-auto mt-4 max-w-md font-mono uppercase tracking-widest"
          style={{ color: "var(--muted-fg)", fontSize: isMobile ? "11px" : "12px" }}
        >
          {sequence === "returning"
            ? "Restacking the archive…"
            : sequence === "holding"
            ? "Settling the papers…"
            : sequence === "all-three-down"
            ? "All three down · holding…"
            : stage === "complete"
            ? "Scroll down to continue ↓"
            : isAnimating
            ? "Releasing…"
            : isMobile
            ? "Swipe down or tap the active clip ↓"
            : "Scroll down or click the active clip ↓"}
        </p>
      </div>

      {/* Live region */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>

      {/*
        The scene is a stacking context. Inside it (from back to front):
          1. Aristotle plate (z-index 5)   — present from frame 1, full
             page height, positioned at the top just below the wire.
          2. Wire SVG     (z-index 10)
          3. Three paper assemblies (z-index 10/20/30, set per-paper)
             — physically cover the Aristotle plate; once they fall, the
             plate is revealed.
      */}
      <div
        ref={sceneRef}
        className="relative mx-auto"
        style={{
          maxWidth: "1200px",
          minHeight: isMobile ? "min(135vh, 1250px)" : "min(140vh, 1250px)",
          paddingBottom: isMobile ? "60px" : 0,
        }}
      >
        {/* ── ARISTOTLE PLATE — BACK LAYER ── */}
        <div
          aria-hidden="false"
          className="absolute left-0 right-0"
          style={{ top: "60px", zIndex: 5, pointerEvents: "none" }}
        >
          <div className="relative mx-auto" style={{ maxWidth: "1200px" }}>
            <AristotleSection />
          </div>
        </div>

        {/* ── WIRE SVG ── */}
        <svg
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 z-10 h-[40px] w-full"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          style={{ pointerEvents: "none" }}
        >
          <line
            x1="0"
            y1="0"
            x2="1200"
            y2="0"
            stroke="#171411"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="6" fill="#1a1612" stroke="#000" strokeWidth={0.5} />
          <circle cx="1200" cy="0" r="6" fill="#1a1612" stroke="#000" strokeWidth={0.5} />
        </svg>

        {/* ── PAPER ASSEMBLIES ── */}
        {showPapers &&
          PAPERS.map((paper, idx) => {
            const paperIdx = idx as PaperStageIndex;
            return (
              <PaperAssembly
                key={paper.id}
                paper={paper}
                paperIdx={paperIdx}
                stage={stage}
                isMobile={isMobile}
                clipReleasingId={clipReleasingId}
                isAnimating={isAnimating}
                reducedMotion={reducedMotion}
                fallingId={fallingId}
                isFallen={fallenIds.includes(paper.id)}
                dragEnabled={dragEnabled}
                paperElRef={(el) => {
                  paperElRefs.current[paper.id] = el;
                }}
                stringElRef={(el) => {
                  stringElRefs.current[paper.id] = el;
                }}
                onAdvance={advanceLayer}
                onKeyDown={onKeyDown}
                onAnimationEnd={handlePaperAnimationEnd}
                onPaperPointerDown={onPaperPointerDown}
                isPhysicsDriven={
                  sequence === "returning" || sequence === "settled"
                }
              />
            );
          })}
      </div>

      {/* Dev-only reset (disabled — was a debugging affordance for the
          interactive 3-paper scene; production visitors never saw it
          but it isn't doing useful work any more, so it's gone.) */}
    </section>
  );
}

// ─── PaperAssembly: one paper + its clip + its string (independent DOM) ──────

interface PaperAssemblyProps {
  paper: PaperConfig;
  paperIdx: PaperStageIndex;
  stage: Stage;
  isMobile: boolean;
  clipReleasingId: PaperId | null;
  isAnimating: boolean;
  reducedMotion: boolean;
  fallingId: PaperId | null;
  isFallen: boolean;
  dragEnabled: boolean;
  paperElRef: (el: HTMLElement | null) => void;
  stringElRef: (el: HTMLDivElement | null) => void;
  isPhysicsDriven: boolean;
  onAdvance: () => void;
  onKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    paperIdx: PaperStageIndex,
  ) => void;
  onAnimationEnd: (id: PaperId) => void;
  onPaperPointerDown: (
    id: PaperId,
    event: ReactPointerEvent<HTMLElement>,
  ) => void;
}

function PaperAssembly({
  paper,
  paperIdx,
  stage,
  isMobile,
  clipReleasingId,
  isAnimating,
  reducedMotion,
  fallingId,
  isFallen,
  dragEnabled,
  paperElRef,
  stringElRef,
  isPhysicsDriven,
  onAdvance,
  onKeyDown,
  onAnimationEnd,
  onPaperPointerDown,
}: PaperAssemblyProps) {
  const currentPaperStage = PAPER_STAGES[paperIdx];
  const isCurrent = stage === currentPaperStage;
  // `isFalling` is the strict source of truth for which paper
  // the CSS paper-fall-N keyframe is bound to. It is true ONLY
  // for the paper whose clip has just been released; the moment
  // onAnimationEnd fires, the parent clears `fallingId` and this
  // paper's animation will be the CSS `forwards` fill of the
  // keyframe's 100% frame.
  const isFalling = fallingId === paper.id;
  // While the restack is in progress (all-three-down, holding,
  // returning, settled), no paper is "active" for the user to
  // click — the sequence is done. Treat every paper as
  // non-clickable and non-current.
  const isLocked = !isCurrent || isPhysicsDriven;
  const isClipReleasing = clipReleasingId === paper.id;
  // `dragEnabled` is only true during the physics-return phase, and
  // the paper article should be interactive exactly during that phase.
  // The previous `!isPhysicsDriven` guard cancelled `canDrag` to false
  // for the entire returning window, which made the article
  // `pointer-events: none` and `cursor: default` — so the user could
  // never grab the paper even though the spec required it. The clip
  // button has its own `isLocked` rule (line 1190-ish) so the clip
  // stays unclickable during the return; we don't need to share that
  // gate with the drag target.
  const canDrag = dragEnabled;

  const clipXPct = isMobile ? paper.clipXMobile : paper.clipXDesktop;
  const articleMaxWidth = isMobile
    ? `min(${paper.width}px, calc(100vw - 24px))`
    : `${paper.width}px`;

  const handleClick = () => {
    if (isCurrent && !isAnimating) onAdvance();
  };

  return (
    <div
      className="absolute top-0"
      style={{
        left: `${clipXPct}%`,
        transform: "translateX(-50%)",
        zIndex: paper.zIndex,
        pointerEvents: canDrag || !isLocked ? "auto" : "none",
        width: `${paper.width}px`,
        maxWidth: isMobile ? "calc(100vw - 24px)" : "92vw",
      }}
    >
      {/* CLIP — sits at the top, on the wire */}
      <button
        type="button"
        aria-label={`Release ${paper.label} paper`}
        aria-disabled={!isCurrent}
        disabled={!isCurrent}
        onClick={handleClick}
        onKeyDown={(e) => onKeyDown(e, paperIdx)}
        className="relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          width: "44px",
          height: "60px",
          margin: "0 auto",
          opacity: isLocked ? 0.3 : 1,
          cursor: isCurrent ? "pointer" : isLocked ? "not-allowed" : "default",
          filter: isLocked ? "grayscale(0.6)" : "none",
          transition: "opacity 0.3s ease, filter 0.3s ease",
          ["--tw-ring-color" as string]: "var(--accent)",
          ["--tw-ring-offset-color" as string]: "var(--bg)",
          animation:
            isClipReleasing && !isPhysicsDriven
              ? `clip-open 0.4s ease forwards`
              : undefined,
        }}
      >
        <BinderClipSVG />
      </button>

      {/* CLIP LABEL */}
      <div
        className="mt-1 text-center font-mono font-bold uppercase tracking-widest"
        style={{
          color: isCurrent ? "var(--accent)" : "var(--muted-fg)",
          whiteSpace: "nowrap",
          fontSize: isMobile ? "9px" : "9px",
        }}
      >
        {paper.label}
      </div>

      {/* STRING — vertical line from clip to paper */}
      <div
        ref={stringElRef}
        aria-hidden="true"
        className="mx-auto"
        style={{
          width: "1px",
          height: `${paper.clipStringHeight}px`,
          background: "linear-gradient(to bottom, #171411 0%, rgba(23,20,17,0.4) 100%)",
          opacity: isLocked ? 0.3 : 0.7,
        }}
      />

      {/* PAPER — its own absolute element with its own transform.
          During the FALL phase we use the existing CSS keyframes
          (paper-fall-N). During the RETURN phase the parent
          component drives `style.transform` directly and disables
          the animation. */}
      <article
        ref={paperElRef as React.Ref<HTMLElement>}
        data-paper-id={paper.id}
        className={`paper-ruled relative ${
          isFallen && !isPhysicsDriven ? `paper-fallen-${paperIdx + 1}` : ""
        }`}
        onAnimationEnd={(e) => {
          const name = (e as ReactAnimationEvent<HTMLElement>).animationName;
          if (name.startsWith("paper-fall-")) {
            onAnimationEnd(paper.id);
          }
        }}
        style={{
          width: `${paper.width}px`,
          maxWidth: articleMaxWidth,
          minHeight: `${paper.height}px`,
          marginTop: "0",
          backgroundColor: "#F2E4CF",
          border: "1.5px solid #171411",
          borderRadius: "2px",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.15), 0 12px 24px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.3)",
          padding: isMobile
            ? paper.id === "location"
              ? "18px 20px"
              : "22px 24px"
            : paper.id === "location"
            ? "22px 26px"
            : "28px 32px",
          transform: isPhysicsDriven || isFallen
            ? undefined
            : `rotate(${paper.rotation}deg) translateY(0)`,
          transformOrigin: "top center",
          animation: (() => {
            if (isPhysicsDriven) return undefined;
            if (isClipReleasing) return undefined;
            if (isFallen) return "none";
            if (isFalling) {
              return reducedMotion
                ? `paper-fall-${paperIdx + 1} 0.3s ease forwards`
                : `paper-fall-${paperIdx + 1} ${FALL_DURATION_MS}ms cubic-bezier(0.5, 0, 0.7, 1) forwards`;
            }
            return reducedMotion
              ? undefined
              : `paper-settle-${paperIdx + 1} 0.6s ease ${paperIdx * 0.1}s both`;
          })(),
          pointerEvents: canDrag || !isLocked ? "auto" : "none",
          cursor: canDrag ? "grab" : undefined,
          touchAction: canDrag ? "none" : undefined,
        }}
        onPointerDown={(event) => onPaperPointerDown(paper.id, event)}
      >
        {/* Tape strip */}
        <div
          aria-hidden="true"
          className="absolute -top-3 left-1/2"
          style={{
            width: "70px",
            height: "18px",
            background: "rgba(216, 169, 107, 0.55)",
            border: "1px solid rgba(23,20,17,0.2)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            transform: `translateX(-50%) rotate(${paper.rotation * 2}deg)`,
          }}
        />

        {/* Header */}
        <header className="mb-4 flex items-center justify-between border-b-2 border-dashed pb-2" style={{ borderColor: "rgba(23,20,17,0.25)" }}>
          <h3 className="font-mono font-bold uppercase tracking-[0.2em]" style={{ color: "var(--ink)", fontSize: "14px" }}>
            {paper.label}
          </h3>
          <span className="font-mono uppercase tracking-widest" style={{ color: "var(--muted-fg)", fontSize: "9px" }}>
            N° 0{paperIdx + 1}
          </span>
        </header>

        {/* Tagline */}
        <p className="mb-4 font-mono uppercase tracking-wider" style={{ color: "var(--muted-fg)", fontSize: "11px" }}>
          {paper.tagline}
        </p>

        {/* Body */}
        <div>{paper.body(isMobile)}</div>
      </article>
    </div>
  );
}

// ─── inline SVG binder clip ─────────────────────────────────────────────────

function BinderClipSVG() {
  return (
    <svg
      viewBox="0 0 44 60"
      width="44"
      height="60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path
        d="M 6 8 Q 6 4 11 4 L 33 4 Q 38 4 38 8 L 38 18"
        fill="none"
        stroke="#bfc4c8"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 6 8 Q 6 4 11 4 L 33 4 Q 38 4 38 8 L 38 18"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      <rect x="6" y="14" width="32" height="22" rx="2" fill="#1a1612" stroke="#000" strokeWidth="0.6" />
      <rect x="9" y="17" width="26" height="2" rx="1" fill="#3a342e" opacity="0.7" />
      <path d="M 8 36 L 36 36 L 34 50 L 10 50 Z" fill="#0d0b09" stroke="#000" strokeWidth="0.6" />
      <path d="M 10 38 L 34 38 L 33 41 L 11 41 Z" fill="#2a2520" opacity="0.8" />
      <circle cx="11" cy="25" r="1.6" fill="#4a4540" />
      <circle cx="33" cy="25" r="1.6" fill="#4a4540" />
      <ellipse cx="22" cy="58" rx="14" ry="1.5" fill="rgba(0,0,0,0.25)" />
    </svg>
  );
}
