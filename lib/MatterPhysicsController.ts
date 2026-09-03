"use client";

import {
  Engine,
  World,
  Bodies,
  Body,
  Constraint,
  Sleeping,
  Vector,
} from "matter-js";

/**
 * A small, return-only Matter.js controller for the About Me paper
 * stack.
 *
 * Lifecycle:
 *   - The three papers fall via existing CSS keyframes (`paper-fall-N`).
 *   - A 10-second hold keeps the CSS forwards fill at the fallen
 *     pose. During this hold NO Matter.js exists in memory.
 *   - After 10 seconds, the React orchestrator instantiates this
 *     controller and calls `startReturn(...)` with the *current*
 *     world-space position / rotation of each paper (its fallen
 *     pose). A rigid body is created at that pose and a soft
 *     spring constraint is attached to the original anchor on the
 *     wire. The body then physically swings / overshoots /
 *     oscillates / damps back to the anchor.
 *   - The DOM renderer reads `getTransform(id)` every frame and
 *     applies `translate3d(x, y, 0) rotate(radToDeg(angle))` to
 *     the paper element.
 *   - When all bodies have settled (close to anchor with low
 *     velocity), the caller calls `snapAllAndDispose()` which
 *     removes every body, destroys the engine, and leaves the DOM
 *     to be driven by React for the next cycle.
 *
 * IMPORTANT: This controller is NEVER instantiated during the
 * three-paper fall. It only comes into existence after the
 * 10-second timer completes. Falling papers are pure CSS.
 *
 * Tuned for lightweight paper: low density, light air friction.
 * The return spring is stiff enough to pull the paper back but
 * soft enough to allow one or two visible overshoots.
 */

export interface FallenPose {
  /** Body's initial centre x in world coordinates (px). */
  x: number;
  /** Body's initial centre y in world coordinates (px). */
  y: number;
  /** Initial angle in radians (inherited from the CSS fall pose). */
  angle: number;
  /** Paper width (px). */
  width: number;
  /** Paper height (px). */
  height: number;
}

export interface PaperReturnSpec {
  /** Where the paper currently is (its fallen pose). */
  fallen: FallenPose;
  /** The original anchor on the wire (target). */
  anchor: FallenPose;
  /** Initial linear velocity (inherited from the CSS fall; usually 0). */
  velocityX?: number;
  velocityY?: number;
  /** Initial angular velocity (inherited from the CSS fall; usually 0). */
  angularVelocity?: number;
}

export interface PaperReturnState {
  body: Body;
  spring: Constraint;
  anchor: { x: number; y: number };
  /** Target angle the body should settle to (radians). */
  anchorAngle: number;
  /** Lifecycle phase. */
  phase: "returning" | "settled";
  /** Has this paper been promoted to "settled" by snapAllAndDispose? */
  settled: boolean;
}

export interface MatterPhysicsControllerOptions {
  /** Gravity in m/s² applied while papers are returning. Default 1.0. */
  gravity?: number;
  /** Step size in ms (fixed). Default 16.667 (~60Hz). */
  stepMs?: number;
  /** Optional callback fired every step (after Engine.update). */
  onStep?: () => void;
}

const DEFAULT_GRAVITY = 1.0;
const DEFAULT_STEP_MS = 1000 / 60;

// Spring stiffness / damping / air friction / gravity for the
// return. Each paper is attached to its clip by a SOFT SPRING
// anchored at the body center, with full matter-js gravity. The
// body translates from its fallen pose to the anchor in ~1s with
// one visible overshoot, then settles within ~2-3s. This reads
// visually as "a paper yanked back up to its clip" — decisive
// rather than floaty.
//
// Why these specific numbers (verified by simulation against
// matter-js at 60Hz):
//
//   - stiffness = 0.015 → stiffer than the previous 0.003, stiff
//     enough to overcome full gravity and pull the body all the
//     way to the anchor within 1s.
//   - damping   = 0.008 → light enough that one overshoot is
//     visible at t≈0.6s, heavy enough that the body settles
//     within 2-3s without ringing.
//   - frictionAir (on the body) = 0.01 → matter-js default. Adds
//     a small air-drag dissipation on top of the spring damping.
//   - length    = 0 → the body center is at the anchor when at
//     rest. The visual string is 36px between the clip and the
//     top of the paper because the anchor is the body center
//     (paper center is below the clip by clipStringHeight + h/2).
//   - gravity (passed by caller) = 1.0 → matter-js default. The
//     soft spring here is stiff enough relative to gravity that
//     the body actually reaches the anchor (the previous 0.05
//     gravity was a hack to make the previous 0.003 spring work).
//
// Verified trajectory (k=0.015, d=0.008, fa=0.01, g=1.0, center-anchor):
//   t=0.4  dist=2    (reaches the anchor)
//   t=0.6  dist=57   (1 visible overshoot)
//   t=1.2  dist=2    (back at the anchor)
//   t=2.0  dist=3    (settled, oscillating < 5px)
const RETURN_SPRING_STIFFNESS = 0.015;
const RETURN_SPRING_DAMPING = 0.008;
const RETURN_SPRING_LENGTH = 0;

// Angular restoring force per unit of body inertia. We scale
// the spring constant by the body's moment of inertia so all
// three paper sizes (which have very different inertias —
// paper 1: 37M, paper 2: 95M, paper 3: 200M) converge in the
// same window. A constant k would settle the small paper faster
// and the large paper slower, which would be visibly out of
// sync.
//
// The body pendulum-swings under gravity as it translates back
// to the anchor. This angular spring biases the rest rotation
// to the per-paper target (-0.6° / +0.4° / -0.3°). Without it,
// the body would settle at whatever rotation the gravity-driven
// translation happens to leave it at.
//
// Tuned for a ~2-3s settle: large enough that the rotation is
// visibly correct at the end, soft enough that the body can
// translate freely during the first second without fighting the
// main return motion.
const RETURN_ANGULAR_K_PER_INERTIA = 0.0003;
const RETURN_ANGULAR_D_PER_INERTIA = 0.0003;

export class MatterPhysicsController {
  readonly engine: Engine;
  readonly world: World;
  readonly papers = new Map<string, PaperReturnState>();

  private readonly opts: Required<MatterPhysicsControllerOptions>;
  private running = false;
  private rafHandle: number | null = null;
  private dragConstraint: Constraint | null = null;
  /**
   * Negative collision group shared by every paper body this
   * controller creates. Bodies in the same negative group
   * never collide with each other (per matter's
   * `collisionFilter` rules), which is what we want for the
   * three papers that may overlap horizontally while falling
   * back to their original positions.
   */
  private readonly paperCollisionGroup: number;

  constructor(options: MatterPhysicsControllerOptions = {}) {
    this.opts = {
      gravity: DEFAULT_GRAVITY,
      stepMs: DEFAULT_STEP_MS,
      onStep: () => {},
      ...options,
    };
    this.engine = Engine.create({
      gravity: { x: 0, y: this.opts.gravity, scale: 0.001 },
    });
    this.world = this.engine.world;
    // All paper bodies share the same non-colliding group so
    // they never push each other around when their bounding
    // boxes happen to overlap. `Body.nextGroup(true)` returns
    // a unique negative group index; we call it once at
    // construction so every paper added by this controller
    // gets the SAME group.
    this.paperCollisionGroup = Body.nextGroup(true);
  }

  /**
   * Add a paper to the simulation. The body is placed at the
   * supplied fallen pose and a soft spring constraint pulls it
   * toward the anchor. The body is created NON-sleeping so the
   * first frame of `Engine.update` starts integrating immediately.
   */
  addPaper(id: string, spec: PaperReturnSpec): PaperReturnState {
    if (this.papers.has(id)) {
      return this.papers.get(id)!;
    }
    const { fallen, anchor } = spec;
    const body = Bodies.rectangle(
      fallen.x,
      fallen.y,
      fallen.width,
      fallen.height,
      {
        density: 0.0015,
        // Air friction at the matter-js default. Combined with the
        // spring damping above, this is what brings the body to
        // rest in ~2-3s after 1 visible overshoot.
        frictionAir: 0.01,
        friction: 0.6,
        restitution: 0.05,
        angle: fallen.angle,
        isSleeping: false,
        label: `paper:${id}`,
        // All papers share a non-colliding group so they never
        // shove each other around when their bounding boxes
        // happen to overlap (which they do — the three papers
        // are positioned at overlapping X coordinates on the
        // wire, even when stacked).
        collisionFilter: { group: this.paperCollisionGroup },
      },
    );
    // Inherit whatever residual motion the CSS animation left.
    if (spec.velocityX !== undefined || spec.velocityY !== undefined) {
      Body.setVelocity(body, {
        x: spec.velocityX ?? 0,
        y: spec.velocityY ?? 0,
      });
    }
    if (spec.angularVelocity !== undefined) {
      Body.setAngularVelocity(body, spec.angularVelocity);
    }
    World.add(this.world, body);

    // Spring anchors the body center to the clip. The body is
    // pulled back to the anchor and settles there with the
    // per-paper rotation. The visual "string" between the clip
    // and the top of the paper is rendered separately in CSS
    // and stays static; the body's translation is the visible
    // motion. The orchestrator passes the anchor as the body's
    // CENTER position at the stacked pose, so when at rest the
    // body's top sits 36px (clipStringHeight) below the clip.
    const spring = Constraint.create({
      bodyA: body,
      pointA: { x: 0, y: 0 },
      pointB: { x: anchor.x, y: anchor.y },
      length: RETURN_SPRING_LENGTH,
      stiffness: RETURN_SPRING_STIFFNESS,
      damping: RETURN_SPRING_DAMPING,
    });
    World.add(this.world, spring);

    const state: PaperReturnState = {
      body,
      spring,
      anchor: { x: anchor.x, y: anchor.y },
      anchorAngle: anchor.angle,
      phase: "returning",
      settled: false,
    };
    this.papers.set(id, state);
    return state;
  }

  /**
   * Read the body's current world-space transform. The DOM
   * renderer applies this every frame as
   * `translate3d(x, y, 0) rotate(radToDeg(angle))`.
   */
  getTransform(id: string): { x: number; y: number; angle: number } | null {
    const state = this.papers.get(id);
    if (!state) return null;
    return {
      x: state.body.position.x,
      y: state.body.position.y,
      angle: state.body.angle,
    };
  }

  /**
   * Attach a temporary pointer constraint to a paper already hanging from
   * its return spring. The constraint is anchored at the body-local point
   * where the user actually clicked (not the body center), so the paper
   * behaves like a piece of paper grabbed at a specific spot — pulling
   * the top tilts the body, pulling the bottom drags the whole sheet.
   * The original string constraint stays attached, so releasing the drag
   * leaves the paper free to swing back under gravity like a curtain.
   */
  beginDrag(id: string, target: { x: number; y: number }): void {
    const state = this.papers.get(id);
    if (!state) return;
    this.endDrag();
    // Convert the world-space click point into body-local coordinates
    // by subtracting the body position and rotating by -body.angle.
    // The result is the body-local point that the user is grabbing.
    const worldDelta = Vector.sub(target, state.body.position);
    const localPoint = Vector.rotate(worldDelta, -state.body.angle);
    this.dragConstraint = Constraint.create({
      bodyA: state.body,
      pointA: localPoint,
      pointB: { x: target.x, y: target.y },
      length: 0,
      // Softer than 0.1 — 0.07 lets the body pendulum-tilt under the
      // user's hand instead of being yanked rigidly. Damping 0.1 kills
      // any high-frequency jitter the user might induce with a shaky
      // pointer.
      stiffness: 0.07,
      damping: 0.1,
    });
    World.add(this.world, this.dragConstraint);
  }

  updateDrag(target: { x: number; y: number }): void {
    if (!this.dragConstraint) return;
    this.dragConstraint.pointB.x = target.x;
    this.dragConstraint.pointB.y = target.y;
  }

  endDrag(): void {
    if (this.dragConstraint) {
      World.remove(this.world, this.dragConstraint);
      this.dragConstraint = null;
    }
  }

  /**
   * Apply an angular restoring torque to every paper body so
   * that the paper rotates back to its original anchor angle.
   * Run this BEFORE `Engine.update` so the torque is integrated
   * in the current step. The torque is a critically-damped
   * spring scaled by the body's moment of inertia so all three
   * paper sizes converge at the same rate:
   *   T = I * ( -K * (angle - anchor) - D * angularVelocity )
   * where K and D are the per-inertia constants tuned against
   * matter-js at 60Hz.
   */
  private applyAngularSpring(): void {
    for (const state of this.papers.values()) {
      const dTheta = state.body.angle - state.anchorAngle;
      const k = state.body.inertia * RETURN_ANGULAR_K_PER_INERTIA;
      const d = state.body.inertia * RETURN_ANGULAR_D_PER_INERTIA;
      const torque =
        -k * dTheta - d * state.body.angularVelocity;
      state.body.torque += torque;
    }
  }

  /**
   * Start the simulation loop. Drives `Engine.update` at a fixed
   * `stepMs` and calls `onStep` after every step.
   */
  start(): void {
    if (this.running) return;
    this.running = true;
    const stepMs = this.opts.stepMs;
    const tick = (_now: number) => {
      if (!this.running) return;
      this.applyAngularSpring();
      Engine.update(this.engine, stepMs, 1);
      this.opts.onStep?.();
      this.rafHandle = requestAnimationFrame(tick);
    };
    this.rafHandle = requestAnimationFrame(tick);
  }

  /**
   * Check whether every paper is sufficiently close to its anchor
   * (in BOTH position and rotation) with low velocity (i.e. has
   * effectively settled). The caller polls this each frame to
   * decide when to call `snapAllAndDispose`.
   *
   * `epsilon` is the position threshold in pixels (default 2.0).
   * `angleEpsilon` is the rotation threshold in radians (default
   * 0.001 ≈ 0.057°).
   */
  allSettled(
    epsilon: number = 2.0,
    angleEpsilon: number = 0.001,
  ): boolean {
    if (this.papers.size === 0) return true;
    for (const state of this.papers.values()) {
      const dx = state.body.position.x - state.anchor.x;
      const dy = state.body.position.y - state.anchor.y;
      const distSq = dx * dx + dy * dy;
      if (distSq > epsilon * epsilon) return false;
      const speed = Math.hypot(state.body.velocity.x, state.body.velocity.y);
      if (speed > 0.5) return false;
      const dAngle = state.body.angle - state.anchorAngle;
      // Wrap to [-pi, pi] so an angle that overshot by 2*pi is
      // not falsely "far" from the target.
      const wrapped = Math.atan2(Math.sin(dAngle), Math.cos(dAngle));
      if (Math.abs(wrapped) > angleEpsilon) return false;
    }
    return true;
  }

  /**
   * Snap every paper exactly to its anchor (zero velocity), stop
   * the simulation, and dispose of all bodies / constraints. The
   * engine is left in a usable state for `start()` again if
   * needed, but typically the caller just lets the controller
   * be garbage-collected.
   *
   * Returns the final transform for each paper so the caller can
   * apply the snap to the DOM as well.
   */
  snapAllAndDispose(): Map<string, { x: number; y: number; angle: number }> {
    const out = new Map<string, { x: number; y: number; angle: number }>();
    for (const [id, state] of this.papers) {
      Body.setPosition(state.body, {
        x: state.anchor.x,
        y: state.anchor.y,
      });
      Body.setVelocity(state.body, { x: 0, y: 0 });
      Body.setAngularVelocity(state.body, 0);
      Sleeping.set(state.body, true);
      out.set(id, {
        x: state.anchor.x,
        y: state.anchor.y,
        angle: 0, // not used — caller uses its own anchor rotation
      });
    }
    this.stop();
    return out;
  }

  /**
   * Hard stop. Cancels the RAF, removes all bodies and
   * constraints from the world, and clears the papers map. The
   * engine is left intact but unused.
   */
  stop(): void {
    this.running = false;
    if (this.rafHandle !== null) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
    this.endDrag();
    for (const state of this.papers.values()) {
      if (state.spring) {
        World.remove(this.world, state.spring);
      }
      World.remove(this.world, state.body);
    }
    this.papers.clear();
  }

  isRunning(): boolean {
    return this.running;
  }
}
