"use client";

import { useEffect, useRef } from "react";
import { useAnimationGate } from "@/lib/hooks/useAnimationGate";

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  baseOpacity: number;
}

const OFFSCREEN_PADDING = 20; // tight padding around rendered text
const LINE_HEIGHT_RATIO = 1.3; // line-height as a multiple of font size

const FONT_STACK = '"Orbitron", "Share Tech Mono", "Audiowide", sans-serif';
const FONT_WEIGHT = 900;

export default function ParticleText({
  text,
  fontSize = 48,
  pixelStep = 5,
  repelRadius = 90,
  repelForce = 4000,
  springStrength = 0.04,
  friction = 0.78,
  idleAmplitude = 1.5,
  idleSpeed = 0.0008,
  shimmerSpeed = 0.002,
  ambientBreathing = true,
  particleColor = "#e8dcc8",
  className,
}: {
  text: string;
  fontSize?: number;
  pixelStep?: number;
  repelRadius?: number;
  repelForce?: number;
  springStrength?: number;
  friction?: number;
  idleAmplitude?: number;
  idleSpeed?: number;
  shimmerSpeed?: number;
  ambientBreathing?: boolean;
  particleColor?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animFrameRef = useRef(0);
  const timeRef = useRef(0);
  const dotRadiusRef = useRef(3);

  // Pause the rAF loop when the canvas is off-screen OR the tab is
  // hidden. `rootMargin: "100px"` lets it resume just before the
  // section enters the viewport so the first paint is ready.
  const animating = useAnimationGate(wrapperRef, { rootMargin: "100px" });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const c = canvas;
    const cx = ctx;

    const fontReady =
      document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();

    let resizeTimeout: ReturnType<typeof setTimeout>;

    function measureText(
      offCtx: CanvasRenderingContext2D,
      str: string,
      px: number,
      maxWidth: number
    ): { lines: string[]; width: number; height: number } {
      offCtx.font = `${FONT_WEIGHT} ${px}px ${FONT_STACK}`;
      const words = str.split(/\s+/).filter(Boolean);
      const lines: string[] = [];

      // Greedy wrap.
      let current = "";
      for (const w of words) {
        const test = current ? `${current} ${w}` : w;
        if (offCtx.measureText(test).width <= maxWidth) {
          current = test;
        } else {
          if (current) lines.push(current);
          current = w;
        }
      }
      if (current) lines.push(current);

      // If the line is one very long string, force a balanced 2-line split.
      if (lines.length === 1 && words.length >= 3) {
        const total = offCtx.measureText(str).width;
        if (total > maxWidth * 0.95) {
          let bestSplit = 1;
          let bestDiff = Infinity;
          for (let i = 1; i < words.length; i++) {
            const left = words.slice(0, i).join(" ");
            const right = words.slice(i).join(" ");
            const diff = Math.abs(
              offCtx.measureText(left).width - offCtx.measureText(right).width
            );
            if (diff < bestDiff) {
              bestDiff = diff;
              bestSplit = i;
            }
          }
          lines.length = 0;
          lines.push(words.slice(0, bestSplit).join(" "));
          lines.push(words.slice(bestSplit).join(" "));
        }
      }

      let width = 0;
      for (const line of lines) {
        const w = offCtx.measureText(line).width;
        if (w > width) width = w;
      }
      // Height must cover the full extent of the last line, including its
      // descenders. With textBaseline="top", the last line's top sits at
      // (lines.length - 1) * lineStep, and its glyphs extend a full `px`
      // below that, so total = (lines.length - 1) * lineStep + px.
      const lineStep = px * LINE_HEIGHT_RATIO;
      const height = (lines.length - 1) * lineStep + px;
      return { lines, width, height };
    }

    async function buildAndRender() {
      await fontReady;

      // Use the parent column width to determine how wide the text can be
      // before wrapping, but the VISIBLE canvas only needs to be as wide as
      // the measured text — so no dead space.
      const parent = c.parentElement;
      const parentWidth = parent ? parent.getBoundingClientRect().width : 600;
      const maxTextWidth = Math.max(160, Math.floor(parentWidth));
      const cssFontSize = fontSize;

      // Measure with a throwaway context.
      const measureCanvas = document.createElement("canvas");
      const mctx = measureCanvas.getContext("2d");
      if (!mctx) return;
      const measurement = measureText(mctx, text, cssFontSize, maxTextWidth);

      const textCssWidth = Math.ceil(measurement.width);
      const textCssHeight = Math.ceil(measurement.height);

      // Offscreen canvas matches the actual text bounding box tightly.
      const offW = Math.max(64, textCssWidth + OFFSCREEN_PADDING * 2);
      const offH = Math.max(32, textCssHeight + OFFSCREEN_PADDING * 2);

      const offscreen = document.createElement("canvas");
      offscreen.width = offW;
      offscreen.height = offH;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;
      offCtx.font = `${FONT_WEIGHT} ${cssFontSize}px ${FONT_STACK}`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "top";
      offCtx.fillStyle = "#000000";

      const centerX = offW / 2;
      const startY = OFFSCREEN_PADDING;
      measurement.lines.forEach((line, i) => {
        offCtx.fillText(line, centerX, startY + i * cssFontSize * LINE_HEIGHT_RATIO);
      });

      const imageData = offCtx.getImageData(0, 0, offW, offH);
      const data = imageData.data;

      // Visible canvas: tight to the text. No more dead space.
      c.width = Math.round(offW * dpr);
      c.height = Math.round(offH * dpr);
      c.style.width = `${offW}px`;
      c.style.height = `${offH}px`;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Sample particles directly in visible-canvas coordinates (1:1).
      const step = pixelStep;
      const particles: Particle[] = [];
      const dotRadius = Math.max(2.5, Math.min(4, cssFontSize / 14));
      dotRadiusRef.current = dotRadius;

      for (let py = step; py < offH - step; py += step) {
        for (let px = step; px < offW - step; px += step) {
          const idx = (py * offW + px) * 4;
          if (data[idx + 3] > 128) {
            particles.push({
              originX: px,
              originY: py,
              x: px,
              y: py,
              vx: 0,
              vy: 0,
              phase: Math.random() * Math.PI * 2,
              baseOpacity: 0.55 + Math.random() * 0.45,
            });
          }
        }
      }

      particlesRef.current = particles;
    }

    function resize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        buildAndRender();
      }, 120);
    }

    resize();
    window.addEventListener("resize", resize);

    if (!animating) {
      // Don't start the rAF loop. Setup (resize, listeners, font
      // measurement) is already done so when the user scrolls back
      // into view, `animating` flips true and the effect re-runs.
      return () => {
        clearTimeout(resizeTimeout);
        window.removeEventListener("resize", resize);
        c.removeEventListener("mousemove", onMouseMove);
        c.removeEventListener("touchmove", onTouchMove);
        c.removeEventListener("touchend", onTouchEnd);
        c.removeEventListener("mouseleave", onMouseLeave);
        c.removeEventListener("touchcancel", onTouchEnd);
      };
    }

    function onMouseMove(e: MouseEvent) {
      const rect = c.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        const rect = c.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          active: true,
        };
      }
    }

    function onTouchEnd() {
      mouseRef.current.active = false;
    }

    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    }

    c.addEventListener("mousemove", onMouseMove);
    c.addEventListener("touchmove", onTouchMove, { passive: true });
    c.addEventListener("touchend", onTouchEnd);
    c.addEventListener("mouseleave", onMouseLeave);
    c.addEventListener("touchcancel", onTouchEnd);

    function getBreathingOffset(p: Particle, t: number): { dx: number; dy: number } {
      if (!ambientBreathing) return { dx: 0, dy: 0 };
      const bx = Math.sin(t * idleSpeed * 1000 + p.phase) * idleAmplitude;
      const by = Math.cos(t * idleSpeed * 800 + p.phase * 1.3) * idleAmplitude * 0.6;
      return { dx: bx, dy: by };
    }

    function animate() {
      const cssWidth = c.width / dpr;
      const cssHeight = c.height / dpr;
      timeRef.current = performance.now();

      cx.clearRect(0, 0, cssWidth, cssHeight);

      const { x: mx, y: my, active } = mouseRef.current;
      const particles = particlesRef.current;
      const dotRadius = dotRadiusRef.current;

      // No per-dot shadow blur — that's the most expensive call for thousands
      // of dots. We get the "glow" feel from higher base opacity and the
      // soft alpha falloff instead.

      for (const p of particles) {
        const breath = getBreathingOffset(p, timeRef.current);
        const targetX = p.originX + breath.dx;
        const targetY = p.originY + breath.dy;

        if (active) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repelRadius && dist > 0) {
            const force = ((repelRadius - dist) / repelRadius) ** 2;
            const angle = Math.atan2(dy, dx);
            p.vx += (Math.cos(angle) * force * repelForce) / Math.max(dist, 1);
            p.vy += (Math.sin(angle) * force * repelForce) / Math.max(dist, 1);
          }
        }

        p.vx += (targetX - p.x) * springStrength;
        p.vy += (targetY - p.y) * springStrength;
        p.vx *= friction;
        p.vy *= friction;

        // Clamp velocity so a single frame of repulsion can't fling a dot
        // clear off the canvas. Without this, dots drift away and never
        // return, leaving the text shape "exploded".
        const MAX_VEL = 14;
        if (p.vx > MAX_VEL) p.vx = MAX_VEL;
        else if (p.vx < -MAX_VEL) p.vx = -MAX_VEL;
        if (p.vy > MAX_VEL) p.vy = MAX_VEL;
        else if (p.vy < -MAX_VEL) p.vy = -MAX_VEL;

        p.x += p.vx;
        p.y += p.vy;

        // Hard-clamp position: a particle can never wander further than 3x
        // the repel radius from its origin. If a dot is somehow blown way
        // out, snap it back near origin so the text shape stays intact.
        const driftX = p.x - p.originX;
        const driftY = p.y - p.originY;
        const driftMax = repelRadius * 2.5;
        const drift2 = driftX * driftX + driftY * driftY;
        if (drift2 > driftMax * driftMax) {
          const drift = Math.sqrt(drift2);
          const k = driftMax / drift;
          p.x = p.originX + driftX * k;
          p.y = p.originY + driftY * k;
          p.vx = 0;
          p.vy = 0;
        }

        const distFromOrigin = Math.sqrt(
          (p.x - p.originX) ** 2 + (p.y - p.originY) ** 2
        );
        const depth = Math.min(distFromOrigin / 60, 1);
        const springOpacity = 0.7 + (1 - depth) * 0.3;
        const shimmer = Math.sin(timeRef.current * shimmerSpeed + p.phase * 3.7) * 0.1 + 0.9;
        const opacity = p.baseOpacity * springOpacity * shimmer;

        cx.beginPath();
        cx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
        cx.fillStyle = particleColor;
        cx.globalAlpha = Math.max(0.5, Math.min(1, opacity));
        cx.fill();
      }

      cx.globalAlpha = 1;

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resize);
      c.removeEventListener("mousemove", onMouseMove);
      c.removeEventListener("touchmove", onTouchMove);
      c.removeEventListener("touchend", onTouchEnd);
      c.removeEventListener("mouseleave", onMouseLeave);
      c.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [
    text,
    fontSize,
    pixelStep,
    repelRadius,
    repelForce,
    springStrength,
    friction,
    idleAmplitude,
    idleSpeed,
    shimmerSpeed,
    ambientBreathing,
    particleColor,
    animating,
  ]);

  return (
    <div ref={wrapperRef}>
      <canvas
        ref={canvasRef}
        className={className}
        style={{ display: "block", touchAction: "none", cursor: "default" }}
      />
    </div>
  );
}
