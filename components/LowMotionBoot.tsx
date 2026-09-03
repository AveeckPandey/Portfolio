"use client";
import { useEffect } from "react";

/**
 * Tiny client-only effect that toggles `body.low-motion` based on
 * the current viewport width. Mobile viewports are flagged so the
 * stylesheet's `body.low-motion *` rule short-circuits any animations
 * still attached to elements. The class is purely additive — the
 * `prefers-reduced-motion: reduce` block in `globals.css` composes
 * with it.
 *
 * This is intentionally perf-only, not a user-facing accessibility
 * setting. Users who have set their OS to reduced-motion still get
 * the existing (stricter) globals.css rule regardless of viewport.
 */
export default function LowMotionBoot() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => {
      document.body.classList.toggle("low-motion", window.innerWidth <= 768);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return null;
}
