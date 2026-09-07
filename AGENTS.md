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
| `/fireman-ladder` | Fireman's ladder (CCR N°14) — the first of the three 3D scenes: a ladder elevating at ω₂ while the turret spins at ω₁ and the ladder extends at ṡ. Rotating-reference-frame decomposition of v and a at the tip (transport + relative; Euler + centripetal + Coriolis), drawn with a hand-rolled orthographic projection the user can orbit by dragging. `s₀`/`θ₂₀` default to the statement's own s = 10 m, θ₂ = 30°, so t = 0 *is* the instant the exercise asks about; from there both sweep between stops so the 3D terms never go stale. No ODE — every quantity is a cross product |
| `/cam-follower`   | Cam and roller follower (Hibbeler 13-91) — the second 3D scene: a rod held vertical by a bearing rides on a smooth cam whose profile is z = A·sin θ. Newton's second law read backwards — the motion is given, the force is the unknown — after the chain rule turns the θ-parameterised profile into z̈ = −A·θ̇²·sin θ. Also surfaces the true surface-normal force N = N_z/cos φ, which coincides with the textbook's vertical component only at the extremes, and flags roller lift-off once A·θ̇² > g. No ODE |
| `/banked-curve`   | Banked curve with friction (Hibbeler 13-53 / 13-54) — a car on a horizontal circle of radius ρ over a banked road, so there is no vertical acceleration and the resultant is purely centripetal. N and f resolved on a horizontal and a vertical axis give N = m(g cos θ + (v²/ρ) sen θ) and f = m((v²/ρ) cos θ − g sen θ); both scale with m, so μ_req = f/N does not and the 1700 kg never reaches the answer. Setting f = ±μN gives v_max/v_min. Handles both degenerate cases explicitly: μ ≥ tan θ ⇒ v_min = 0, μ ≥ cot θ ⇒ v_max is null (unbounded). No ODE |
| `/parabolic-spring` | Block on a parabolic path with a spring (Hibbeler 13-74) — planar, not 3D. Path-intrinsic axes read straight off y = a − b·x²: t̂, n̂ and ρ = (1+y′²)^(3/2)/|y″|. Because the path is smooth, N does no work and the two equations decouple — ΣF_t = m·v̇ gives the rate of increase of speed as a function of position alone, and ΣF_n = m·v²/ρ then gives N. The roller guide keeps the spring horizontal, so its stretch is just x − L₀. The statement is a snapshot, but the page also integrates the real descent with RK4 on [x, v] (the tangential force varies along the path, so Euler would visibly bleed energy); startX/startSpeed default to the statement's x = 1 m, v = 4 m/s so t = 0 is the instant asked about. Flags N < 0 as the block leaving the path |
| `/oscillating-bar` | Rotating bar driving an oscillating bar through a sliding pin — planar. The loop closes as tan θ = b·sen φ/(d − b·cos φ); since ω is constant, φ̈ = 0 and both θ̇ = ω·dθ/dφ and θ̈ = ω²·d²θ/dφ² come out in closed form. Two structural facts the simulator surfaces: BC *oscillates* between ±arcsen(b/d) (±30° at OB = 2b), with θ̇ = 0 at the turning points; and at OB = OA it degenerates to a constant −ω/2. Also draws the full rotating-frame decomposition of a_A into Euler + centripetal + Coriolis + relative, which must close on b·ω² toward O — the planar twin of the fireman's ladder. Watch the sign: θ grows as the ray B→A turns *clockwise*, so ω_BC = −θ̇. No ODE |
| `/forced-vibration` | Forced vibration with viscous damping — m·ẍ + c·ẋ + k·x = F₀·cos(ωt), integrated with RK4 rather than assembled from the closed form (which splits into three damping regimes and degenerates at r = 1, ζ = 0 — one code path stays right through resonance). Everything follows from ω_n = √(k/m), ζ = c/(2√(km)) and r = ω/ω_n; X = δ_st/√[(1−r²)² + (2ζr)²]. Case buttons switch between forced and free response and between c = 500 and c = 0 — the exercise asks for all four. Note the system runs *above* resonance at r = 1.2, so removing the damper makes the amplitude worse (22.7 mm vs 13.4 mm). Distinct from `/mechanical-vibrations/vehicle-suspension`, which is base-excited and uses transmissibility |
| `/helicopter-lift` | Helicopter hover lift (Hibbeler, steady flow of a fluid stream) — not part of either TP, added as a standalone core exercise. The rotor's downwash is a control volume drawing in air at rest and expelling it at v, so the steady-flow form of Newton's second law, ΣF = ṁ·(v_out − v_in), reduces to a thrust T = ṁ·v with ṁ = (γ/g)·A·v (γ is a *weight* density, so it's divided by g before multiplying the volume flow rate A·v). L_max = T − W. Imperial units throughout (ft, lb, slug, g = 32.2 ft/s²) since that's how Hibbeler states it. No ODE |
| `/jet-climb` | Jet climb to level flight (variable-mass-flow propulsion + quadratic drag) — also standalone, not part of either TP. Thrust is steady, T = ṁ·v_rel, independent of the aircraft's own speed. The climb (constant speed, so ΣF = 0 along the path) fixes the drag law D = k·v² from T = D₀ + m·g·sen θ at v₀. The instant the pilot levels off, drag hasn't changed but gravity's along-path component vanishes, so a₀ = g·sen θ exactly — a clean sanity check independent of k. From there m·dv/dt = T − k·v² is separable with an exact tanh solution, v(t) = v_max·tanh(λt + atanh(v₀/v_max)), λ = √(Tk)/m, so no RK4 is needed despite being a genuine ODE. SI units (kg, m/s, N, g = 9.81 m/s²) |

Plus two grouped sections:

- **Particle Kinematics** (`/particle-kinematics`) — TP N°1, Cinemática del Punto Material (Mecánica Técnica, UTN FRBA). Ten exercise routes, all implemented, browsable via a section index and an exercise nav (prev/next, jump-to dropdown).
- **Particle Dynamics** (`/particle-dynamics`) — TP N°2, Dinámica del Punto Material (Mecánica Técnica, UTN FRBA). All fourteen exercises are implemented — PD 1 (`/particle-dynamics/viscous-impact`, a bullet decelerating linearly with distance through a viscous plate — dv/dx = −k/m is constant because the v·dv/dx substitution cancels the v, no ODE), PD 2 (`/particle-dynamics/parachutist`, linear-drag descent — the classic exact closed form v(t) = v_t + (v_0−v_t)e^(−t/τ), no numerical integration needed despite being "an ODE"), PD 3 (`/particle-dynamics/ring`, the vertical ring, moved here from the former core `/ring` route, RK4 integration of `θ̈ = −(g/R)·sin θ`, normal force, energy bookkeeping, `v_min = √(5gR)` threshold), PD 4 (`/particle-dynamics/atwood`, the Atwood machine — a = (m₂−m₁)g/(m₁+m₂+I/r²) generalizes the massless-pulley result to a pulley with real moment of inertia I, splitting the two-sided tension T₁≠T₂; I=0 recovers the textbook case, no ODE), PD 5 (`/particle-dynamics/parabolic-bowl`, a sphere sliding frictionlessly between two supports — N(x) from energy conservation + the track's curvature, and the L ≥ 2H design rule for a 4g limit at the vertex; the animation's timing is stylized since the true x(t) isn't simple harmonic, but N(x)/v(x) shown are exact), PD 6 (`/particle-dynamics/kepler`, orbital mechanics, moved here from the former core `/kepler` route — Mars return vehicle transfer trajectory, Kepler's laws, vis-viva), PD 7 (`/particle-dynamics/elevator-counterweight`, elevator/counterweight motor power — the motor drives the pulley itself, so power is a balance over the coupled system, P = (m_e+m_c)·v·a + (m_e−m_c)·g·v; the sign of P flips between driving and braking depending on speed/acceleration, no ODE), PD 8 (`/particle-dynamics/spring-stop`, a package sliding down a rough incline into a precompressed spring — the work-energy theorem gives a quadratic in the additional deformation δ, solved for its positive root, no ODE), PD 9 (`/particle-dynamics/pulley-friction`, two blocks linked by a 1:1 pulley, one dragged on the flat at angle θ and one hauled up an incline — F(θ) = (μ·weightA + T)/(cos θ + μ·sin θ) minimized at θ = arctan(μ), the classic "minimum force to drag a crate" result generalized with a cable tension term, no ODE), PD 10 (`/particle-dynamics/vehicle-power`, vehicle resistance and power — fits F(v) = a + bv² from two (speed, power) calibration readings via a 2×2 linear solve, then predicts power at another flat-road speed and on a graded road, no ODE), PD 11 (`/particle-dynamics/hoist`, hoist motor efficiency — a counterweight over a movable pulley genuinely relieves the motor: T₂ = load·g/2 at the pulley, T₁ = T₂ − counterweight·g at the motor, P_mech = T₁ · (2·v); counterweightMass is clamped to ≤ loadMass/2 so T₁ never goes negative, no ODE), PD 12 (`/particle-dynamics/escalator`, three-phase motor + escalator efficiency — closed-form P_elec = √3·V·I·cos φ vs. P_mech = n·m·g·h/t, no ODE), PD 13 (`/particle-dynamics/rail-car-coupling`, rail car coupling — momentum conservation gives v_f, the impulse-momentum theorem gives the mean coupling force; the canvas animates the closed-form linear velocity ramp during coupling, no ODE), and PD 14 (`/particle-dynamics/staged-rocket`, the rocket equation with gravity, v(t) = v_0 + v_rel·ln(m_0/m(t)) − g·t, comparing a single-stage vs. two-stage design side by side — max speed always lands exactly at burnout, no ODE).
- **Mechanical Vibrations** (`/mechanical-vibrations`) — TP N°3, Vibraciones Mecánicas (Mecánica Técnica, UTN FRBA). All seven exercises are implemented, plus a shared `lib/vibrationTransmissibility.ts` (`magnification`, `unbalanceMagnification`, `transmissibility`, `transmissibilityPeak`, `dampingRatioFrom`) that VIB 1/2/3/4 all build on instead of re-deriving the same closed forms — VIB 1 (`/mechanical-vibrations/rotating-unbalance`, a motor on 4 springs shaken by its own rotor's unbalance — the exciting force F₀ = m·e·ω² grows with speed, so the response is the unbalance factor r²/D rather than plain 1/D: it starts at zero and flattens to the asymptote m·e/M instead of dying away), VIB 2 (`/mechanical-vibrations/vehicle-suspension`, moved here from the former core `/vehicle-suspension` route — base-excited SDOF, 4 springs from static deflection, 4 dampers, displacement transmissibility; overdamped (ζ = 1.314) yet sitting exactly at resonance, with only 7% amplification), VIB 3 (`/mechanical-vibrations/vibration-isolation`, the only exercise that solves backwards — given a target transmissibility, a quadratic in u = r² gives the frequency ratio; handles both degenerate cases explicitly, the way `/banked-curve` handles its own: target ≥ the curve's own peak ⇒ reachable everywhere, negative discriminant/non-positive root ⇒ unattainable), VIB 4 (`/mechanical-vibrations/machine-element-base`, the same transmissibility as VIB 2 but k given directly and r = 0.536 sits below the r = √2 isolation crossover, so damping *helps* here — the opposite of VIB 3), VIB 5 (`/mechanical-vibrations/pressure-gauge`, an undamped design problem — the real design rule is a frequency margin ω₀/ω = √[(1+ε)/ε], not the piston mass itself; the same instrument run at r ≫ 1 is an accelerometer/seismograph), and VIB 6/7 (`/mechanical-vibrations/mass-release`, one module covering all four damping regimes for a mass released from a spring — VIB 7 reached via `?preset=mv7`; VIB 6's own numbers make the spring go slack (x₀ = 40 cm exceeds M₁'s own static deflection of 25 cm), which no textbook figure shows and the page flags explicitly; VIB 7 overlays the critically-damped comparison to show the overdamped response settles ~7× slower, the classic "more damping isn't always faster" result — the critical-damping closed form x₀(1+ω₀t)e^(−ω₀t) is guarded separately since the general s₁≠s₂ formula divides by zero there).

See `src/lib/simulators.ts` for the full registry and `README.md` for the per-exercise route tables.

`/` itself is a landing page (`src/components/HomeIndexClient.tsx`) — a card index linking to the two core simulators above, the Kepler orbital-mechanics exercise (pulled out of the Particle Dynamics group onto the home grid since it predates that section), and all three TP section cards.

Stack: **Next.js 16** · **React 19** · **TypeScript (strict)** · **Tailwind CSS v4** · native Canvas 2D API.

## Folder structure

Every exercise — core, PK, PD, or VIB — follows the same five-way split: one route (`app/.../<name>/page.tsx`), one pure physics module (`lib/<name>Kinematics.ts`, usually with a colocated `lib/<name>Kinematics.test.ts`), one state hook + one RAF hook (`hooks/use<Name>Simulator.ts` / `use<Name>AnimationLoop.ts`), one types file (`types/<name>.ts`), and one aside-panel folder (`components/<name>/` with Canvas/Controls/Metrics/Equations/Legend pieces) — except VIB 3 and VIB 5, which have no time evolution and skip the RAF hook, rendering a `FunctionPlot` in place of the Canvas component instead. The tree below shows that pattern once per group rather than enumerating every exercise — check `src/lib/simulators.ts` for the current, authoritative list of exercise ids.

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
│   │   └── <name>/page.tsx           # one dir per PK exercise route (pin-slot doubles as PK4 via ?preset=pk4)
│   ├── particle-dynamics/
│   │   ├── layout.tsx                # LanguageProvider + ExerciseNav for the whole section
│   │   ├── page.tsx                  # /particle-dynamics — section index (card grid, incl. disabled stubs)
│   │   └── <name>/page.tsx           # one dir per PD exercise route (ring = PD3, kepler = PD6, moved from the former core /ring and /kepler)
│   ├── mechanical-vibrations/
│   │   ├── layout.tsx                # LanguageProvider + ExerciseNav for the whole section
│   │   ├── page.tsx                  # /mechanical-vibrations — section index (card grid)
│   │   └── <name>/page.tsx           # one dir per VIB exercise route (vehicle-suspension = VIB2, moved from the former core /vehicle-suspension; mass-release doubles as VIB7 via ?preset=mv7)
│   └── globals.css                   # Tailwind v4 import + CSS variables
├── components/
│   ├── SimulatorCanvas.tsx     # Polar canvas: ResizeObserver + DPR + RAF wiring
│   ├── ControlsPanel.tsx       # Polar sliders + visibility toggles
│   ├── PolarMetrics.tsx        # Polar live cards (React.memo)
│   ├── VectorLegend.tsx        # Polar colour legend (React.memo)
│   ├── EquationsPanel.tsx      # Polar collapsible formula panel (React.memo)
│   ├── StripChart.tsx          # Rolling real-time strip chart (React.memo)
│   ├── FunctionPlot.tsx        # Static function plotter: axes, markers, shading, hover (React.memo)
│   ├── PhasorDiagram.tsx       # Phasor/vector diagram for AC-circuit exercises (escalator/hoist motors) (React.memo)
│   ├── SimulatorNav.tsx        # Grouped top nav: Home + core tabs + Particle Kinematics + Particle Dynamics + Mechanical Vibrations, mobile menu
│   ├── SimulatorHeader.tsx     # Shared per-page header: title + LanguageToggle + ThemeToggle + GitHubLink (React.memo)
│   ├── HomeIndexClient.tsx     # / — landing page card grid (core simulators + Kepler + all three TP sections)
│   ├── HomePolarPreview.tsx    # Mini animated polar preview on the home card (React.memo)
│   ├── ProjectCredits.tsx      # Footer credits block (React.memo)
│   ├── LanguageToggle.tsx      # EN ↔ ES switch
│   ├── ThemeToggle.tsx         # auto/light/dark cycle, localStorage-backed (`kinelab-theme`), overrides prefers-color-scheme
│   ├── GitHubLink.tsx          # Repo icon link
│   ├── Subscript.tsx           # `withSubscripts` — renders v_0-style text with real `<sub>` tags
│   ├── <name>/                 # one aside-panel folder per exercise — core (ring, pin-slot, quick-return, kepler),
│   │                           # every PK exercise, every PD exercise, and every VIB exercise — each with its own
│   │                           # Canvas/Controls/Metrics/Equations/Legend components (VIB 3/5: Plot instead of Canvas),
│   │                           # e.g. `ring/RingCanvas.tsx`, `atwood/AtwoodControls.tsx`, `mass-release/MassReleaseEquations.tsx`
│   ├── pk/
│   │   ├── ExerciseNav.tsx     # Prev/next + jump-to dropdown + position, rendered by the section layout
│   │   └── ParticleKinematicsIndexClient.tsx  # Section index card grid
│   ├── pd/
│   │   ├── ExerciseNav.tsx     # Same shape as pk's, but prev/next/jump-to skip `disabled` stub exercises
│   │   └── ParticleDynamicsIndexClient.tsx  # Section index card grid; renders `disabled` entries as non-clickable stubs
│   └── vib/
│       ├── ExerciseNav.tsx     # Same shape as pd's
│       └── MechanicalVibrationsIndexClient.tsx  # Section index card grid; also links out to /vibrations-quiz as an 8th "review" card
├── contexts/
│   └── LanguageContext.tsx     # EN / ES context, localStorage-backed, cross-tab sync
├── hooks/
│   ├── useSimulator.ts / useAnimationLoop.ts        # Polar state + RAF loop (semi-implicit Euler)
│   ├── use<Name>Simulator.ts / use<Name>AnimationLoop.ts  # one pair per exercise (core, PK, PD, VIB alike;
│   │                                                       # VIB 3/5 have no AnimationLoop — see above)
│   └── usePreset.ts            # Reads shared `?preset=<id>` convention; falls back silently
├── lib/
│   ├── kinematics.ts           # Polar physics (no ODE)
│   ├── <name>Kinematics.ts     # one pure physics module per exercise, most with a colocated `.test.ts` (Vitest)
│   ├── vibrationTransmissibility.ts  # Shared SDOF response functions — magnification, unbalanceMagnification,
│   │                                 # transmissibility, transmissibilityPeak, dampingRatioFrom — VIB 1/2/3/4 build on this
│   ├── drawing.ts               # Canvas helpers, COLORS/COLORS_DARK palettes, renderFrame (polar) + shared helpers
│   ├── strip-chart.ts           # Rolling real-time sample buffer + drawing
│   ├── plot.ts / plot.test.ts   # Static-plot helpers (scales, ticks, interpolation) backing FunctionPlot
│   ├── simulators.ts / simulators.test.ts  # SIMULATORS registry — single source of truth for all navigation
│   └── i18n/                    # Translation modules — see below
│       ├── index.ts             # Merges all modules; exports Language, translations, TranslationKey
│       ├── common.ts, polar.ts, ring.ts, pin-slot.ts, quick-return.ts, kepler.ts
│       ├── pk/
│       │   ├── section.ts       # Section index / exercise-nav strings
│       │   └── exercises.ts     # PK 1–10 titles + one-line summaries
│       ├── pd/
│       │   ├── section.ts       # Section index / exercise-nav strings
│       │   └── exercises.ts     # PD 1–14 titles + one-line summaries
│       └── vib/
│           ├── section.ts       # Section index / exercise-nav strings
│           ├── exercises.ts     # VIB 1–7 titles + one-line summaries
│           └── <name>.ts        # one module per VIB exercise (rotating-unbalance.ts, mass-release.ts, …)
└── types/
    ├── simulator.ts             # Barrel: re-exports everything below — import path unchanged
    └── polar.ts, ring.ts, quick-return.ts, kepler.ts, <name>.ts  # one file per exercise
```

## Key conventions

- **World coordinates**: Y-axis points up, geometric centre fixed at (0, 0). `worldToScreen` in `lib/drawing.ts` handles the Y flip and places the centre at `(W×0.45, H×0.50)`.
- All drawing helpers in `lib/drawing.ts` work in screen coordinates.
- The polar simulator uses `renderFrame` (in `lib/drawing.ts`) as a single render entry point. The ring simulator inlines its render in `useRingAnimationLoop` and reuses the lower-level helpers — there is intentionally no shared `renderRing` export.
- The three 3D simulators (`/fireman-ladder`, `/cam-follower`, `/banked-curve`) share `src/lib/vec3.ts` (vector algebra) and `src/lib/projection3d.ts` (a hand-rolled orthographic projection plus `strokePolyline3D`/`fillPolygon3D`/`drawBox3D`/`drawOrientedBox3D`/`drawVector3D`), with `Vec3`/`Camera3D` in `src/types/geometry3d.ts`. There is no perspective divide and no z-buffer — `depth()` exists only so solid shapes can painter-order their own faces. Everything else in the app is planar and uses the per-simulator `worldToScreen*` transforms in `drawing.ts`.
- Physics is fully decoupled from rendering — `lib/kinematics.ts` and `lib/ringKinematics.ts` import no React or DOM.
- Frame-rate state is held in **refs** (`phiRef`, `omegaRef`, `thetaRef`, `thetaDotRef`, `traceRef`) so that the animation loop never triggers a re-render.
- Metrics are throttled to ~15 fps (`66ms` gate on `lastMetricUpdate`) to avoid saturating React's reconciler.
- The polar loop is **semi-implicit Euler** (good enough for kinematics-only). The ring loop is **4th-order Runge–Kutta** on `[θ, θ̇]` because the pendulum-form ODE is nonlinear and we need energy conservation visible to the user. Don't downgrade it.
- i18n: every user-facing string goes through `t(key)` from `LanguageContext`. Add new keys to both the `en` and `es` blocks of the relevant module under `src/lib/i18n/` simultaneously; `TranslationKey` is derived from the merged `en` in `src/lib/i18n/index.ts`. The public import path `@/lib/i18n` never changes — only add a new module file and wire it into `index.ts`.
- Navigation is registry-driven: `src/lib/simulators.ts` is the single source of truth. `SimulatorNav`, all three section indices, and all three `ExerciseNav`s all read `SIMULATORS`/`coreSimulators()`/`pkExercises()`/`pdExercises()`/`vibExercises()` from there — adding or reordering a simulator should only ever touch this file plus its own slice.
- Adding a **core** simulator: add an entry to `SIMULATORS` with `group: "core"`, create `app/<name>/page.tsx` as a client component, and follow the standard split (one pure physics module, one state hook, one RAF hook, one canvas component, one or more aside panels).
- Adding a **particle-kinematics** exercise: add an entry with `group: "particle-kinematics"` and a `pk` number, create `app/particle-kinematics/<name>/page.tsx` (no need to re-declare `LanguageProvider` or `ExerciseNav` — the section `layout.tsx` provides both), and add its title/summary keys to `src/lib/i18n/pk/exercises.ts`.
- Adding a **particle-dynamics** exercise: same shape, under `group: "particle-dynamics"` with a `pd` number, route `app/particle-dynamics/<name>/page.tsx`, keys in `src/lib/i18n/pd/exercises.ts`. Registry entries not yet built keep `disabled: true` and `href: "/particle-dynamics"` — flip `disabled` off and point `href` at the real route once the page exists; the section index and `ExerciseNav` pick this up automatically.
- Adding a **mechanical-vibrations** exercise: same shape, under `group: "mechanical-vibrations"` with a `vib` number, route `app/mechanical-vibrations/<name>/page.tsx`, keys in `src/lib/i18n/vib/exercises.ts` plus its own `src/lib/i18n/vib/<name>.ts` module. Registry entries not yet built keep `disabled: true` and `href: "/mechanical-vibrations"`, same convention as PD. Two exercises sharing one route via `?preset=` (VIB 6/7) need `preset: "<id>"` on the registry entry and `usePreset` in the shared `use<Name>Simulator` hook — see `useMassReleaseSimulator.ts` / `usePinSlotSimulator.ts` for the render-time sync trick that keeps params in sync when navigating between two presets of the same route without a remount.
- Shared `?preset=<id>` query-string convention: `usePreset(presets, fallback)` (`src/hooks/usePreset.ts`) reads it via `useSearchParams`, so any component calling it (directly or through a `use<Name>Simulator` hook) must render under a `<Suspense>` boundary. Unknown preset ids fall back silently.
- `FunctionPlot` (`src/components/FunctionPlot.tsx` + `src/lib/plot.ts`) is for **static** function/analytic plots (v(t), x(t), phase portraits …) — axes, ticks, markers, dashed reference lines, area shading, hover cursor. `StripChart` is for **rolling real-time** samples. Don't use one for the other's job.
- Dark mode is a three-way `auto`/`light`/`dark` toggle (`ThemeToggle.tsx`), not purely `prefers-color-scheme` — `auto` defers to the media query, `light`/`dark` pin it and persist to `localStorage["kinelab-theme"]`. Any component that reads `prefers-color-scheme` directly for canvas colors (`StripChart`, `FunctionPlot`, `PhasorDiagram`, the ring energy chart, `MotionGraphsCanvas`, `ParabolicTrackCanvas`) is following the resolved `dark` class on `<html>`, not the raw media query, so it stays correct under a manual override.
- Physics modules are unit-tested with **Vitest** (`vitest.config.mts`) — most `lib/<name>Kinematics.ts` files have a colocated `<name>Kinematics.test.ts`. Run with `npm test`. New pure-physics modules should get a test file alongside them; rendering/hook code is not tested.

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

**Unit tests** (pure physics modules only, Vitest):
```bash
npm test         # run once
npm run test:watch
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
