"use client";

import { useEffect, useRef, useState } from "react";

interface ScrambleTextProps {
  /** Final text to reveal. */
  text: string;
  /** Character pool used for the gibberish frame. */
  chars?: string;
  /** Total reveal duration, in ms. Default 900. */
  duration?: number;
  /** How often the random frame refreshes, in ms. Default 35. */
  frameInterval?: number;
  /** When true, scramble once when the element scrolls into view. */
  replayOnView?: boolean;
  /** Delay before the first run, in ms. Default 0. */
  delay?: number;
  /**
   * When true (default), the scramble loops continuously while the
   * cursor is over the text. On pointerleave the loop stops and the
   * text settles to its final form.
   */
  hoverLoop?: boolean;
  /**
   * Time to wait between scramble cycles while hovering, in ms.
   * Default 1400. Set to 0 for no pause between cycles.
   */
  hoverLoopPause?: number;
  /** Optional className applied to the wrapper span. */
  className?: string;
}

const DEFAULT_CHARS = "!@#$%^&*()_+-=[]{}|;:'\",.<>/?`~\\";

/**
 * Drop-in span that renders `text` as scrambled gibberish and then
 * "decodes" it left-to-right into the final string. Used as a
 * decorative deciphering effect for section / card headings.
 *
 * Behavior:
 *  - On first scroll into view, runs once.
 *  - On hover, runs in a continuous loop until the cursor leaves.
 *  - Honors `prefers-reduced-motion: reduce` (shows the final text
 *    immediately, no animation).
 */
export default function ScrambleText({
  text,
  chars = DEFAULT_CHARS,
  duration = 900,
  frameInterval = 35,
  replayOnView = true,
  delay = 0,
  hoverLoop = true,
  hoverLoopPause = 1400,
  className,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement | null>(null);

  // Pending frame-timer id from the active tick loop.
  const tickTimerRef = useRef<number | null>(null);
  // Pending pause-timer id between hover cycles.
  const pauseTimerRef = useRef<number | null>(null);
  // Set to true while a hover session is in progress — checked inside
  // the cycle-finish callback to decide whether to start the next run.
  const hoveringRef = useRef(false);
  // Whether the initial on-view reveal has already played.
  const hasPlayedViewRef = useRef(false);

  // ── helpers ────────────────────────────────────────────────────────
  const clearTimers = () => {
    if (tickTimerRef.current != null) {
      window.clearTimeout(tickTimerRef.current);
      tickTimerRef.current = null;
    }
    if (pauseTimerRef.current != null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  };

  const prefersReducedMotion = () => {
    if (typeof window === "undefined") return false;
    return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  };

  // Build a fresh "all gibberish" buffer the same length as the target.
  const randomFrame = () => {
    let out = "";
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === " ") {
        out += " ";
      } else if (/[^\w]/.test(c)) {
        out += c;
      } else {
        out += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    return out;
  };

  // Run one decode cycle. `onComplete` fires after the cycle finishes
  // (only used by the hover loop to chain into the next cycle).
  const runOnce = (onComplete?: () => void) => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      onComplete?.();
      return;
    }

    clearTimers();

    const start = performance.now() + delay;

    const tick = () => {
      const elapsed = performance.now() - start;
      if (elapsed < 0) {
        tickTimerRef.current = window.setTimeout(tick, -elapsed);
        return;
      }
      const progress = Math.min(1, elapsed / duration);
      const resolvedCount = Math.floor(progress * text.length);

      let frame = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (i < resolvedCount) {
          frame += c;
        } else if (c === " " || /[^\w]/.test(c)) {
          frame += c;
        } else {
          frame += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplay(frame);

      if (progress < 1) {
        tickTimerRef.current = window.setTimeout(tick, frameInterval);
      } else {
        setDisplay(text);
        tickTimerRef.current = null;
        onComplete?.();
      }
    };

    setDisplay(randomFrame());
    tick();
  };

  // ── hover loop ─────────────────────────────────────────────────────
  const startHoverLoop = () => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }
    hoveringRef.current = true;
    const cycle = () => {
      // Bail out if the user has already left.
      if (!hoveringRef.current) return;
      runOnce(() => {
        // After a cycle finishes, hold the final text for `hoverLoopPause`
        // ms, then re-scramble — but only if the user is still hovering.
        if (!hoveringRef.current) return;
        if (hoverLoopPause <= 0) {
          cycle();
        } else {
          pauseTimerRef.current = window.setTimeout(cycle, hoverLoopPause);
        }
      });
    };
    cycle();
  };

  const stopHoverLoop = () => {
    hoveringRef.current = false;
    clearTimers();
    // Settle to the final text when the cursor leaves.
    if (!prefersReducedMotion()) setDisplay(text);
  };

  // ── one-shot on-view reveal ────────────────────────────────────────
  useEffect(() => {
    if (!replayOnView) {
      runOnce();
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasPlayedViewRef.current) {
            hasPlayedViewRef.current = true;
            runOnce();
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, duration, frameInterval, replayOnView, delay]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <span
      ref={ref}
      className={className}
      onPointerEnter={hoverLoop ? startHoverLoop : undefined}
      onPointerLeave={hoverLoop ? stopHoverLoop : undefined}
      style={{
        fontFamily:
          "'JetBrains Mono', 'Fira Code', 'Roboto Mono', 'Courier New', monospace",
      }}
    >
      {display}
    </span>
  );
}
