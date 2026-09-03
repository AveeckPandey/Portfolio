"use client";
import { useEffect, useState } from "react";

/**
 * Returns `true` when the viewport width is at most `breakpoint` px.
 * Defaults to 768, matching the project's existing mobile breakpoint
 * used in `PaperStack.tsx` and `AristotleSection.tsx`.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [m, setM] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setM(mq.matches);
    const onChange = () => setM(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);
  return m;
}
