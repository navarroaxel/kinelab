# Kinelab — Polar Coordinates Simulator

An interactive browser simulator that shows, in real time, the relationship between Cartesian and polar coordinates for a point undergoing uniform circular motion.

The key insight it makes visible: move the pole (origin of the polar frame) away from the circle centre and watch the radial velocity ṙ and transverse velocity rθ̇ become non-zero — even though the path is still a perfect circle.

## Features

- **Animated canvas** — point moves at a configurable angular velocity
- **Freely movable pole** — drag via sliders; polar vectors update instantly
- **Polar velocity vectors** — ṙ·eᵣ (radial) and rθ̇·eₒ (transverse) drawn from the point
- **Polar acceleration vectors** — aᵣ and aₒ (toggle on)
- **Cartesian coordinate display** — dashed projection lines + live x/y labels
- **r vector + θ arc** — pole-to-point vector with angle indicator
- **Path trace** — fades trail of the point across the polar frame
- **Live metrics panel** — r, θ, ṙ, rθ̇ updating at ~15 fps
- **Equations panel** — collapsible, shows only the formulas relevant to active layers
- **Dark mode** — automatic via `prefers-color-scheme`
- **Retina-sharp** — DPR-aware canvas scaling + ResizeObserver

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

No environment variables required — the app is entirely client-side.

## Physics

A point P moves on a circle of radius R centred at the origin:

```
x(t) = R·cos(φ(t))
y(t) = R·sin(φ(t))     φ̇ = ω (constant)
```

Given a pole O′ at (x₀, y₀), the polar vector r points from O′ to P:

```
r = √[(x−x₀)² + (y−y₀)²]
θ = atan2(y−y₀, x−x₀)
```

Projecting the Cartesian velocity onto the polar unit vectors eᵣ and eₒ:

```
ṙ    = R·ω·sin(φ − θ)
rθ̇   = R·ω·cos(φ − θ)
```

When the pole coincides with the circle centre: θ = φ, so ṙ = 0 and rθ̇ = R·ω = constant. Move the pole off-centre and both components become time-varying, illustrating that "constant speed on a circle" does not mean "constant polar velocity components".

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Styles | Tailwind CSS v4 |
| Animation | Native `requestAnimationFrame` |
| State | `useState` + `useReducer`-style reducer |
| Runtime | Node ≥ 20 |
