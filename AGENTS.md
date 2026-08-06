<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kinelab — Interactive Physics Simulators

## Project overview

Client-side educational simulators. Each route isolates one concept and animates it in a Canvas-driven page. The architecture deliberately repeats the same shape across simulators so that adding a new one is a matter of cloning a small, well-defined slice.

Core simulators:

| Route             | Concept |
|-------------------|---------|
| `/polar`          | Polar coordinates — Cartesian ↔ polar decomposition of circular motion with a freely movable pole |
| `/quick-return`   | Quick-return mechanism — crank AB drives an oscillating bar OQ and a tool slider P |

Plus two grouped sections:

- **Particle Kinematics** (`/particle-kinematics`) — TP N°1, Cinemática del Punto Material (Mecánica Técnica, UTN FRBA). Ten exercise routes, all implemented, browsable via a section index and an exercise nav (prev/next, jump-to dropdown).
- **Particle Dynamics** (`/particle-dynamics`) — TP N°2, Dinámica del Punto Material (Mecánica Técnica, UTN FRBA). Fourteen exercises registered; two are implemented so far — PD 3 (`/particle-dynamics/ring`, the vertical ring, moved here from the former core `/ring` route, RK4 integration of `θ̈ = −(g/R)·sin θ`, normal force, energy bookkeeping, `v_min = √(5gR)` threshold) and PD 6 (`/particle-dynamics/kepler`, orbital mechanics, moved here from the former core `/kepler` route — Mars return vehicle transfer trajectory, Kepler's laws, vis-viva). The rest render as disabled "coming soon" cards on the section index (`disabled: true` in the registry) until built.

See `src/lib/simulators.ts` for the full registry and `README.md` for the per-exercise route tables.

`/` itself is a landing page — a card index linking to the two core simulators above plus both TP sections (`src/components/HomeIndexClient.tsx`).

Stack: **Next.js 16** · **React 19** · **TypeScript (strict)** · **Tailwind CSS v4** · native Canvas 2D API.

## Folder structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout, Geist fonts, metadata
│   ├── page.tsx                      # / — home landing page (server component + metadata)
│   ├── polar/page.tsx                # /polar — polar simulator (client component, inline composition)
│   ├── quick-return/page.tsx         # /quick-return — quick-return mechanism
│   ├── particle-kinematics/
│   │   ├── layout.tsx                # LanguageProvider + ExerciseNav for the whole section
│   │   ├── page.tsx                  # /particle-kinematics — section index (card grid)
│   │   └── pin-slot/page.tsx         # /particle-kinematics/pin-slot — PK 6 (moved from /pin-slot)
│   ├── particle-dynamics/
│   │   ├── layout.tsx                # LanguageProvider + ExerciseNav for the whole section
│   │   ├── page.tsx                  # /particle-dynamics — section index (card grid, incl. disabled stubs)
│   │   ├── ring/page.tsx             # /particle-dynamics/ring — PD 3 (moved from the former core /ring)
│   │   └── kepler/page.tsx           # /particle-dynamics/kepler — PD 6 (moved from the former core /kepler)
│   └── globals.css                   # Tailwind v4 import + CSS variables
├── components/
│   ├── SimulatorCanvas.tsx     # Polar canvas: ResizeObserver + DPR + RAF wiring
│   ├── ControlsPanel.tsx       # Polar sliders + visibility toggles
│   ├── PolarMetrics.tsx        # Polar live cards (React.memo)
│   ├── VectorLegend.tsx        # Polar colour legend (React.memo)
│   ├── EquationsPanel.tsx      # Polar collapsible formula panel (React.memo)
│   ├── StripChart.tsx          # Rolling real-time strip chart (React.memo)
│   ├── FunctionPlot.tsx        # Static function plotter: axes, markers, shading, hover (React.memo)
│   ├── SimulatorNav.tsx        # Grouped top nav: Home + core tabs + Particle Kinematics + Particle Dynamics, mobile menu
│   ├── HomeIndexClient.tsx     # / — landing page card grid (core simulators + both TP sections)
│   ├── LanguageToggle.tsx      # EN ↔ ES switch
│   ├── GitHubLink.tsx          # Repo icon link
│   ├── ring/                   # Ring-only aside panels (RingCanvas, RingControls, RingMetrics, …)
│   ├── pin-slot/                # Pin-slot-only aside panels
│   ├── quick-return/           # Quick-return-only aside panels
│   ├── pk/
│   │   ├── ExerciseNav.tsx     # Prev/next + jump-to dropdown + position, rendered by the section layout
│   │   └── ParticleKinematicsIndexClient.tsx  # Section index card grid
│   └── pd/
│       ├── ExerciseNav.tsx     # Same shape as pk's, but prev/next/jump-to skip `disabled` stub exercises
│       └── ParticleDynamicsIndexClient.tsx  # Section index card grid; renders `disabled` entries as non-clickable stubs
├── contexts/
│   └── LanguageContext.tsx     # EN / ES context, localStorage-backed, cross-tab sync
├── hooks/
│   ├── useSimulator.ts / useAnimationLoop.ts        # Polar state + RAF loop (semi-implicit Euler)
│   ├── useRingSimulator.ts / useRingAnimationLoop.ts # Ring state + RAF loop (RK4)
│   ├── usePinSlotSimulator.ts / usePinSlotAnimationLoop.ts
│   ├── useQuickReturnSimulator.ts / useQuickReturnAnimationLoop.ts
│   ├── useKeplerSimulator.ts / useKeplerAnimationLoop.ts   # Kepler state + RAF loop (PD 6)
│   └── usePreset.ts            # Reads shared `?preset=<id>` convention; falls back silently
├── lib/
│   ├── kinematics.ts, ringKinematics.ts, pinSlotKinematics.ts, quickReturnKinematics.ts, keplerKinematics.ts
│   ├── drawing.ts               # Canvas helpers, COLORS/COLORS_DARK palettes, renderFrame (polar) + shared helpers
│   ├── strip-chart.ts           # Rolling real-time sample buffer + drawing
│   ├── plot.ts                  # Static-plot helpers (scales, ticks, interpolation) backing FunctionPlot
│   ├── simulators.ts            # SIMULATORS registry — single source of truth for all navigation
│   └── i18n/                    # Translation modules — see below
│       ├── index.ts             # Merges all modules; exports Language, translations, TranslationKey
│       ├── common.ts, polar.ts, ring.ts, pin-slot.ts, quick-return.ts, kepler.ts
│       ├── pk/
│       │   ├── section.ts       # Section index / exercise-nav strings
│       │   └── exercises.ts     # PK 1–10 titles + one-line summaries
│       └── pd/
│           ├── section.ts       # Section index / exercise-nav strings
│           └── exercises.ts     # PD 1–14 titles + one-line summaries
└── types/
    ├── simulator.ts             # Barrel: re-exports everything below — import path unchanged
    └── polar.ts, ring.ts, pin-slot.ts, kepler.ts, quick-return.ts
```

## Key conventions

- **World coordinates**: Y-axis points up, geometric centre fixed at (0, 0). `worldToScreen` in `lib/drawing.ts` handles the Y flip and places the centre at `(W×0.45, H×0.50)`.
- All drawing helpers in `lib/drawing.ts` work in screen coordinates.
- The polar simulator uses `renderFrame` (in `lib/drawing.ts`) as a single render entry point. The ring simulator inlines its render in `useRingAnimationLoop` and reuses the lower-level helpers — there is intentionally no shared `renderRing` export.
- Physics is fully decoupled from rendering — `lib/kinematics.ts` and `lib/ringKinematics.ts` import no React or DOM.
- Frame-rate state is held in **refs** (`phiRef`, `omegaRef`, `thetaRef`, `thetaDotRef`, `traceRef`) so that the animation loop never triggers a re-render.
- Metrics are throttled to ~15 fps (`66ms` gate on `lastMetricUpdate`) to avoid saturating React's reconciler.
- The polar loop is **semi-implicit Euler** (good enough for kinematics-only). The ring loop is **4th-order Runge–Kutta** on `[θ, θ̇]` because the pendulum-form ODE is nonlinear and we need energy conservation visible to the user. Don't downgrade it.
- i18n: every user-facing string goes through `t(key)` from `LanguageContext`. Add new keys to both the `en` and `es` blocks of the relevant module under `src/lib/i18n/` simultaneously; `TranslationKey` is derived from the merged `en` in `src/lib/i18n/index.ts`. The public import path `@/lib/i18n` never changes — only add a new module file and wire it into `index.ts`.
- Navigation is registry-driven: `src/lib/simulators.ts` is the single source of truth. `SimulatorNav`, both section indices, and both `ExerciseNav`s all read `SIMULATORS`/`coreSimulators()`/`pkExercises()`/`pdExercises()` from there — adding or reordering a simulator should only ever touch this file plus its own slice.
- Adding a **core** simulator: add an entry to `SIMULATORS` with `group: "core"`, create `app/<name>/page.tsx` as a client component, and follow the standard split (one pure physics module, one state hook, one RAF hook, one canvas component, one or more aside panels).
- Adding a **particle-kinematics** exercise: add an entry with `group: "particle-kinematics"` and a `pk` number, create `app/particle-kinematics/<name>/page.tsx` (no need to re-declare `LanguageProvider` or `ExerciseNav` — the section `layout.tsx` provides both), and add its title/summary keys to `src/lib/i18n/pk/exercises.ts`.
- Adding a **particle-dynamics** exercise: same shape, under `group: "particle-dynamics"` with a `pd` number, route `app/particle-dynamics/<name>/page.tsx`, keys in `src/lib/i18n/pd/exercises.ts`. Registry entries not yet built keep `disabled: true` and `href: "/particle-dynamics"` — flip `disabled` off and point `href` at the real route once the page exists; the section index and `ExerciseNav` pick this up automatically.
- Shared `?preset=<id>` query-string convention: `usePreset(presets, fallback)` (`src/hooks/usePreset.ts`) reads it via `useSearchParams`, so any component calling it (directly or through a `use<Name>Simulator` hook) must render under a `<Suspense>` boundary. Unknown preset ids fall back silently.
- `FunctionPlot` (`src/components/FunctionPlot.tsx` + `src/lib/plot.ts`) is for **static** function/analytic plots (v(t), x(t), phase portraits …) — axes, ticks, markers, dashed reference lines, area shading, hover cursor. `StripChart` is for **rolling real-time** samples. Don't use one for the other's job.

## Common tasks

**Run dev server** (already running on port 3000):
```bash
npm run dev
```

**Type-check + build**:
```bash
npm run build
```

**Lint**:
```bash
npx eslint src/
```

## Physics quick reference

### Polar (`/polar`)

```
ptx = R·cos(φ),  pty = R·sin(φ)          point position on circle
dx  = ptx − poleX,  dy = pty − poleY
r   = √(dx² + dy²),  θ = atan2(dy, dx)

ṙ    = vx·cos θ + vy·sin θ  =  R·ω·sin(θ − φ)
rθ̇   = −vx·sin θ + vy·cos θ  =  R·ω·cos(φ − θ)
```

Special case — pole at (0, 0): `ṙ = 0` and `rθ̇ = R·ω` (pure rotation).

### Ring (`/particle-dynamics/ring`, PD 3)

θ measured from the bottom, CCW positive. Mass normalised to 1 throughout.

```
θ̈   = −(g/R)·sin θ                equation of motion
N   = g·cos θ + R·θ̇²              normal force (constraint maintained while N ≥ 0)
h   = R·(1 − cos θ)                height above bottom
v   = R·|θ̇|                        speed
KE  = ½·v²,  PE = g·h              per-unit-mass energy
E   = KE + PE = const              (smooth ring)
v_min = √(5·g·R)                   bottom speed for a complete loop
```

Solved with `rk4Step` in `lib/ringKinematics.ts` on the state `[θ, θ̇]`.
