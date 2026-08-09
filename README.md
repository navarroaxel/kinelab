# Kinelab — Interactive Physics Simulators

A browser-based set of small, focused physics simulators built with Next.js + Canvas. Each one isolates a single concept and visualises it in real time.

## Simulators

| Route | Title | Concept |
|---|---|---|
| [`/`](http://localhost:3000/) | **Home** | Landing page — a card index linking to every simulator below |
| [`/polar`](http://localhost:3000/polar) | **Polar coordinates** | Cartesian ↔ polar decomposition of circular motion with a freely movable pole |
| [`/quick-return`](http://localhost:3000/quick-return) | **Quick-return mechanism** | Crank AB drives an oscillating bar OQ and a tool slider P — the cutting and return strokes take unequal time |
| [`/particle-kinematics`](http://localhost:3000/particle-kinematics) | **Particle Kinematics (TP N°1)** | Ten exercises from Cinemática del Punto Material, Mecánica Técnica — UTN FRBA (see table below) |
| [`/particle-dynamics`](http://localhost:3000/particle-dynamics) | **Particle Dynamics (TP N°2)** | Fourteen exercises from Dinámica del Punto Material, Mecánica Técnica — UTN FRBA (see table below) |

Switch between them via the tab nav in the top-right of any page; on narrow screens it collapses into a menu button.

### Particle Kinematics section (`/particle-kinematics`)

A browsable set of the ten exercises from TP N°1, with prev/next navigation, a jump-to dropdown, and a section index with one card per exercise.

| Exercise | Route |
|---|---|
| PK 1 — Cyclist with air drag | `/particle-kinematics/drag-descent` |
| PK 2 — Stopping distance | `/particle-kinematics/stopping-distance` |
| PK 3 — Skater on a parabolic profile | `/particle-kinematics/parabolic-track` |
| PK 4 — Pin-slot, degenerate case (d = r) | `/particle-kinematics/pin-slot?preset=pk4` |
| PK 5 — Motion graph builder | `/particle-kinematics/motion-graphs` |
| PK 6 — Pin in a circular slot | `/particle-kinematics/pin-slot` |
| PK 7 — Cable, pulleys and blocks | `/particle-kinematics/cable-blocks` |
| PK 8 — Radar-tracked aircraft | `/particle-kinematics/radar-tracking` |
| PK 9 — Satellite in circular orbit | `/particle-kinematics/circular-orbit` |
| PK 10 — Elevator and pulley | `/particle-kinematics/elevator-cable` |

All ten exercises are implemented — see `src/lib/simulators.ts` for the registry driving this table.

### Particle Dynamics section (`/particle-dynamics`)

A browsable set of the fourteen exercises from TP N°2, same nav pattern as the kinematics section. All fourteen exercises have working simulators.

| Exercise | Route |
|---|---|
| PD 1 — Bullet through a viscous plate | `/particle-dynamics/viscous-impact` |
| PD 2 — Parachutist with linear drag | `/particle-dynamics/parachutist` |
| PD 3 — Particle in a vertical ring | `/particle-dynamics/ring` |
| PD 4 — Atwood machine | `/particle-dynamics/atwood` |
| PD 5 — Sphere on a parabolic track | `/particle-dynamics/parabolic-bowl` |
| PD 6 — Orbital transfer thrust factors | `/particle-dynamics/kepler` |
| PD 7 — Elevator and counterweight power | `/particle-dynamics/elevator-counterweight` |
| PD 8 — Spring-stopped package on an incline | `/particle-dynamics/spring-stop` |
| PD 9 — Pulleys and blocks with friction | `/particle-dynamics/pulley-friction` |
| PD 10 — Vehicle resistance and power | `/particle-dynamics/vehicle-power` |
| PD 11 — Hoist motor efficiency | `/particle-dynamics/hoist` |
| PD 12 — Escalator motor efficiency | `/particle-dynamics/escalator` |
| PD 13 — Rail car coupling | `/particle-dynamics/rail-car-coupling` |
| PD 14 — Staged rocket launch | `/particle-dynamics/staged-rocket` |

See `src/lib/simulators.ts` for the registry driving this table.

### `/polar` Polar coordinates

The key insight it makes visible: move the pole (origin of the polar frame) away from the circle center and watch the radial velocity ṙ and transverse velocity rθ̇ become non-zero — even though the path is still a perfect circle.

- Animated canvas with configurable angular velocity ω and angular acceleration α
- Freely movable pole via sliders; polar vectors update instantly
- Polar velocity vectors `ṙ·eᵣ` (radial) and `rθ̇·eₒ` (transverse)
- Polar / tangential / normal acceleration vectors (toggle on)
- Cartesian projection lines + live x / y labels
- Strip charts: polar velocity vs. time, tangential acceleration vs. time
- Live metrics: r, θ, ṙ, rθ̇, ω, aₜ

### `/particle-dynamics/ring` Vertical ring (PD 3)

A particle constrained to slide on the inside of a smooth ring of radius R in a uniform gravitational field. The simulation integrates `θ̈ = −(g/R)·sin θ` with 4th-order Runge–Kutta and surfaces the dynamics in real time:

- Sliders for R, g, and the initial bottom speed v₀
- Force vectors: weight mg, normal force N (dashed when contact is lost), tangent velocity v
- KE / PE stacked energy bar — energy conservation visible at a glance, with a drift warning when RK4 error exceeds 1%
- Live metrics: θ, v, N, h, KE, PE; N card turns red when contact is lost
- v_min indicator: the slider shows `v₀ / v_min` and where the threshold sits
- Equations panel covering the equation of motion, normal force, v_min derivation, and energy conservation

## Shared features

- **EN / ES toggle** — persisted in localStorage, syncs across tabs
- **Dark mode** — auto/light/dark toggle; `auto` follows `prefers-color-scheme`, `light`/`dark` pin and persist the choice
- **Retina-sharp** — DPR-aware canvas scaling + `ResizeObserver`
- **Pure physics** — every simulator's physics lives in its own `lib/<name>Kinematics.ts` module with no React or DOM dependencies; most are unit-tested with Vitest (`npm test`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build   # type-checks + produces optimised output
npm run start   # serve the production build locally
npm test        # run the Vitest suite for the pure physics modules
```

## Deploy

Zero-config deploy to Vercel:

```bash
npx vercel
```

No environment variables required — both pages are entirely client-side.

## Physics quick reference

### Polar simulator

A point P moves on a circle of radius R centered at the origin:

```
x(t) = R·cos(φ(t))
y(t) = R·sin(φ(t))     φ̇ = ω
```

Given a pole O′ at (x₀, y₀), the polar vector r points from O′ to P:

```
r = √[(x−x₀)² + (y−y₀)²]
θ = atan2(y−y₀, x−x₀)
```

Projecting Cartesian velocity onto the polar unit vectors:

```
ṙ    = R·ω·sin(θ − φ)
rθ̇   = R·ω·cos(φ − θ)
```

When the pole coincides with the circle center: θ = φ, so ṙ = 0 and rθ̇ = R·ω = constant. Move the pole off-center and both components become time-varying.

### Ring simulator

θ measured from the bottom of the ring, CCW positive. With mass normalised to 1:

```
θ̈ = −(g/R) · sin θ                  equation of motion (pendulum form)
N  = g · cos θ + R · θ̇²              normal force
h  = R · (1 − cos θ)                  height above bottom
E  = ½·v² + g·h         = const       energy conservation (smooth ring)
v_min = √(5·g·R)                       minimum bottom speed for a complete loop
```

`v_min` comes from imposing `N ≥ 0` at the top (`v_top ≥ √(g·R)`) plus energy conservation across `Δh = 2R`.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language  | TypeScript 5 (strict) |
| Styles    | Tailwind CSS v4 |
| Animation | Native `requestAnimationFrame` |
| Integrator (ring) | 4th-order Runge–Kutta on `[θ, θ̇]` |
| Runtime   | Node ≥ 20 |

## License

[MIT](LICENSE) © Axel Navarro
