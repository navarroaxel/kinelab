<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Kinelab — Interactive Physics Simulators

## Project overview

Client-side educational simulators. Each route isolates one concept and animates it in a Canvas-driven page. The architecture deliberately repeats the same shape across simulators so that adding a new one is a matter of cloning a small, well-defined slice.

Currently two simulators:

| Route   | Concept |
|---------|---------|
| `/`     | Polar coordinates — Cartesian ↔ polar decomposition of circular motion with a freely movable pole |
| `/ring` | Vertical ring — particle inside a smooth vertical ring, RK4 integration of `θ̈ = −(g/R)·sin θ`, normal force, energy bookkeeping, `v_min = √(5gR)` threshold |

Stack: **Next.js 16** · **React 19** · **TypeScript (strict)** · **Tailwind CSS v4** · native Canvas 2D API.

## Folder structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, Geist fonts, metadata
│   ├── page.tsx                # / — polar simulator (client component, inline composition)
│   ├── ring/
│   │   └── page.tsx            # /ring — vertical ring simulator (client component, inline)
│   └── globals.css             # Tailwind v4 import + CSS variables
├── components/
│   ├── SimulatorCanvas.tsx     # Polar canvas: ResizeObserver + DPR + RAF wiring
│   ├── ControlsPanel.tsx       # Polar sliders + visibility toggles
│   ├── PolarMetrics.tsx        # Polar live cards (React.memo)
│   ├── VectorLegend.tsx        # Polar colour legend (React.memo)
│   ├── EquationsPanel.tsx      # Polar collapsible formula panel (React.memo)
│   ├── StripChart.tsx          # Time-series strip chart (polar only) (React.memo)
│   ├── SimulatorNav.tsx        # Cross-page tab nav (Polar / Ring)
│   ├── LanguageToggle.tsx      # EN ↔ ES switch
│   ├── GitHubLink.tsx          # Repo icon link
│   └── ring/
│       ├── RingCanvas.tsx      # Ring canvas: ResizeObserver + DPR + RAF wiring
│       ├── RingControls.tsx    # Ring sliders + toggles + reset / pause
│       ├── RingMetrics.tsx     # Ring live cards + v_min indicator (React.memo)
│       ├── RingEnergyBar.tsx   # Stacked KE / PE bar with drift warning (React.memo)
│       ├── RingLegend.tsx      # Ring colour legend (React.memo)
│       └── RingEquations.tsx   # Ring collapsible formula panel (React.memo)
├── contexts/
│   └── LanguageContext.tsx     # EN / ES context, localStorage-backed, cross-tab sync
├── hooks/
│   ├── useSimulator.ts         # Polar state: params, visibility, refs, paused
│   ├── useAnimationLoop.ts     # Polar RAF loop (semi-implicit Euler), metrics throttle
│   ├── useRingSimulator.ts     # Ring state: params, visibility, integration refs
│   └── useRingAnimationLoop.ts # Ring RAF loop (RK4), direct render
├── lib/
│   ├── kinematics.ts           # Pure physics: computeKinematics()
│   ├── ringKinematics.ts       # Pure physics: rk4Step, computeRingState, computeVMin, speedToThetaDot, classifyMotion
│   ├── drawing.ts              # Canvas helpers, COLORS/COLORS_DARK palettes, renderFrame (polar) + ring helpers
│   ├── strip-chart.ts          # Strip-chart drawing + sample buffer
│   └── i18n.ts                 # Translation table + Language type + TranslationKey type
└── types/
    └── simulator.ts            # Polar + ring shared types
```

## Key conventions

- **World coordinates**: Y-axis points up, geometric centre fixed at (0, 0). `worldToScreen` in `lib/drawing.ts` handles the Y flip and places the centre at `(W×0.45, H×0.50)`.
- All drawing helpers in `lib/drawing.ts` work in screen coordinates.
- The polar simulator uses `renderFrame` (in `lib/drawing.ts`) as a single render entry point. The ring simulator inlines its render in `useRingAnimationLoop` and reuses the lower-level helpers — there is intentionally no shared `renderRing` export.
- Physics is fully decoupled from rendering — `lib/kinematics.ts` and `lib/ringKinematics.ts` import no React or DOM.
- Frame-rate state is held in **refs** (`phiRef`, `omegaRef`, `thetaRef`, `thetaDotRef`, `traceRef`) so that the animation loop never triggers a re-render.
- Metrics are throttled to ~15 fps (`66ms` gate on `lastMetricUpdate`) to avoid saturating React's reconciler.
- The polar loop is **semi-implicit Euler** (good enough for kinematics-only). The ring loop is **4th-order Runge–Kutta** on `[θ, θ̇]` because the pendulum-form ODE is nonlinear and we need energy conservation visible to the user. Don't downgrade it.
- i18n: every user-facing string goes through `t(key)` from `LanguageContext`. Add new keys to both `en` and `es` blocks of `src/lib/i18n.ts` simultaneously; `TranslationKey` is derived from `en`.
- Adding a new simulator: add a route to `SimulatorNav.ts`'s `ITEMS`, create `app/<name>/page.tsx` as a client component, and follow the polar/ring split (one pure physics module, one state hook, one RAF hook, one canvas component, one or more aside panels).

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

### Polar (`/`)

```
ptx = R·cos(φ),  pty = R·sin(φ)          point position on circle
dx  = ptx − poleX,  dy = pty − poleY
r   = √(dx² + dy²),  θ = atan2(dy, dx)

ṙ    = vx·cos θ + vy·sin θ  =  R·ω·sin(θ − φ)
rθ̇   = −vx·sin θ + vy·cos θ  =  R·ω·cos(φ − θ)
```

Special case — pole at (0, 0): `ṙ = 0` and `rθ̇ = R·ω` (pure rotation).

### Ring (`/ring`)

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
