"use client";
import { useEffect, useRef, useState, type RefObject, type MutableRefObject } from "react";

/**
 * Mirrors the IntersectionObserver + Page Visibility gate into a React
 * state boolean. Returns `true` while the element is in the viewport
 * AND the document is visible.
 *
 * The third argument is OPTIONAL. When passed, the hook also writes
 * the latest value into a `MutableRefObject<boolean>` the caller owns.
 * This is the path used inside long-lived effects whose own deps
 * array must stay constant — they read `outRef.current` instead of
 * subscribing to the boolean directly.
 *
 * IMPORTANT: the hooks rule requires the effect's dep array to have
 * the same length on every render. To honor that, we wrap `outRef`
 * in a stable ref-of-a-ref and pull it out at write time. Callers
 * can therefore omit the third argument freely without breaking the
 * rule, and the effect never re-runs because of a missing trailing
 * `undefined`.
 *
 * The `rootMargin` lets animations resume a bit before the element
 * enters the viewport so the trail doesn't visibly pop in.
 */
export function useAnimationGate(
  ref: RefObject<Element | null>,
  options: { rootMargin?: string; threshold?: number } = {},
  outRef?: MutableRefObject<boolean>
): boolean {
  const [active, setActive] = useState(false);
  const visibleRef = useRef(false);
  const docVisibleRef = useRef(
    typeof document === "undefined" ? true : !document.hidden
  );
  // Stable handle to the caller's outRef. Updated on every render
  // (cheap), but the effect's dep array doesn't include this — only
  // the original stable shape — so the effect runs once.
  const outRefHandle = useRef<MutableRefObject<boolean> | null>(outRef ?? null);
  outRefHandle.current = outRef ?? null;

  useEffect(() => {
    const el = ref.current;
    const write = (next: boolean) => {
      if (outRefHandle.current) outRefHandle.current.current = next;
      setActive(next);
    };
    if (!el || typeof IntersectionObserver === "undefined") {
      write(docVisibleRef.current);
      const onVis = () => {
        docVisibleRef.current = !document.hidden;
        write(docVisibleRef.current);
      };
      document.addEventListener("visibilitychange", onVis);
      return () => document.removeEventListener("visibilitychange", onVis);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRef.current = entry.isIntersecting;
        }
        write(visibleRef.current && docVisibleRef.current);
      },
      {
        rootMargin: options.rootMargin ?? "0px",
        threshold: options.threshold ?? 0,
      }
    );
    io.observe(el);

    const onVis = () => {
      docVisibleRef.current = !document.hidden;
      write(visibleRef.current && docVisibleRef.current);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref, options.rootMargin, options.threshold]);

  return active;
}
