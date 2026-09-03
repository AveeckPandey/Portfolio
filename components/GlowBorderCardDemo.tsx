"use client";

/**
 * GlowBorderCardDemo
 * ──────────────────
 * A small standalone showcase that demonstrates the GlowBorderCard
 * in a few configurations:
 *
 *   1. Default state — the card sits in a grid with siblings, beam
 *      travels around its perimeter.
 *   2. Hover state — hovered card spins faster, glow brightens.
 *   3. Custom content — different inner content per card to show
 *      the component is composable.
 *
 * Drop this anywhere on a page to see the effect. Or just import
 * <GlowBorderCard /> directly in your own JSX.
 */

import GlowBorderCard from "./GlowBorderCard";
import styles from "./glow-border-card-demo.module.css";

const FEATURES = [
  {
    title: "Realtime sync",
    desc: "Push events to every connected client in under 50ms — across regions, with conflict-free delivery.",
    metric: "47ms p95",
  },
  {
    title: "Typed APIs",
    desc: "End-to-end TypeScript: from the database schema to the client component, every layer is checked.",
    metric: "100% typed",
  },
  {
    title: "Edge runtime",
    desc: "Deploys to 300+ edge locations. Cold start under 5ms, no regional pin.",
    metric: "5ms cold",
  },
  {
    title: "Audit trail",
    desc: "Every mutation is recorded with a signed, queryable log. SOC 2 ready out of the box.",
    metric: "SOC 2 ✓",
  },
];

export default function GlowBorderCardDemo() {
  return (
    <section className={styles.demo}>
      <header className={styles.head}>
        <span className={styles.eyebrow}>// live preview</span>
        <h2 className={styles.title}>GlowBorderCard</h2>
        <p className={styles.lede}>
          A reusable card with a moving golden border trail and ambient halo.
          Hover any card to see the trail speed up and the glow brighten.
        </p>
      </header>

      <div className={styles.grid}>
        {FEATURES.map((f) => (
          <GlowBorderCard
            key={f.title}
            className={styles.cardInner}
          >
            <div className={styles.cardHeader}>
              <span className={styles.metric}>{f.metric}</span>
              <span aria-hidden className={styles.dot} />
            </div>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p className={styles.cardDesc}>{f.desc}</p>
          </GlowBorderCard>
        ))}
      </div>
    </section>
  );
}
