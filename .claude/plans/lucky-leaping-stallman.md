# Paper Stack: Curtain-Style Physics Return

## Context

The current PaperStack build in `components/PaperStack.tsx` and `lib/MatterPhysicsController.ts` has four visible defects and one architectural mismatch, all of which make the interaction feel like "freely draggable cards" instead of "curtains suspended from their original clips":

1. **First-load rotation is zeroed out.** Every paper runs the `paper-settle` keyframe on initial mount (the fallback branch in `PaperStack.tsx:1283-1294`). Under `both` fill, the 0% frame (`rotate(0deg)`) is held for the entire mount, overriding the inline `rotate(${paper.rotation}deg)` so all three papers look identical at 0° instead of -0.6° / +0.4° / -0.3°.

2. **Spring is attached at the body center, not the top edge.** `Constraint.create({ pointA: { x: 0, y: 0 }, ... length: 0 })` at `MatterPhysicsController.ts:254-261` makes the body hang from its centroid. With full gravity that would create a stable equilibrium below the anchor, so the current tuning reduces gravity to 0.05 — which kills the pendulum feel and makes the return look like a soft balloon.

3. **Drag is impossible because of a boolean inversion, not a stale closure.** `canDrag = dragEnabled && !isPhysicsDriven` at `PaperStack.tsx:1172` is always `false` while `isPhysicsDriven` is `true` — which is the entire returning phase. This propagates to `pointerEvents: "none"` and `cursor: "default"` on the paper article at `PaperStack.tsx:1295-1296`, so the article never receives pointer events during the draggable phase.

4. **`getPaperAngle` only parses `matrix(...)`, not `matrix3d(...)`.** During the fall, browsers serialize the `translate3d(...)` transforms from `paper-fall-1/2/3` as `matrix3d(...)`. The regex at `PaperStack.tsx:397` doesn't match, so the captured `fallen.angle` is 0 instead of the actual -34° / +28° / -24°. The body therefore starts at 0° and the angular spring has to "snap" it to the per-paper rotation.

5. **Drag constraint is also at the body center.** `beginDrag` at `MatterPhysicsController.ts:301-309` creates the drag spring with `pointA: { x: 0, y: 0 }` (body center), so the body translates as a rigid block with its center pulled to the mouse. That IS the "freely draggable card" perception.

The intent of this plan: convert the interaction from "soft rubber-band card" to "paper on a string" — top-edge constraint, full gravity, a stiff string + damped pendulum, draggable only at the click point, papers that settle at their per-paper rotation without snapping.

## Files to change

- `lib/MatterPhysicsController.ts` — change spring pointA to top edge, use full gravity, retune spring + damping + frictionAir, give the spring a non-zero length equal to the clip string, retune the angular spring, re-anchor the drag constraint to the click point.
- `components/PaperStack.tsx` — fix the `canDrag` boolean so the article is interactive during the returning phase, fix `getPaperAngle` to handle `matrix3d(...)`, pass `gravity: 1.0` to the controller.
- `app/globals.css` — replace the single `paper-settle` keyframe with three per-paper keyframes (`paper-settle-1/2/3`) that bake the per-paper rotation into both the 0% and 100% frames.

## Implementation

### 1. `lib/MatterPhysicsController.ts` — top-edge string + damped pendulum

**1a. Move the spring pointA to the top edge.** The string attaches to the top center of the paper, like a real curtain on a rod.

```ts
// in addPaper, replace:
const spring = Constraint.create({
  bodyA: body,
  pointA: { x: 0, y: 0 },
  pointB: { x: anchor.x, y: anchor.y },
  length: RETURN_SPRING_LENGTH,
  stiffness: RETURN_SPRING_STIFFNESS,
  damping: RETURN_SPRING_DAMPING,
});
// with:
const spring = Constraint.create({
  bodyA: body,
  pointA: { x: 0, y: -fallen.height / 2 }, // top edge of paper
  pointB: { x: anchor.x, y: anchor.y },     // clip on the wire
  length: RETURN_SPRING_LENGTH,             // non-zero: clipStringHeight
  stiffness: RETURN_SPRING_STIFFNESS,
  damping: RETURN_SPRING_DAMPING,
});
```

**1b. Retune the spring + damping + air friction for a 2–3s pendulum return that settles within ~6s.** The previous tuning (k=0.003, d=0.0003, g=0.05, fa=0.0003) was for center-anchor mode and is no longer valid. For a top-edge pendulum with full gravity:

```ts
// before:
//   RETURN_SPRING_STIFFNESS = 0.003
//   RETURN_SPRING_DAMPING   = 0.0003
//   RETURN_SPRING_LENGTH    = 0
// after:
const RETURN_SPRING_STIFFNESS = 0.06;   // soft restoring pull toward anchor
const RETURN_SPRING_DAMPING   = 0.2;    // heavy damping -> 1-2 visible overshoots
const RETURN_SPRING_LENGTH    = 36;    // ≈ clipStringHeight; string is the visual + physical gap
//   frictionAir on the body:
//     was 0.0003  ->  set to 0.01 (matter-js default; visible air drag)
```

The caller (`PaperStack.tsx:787`) currently passes `gravity: 0.05`. Change to `gravity: reducedMotion ? 0 : 1.0` — full matter-js gravity. The top-edge anchor means there is no equilibrium offset to worry about; the string just keeps the top at the anchor while gravity swings the body below.

**1c. The spring length is the clip string.** `RETURN_SPRING_LENGTH = 36` makes the top edge of the body sit 36px below the clip when at rest. The orchestrator's anchor positions are already `clipY + clipStringHeight + paper.height/2` (center of body when top is at `clipY + clipStringHeight`), so the body ends up in the correct screen position. Per-paper clip string heights (36 / 30 / 42) can be approximated with 36, or pulled from `PaperStack.tsx:214,266,296` and threaded into `addPaper` via a new `stringLength` field on `PaperReturnSpec`.

**1d. Retune the angular spring to settle in ~3s.** With a top-edge string, gravity creates no torque on a symmetric body (the body pendulum hangs vertically), so the per-paper rotation (-0.6° / +0.4° / -0.3°) is NOT preserved by gravity alone — `applyAngularSpring` is still required to bias the rest angle. But the constants need to be ~5× larger to settle in 3s instead of 10s:

```ts
const RETURN_ANGULAR_K_PER_INERTIA = 0.0003;  // was 0.00005
const RETURN_ANGULAR_D_PER_INERTIA = 0.0003;  // was 0.00005
```

**1e. Re-anchor the drag constraint to the click point.** `beginDrag` should attach the drag spring at the local body coordinate where the user clicked, not at the body center. Convert the world-space click point to body-local using `Body.vector(worldPoint, body)` (or by inverting the body's transform via `Vector.sub(worldPoint, body.position)` then `Vector.rotate(delta, -body.angle)`):

```ts
// in beginDrag, replace pointA: { x: 0, y: 0 } with:
const localPoint = {
  x: target.x - state.body.position.x,
  y: target.y - state.body.position.y,
};
const rotated = {
  x: localPoint.x * Math.cos(-state.body.angle) - localPoint.y * Math.sin(-state.body.angle),
  y: localPoint.x * Math.sin(-state.body.angle) + localPoint.y * Math.cos(-state.body.angle),
};
this.dragConstraint = Constraint.create({
  bodyA: state.body,
  pointA: rotated,
  pointB: { x: target.x, y: target.y },
  length: 0,
  stiffness: 0.07,   // softer than 0.1 — feels like grabbing paper, not a rigid card
  damping: 0.1,
});
```

When the user releases, the drag constraint is removed (`endDrag` is already wired) and the body swings back under the top-edge string. The string + gravity do the work, exactly like a real curtain.

### 2. `components/PaperStack.tsx` — fix the `canDrag` boolean inversion

The current `canDrag = dragEnabled && !isPhysicsDriven` (line 1172) is always `false` during the draggable phase because `isPhysicsDriven` is `true` for the whole returning window. The fix is to remove the `!`:

```ts
// line 1172, replace:
//   const canDrag = dragEnabled && !isPhysicsDriven;
// with:
const canDrag = dragEnabled;
```

This makes the article `pointerEvents: "auto"` and `cursor: "grab"` during the returning phase. The existing `onPointerDown` handler at `PaperStack.tsx:466-485` then fires. The clip's `pointerEvents: ... isCurrent && !isAnimating && !isPhysicsDriven ? "auto" : "none"` (already correct at line 1190-ish) keeps the clip unclickable during the return.

### 3. `components/PaperStack.tsx` — fix `getPaperAngle` for `matrix3d(...)`

The current regex at `PaperStack.tsx:397` only matches `matrix(a,b,c,d,e,f)`. During the fall, the keyframes use `translate3d(...)` which Chromium serializes as `matrix3d(...)`. Fix the parser to handle both:

```ts
const getPaperAngle = (element: HTMLElement) => {
  const transform = window.getComputedStyle(element).transform;
  // matrix(a, b, c, d, e, f) — 2D
  let m = transform.match(/^matrix\(([^)]+)\)$/);
  if (m) {
    const [a, b] = m[1].split(",").map((v) => parseFloat(v.trim()));
    return Number.isFinite(a) && Number.isFinite(b) ? Math.atan2(b, a) : 0;
  }
  // matrix3d(a1, b1, 0, 0, a2, b2, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1) — 3D
  m = transform.match(/^matrix3d\(([^)]+)\)$/);
  if (m) {
    const parts = m[1].split(",").map((v) => parseFloat(v.trim()));
    const a = parts[0], b = parts[1];
    return Number.isFinite(a) && Number.isFinite(b) ? Math.atan2(b, a) : 0;
  }
  return 0;
};
```

This makes the captured `fallen.angle` actually be -34° / +28° / -24°, so the body starts at the correct rotation. The `applyAngularSpring` then settles it to the per-paper rotation smoothly instead of "snapping" from 0° to -0.6°.

### 4. `components/PaperStack.tsx` — pass full gravity to the controller

At `PaperStack.tsx:787`, change `gravity: reducedMotion ? 0 : 0.05` to `gravity: reducedMotion ? 0 : 1.0`. The 0.05 reduction is no longer needed with the top-edge constraint.

### 5. `app/globals.css` — per-paper `paper-settle` keyframes

The single `paper-settle` keyframe at `app/globals.css:203-207` hardcodes `rotate(0deg)`. Replace with three keyframes that bake the per-paper rotation into both ends:

```css
@keyframes paper-settle-1 {
  0%   { transform: translateY(-8px) rotate(-0.6deg); }
  60%  { transform: translateY(2px)  rotate(-0.2deg); }
  100% { transform: translateY(0)    rotate(-0.6deg); }
}
@keyframes paper-settle-2 {
  0%   { transform: translateY(-8px) rotate(0.4deg); }
  60%  { transform: translateY(2px)  rotate(0.8deg); }
  100% { transform: translateY(0)    rotate(0.4deg); }
}
@keyframes paper-settle-3 {
  0%   { transform: translateY(-8px) rotate(-0.3deg); }
  60%  { transform: translateY(2px)  rotate(0.1deg); }
  100% { transform: translateY(0)    rotate(-0.3deg); }
}
```

In `PaperStack.tsx:1291-1293`, dispatch to the per-paper keyframe:
```ts
return reducedMotion
  ? undefined
  : `paper-settle-${paperIdx + 1} 0.6s ease ${paperIdx * 0.1}s both`;
```

## Verification

```bash
npx tsc --noEmit
npx next build
```

Then run a Node simulation with the new tuning (k=0.06, d=0.2, fa=0.01, g=1.0, pointA={0,-h/2}, length=36) against a single body. Verify the body:
- Reaches within 50px of the anchor by t=1.0s
- Overshoots by 20-40px on the first swing
- Settles (position within 2px, angle within 0.001 rad) within ~6-8s
- Has 1-2 visible overshoots, not 30+

Manual smoke test:
- Refresh → 3 papers hang with their slight tilts (-0.6° / +0.4° / -0.3°), not all 0°
- Click LOCATION clip → paper 1 falls, scrolls; onAnimationEnd sets `all-three-down` countdown
- 10s pass → physics activates
- During physics, hover over a paper → cursor becomes `grab`; click and drag → paper swings like a curtain on its string, not a card
- Release mid-drag → paper swings back to its anchor naturally
- All 3 papers settle within ~6-8s, then 400ms breath, then sequence restarts

## Out of scope

- Static string DOM between clip and paper does not move during physics. Follow-up visual polish.
- `handleReset` 10s wait (`PaperStack.tsx:877-905`) — leave as-is for now; this is dev-only.
- `setPointerCapture` try/catch wrap — defensive but not on the critical path.
- `frictionAir` / angular spring no-op under `prefers-reduced-motion` — the existing `gravity: reducedMotion ? 0 : 1.0` already covers the gravity side; springs and friction are no-ops when the controller is never started.
