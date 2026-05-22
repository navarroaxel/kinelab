@AGENTS.md

# Kinelab — Polar Coordinates Simulator

## Project overview

Client-side educational simulator that animates a point undergoing uniform circular motion and visualises its kinematics in both Cartesian and polar coordinates. The pole (origin of the polar frame) is freely draggable away from the circle centre, making the non-trivial polar velocity decomposition visible in real time.

Stack: **Next.js 16** · **React 19** · **TypeScript (strict)** · **Tailwind CSS v4** · native Canvas 2D API.

## Folder structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, Geist fonts, metadata
│   ├── page.tsx            # Entry point — client component, mounts simulator
│   └── globals.css         # Tailwind v4 import + CSS variables
├── components/
│   ├── SimulatorCanvas.tsx # Canvas element: ResizeObserver + DPR + RAF wiring
│   ├── ControlsPanel.tsx   # Sliders (pole, radius, ω) + visibility toggles
│   ├── PolarMetrics.tsx    # Live cards: r, θ, ṙ, rθ̇  (React.memo)
│   ├── VectorLegend.tsx    # Static colour legend (React.memo)
│   └── EquationsPanel.tsx  # Collapsible formula panel (React.memo)
├── hooks/
│   ├── useSimulator.ts     # Central state: params, visibility, paused, refs
│   └── useAnimationLoop.ts # requestAnimationFrame loop, metrics throttle
├── lib/
│   ├── kinematics.ts       # Pure physics: computeKinematics()
│   └── drawing.ts          # Canvas helpers + renderFrame() + colour palettes
└── types/
    └── simulator.ts        # SimulatorParams, VisibilityState, KinematicState
```

## Key conventions

- **World coordinates**: Y-axis points up, circle centre fixed at (0, 0).
- **Screen coordinates**: Y-axis points down; `worldToScreen` in `lib/drawing.ts` handles the flip and places the centre at `(W×0.45, H×0.50)`.
- All drawing helpers in `lib/drawing.ts` work in screen coordinates.
- `renderFrame` is the single render entry point called each RAF tick.
- Physics is fully decoupled from rendering — `lib/kinematics.ts` has no side effects.
- `phiRef` and `traceRef` are refs (not state) to avoid triggering re-renders on every frame.
- Metrics are throttled to ~15 fps via `lastMetricUpdate` to avoid saturating React's reconciler.

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

```
ptx = R·cos(φ),  pty = R·sin(φ)          point position on circle
dx  = ptx − poleX,  dy = pty − poleY
r   = √(dx² + dy²),  θ = atan2(dy, dx)

ṙ    = vx·cos θ + vy·sin θ  =  R·ω·sin(θ − φ)
rθ̇   = −vx·sin θ + vy·cos θ  =  R·ω·cos(φ − θ)
```

Special case — pole at (0, 0): ṙ = 0 and rθ̇ = R·ω = constant (pure rotation).
