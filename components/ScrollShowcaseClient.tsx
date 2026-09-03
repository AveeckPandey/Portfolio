"use client";

import dynamic from "next/dynamic";

/**
 * Client-side wrapper that lazy-loads `ScrollShowcase`. Lives in a
 * client component because Next.js 16 disallows `ssr: false` from
 * Server Components (and `app/page.tsx` is one).
 *
 * `ScrollShowcase` pulls in GSAP + Lenis, both of which touch
 * `window` at module load. Deferring the import to a client chunk
 * keeps the smooth-scroll runtime out of the home page's initial
 * bundle. The `loading` placeholder reserves a viewport's worth of
 * space so the layout doesn't shift on hydration.
 */
const ScrollShowcase = dynamic(
  () => import("./ScrollShowcase"),
  {
    ssr: false,
    loading: () => <div aria-hidden="true" style={{ minHeight: "100vh" }} />,
  }
);

export default function ScrollShowcaseClient() {
  return <ScrollShowcase />;
}
