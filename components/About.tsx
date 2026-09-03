"use client";

import dynamic from "next/dynamic";

/**
 * The About section renders an interactive 3-layer paper stack
 * (Location → Focus Areas → About Me) that responds to clicks and
 * downward scroll, then transitions the user to the Expertise section.
 *
 * `PaperStack` is dynamically imported with `ssr: false` because
 * Matter.js touches `window` on first render and we don't want the
 * matter-js chunk on the critical path of the home page. The
 * `loading` placeholder reserves a viewport's worth of space so
 * the section doesn't collapse on first paint.
 */
const PaperStack = dynamic(
  () => import("./PaperStack"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        style={{ minHeight: "min(150vh, 1500px)" }}
      />
    ),
  }
);

export default function About() {
  return <PaperStack />;
}
