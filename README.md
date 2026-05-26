# Kinelab — Interactive Physics Simulators

A browser-based set of small, focused physics simulators built with Next.js + Canvas. Each one isolates a single concept and visualises it in real time.

## Simulators

| Route | Title | Concept |
|---|---|---|
| [`/`](http://localhost:3000/)        | **Polar coordinates** | Cartesian ↔ polar decomposition of circular motion with a freely movable pole |
| [`/ring`](http://localhost:3000/ring) | **Vertical ring**     | Particle on the inside of a smooth vertical ring — RK4 integration of `θ̈ = −(g/R)·sin θ`, normal force, and the loop threshold `v_min = √(5gR)` |

Switch between them via the tab nav in the top-right of either page.

### `/` Polar coordinates

The key insight it makes visible: move the pole (origin of the polar frame) away from the circle center and watch the radial velocity ṙ and transverse velocity rθ̇ become non-zero — even though the path is still a perfect circle.

- Animated canvas with configurable angular velocity ω and angular acceleration α
- Freely movable pole via sliders; polar vectors update instantly
- Polar velocity vectors `ṙ·eᵣ` (radial) and `rθ̇·eₒ` (transverse)
- Polar / tangential / normal acceleration vectors (toggle on)
- Cartesian projection lines + live x / y labels
- Strip charts: polar velocity vs. time, tangential acceleration vs. time
- Live metrics: r, θ, ṙ, rθ̇, ω, aₜ

### `/ring` Vertical ring

A particle constrained to slide on the inside of a smooth ring of radius R in a uniform gravitational field. The simulation integrates `θ̈ = −(g/R)·sin θ` with 4th-order Runge–Kutta and surfaces the dynamics in real time:

- Sliders for R, g, and the initial bottom speed v₀
- Force vectors: weight mg, normal force N (dashed when contact is lost), tangent velocity v
- KE / PE stacked energy bar — energy conservation visible at a glance, with a drift warning when RK4 error exceeds 1%
- Live metrics: θ, v, N, h, KE, PE; N card turns red when contact is lost
- v_min indicator: the slider shows `v₀ / v_min` and where the threshold sits
- Equations panel covering the equation of motion, normal force, v_min derivation, and energy conservation

## Shared features

- **EN / ES toggle** — persisted in localStorage, syncs across tabs
- **Automatic dark mode** via `prefers-color-scheme`
- **Retina-sharp** — DPR-aware canvas scaling + `ResizeObserver`
- **Pure physics** — `lib/kinematics.ts` (polar) and `lib/ringKinematics.ts` (ring) have no React or DOM dependencies

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
