# TP N°4 — Rigid Body Kinematics section

Plan for adding *Cinemática del Cuerpo Rígido* (Mecánica Técnica, UTN FRBA,
Unidad IV) to kinelab as a new section, following the `/particle-kinematics`
(TP N°1) and `/particle-dynamics` (TP N°2) patterns.

Exercises are prefixed **RB** and live under `/rigid-body-kinematics`.

---

## 0. Conventions to follow

Nothing here is new — mirror what TP 1 and TP 2 already do:

- One entry per exercise in `src/lib/simulators.ts`. That registry drives the
  nav, the section index cards and the README tables; do not hand-write those.
- Physics lives in `src/lib/<name>Kinematics.ts`, pure TypeScript, no React and
  no DOM. Every module gets a Vitest spec.
- Section page with prev/next navigation, jump-to dropdown, and one card per
  exercise.
- EN/ES strings for every label, equation caption and metric.
- Canvas is DPR-aware with a `ResizeObserver`; dark mode via the existing
  theme toggle.
- Each exercise page carries an equations panel stating the vector relations it
  implements, the same way `/particle-dynamics/ring` does.

---

## 1. What already exists — reuse, don't rebuild

Two routes in the repo already cover TP 4 material:

| Existing route | Relationship to TP 4 |
| --- | --- |
| `/fireman-ladder` | **Is** CCR N°14. Move it into the section as RB 6; keep a redirect from the old route. |
| `/oscillating-bar` | Close cousin of CCR N°16 (rotating bar, pin sliding in a slot, Coriolis term). Fork it or drive the CCR 16 geometry through a preset. |

Before Phase 2 and 3, extract the reusable parts of `/fireman-ladder`:

- `Scene3D` — orbitable axonometric camera, axis triad, DPR handling
- `src/lib/rotationComposition.ts` — build Ω from a chain of relative
  rotations and derive γ = dΩ/dt by differentiating each carried axis

Both are needed by three exercises each, so they pay for themselves.

---

## 2. Exercise map

| # | Route | Source | Kind |
| --- | --- | --- | --- |
| RB 1 | `/rigid-body-kinematics/box-diagonal` | CCR 1 | 3D |
| RB 2 | `/rigid-body-kinematics/cube-rotations` | CCR 2 | 3D |
| RB 3 | `/rigid-body-kinematics/three-bar-linkage` | CCR 6 | planar |
| RB 4 | `/rigid-body-kinematics/wheel-collar` | CCR 7 | planar |
| RB 5 | `/rigid-body-kinematics/four-bar` | CCR 10 | planar |
| RB 6 | `/rigid-body-kinematics/fireman-ladder` | CCR 14 | 3D (migrated) |
| RB 7 | `/rigid-body-kinematics/planetary-reducer` | CCR 15 | planar |
| RB 8 | `/rigid-body-kinematics/pin-slot-bar` | CCR 16 | planar |
| RB 9 | `/rigid-body-kinematics/liquid-ring` | CCR 11 | symbolic / plot |
| RB 10 | `/rigid-body-kinematics/disc-on-arm` | CCR 21 | 3D |

---

## 3. Phasing

Each phase is one PR. Stop and show the diff at the end of each.

### Phase 0 — scaffold

Section route, registry entries for all ten exercises, nav wiring, index cards,
README.md and README.es.md rows. Every exercise page is a stub. No physics.

This phase exists to lock the conventions before any real work lands.

### Phase 1 — migrate

- Move `/fireman-ladder` to `/rigid-body-kinematics/fireman-ladder`, redirect
  the old route.
- Extract `Scene3D` and `rotationComposition.ts`; refactor the migrated ladder
  onto them so the extraction is proven by a working consumer.
- Build RB 8 (CCR 16) from `/oscillating-bar`.

### Phase 2 — planar linkages (RB 3, 4, 5, 7)

Build `src/lib/planarRigidBody.ts` first:

- velocity field of a rigid body, `v_P = v_Q + ω × r_P/Q`
- instantaneous centre from two known velocity directions
- ω from two points of the same body
- acceleration field with normal and tangential split

Then the four sims are geometry plus a shared bar/pin/roller/gear drawing kit.

### Phase 3 — spatial rotations (RB 1, 2, 10)

Consumers of `Scene3D` + `rotationComposition.ts`. Each renders the body, the
Ω vector, the γ vector, and v/a at the requested point, with a slider for the
animation and a freeze button at the instant stated in the problem.

### Phase 4 — RB 9 (CCR 11)

Different shape from the rest: the deliverable is |a| as a function of φ with
the four marked points, not an animation. Reuse the strip-chart code from
`/polar`. A small animated ring on the side showing P at the current φ is
enough of a visual.

### Phase 5 — docs

README.md + README.es.md section tables, a short physics quick-reference block
for the section (Ω composition and the γ = dΩ/dt rule), and a note in AGENTS.md
if any new shared module deserves a mention.

---

## 4. Exercise data and expected results

Use these as the Vitest fixtures. They are the acceptance criteria for the
physics modules — build the module against the numbers, then the UI.

### RB 1 — Box rotating about diagonal HB (CCR 1)

Box 15 × 8 × 5 cm, rotating about diagonal HB at ω = 14 s⁻¹, counter-clockwise
seen from B. J is the centre of face ABFE.

```
v_J = (0, 15.8013, −47.4039) cm/s
a_J = (−624.204, 299.618, 99.8726) cm/s²
```

### RB 2 — Cube with four simultaneous rotations (CCR 2)

Cube of edge b = 2 m; ω₁ = ω₄ = 6 s⁻¹, ω₂ = ω₃ = 4 s⁻¹. Reduce the four
rotations to a resultant, then verify at F and G.

```
v_F = v_G = (−12, 12, −8) m/s
```

The teaching point is the reduction itself — render the four input vectors and
the resultant side by side.

### RB 3 — Three-bar linkage (CCR 6)

Bars OA, AB, BO₁ in the plane. OA = 15 cm, AO₁ = 10 cm, 20° angles as in the
figure. Midpoint D of BO₁ has v_D = 25 cm/s.

```
ω_OB = 9.4 rad/s ; ω_AB = 9.4 rad/s ; ω_OA = 2.28 rad/s
```

### RB 4 — Collar, bar and rolling wheel (CCR 7)

Collar D descends at 360 mm/s; the wheel rolls without slipping. Dimensions
60 / 220 / 160 / 80 mm as in the figure.

```
ω_BD = 0.9 rad/s (clockwise) ; v_A = 144 mm/s (leftward)
```

### RB 5 — Four-bar linkage (CCR 10)

ω_CD = 6 rad/s. With D at the origin: C = (0, 0.6), B = (−0.6, 0.6),
E = (−0.3, 0.6) the midpoint of BC, A the fixed pin of AB at 30°.

```
ω_AB = 6 rad/s (CCW) ; ω_BC = −10.39 rad/s (CW) ; v_E = 4.76 m/s
CIR of BC = (0, 0.946)
```

**The statement does not give the length of AB.** It is inferred as 1.2 m from
the figure (AB·sin 30° = 0.6 m, i.e. A sits at floor level with D). Expose it
as an adjustable input defaulting to 1.2 m and state the inference in the
equations panel.

### RB 6 — Fireman's ladder (CCR 14) — already implemented

ω₁ = 0.8 rad/s about the vertical, ω₂ = 0.5 rad/s elevation, extension at
1.5 m/s, s = 10 m, θ₂ = 30°.

```
Ω = (0.5, 0, 0.8) ; γ = (0, 0.4, 0)
v_B = (−6.928, −1.201, 5.08) m/s
a_B = (1.92, −8.46, 0.05) m/s²
```

Verify the migrated module still matches these before refactoring it onto
`Scene3D`.

### RB 7 — Planetary reducer (CCR 15)

Sun A and three planets B, C, D all r = 20 cm; ring E fixed, inner radius
r_E = r_A + 2r = 60 cm (not given in the statement — derive it and say so).
ω_A = 1200 rpm **counter-clockwise**.

```
v_J (sun–planet contact) = 25.13 m/s
v_O (planet centre)      = 12.57 m/s
ω_planet  = 600 rpm (clockwise)
ω_carrier = 300 rpm (counter-clockwise, same sense as A)
reduction ratio = r_A / (r_A + r_E) = 1/4
```

The planet's contact with the fixed ring is its instantaneous centre — make
that point visually explicit, it is the whole solution.

Planets C and D are there for load balance and contribute nothing to the
kinematics; say so in the panel.

### RB 8 — Pin in slot (CCR 16)

Bar BO rotates about O at ω = 2 rad/s clockwise, constant. Pin A of bar AC
slides in the slot. At the instant analysed θ = 45° and AC is horizontal.
With C at the origin: A = (20, 0), O = (40, 20) cm.

```
v_arr = (−40, 40) ; v_rel = (40, 40) ; v_A = (0, 80) cm/s
ω_AC = 4 rad/s (CCW)

a_arr = (80, 80) ; a_cor = (160, −160) ; a_rel = (−560, −560) cm/s²
a_A   = (−320, −640) cm/s²
γ_AC  = −32 rad/s² (clockwise)
```

Coriolis is 226 cm/s² here — roughly twice the transport term. Dropping it
gives γ = 24 instead of 32, so make the term a toggle: switching it off and
watching the answer go wrong is the lesson.

Note that v_rel points toward O while a_rel points away: the sliding is
decelerating and about to reverse. Worth a line in the panel so it doesn't read
as a sign error.

### RB 9 — Liquid in a rotating ring (CCR 11)

Hollow ring of radius r rigidly attached to shaft AB, rotating at constant Ω.
Liquid circulates at constant speed u relative to the ring.

```
a_P = −(u²/r)·cos φ î − [ (u²/r)·sin φ + Ω²·r·(2 + sin φ) ] ĵ + 2·Ω·u·cos φ k̂

a₁ = u²/r − Ω²·r
a₂ = a₄ = √( u⁴/r² + 4Ω²u² + 4Ω⁴r² )
a₃ = u²/r + 3Ω²r
```

Symbolic module: takes r, u, Ω and returns the vector as a function of φ plus
the four point magnitudes. Plot |a| vs φ with the four points marked.

### RB 10 — Disc on arm on vertical shaft (CCR 21)

R = 0.2 m, b = 0.3 m. Disc spins at ω_d = 6 s⁻¹ relative to the horizontal bar,
the bar turns at ω_b = 4 s⁻¹ relative to the vertical shaft, the shaft turns at
ω₀ = 2 s⁻¹ absolute. P is the top point of the disc rim.

Frame: y vertical along the shaft, x along the horizontal bar, z the hinge axis
between shaft and bar. Then (P − O) = 0.3 î + 0.2 ĵ.

```
Ω = 6 î + 2 ĵ + 4 k̂
γ = 8 î + 24 ĵ − 12 k̂        (ĵ is fixed; k̂ is carried by ω₀; î by ω₀ and ω_b)
v_P = (−0.8, 1.2, 0.6) m/s
a_P = (−1.2, −10.4, 3.2) m/s²
```

**Discrepancy with the TP answer sheet.** The PDF gives a_P = (−1.2, −10.4,
**4.8**). The î and ĵ components agree exactly; only k̂ differs. Two independent
derivations — absolute (γ ∧ r + Ω ∧ (Ω ∧ r)) and relative with a frame attached
to the bar (a_rel = −7.2 ĵ, a_arr = (−6, −3.2, 3.2), a_cor = (4.8, 0, 0)) — both
give 3.2. Write the test against **3.2** and leave a comment recording both
values so nobody later "fixes" the module to match the PDF.

---

## 5. Cross-cutting notes

**Rotation senses are the easy thing to get wrong.** Every 3D module should
export its Ω and γ vectors, not just the final v and a, so the tests pin the
sense and not only the magnitudes. A mirrored ω flips the entire velocity field
while leaving every magnitude intact.

**Units.** TP 4 mixes cm, mm, m and rpm across exercises. Keep each module in
the units of its own statement (so the fixtures above are literal), and convert
only at the display layer.

**Shared vocabulary for the UI.** CIR, transport/relative/Coriolis, normal and
tangential components — define these once in the i18n files and reuse, so the
Spanish wording stays consistent across ten pages.

---

## 6. Kickoff prompt

> Read AGENTS.md and `src/lib/simulators.ts`, then study `/particle-kinematics`
> end to end — routing, registry, i18n, index cards, prev/next nav — and
> `/fireman-ladder` for the 3D canvas setup. Then implement Phase 0 of
> `docs/tp4-plan.md`: a `/rigid-body-kinematics` section with ten stub
> exercises registered as RB 1–10, section index, nav wired, README.md and
> README.es.md tables updated. No physics yet. Stop and show me the diff before
> Phase 1.
