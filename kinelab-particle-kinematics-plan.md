# Kinelab — Particle Kinematics Section

Spec for Claude Code. Repo: `navarroaxel/kinelab` (Next.js 16 · React 19 · TS strict · Tailwind v4 · Canvas 2D).

**Goal.** Add a grouped section at `/particle-kinematics` that lets a user browse and navigate all ten exercises of TP N°1 — Cinemática del Punto Material (Mecánica Técnica, UTN FRBA). Relocate the existing `/pin-slot` simulator into it. Every exercise gets a card in the index and a working route.

---

## 0. Repo facts (verified against the current tree)

Existing simulators: `/` (polar), `/ring`, `/pin-slot`, `/quick-return`, `/kepler`.

Standard per-simulator slice:

```
src/lib/<name>Kinematics.ts          # pure physics, no React, no DOM
src/hooks/use<Name>Simulator.ts      # params + visibility + refs + paused/reset
src/hooks/use<Name>AnimationLoop.ts  # RAF loop, direct render or via lib/drawing
src/components/<name>/<Name>Canvas.tsx
src/components/<name>/<Name>Controls.tsx
src/components/<name>/<Name>Metrics.tsx
src/components/<nam``e>/<Name>Legend.tsx
src/components/<name>/<Name>Equations.tsx
src/app/<name>/page.tsx              # "use client", inline composition
```

Non-negotiable conventions (already in `AGENTS.md`):

- High-frequency state lives in **refs**. The RAF loop must never trigger a re-render.
- Metrics throttled to ~15 fps (66 ms gate on `lastMetricUpdate`).
- Every user-facing string goes through `t(key)`; keys land in `en` **and** `es` in the same commit.
- Physics stays decoupled from rendering.
- `aside` panels are wrapped in `React.memo`.
- `pinSlotKinematics.ts` guards an analytic invariant behind `process.env.NODE_ENV === "development"` with a `console.warn`. Replicate that pattern in every new physics module that has one.

CI (`.github/workflows/ci.yml`) runs `npm run lint` → `npx tsc --noEmit` → `npm run build`. All three must pass on every phase.

**Move cost is low.** The literal route string `/pin-slot` appears in exactly one place: `SimulatorNav.tsx:12`. The `pin-slot.*` i18n keys are key names, not paths — leave them alone, renaming them is pure churn.

---

## 1. Decisions

1. **Section route: `/particle-kinematics`.** Exercise pages are nested under it. If you prefer a shorter path, `/cpm` works too — it's a single constant in the registry, so swap it before Phase 2 or not at all.
2. **`/` stays the polar simulator.** Unchanged.
3. **`/pin-slot` moves to `/particle-kinematics/pin-slot`** with a permanent redirect from the old path.
4. **CPM 4 is CPM 6 with `d = r`** — the circular guide passes through O, giving ρ = 2r·cos φ. It ships as a preset of the pin-slot page, not a separate route, but it still gets its own index card.
5. **CPM 9 gets its own small route** rather than being forced into `/kepler`. The Kepler simulator is built around Mars transfer orbits and bending it into an Earth circular-orbit case would distort its UI for little gain.
6. Nine routes plus the index. Ten exercise cards.

| Exercise | Route | Status |
|---|---|---|
| CPM 1 | `/particle-kinematics/drag-descent` | new |
| CPM 2 | `/particle-kinematics/stopping-distance` | new |
| CPM 3 | `/particle-kinematics/parabolic-track` | new |
| CPM 4 | `/particle-kinematics/pin-slot?preset=cpm4` | preset |
| CPM 5 | `/particle-kinematics/motion-graphs` | new |
| CPM 6 | `/particle-kinematics/pin-slot` | **moved** |
| CPM 7 | `/particle-kinematics/cable-blocks` | new |
| CPM 8 | `/particle-kinematics/radar-tracking` | new |
| CPM 9 | `/particle-kinematics/circular-orbit` | new |
| CPM 10 | `/particle-kinematics/elevator-cable` | new |

---

## Phase 1 — Groundwork

Do this before adding any simulator. Skipping it means immediate rework.

### 1.1 — Simulator registry

Create `src/lib/simulators.ts` as the single source of truth for navigation:

```ts
export type SimulatorGroup = "core" | "particle-kinematics";

export interface SimulatorEntry {
  id: string;              // "pin-slot"
  href: string;            // "/particle-kinematics/pin-slot"
  navKey: TranslationKey;
  titleKey: TranslationKey;
  summaryKey: TranslationKey;  // one-line statement for the index card
  group: SimulatorGroup;
  cpm?: number;            // exercise number, drives ordering inside the section
  preset?: string;         // e.g. "cpm4" — appended as ?preset=
}

export const SIMULATORS: SimulatorEntry[] = [ /* ... */ ];
export const cpmExercises = () => SIMULATORS.filter(s => s.group === "particle-kinematics")
                                            .sort((a, b) => a.cpm! - b.cpm!);
```

`SimulatorNav`, the section index, and the exercise nav all read from here.

**Acceptance:** adding a simulator touches the registry and nothing else in navigation.

### 1.2 — Grouped top-level nav

The flat tab bar does not survive twelve entries. Rework `SimulatorNav.tsx`:

- Core simulators stay as tabs.
- The section appears as one entry linking to `/particle-kinematics`, marked active for any path beneath it (`pathname.startsWith`).
- On mobile, collapse the whole thing into a menu button.
- Preserve `aria-current="page"` and the existing `aria-label`. Keyboard-operable: Escape closes, arrows move between items.

### 1.3 — Split i18n

`src/lib/i18n.ts` is 867 lines in one object literal and would pass 2000 with this section. Convert to a directory:

```
src/lib/i18n/
├── index.ts        # merges modules; exports Language, translations, TranslationKey
├── common.ts       # theme, github, language, nav, credits
├── polar.ts
├── ring.ts
├── pin-slot.ts
├── quick-return.ts
├── kepler.ts
└── cpm/
    ├── section.ts  # index page, exercise nav
    └── cpm1.ts … cpm10.ts
```

Each module exports `{ en: {...}, es: {...} }`. `index.ts` merges them and keeps deriving `TranslationKey` from the merged `en`.

**Acceptance:** the public import `@/lib/i18n` is unchanged, no component is touched, `tsc --noEmit` is clean.

### 1.4 — Split types

Same treatment for `src/types/simulator.ts`: one file per simulator under `src/types/`, plus a barrel that re-exports everything so `@/types/simulator` keeps working.

### 1.5 — Refresh the docs

`AGENTS.md` and `README.md` still say "Currently two simulators" and only document `/` and `/ring` — `/pin-slot`, `/quick-return` and `/kepler` are missing. This actively misleads any agent reading the repo. Update `AGENTS.md`, `README.md` and `README.es.md` with the full route table, the new section, and the conventions from 1.1–1.4.

---

## Phase 2 — Section infrastructure

### 2.1 — Move pin-slot

- `git mv src/app/pin-slot/page.tsx src/app/particle-kinematics/pin-slot/page.tsx`.
- Leave `src/components/pin-slot/`, `src/hooks/usePinSlot*`, `src/lib/pinSlotKinematics.ts` and the `pin-slot.*` i18n keys exactly where they are. Only the route moves.
- Add a permanent redirect in `next.config.ts` (currently an empty config object):

```ts
async redirects() {
  return [{ source: "/pin-slot", destination: "/particle-kinematics/pin-slot", permanent: true }];
}
```

- Update the registry entry.

**Acceptance:** `/pin-slot` 308-redirects to the new path; the simulator behaves identically.

### 2.2 — Section layout

`src/app/particle-kinematics/layout.tsx` wraps the whole section with `LanguageProvider` and the exercise nav. Every page currently re-declares `LanguageProvider` inline — inside the section, hoist it to the layout and drop it from the pages.

### 2.3 — Exercise navigation

`src/components/cpm/ExerciseNav.tsx`, rendered by the section layout:

- Prev / next buttons that walk the ten exercises in CPM order, wrapping at the ends.
- A dropdown jumping straight to any exercise, labelled `CPM 1 — <title>`.
- A "back to index" link.
- Current position shown as `3 / 10`.
- Keyboard shortcuts: `←` / `→` move between exercises, with a `data-no-shortcut` opt-out so sliders and inputs don't hijack them.

This is the piece that makes the section feel like a browsable set rather than ten unrelated URLs. Build it before the simulators so each new page inherits it for free.

### 2.4 — Section index page

`src/app/particle-kinematics/page.tsx`: card grid driven by `cpmExercises()`. Each card shows the CPM number, title, a one-line summary of the statement, and a small static thumbnail or an SVG glyph of the mechanism. Cards for preset-backed exercises link with the query string.

Add proper metadata and an `<h1>`. Also link the original TP PDF from `public/`.

### 2.5 — Preset plumbing

Shared convention: `?preset=<id>`. Add `src/hooks/usePreset.ts`:

```ts
export function usePreset<T>(presets: Record<string, T>, fallback: T): T
```

It reads the search param and returns initial params. Each `use<Name>Simulator` takes it as an optional argument. Unknown preset ids fall back silently.

### 2.6 — `FunctionPlot` component

`src/components/FunctionPlot.tsx` plus helpers in `src/lib/plot.ts`. Required by CPM 1, 2, 5, 7 and 10.

`StripChart` is a rolling real-time buffer and is the wrong tool here — this is a static function plotter.

Requirements:

- Accepts one or more series `{ label, color, points: [x, y][], dashed?: boolean }`.
- Axes with ticks and grid; autoscale with an optional fixed domain/range.
- Labelled markers on notable points (e.g. `t = 59.4 s`).
- Dashed horizontal/vertical reference lines and asymptotes.
- Area shading under a curve between two x values (CPM 2 needs it).
- Hover cursor reporting every series' value at that x.
- DPR-aware plus `ResizeObserver`, matching the existing canvases.
- Uses `COLORS` / `COLORS_DARK` from `lib/drawing.ts`.

**This is the highest-risk item in the plan.** Build it first and build it properly — four simulators fall out of it almost for free.

---

## Phase 3 — Simulators

Suggested order: 3.1 → 3.4 → 3.2 → 3.7 → 3.3 → 3.5 → 3.6 → 3.8, with the CPM 4 preset (3.9) any time after 2.5.

For each one: pure physics first with its dev invariant, then the state hook, then the RAF loop, then the components, then the page and i18n keys.

The reference numbers below are verified. Use them as acceptance tests for each physics module — if a simulator does not reproduce them, the bug is in the simulator.

---

### 3.1 — CPM 1 · Cyclist with air drag → `drag-descent`

**Statement.** `a(v) = A − B·v²` with A = 0.122, B = 0.0007 (MKS), starting from rest. Find v(x), v_max, and the time to reach v_max/2.

**Physics** (`dragDescentKinematics.ts`) — fully closed form, no numerical integration:

```
v_max = √(A/B)
k     = B · v_max                     [1/s]
v(t)  = v_max · tanh(k·t)
x(t)  = (1/B) · ln[cosh(k·t)]
v(x)  = v_max · √(1 − e^(−2·B·x))
t½    = artanh(0.5) / k
```

Reference with default A, B: v_max = 13.20 m/s · k = 0.009241 s⁻¹ · t½ = 59.44 s · x(t½) = 205.5 m.

**Dev invariant:** `v(x(t))` must match `v(t)` to 1e-6 relative.

**Params:** A ∈ [0.02, 0.4], B ∈ [0.0001, 0.005], `tMax` ∈ [60, 600].

**Visuals:** animated cyclist on a slope, velocity arrow approaching the asymptote, drag arrow growing as v². Plot panel with all three curves (v–x, v–t, x–t), the v_max asymptote, the initial tangent of slope A, and the t½ marker.

**Metrics:** v, x, instantaneous a, v/v_max as a percentage, elapsed t.

**Acceptance:** at t = 59.4 s the readout is v = 6.60 m/s and x = 205 m; x(t) approaches `v_max·t − ln2/B`.

---

### 3.2 — CPM 2 · Stopping distance → `stopping-distance`

**Statement.** 0.7 s reaction at constant speed, then braking at g/2 to a stop. Compare 40, 80 and 100 km/h and compute the area under v(t).

**Physics** (`stoppingDistanceKinematics.ts`), per case:

```
d₁ = v₀·t_r                 (rectangle)
t_f = v₀/a                  with a = g/2 = 4.905 m/s²
d₂ = v₀²/(2a)               (triangle)
D  = d₁ + d₂
```

Reference: 40 → 20.36 m · 80 → 65.89 m · 100 → 98.10 m.

**Params:** up to three configurable speeds (default 40/80/100 km/h), `t_r` ∈ [0, 2.5] s, deceleration factor ∈ [0.2g, 1.0g], and a surface preset (dry / wet / ice) that sets the factor.

**Visuals:** top-down view of three cars launching together and braking, with travelled distance marked against a shared ruler. Below, a `FunctionPlot` of the three v(t) traces with the area shaded and split into rectangle plus triangle.

**Key interaction:** an "obstacle distance" slider that turns red the cases that fail to stop in time. That is the pedagogical point of the exercise — D grows with v₀², not linearly.

**Metrics:** table of v₀ [km/h] · v₀ [m/s] · d₁ · t_f · d₂ · D · t_total.

---

### 3.3 — CPM 3 · Skater on a parabolic profile → `parabolic-track`

**Statement.** `y = x²/80`. At A (x = 10 m) the speed is 12 m/s and changes at 4 m/s². Find |a|.

**Physics** (`parabolicTrackKinematics.ts`):

```
y' = x/40 ,  y'' = 1/40
R_c(x) = (1 + y'²)^(3/2) / |y''|
a_t = v̇                      (given)
a_n = v² / R_c
|a| = √(a_t² + a_n²)
β   = arctan(a_n / a_t)       angle of a from the tangent
```

Reference at x = 10: R_c = 43.81 m · a_n = 3.287 · |a| = 5.177 m/s² · β = 39.4°.

**Watch the signs.** The skater travels *toward the vertex*, so the unit tangent points in −x. `a_n` always points to the concave side (up and to the left at A), never outward. This is easy to draw backwards.

**Params:** parabola coefficient (default 1/80), x_A ∈ [−30, 30], v ∈ [0, 30], v̇ ∈ [−10, 10].

**Visuals:** the parabolic profile, the skater at A, a dashed osculating circle of radius R_c with its centre marked, and the v / a_t / a_n / a vector set with the parallelogram construction. Optional animated mode that runs along the track so R_c visibly changes with x.

---

### 3.4 — CPM 5 · Motion graph builder → `motion-graphs`

**Statement.** Given piecewise v(t) with x₀ = 0, construct a(t) and x(t).

The most didactic of the set and the lightest on physics. The core is a **piecewise-linear v(t) editor**.

**Physics** (`motionGraphsKinematics.ts`) — given `Segment[] = { t0, t1, v0, v1 }[]`:

```
a  = (v1 − v0)/(t1 − t0)                    constant per segment
x(t) = x(t0) + v0·τ + ½·a·τ²,  τ = t − t0   exact integration
```

Detect and mark zero crossings of v (extrema of x), jump discontinuities in a, and the final x.

**Interaction:** drag the vertices of the v(t) polyline; a(t) and x(t) recompute live. Add and remove segments. Toggleable grid snapping.

**Presets** — the four cases from the TP:

| Case | v(t) segments | a per segment | x at breakpoints |
|---|---|---|---|
| 1 | 40 (0–10), 40→60 (10–30), 60 (30–60) | 0 / +1 / 0 | 400 · 1400 · 3200 |
| 2 | 0→100 (0–20), 100 (20–30), 100→0 (30–40), 0 (40–60) | +5 / 0 / −10 / 0 | 1000 · 2000 · 2500 |
| 3 | 40 (0–10), 40→−60 (10–40), −60 (40–60) | 0 / −10/3 / 0 | 400 · max 640 at t=22 · 100 · −1100 |
| 4 | 50→−50 (0–20), −50 (20–30), −50→50 (30–50), 50 (50–60) | −5 / 0 / +5 / 0 | max 250 at t=10 · −500 · min −750 at t=40 · 0 |

**Bonus:** an inverse mode (given a(t), build v and x) covers supplementary exercise CPM 18 with no new code.

---

### 3.5 — CPM 7 · Cable, pulleys and blocks → `cable-blocks`

**Statement.** Motor D pulls with `a_D = 5 m/s²`; motor C with `a_C = 3t² m/s²`. Both start from rest with d = 3 m. Find t for d = 0 and the block velocities.

**Physics** (`cableBlocksKinematics.ts`):

```
Block B (motor D, single run):   s_B = 2.5·t²        v_B = 5·t
Block A (motor C, 2 runs):       a_A = a_C/2 = 1.5·t²
                                 v_A = 0.5·t³        s_A = 0.125·t⁴
Meeting condition: s_A + s_B = d  →  0.125·t⁴ + 2.5·t² − 3 = 0
```

Root: **t = 1.0656 s**, with s_B = 2.839 m and s_A = 0.161 m. Velocities: **v_B = 5.33 m/s** (leftward) and **v_A = 0.605 m/s** (rightward).

Solve the quartic in closed form via `u = t²` — it is biquadratic, `u = (−2.5 + √(6.25 + 1.5))/0.25`. No bisection.

**Sign convention matters here.** Define positive to the right and report v_B as negative. The exercise's answer key labels this block twice as `v_A`; the simulator should make the direction unambiguous with arrows.

**Params:** `a_D`, the coefficient of `a_C`, initial `d`, and the number of cable runs on A's side (default 2) — changing it makes the constraint relationship visible.

**Visuals:** side view of the mechanism, animated cables, velocity arrows on A and B, and the `d` dimension shrinking live. Below, s(t) and v(t) plots for both blocks with a vertical marker at the meeting instant.

---

### 3.6 — CPM 8 · Radar-tracked aircraft → `radar-tracking`

**Statement.** At the lowest point of a vertical trajectory: v = 150 m/s horizontal, a_t = 25 m/s², ρ = 2000 m. Radar 800 m horizontally and 600 m below. Find ṙ, r̈, θ̇, θ̈.

**Physics** (`radarTrackingKinematics.ts`). Trajectory is a circle of radius ρ centred above the lowest point; the aircraft accelerates with constant `a_t`. Position relative to the radar gives the polar derivatives:

```
r = √(x² + y²)               θ = atan2(y, x)
ê_r = (cos θ, sin θ)         ê_θ = (−sin θ, cos θ)
ṙ  = v⃗ · ê_r                r·θ̇ = v⃗ · ê_θ
a_r = a⃗ · ê_r               a_θ = a⃗ · ê_θ
r̈  = a_r + r·θ̇²
θ̈  = (a_θ − 2·ṙ·θ̇) / r
```

Reference at the stated instant: r = 1000 m · θ = 36.87° · **ṙ = 120 m/s · r̈ = 34.85 m/s² · θ̇ = −0.09 rad/s · θ̈ = +0.0156 rad/s²**.

> **Sign note.** The course answer key gives θ̈ = −0.0156. The correct sign is **positive**: θ̇ is negative and its magnitude decreases as the aircraft moves away, which requires θ̈ > 0. Confirmed both by projection and by differentiating `θ = arctan(y/x)`. Surface this in the equations panel — the animation makes it self-evident, since `|θ̇|` visibly decays.

**Dev invariant:** compare analytic θ̈ against a centred finite difference of θ(t) along the trajectory, tolerance 1e-4.

**Params:** v₀, a_t, ρ, radar position (x, y) draggable on the canvas, height of the lowest point.

**Visuals:** curved trajectory, aircraft, radar, the r vector with θ dimensioned, and v and a decomposed onto ê_r / ê_θ with parallelograms. Live strip charts of r, θ, ṙ, θ̇.

**Worth the effort:** making the radar draggable reuses the movable-pole idea from the existing polar simulator and shows that all four derivatives change with geometry alone, not with the physics.

---

### 3.7 — CPM 9 · Satellite in circular orbit → `circular-orbit`

**Statement.** A satellite stays in a circular orbit when the normal acceleration equals `g·(R/r)²`. Find the altitude for v = 24000 km/h, with R = 6372 km and g = 9.806 m/s².

**Physics** (`circularOrbitKinematics.ts`):

```
a_n = v²/r = g·(R/r)²   →   r = g·R² / v²
h = r − R
T = 2πr / v
```

Reference: v = 6666.7 m/s · r = 8958.3 km · **h = 2586 km** · T = 8443 s ≈ 2 h 21 min · a_n = 4.961 m/s².

Small and analytic — keep the slice minimal. No RAF-driven integration; animate the satellite by advancing the true anomaly at constant ω = v/r.

**Params:** v ∈ [15000, 40000] km/h, R, g. Show the degenerate cases at the ends of the slider: too slow and r drops below R (the satellite would hit the surface — flag it), too fast and it escapes the useful plot range.

**Visuals:** Earth to scale with the orbit circle, the satellite, the v vector tangent and a_n pointing at the centre, plus the r and h dimensions. A secondary plot of h vs. v making the inverse-square relation visible.

**Note in the equations panel** that `g·R² = μ = 3.98 × 10¹⁴ m³/s²` is the Earth's gravitational parameter — the exercise is handing you the law of gravitation disguised as a kinematics datum.

---

### 3.8 — CPM 10 · Elevator and pulley → `elevator-cable`

**Statement.** Cable unwinds from drum C at constant v₀; find the elevator's velocity and acceleration as functions of time.

**Physics** (`elevatorCableKinematics.ts`):

```
L(t) = √(b² + x²) = b + v₀·t          (initial condition x₀ = 0, L₀ = b)
x(t) = √(v₀²t² + 2·b·v₀·t)
ẋ(t) = v₀·(v₀t + b) / x(t)
ẍ(t) = −b²·v₀² / x(t)³
```

**Dev invariants:** analytic `ẍ` against a finite difference of `ẋ`; and `√(b² + x²) − (b + v₀t)` ≈ 0.

> The course answer key cubes the radicand in ẋ, which is dimensionally inconsistent (its ẍ is correct). The expressions above are the right ones.

**Singularity at t = 0:** `ẋ → ∞`. Handle it explicitly — start at `t = ε` or expose `x₀ > 0` as a parameter — and explain it in the panel: with the cable horizontal, consuming cable at v₀ would require infinite speed. This is the most interesting part of the exercise, so do not hide it behind a clamp.

**Params:** `b` ∈ [1, 20], `v₀` ∈ [0.1, 5], `x₀` ∈ [0, 10].

**Visuals:** the mechanism with the car descending, the cable between A and B changing angle under tension, drum C rotating. Plots of x(t), ẋ(t), ẍ(t) with the `ẋ → v₀` asymptote for large t.

---

### 3.9 — CPM 4 preset on the pin-slot page

Case `d = r`: the guide passes through O, yielding the much simpler closed form `ρ = 2r·cos φ`, `θ = 2φ`, `|v| = 2ωr`, `|a| = 4ω²r`.

Required changes:

- Relax the clamp in `usePinSlotSimulator` — it currently forces `d > r + 1`. Allow `d = r` exactly.
- Handle the singularity: at `φ = π` the pin passes through O, ρ → 0 and θ is undefined. Detect `ρ < ε` and freeze or skip the vectors for that frame instead of pushing NaN into the canvas.
- The `pin-slot.controls.constraint.*` and `pin-slot.equations.section.swing` strings assume `d > r`. Add a variant for the degenerate case and pick between them at render time.
- Show the degenerate closed form in the equations panel alongside the general one.

---

## Phase 4 — Wrap-up

- Every `<Name>Equations.tsx` carries the original statement, the derivation, and the reference numeric result.
- `README.md`, `README.es.md` and `AGENTS.md` updated with the full route table.
- Accessibility pass: canvases need `role="img"` and a descriptive `aria-label`; every slider needs an associated label.
- Performance pass: with twelve simulators, confirm per-route bundles are not inflating. `lib/drawing.ts` is 836 shared lines — check it is not pulled in wholesale by routes that use two helpers. If it is, split it per simulator.
- Verify the `/pin-slot` redirect still works after the build.

---

## Working instructions

- **One phase per PR.** Within Phase 3, **one simulator per PR**.
- Do not start Phase 3 until Phases 1 and 2 are merged.
- Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/`. Version 16 has breaking changes relative to the model's training data.
- After every task: `npm run lint && npx tsc --noEmit && npm run build`.
- No new dependencies. Native Canvas 2D and Tailwind cover everything here, `FunctionPlot` included.
