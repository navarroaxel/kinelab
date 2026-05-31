export type Language = 'en' | 'es'

export const LANGUAGES: Language[] = ['en', 'es']

export const translations = {
  en: {
    // ThemeToggle
    'theme.aria':  'Theme',
    'theme.auto':  'Auto',
    'theme.light': 'Light',
    'theme.dark':  'Dark',

    // GitHubLink
    'github.aria': 'View source on GitHub',

    // LanguageToggle (label is shown in the *current* language, describing what clicking will do)
    'language.switch_aria': 'Switch to Spanish',

    // ControlsPanel — sections
    'controls.section.geometry': 'Geometry',
    'controls.section.dynamics': 'Dynamics',
    'controls.section.visibility': 'Visibility',

    // ControlsPanel — sliders
    'controls.slider.pole_x': 'Pole X',
    'controls.slider.pole_y': 'Pole Y',
    'controls.slider.radius': 'Radius',

    // ControlsPanel — visibility toggles
    'controls.toggle.polar_velocity': 'Polar velocity (ṙ, rθ̇)',
    'controls.toggle.cartesian': 'Cartesian coords (x, y)',
    'controls.toggle.r_vector': 'Vector r',
    'controls.toggle.polar_accel': 'Polar acceleration (aᵣ, aθ)',
    'controls.toggle.normal_accel': 'Normal acceleration (aₙ)',
    'controls.toggle.trace': 'Path trace',

    // ControlsPanel — buttons
    'controls.btn.pole_center': 'Pole to center',
    'controls.btn.reset_alpha': 'Reset α',
    'controls.btn.pause': 'Pause',
    'controls.btn.resume': 'Resume',

    // PolarMetrics
    'metrics.heading': 'Live Metrics',
    'metrics.r': 'r  (magnitude)',
    'metrics.theta': 'θ  (polar angle)',
    'metrics.r_dot': 'ṙ  (radial vel.)',
    'metrics.r_theta_dot': 'rθ̇  (transverse vel.)',
    'metrics.omega': 'ω  (current)',
    'metrics.at': 'aₜ  (tangential)',

    // VectorLegend
    'legend.heading': 'Legend',
    'legend.r': 'r  (pole → P)',
    'legend.r_dot': 'ṙ · eᵣ  (radial velocity)',
    'legend.r_theta_dot': 'rθ̇ · eθ  (transverse velocity)',
    'legend.polar_accel': 'Polar acceleration (aᵣ, aθ)',
    'legend.normal_accel': 'Normal acceleration aₙ',

    // EquationsPanel
    'equations.heading': 'Equations',
    'equations.section.position': 'Position & r vector',
    'equations.section.polar_velocity': 'Polar velocity',
    'equations.note.omega_dot': 'ω̇ = α  (non-uniform when α ≠ 0)',
    'equations.section.polar_accel': 'Polar acceleration',
    'equations.section.tangential': 'Tangential acceleration',
    'equations.section.normal': 'Normal acceleration',
    'equations.footer':
      'Pole at center → ṙ = 0, rθ̇ = R·ω = const. ' +
      'Move the pole off-center → both components become non-zero ' +
      'even though the path remains a perfect circle. ' +
      'Set α ≠ 0 → ω varies in time and the motion is non-uniform.',
    'equations.section.decomp_heading': 'Two decompositions of a',
    'equations.decomp.intrinsic_heading': 'Intrinsic basis (t, n)',
    'equations.decomp.at':
      'Measures the change in speed: aₜ > 0 speeds up, aₜ < 0 slows down. ' +
      'Vanishes in uniform circular motion.',
    'equations.decomp.an':
      'Bends the trajectory without changing |v|. Never vanishes while the particle is turning.',
    'equations.decomp.polar_heading': 'Polar basis (r, θ)',
    'equations.decomp.ar':
      'Includes the term −r·θ̇², which is why it is generally negative even when r is not ' +
      'changing: the unit vector eᵣ rotates with the particle.',
    'equations.decomp.atheta':
      'Contains the Coriolis-like term 2·ṙ·θ̇, which couples radial and angular motion.',
    'equations.decomp.relation':
      'Both pairs add up to the same vector a. The intrinsic basis follows the trajectory; ' +
      'the polar one depends on the chosen pole. Moving the pole changes aᵣ and aθ but ' +
      'leaves aₜ and aₙ untouched.',

    // Strip chart panels
    'chart.velocity.title': 'Polar velocity vs. time',
    'chart.accel.title':    'Tangential acceleration vs. time',

    // Phasor diagrams
    'phasor.velocity.title':     'Velocity phasor',
    'phasor.acceleration.title': 'Acceleration phasor',
    'phasor.basis.intrinsic':    'Intrinsic (t, n)',
    'phasor.basis.polar':        'Polar (r, θ)',
    'phasor.vn.zero':            'vₙ = 0 (v ⊥ R)',

    // Navigation between simulators
    'nav.aria_label':    'Simulators',
    'nav.polar':         'Polar',
    'nav.ring':          'Ring',
    'nav.pin_slot':      'Pin–Slot',
    'nav.quick_return':  'Quick-Return',

    // Polar page — meta
    'polar.page.canvas_aria': 'Polar coordinates simulator — animated circular motion',

    // Ring page — meta
    'ring.page.canvas_aria': 'Vertical ring simulator — particle on the inside of a smooth ring',

    // Ring — metrics
    'ring.metrics.heading':     'Live Metrics',
    'ring.metrics.theta':       'θ  (angle from bottom)',
    'ring.metrics.v':           'v  (speed)',
    'ring.metrics.n':           'N  (normal force)',
    'ring.metrics.h':           'h  (height)',
    'ring.metrics.ke':          'KE  (kinetic)',
    'ring.metrics.pe':          'PE  (potential)',
    'ring.metrics.vmin_label':  'v_min = √(5·g·R)',
    'ring.metrics.vmin_pct':    'of v_min',

    // Ring — controls
    'ring.controls.section.geometry':   'Geometry & gravity',
    'ring.controls.section.dynamics':   'Initial conditions',
    'ring.controls.section.visibility': 'Visibility',
    'ring.controls.section.formulas':   'Formulas',
    'ring.controls.slider.radius':      'Radius R',
    'ring.controls.slider.gravity':     'Gravity g',
    'ring.controls.slider.v0':          'Initial speed v₀',
    'ring.controls.toggle.weight':      'Weight (mg)',
    'ring.controls.toggle.normal':      'Normal force (N)',
    'ring.controls.toggle.velocity':    'Velocity (v)',
    'ring.controls.toggle.energy_bar':  'Energy bar (KE / PE)',
    'ring.controls.toggle.trace':       'Path trace',
    'ring.controls.toggle.vmin':        'v_min threshold',
    'ring.controls.btn.reset':          'Reset to bottom',
    'ring.controls.btn.vmin':           'v₀ = v_min',
    'ring.controls.btn.pause':          'Pause',
    'ring.controls.btn.resume':         'Resume',
    'ring.controls.info.vmin':          'v_min (complete loop)',
    'ring.controls.info.eom':           'Equation of motion',
    'ring.controls.info.normal':        'Normal force',

    // Ring — legend
    'ring.legend.heading':  'Legend',
    'ring.legend.weight':   'mg  (weight)',
    'ring.legend.normal':   'N  (normal force)',
    'ring.legend.velocity': 'v  (tangent velocity)',
    'ring.legend.ke':       'KE  (kinetic energy)',
    'ring.legend.pe':       'PE  (potential energy)',

    // Ring — energy bar
    'ring.energy.heading':       'Energy',
    'ring.energy.ke':            'KE',
    'ring.energy.pe':            'PE',
    'ring.energy.total':         'E',
    'ring.energy.drift_warning': 'Numerical drift detected',
    'ring.energy.empty':         'Set v₀ > 0 to see energy partitioning.',
    'ring.energy.ke_share_aria': 'Kinetic energy share',
    'ring.energy.pe_share_aria': 'Potential energy share',

    // Ring — equations panel
    'ring.equations.heading':         'Equations',
    'ring.equations.section.eom':     'Equation of motion',
    'ring.equations.section.normal':  'Normal force',
    'ring.equations.section.vmin':    'Minimum speed for a complete loop',
    'ring.equations.section.energy':  'Energy conservation',
    'ring.equations.note.pendulum':   'Same form as a pendulum — nonlinear, solved with RK4.',
    'ring.equations.note.contact':    'Contact is maintained while N ≥ 0.',
    'ring.equations.note.energy':
      'The normal force N is always perpendicular to the velocity, so it does no work. ' +
      'Gravity is the only force doing work, and it is conservative — therefore the total ' +
      'mechanical energy E = KE + PE is conserved. Kinetic energy turns into potential energy ' +
      'on the way up and back into kinetic energy on the way down. Any drift you see in E ' +
      'comes from the numerical integrator, not from the physics.',

    // Ring — energy strip chart
    'ring.chart.energy.title': 'Energy partitioning vs. time',
    'ring.chart.energy.empty': 'Set v₀ > 0 to record the energy timeline.',

    // Pin-slot page — meta
    'pin-slot.page.canvas_aria': 'Pin-in-circular-slot simulator — pin B drives pivoted bar OC',

    // Pin-slot — metrics
    'pin-slot.metrics.heading': 'Live Metrics',
    'pin-slot.metrics.phi':     'Φ  (pin angle on slot)',
    'pin-slot.metrics.theta':   'θ  (bar angle)',
    'pin-slot.metrics.rho':     'ρ  (|OB|)',
    'pin-slot.metrics.vr':      'Vᵣ  (radial, along bar)',
    'pin-slot.metrics.vperp':   'V⊥  (transverse)',
    'pin-slot.metrics.omega':   'ω  (bar angular vel.)',
    'pin-slot.metrics.gamma':   'γ  (bar angular accel.)',

    // Pin-slot — controls
    'pin-slot.controls.section.geometry':   'Geometry',
    'pin-slot.controls.section.dynamics':   'Kinematics',
    'pin-slot.controls.section.visibility': 'Visibility',
    'pin-slot.controls.slider.r':           'Slot radius r (u)',
    'pin-slot.controls.slider.d':           'Center distance d (O–A)',
    'pin-slot.controls.slider.v0':          'Pin speed V₀ (u/s)',
    'pin-slot.controls.toggle.v0':          'V₀  (tangent velocity)',
    'pin-slot.controls.toggle.vr':          'Vᵣ  (radial component)',
    'pin-slot.controls.toggle.vperp':       'V⊥  (transverse component)',
    'pin-slot.controls.toggle.angles':      'Φ and θ angle arcs',
    'pin-slot.controls.toggle.rho':         'ρ segment (O→B)',
    'pin-slot.controls.constraint.ok':      'd > r ✓',
    'pin-slot.controls.constraint.warn':    '⚠ d must be > r',
    'pin-slot.controls.btn.reset':          'Reset to Φ = 0',
    'pin-slot.controls.btn.pause':          'Pause',
    'pin-slot.controls.btn.resume':         'Resume',
    'pin-slot.controls.info.omega':         'Pin angular rate',
    'pin-slot.controls.info.omega_bar':     'Bar angular velocity',

    // Pin-slot — legend
    'pin-slot.legend.heading': 'Legend',
    'pin-slot.legend.v0':      'V₀  (tangent velocity at B)',
    'pin-slot.legend.vr':      'Vᵣ  (radial component along bar)',
    'pin-slot.legend.vperp':   'V⊥  (transverse component)',
    'pin-slot.legend.rho':     'ρ  (O → B segment)',
    'pin-slot.legend.bar':     'Bar OC',

    // Pin-slot — equations panel
    'pin-slot.equations.heading':          'Equations',
    'pin-slot.equations.section.setup':    'Geometry (O at origin, A = (d, 0))',
    'pin-slot.equations.section.pin':      'Pin motion on the slot (constant speed)',
    'pin-slot.equations.section.bar':      'Bar OC kinematics (derived)',
    'pin-slot.equations.section.swing':    'Bar swing limit  (d > r)',
    'pin-slot.equations.section.invariant':'Speed invariant',
    'pin-slot.equations.note.swing':
      'Because d > r, O lies outside the circle and the bar never completes a full revolution — ' +
      'it swings back and forth within ±arcsin(r/d).',
    'pin-slot.equations.note.invariant':
      'The total speed of the pin is constant (V₀), so the radial and transverse ' +
      'components always satisfy Vᵣ² + V⊥² = V₀².',

    // Quick-return page — meta
    'quick-return.page.canvas_aria': 'Quick-return mechanism simulator — crank AB drives oscillating bar OQ and tool slider P',

    // Quick-return — metrics
    'quick-return.metrics.heading':        'Live Metrics',
    'quick-return.metrics.phi':            'φ  (crank angle)',
    'quick-return.metrics.x':             'x(t)  (tool position)',
    'quick-return.metrics.v':             'v(t)  (tool velocity)',
    'quick-return.metrics.a':             'a(t)  (tool acceleration)',
    'quick-return.metrics.derived_heading':'Derived Results',
    'quick-return.metrics.ratio_label':   'Quick-return ratio',
    'quick-return.metrics.ratio_note':    'Cutting and return strokes take unequal time',
    'quick-return.metrics.alpha':         'α = arccos(r / L₂)',
    'quick-return.metrics.xmax':          'x_max (extreme positions)',
    'quick-return.metrics.v_phi0':        'v at φ = 0 (fast pass)',
    'quick-return.metrics.v_phi_pi':      'v at φ = π (slow pass)',

    // Quick-return — controls
    'quick-return.controls.section.geometry':   'Geometry',
    'quick-return.controls.section.dynamics':   'Kinematics',
    'quick-return.controls.section.visibility': 'Visibility',
    'quick-return.controls.slider.r':           'Crank length r (u)',
    'quick-return.controls.slider.L2':          'Crank-center height L₂ (u)',
    'quick-return.controls.slider.L1':          'Slot height L₁ (u)',
    'quick-return.controls.slider.omega':        'Crank speed ω (rad/s)',
    'quick-return.controls.toggle.velocity':    'v  (tool velocity)',
    'quick-return.controls.toggle.acceleration':'a  (tool acceleration)',
    'quick-return.controls.toggle.trace':       'Tool path trace',
    'quick-return.controls.toggle.guides':      'Guide circle & axis',
    'quick-return.controls.constraint.ok':      'L₂ > r ✓',
    'quick-return.controls.constraint.warn':    '⚠ L₂ must be > r',
    'quick-return.controls.btn.reset':          'Reset to φ = 0',
    'quick-return.controls.btn.pause':          'Pause',
    'quick-return.controls.btn.resume':         'Resume',
    'quick-return.controls.info.xB':            'Crank pin B',
    'quick-return.controls.info.xP':            'Tool slider P',
    'quick-return.controls.info.constraint':    'Hard constraint',

    // Quick-return — legend
    'quick-return.legend.heading':      'Legend',
    'quick-return.legend.crank':        'Crank AB',
    'quick-return.legend.bar':          'Oscillating bar OQ',
    'quick-return.legend.sliderB':      'Slider B (crank pin)',
    'quick-return.legend.sliderP':      'Slider P (tool)',
    'quick-return.legend.velocity':     'v  (tool velocity)',
    'quick-return.legend.acceleration': 'a  (tool acceleration)',

    // Quick-return — equations panel
    'quick-return.equations.heading':           'Equations',
    'quick-return.equations.section.geometry':  'Geometry (O at origin, A = (0, L₂))',
    'quick-return.equations.section.kinematics':'Tool kinematics',
    'quick-return.equations.section.extremes':  'Extreme positions & quick-return ratio',
    'quick-return.equations.section.center':    'Center-crossing speeds (x = 0)',
    'quick-return.equations.note.ratio':
      'The crank sweeps (2π − 2α) for one stroke and 2α for the other. ' +
      'Since ω is constant the time ratio equals the angle ratio.',
    'quick-return.equations.note.center':
      'The tool crosses x = 0 twice per revolution at different speeds — ' +
      'the asymmetry is the signature of the quick-return mechanism.',

    // Kepler — orbital mechanics / Mars transfer (/kepler)
    'nav.kepler': 'Kepler',

    'kepler.page.canvas_aria': 'Kepler orbital mechanics simulator — Mars return vehicle transfer trajectory',

    // Kepler — phase names
    'kepler.phase.circular':  'Circular orbit',
    'kepler.phase.transfer1': 'Transfer orbit 1',
    'kepler.phase.transfer2': 'Transfer orbit 2',
    'kepler.phase.escape':    'Escape trajectory',

    // Kepler — metrics
    'kepler.metrics.heading':      'Live Metrics',
    'kepler.metrics.phase':        'Phase',
    'kepler.metrics.altitude':     'Altitude',
    'kepler.metrics.speed':        'Speed',
    'kepler.metrics.v_final':      'Final speed (after C)',
    'kepler.metrics.derived':      'Orbital Properties',
    'kepler.metrics.orbit1_T':     'T₁  (transfer orbit 1)',
    'kepler.metrics.orbit2_T':     'T₂  (transfer orbit 2)',
    'kepler.metrics.h1':           'h₁  (angular momentum)',
    'kepler.metrics.h2':           'h₂  (angular momentum)',

    // Kepler — controls
    'kepler.controls.section.maneuvers':  'Δv Maneuvers',
    'kepler.controls.section.animation':  'Animation',
    'kepler.controls.section.visibility': 'Visibility',
    'kepler.controls.slider.dv_a':        'Δv at A (km/s)',
    'kepler.controls.slider.dv_b':        'Δv at B (km/s)',
    'kepler.controls.slider.dv_c':        'Δv at C (km/s)',
    'kepler.controls.slider.anim_speed':  'Sim. speed (× real time)',
    'kepler.controls.toggle.velocity':    'Velocity vector',
    'kepler.controls.toggle.orbits':      'Orbit paths',
    'kepler.controls.toggle.area_sweep':  'Area sweep (Kepler 2)',
    'kepler.controls.toggle.trace':       'Spacecraft trail',
    'kepler.controls.btn.reset':          'Reset',
    'kepler.controls.btn.pause':          'Pause',
    'kepler.controls.btn.resume':         'Resume',
    'kepler.controls.info.problem':       'Mars return vehicle',
    'kepler.controls.info.r_a':           'Altitude at A: 2,200 km',
    'kepler.controls.info.r_b':           'Altitude at B: 100,000 km',
    'kepler.controls.info.r_c':           'Altitude at C: 1,000 km',

    // Kepler — legend
    'kepler.legend.heading':     'Legend',
    'kepler.legend.spacecraft':  'Spacecraft',
    'kepler.legend.velocity':    'Velocity vector',
    'kepler.legend.orbit0':      'Circular orbit (initial)',
    'kepler.legend.orbit1':      'Transfer orbit 1 (A → B)',
    'kepler.legend.orbit2':      'Transfer orbit 2 (B → C)',
    'kepler.legend.escape':      'Escape trajectory',
    'kepler.legend.area_sweep':  'Swept area (equal time = equal area)',

    // Kepler — equations
    'kepler.equations.heading':             'Equations',
    'kepler.equations.section.kepler1':     "Kepler's 1st Law",
    'kepler.equations.section.kepler2':     "Kepler's 2nd Law",
    'kepler.equations.section.kepler3':     "Kepler's 3rd Law",
    'kepler.equations.section.vis_viva':    'Vis-viva equation',
    'kepler.equations.section.circ':        'Circular orbit speed',
    'kepler.equations.section.mission':     'Mission solution',
    'kepler.equations.note.kepler1':
      'All orbits are conic sections with the attracting body at one focus. ' +
      'A circle (e = 0) is the special case of an ellipse where both foci coincide ' +
      'and the radius stays constant at r = a throughout the orbit. ' +
      'As e grows toward 1 the ellipse elongates; at e = 1 it opens into a parabola; ' +
      'above 1 it becomes a hyperbola (the escape trajectories in this mission).',
    'kepler.equations.note.kepler2':
      'Angular momentum L = r × mv is conserved whenever the net torque on a body is zero. ' +
      'For orbital motion, gravity always points from the orbiting body toward the central body (along r), ' +
      'so its torque τ = r × F = 0 — and L is constant throughout the orbit. ' +
      'Dividing by mass gives the specific angular momentum h = L/m = r × v⊥, ' +
      'also constant, which fully characterises the orbit\'s shape and rate of sweeping. ' +
      'A line from the central body sweeps equal areas in equal time intervals — ' +
      'the areal velocity dA/dt = h/2 is constant. ' +
      'As a consequence, the body moves faster near periapsis (small r, large v) ' +
      'and slower near apoapsis (large r, small v).',
    'kepler.equations.note.kepler3':
      'The square of the orbital period is proportional to the cube of the ' +
      'semi-major axis: T² ∝ a³. For Mars: T² = (4π²/μ) × a³.',
    'kepler.equations.note.vis_viva':
      'Derived from conservation of energy. At any point on the orbit, ' +
      'the total specific mechanical energy E = v²/2 − μ/r = −μ/(2a) is constant.',
    'kepler.equations.note.mission':
      'Angular-momentum chain: h = r × v_⊥ is conserved within each orbit. ' +
      'Knowing any r and the tangential speed uniquely determines the entire orbit.',

    // Kepler — impulsive maneuver approximation
    'kepler.equations.section.impulsive': 'Impulsive maneuver approximation',
    'kepler.equations.note.impulsive':
      'Each Δv is modelled as an instantaneous impulse: the burn time Δt → 0 ' +
      'and the arc flown during the burn Δs ≈ 0. ' +
      'As a result, the spacecraft\'s position is fixed at A, B, or C during the maneuver — ' +
      'only the velocity vector changes. ' +
      'This is why the solution chains angular momenta directly at each point ' +
      'without integrating the trajectory during the burn. ' +
      'The approximation is valid when the burn duration is negligible compared to the ' +
      'orbital period (here T₁ ≈ 107 h vs. a burn of seconds or minutes). ' +
      'When that ratio is not small, a finite-burn model is required: the thrust force, ' +
      'the varying mass (Tsiolkovsky equation), and the arc actually flown must all be ' +
      'integrated — the result is no longer analytic.',

    // Units note (shared on both pages)
    'units.note':
      '"u" is a generic length unit — pick any (metres, cm, pixels). ' +
      'Velocities are in u/s, accelerations in u/s², and energies in u²/s² ' +
      '(mass is normalised to 1).',

    // Footer attribution (shown on every page)
    'footer.attribution':
      'Interactive simulator developed as didactic support for visualizing ' +
      'circular motion, within the Mecánica Técnica course at UTN – FRBA.',
    'footer.related.prefix':
      'Curious about the electric field and the relaxation method? Visit',
    'footer.rlc.prefix':
      'Curious about RLC circuits in AC? Visit',
    'footer.nqm.prefix':
      'Want to explore the N, Q and M internal force diagrams for plane frames? Visit',
  },
  es: {
    // ThemeToggle
    'theme.aria':  'Tema',
    'theme.auto':  'Auto',
    'theme.light': 'Claro',
    'theme.dark':  'Oscuro',

    // GitHubLink
    'github.aria': 'Ver código en GitHub',

    // LanguageToggle
    'language.switch_aria': 'Cambiar a inglés',

    // ControlsPanel — sections
    'controls.section.geometry': 'Geometría',
    'controls.section.dynamics': 'Dinámica',
    'controls.section.visibility': 'Visibilidad',

    // ControlsPanel — sliders
    'controls.slider.pole_x': 'Polo X',
    'controls.slider.pole_y': 'Polo Y',
    'controls.slider.radius': 'Radio',

    // ControlsPanel — visibility toggles
    'controls.toggle.polar_velocity': 'Velocidad polar (ṙ, rθ̇)',
    'controls.toggle.cartesian': 'Coordenadas cartesianas (x, y)',
    'controls.toggle.r_vector': 'Vector r',
    'controls.toggle.polar_accel': 'Aceleración polar (aᵣ, aθ)',
    'controls.toggle.normal_accel': 'Aceleración normal (aₙ)',
    'controls.toggle.trace': 'Trayectoria',

    // ControlsPanel — buttons
    'controls.btn.pole_center': 'Polo al centro',
    'controls.btn.reset_alpha': 'Reiniciar α',
    'controls.btn.pause': 'Pausar',
    'controls.btn.resume': 'Reanudar',

    // PolarMetrics
    'metrics.heading': 'Métricas en vivo',
    'metrics.r': 'r  (magnitud)',
    'metrics.theta': 'θ  (ángulo polar)',
    'metrics.r_dot': 'ṙ  (vel. radial)',
    'metrics.r_theta_dot': 'rθ̇  (vel. transversal)',
    'metrics.omega': 'ω  (actual)',
    'metrics.at': 'aₜ  (tangencial)',

    // VectorLegend
    'legend.heading': 'Leyenda',
    'legend.r': 'r  (polo → P)',
    'legend.r_dot': 'ṙ · eᵣ  (velocidad radial)',
    'legend.r_theta_dot': 'rθ̇ · eθ  (velocidad transversal)',
    'legend.polar_accel': 'Aceleración polar (aᵣ, aθ)',
    'legend.normal_accel': 'Aceleración normal aₙ',

    // EquationsPanel
    'equations.heading': 'Ecuaciones',
    'equations.section.position': 'Posición y vector r',
    'equations.section.polar_velocity': 'Velocidad polar',
    'equations.note.omega_dot': 'ω̇ = α  (no uniforme cuando α ≠ 0)',
    'equations.section.polar_accel': 'Aceleración polar',
    'equations.section.tangential': 'Aceleración tangencial',
    'equations.section.normal': 'Aceleración normal',
    'equations.footer':
      'Polo en el centro → ṙ = 0, rθ̇ = R·ω = const. ' +
      'Mueve el polo fuera del centro → ambas componentes se vuelven ' +
      'distintas de cero aunque la trayectoria sigue siendo un círculo perfecto. ' +
      'Si α ≠ 0 → ω varía en el tiempo y el movimiento no es uniforme.',
    'equations.section.decomp_heading': 'Dos descomposiciones de a',
    'equations.decomp.intrinsic_heading': 'Base intrínseca (t, n)',
    'equations.decomp.at':
      'Mide el cambio de rapidez: aₜ > 0 acelera, aₜ < 0 frena. ' +
      'Se anula en movimiento circular uniforme.',
    'equations.decomp.an':
      'Curva la trayectoria sin cambiar |v|. Nunca se anula mientras la partícula gire.',
    'equations.decomp.polar_heading': 'Base polar (r, θ)',
    'equations.decomp.ar':
      'Incluye el término −r·θ̇², por eso suele ser negativa aun cuando r no cambia: ' +
      'el versor eᵣ rota con la partícula.',
    'equations.decomp.atheta':
      'Contiene el término tipo Coriolis 2·ṙ·θ̇, que acopla el movimiento radial con el angular.',
    'equations.decomp.relation':
      'Ambos pares suman el mismo vector a. La base intrínseca acompaña a la trayectoria; ' +
      'la polar depende del polo elegido. Mover el polo cambia aᵣ y aθ pero deja aₜ y aₙ intactas.',

    // Strip charts
    'chart.velocity.title': 'Velocidad polar vs. tiempo',
    'chart.accel.title':    'Aceleración tangencial vs. tiempo',

    // Phasor diagrams
    'phasor.velocity.title':     'Diagrama fasorial — velocidad',
    'phasor.acceleration.title': 'Diagrama fasorial — aceleración',
    'phasor.basis.intrinsic':    'Intrínseca (t, n)',
    'phasor.basis.polar':        'Polar (r, θ)',
    'phasor.vn.zero':            'vₙ = 0 (v ⊥ R)',

    // Navigation between simulators
    'nav.aria_label':    'Simuladores',
    'nav.polar':         'Polar',
    'nav.ring':          'Anillo',
    'nav.pin_slot':      'Pasador',
    'nav.quick_return':  'Retorno Rápido',

    // Polar page — meta
    'polar.page.canvas_aria': 'Simulador de coordenadas polares — movimiento circular animado',

    // Ring page — meta
    'ring.page.canvas_aria': 'Simulador del anillo vertical — partícula dentro de un anillo liso',

    // Ring — metrics
    'ring.metrics.heading':     'Métricas en vivo',
    'ring.metrics.theta':       'θ  (ángulo desde el fondo)',
    'ring.metrics.v':           'v  (rapidez)',
    'ring.metrics.n':           'N  (fuerza normal)',
    'ring.metrics.h':           'h  (altura)',
    'ring.metrics.ke':          'EC  (cinética)',
    'ring.metrics.pe':          'EP  (potencial)',
    'ring.metrics.vmin_label':  'v_min = √(5·g·R)',
    'ring.metrics.vmin_pct':    'de v_min',

    // Ring — controls
    'ring.controls.section.geometry':   'Geometría y gravedad',
    'ring.controls.section.dynamics':   'Condiciones iniciales',
    'ring.controls.section.visibility': 'Visibilidad',
    'ring.controls.section.formulas':   'Fórmulas',
    'ring.controls.slider.radius':      'Radio R',
    'ring.controls.slider.gravity':     'Gravedad g',
    'ring.controls.slider.v0':          'Rapidez inicial v₀',
    'ring.controls.toggle.weight':      'Peso (mg)',
    'ring.controls.toggle.normal':      'Fuerza normal (N)',
    'ring.controls.toggle.velocity':    'Velocidad (v)',
    'ring.controls.toggle.energy_bar':  'Barra de energía (EC / EP)',
    'ring.controls.toggle.trace':       'Trayectoria',
    'ring.controls.toggle.vmin':        'Umbral v_min',
    'ring.controls.btn.reset':          'Volver al fondo',
    'ring.controls.btn.vmin':           'v₀ = v_min',
    'ring.controls.btn.pause':          'Pausar',
    'ring.controls.btn.resume':         'Reanudar',
    'ring.controls.info.vmin':          'v_min (vuelta completa)',
    'ring.controls.info.eom':           'Ecuación de movimiento',
    'ring.controls.info.normal':        'Fuerza normal',

    // Ring — legend
    'ring.legend.heading':  'Leyenda',
    'ring.legend.weight':   'mg  (peso)',
    'ring.legend.normal':   'N  (fuerza normal)',
    'ring.legend.velocity': 'v  (velocidad tangente)',
    'ring.legend.ke':       'EC  (energía cinética)',
    'ring.legend.pe':       'EP  (energía potencial)',

    // Ring — energy bar
    'ring.energy.heading':       'Energía',
    'ring.energy.ke':            'EC',
    'ring.energy.pe':            'EP',
    'ring.energy.total':         'E',
    'ring.energy.drift_warning': 'Deriva numérica detectada',
    'ring.energy.empty':         'Ajusta v₀ > 0 para ver la repartición de energía.',
    'ring.energy.ke_share_aria': 'Proporción de energía cinética',
    'ring.energy.pe_share_aria': 'Proporción de energía potencial',

    // Ring — equations panel
    'ring.equations.heading':         'Ecuaciones',
    'ring.equations.section.eom':     'Ecuación de movimiento',
    'ring.equations.section.normal':  'Fuerza normal',
    'ring.equations.section.vmin':    'Rapidez mínima para una vuelta completa',
    'ring.equations.section.energy':  'Conservación de la energía',
    'ring.equations.note.pendulum':   'Misma forma que un péndulo — no lineal, resuelta con RK4.',
    'ring.equations.note.contact':    'El contacto se mantiene mientras N ≥ 0.',
    'ring.equations.note.energy':
      'La fuerza normal N es siempre perpendicular a la velocidad, por lo que no realiza trabajo. ' +
      'La gravedad es la única fuerza que hace trabajo, y es conservativa — por lo tanto la energía ' +
      'mecánica total E = EC + EP se conserva. La energía cinética se transforma en potencial al ' +
      'subir y vuelve a ser cinética al bajar. Cualquier deriva visible en E proviene del integrador ' +
      'numérico, no de la física.',

    // Ring — energy strip chart
    'ring.chart.energy.title': 'Reparto de energía vs. tiempo',
    'ring.chart.energy.empty': 'Ajusta v₀ > 0 para registrar la línea temporal de energía.',

    // Pin-slot page — meta
    'pin-slot.page.canvas_aria': 'Simulador de pasador en ranura circular — el pasador B mueve la barra articulada OC',

    // Pin-slot — metrics
    'pin-slot.metrics.heading': 'Métricas en vivo',
    'pin-slot.metrics.phi':     'Φ  (ángulo del pasador en ranura)',
    'pin-slot.metrics.theta':   'θ  (ángulo de la barra)',
    'pin-slot.metrics.rho':     'ρ  (|OB|)',
    'pin-slot.metrics.vr':      'Vᵣ  (radial, a lo largo de barra)',
    'pin-slot.metrics.vperp':   'V⊥  (transversal)',
    'pin-slot.metrics.omega':   'ω  (vel. angular de barra)',
    'pin-slot.metrics.gamma':   'γ  (acel. angular de barra)',

    // Pin-slot — controls
    'pin-slot.controls.section.geometry':   'Geometría',
    'pin-slot.controls.section.dynamics':   'Cinemática',
    'pin-slot.controls.section.visibility': 'Visibilidad',
    'pin-slot.controls.slider.r':           'Radio de ranura r (u)',
    'pin-slot.controls.slider.d':           'Distancia entre centros d (O–A)',
    'pin-slot.controls.slider.v0':          'Rapidez del pasador V₀ (u/s)',
    'pin-slot.controls.toggle.v0':          'V₀  (velocidad tangente)',
    'pin-slot.controls.toggle.vr':          'Vᵣ  (componente radial)',
    'pin-slot.controls.toggle.vperp':       'V⊥  (componente transversal)',
    'pin-slot.controls.toggle.angles':      'Arcos de Φ y θ',
    'pin-slot.controls.toggle.rho':         'Segmento ρ (O→B)',
    'pin-slot.controls.constraint.ok':      'd > r ✓',
    'pin-slot.controls.constraint.warn':    '⚠ d debe ser > r',
    'pin-slot.controls.btn.reset':          'Reiniciar a Φ = 0',
    'pin-slot.controls.btn.pause':          'Pausar',
    'pin-slot.controls.btn.resume':         'Reanudar',
    'pin-slot.controls.info.omega':         'Velocidad angular del pasador',
    'pin-slot.controls.info.omega_bar':     'Velocidad angular de la barra',

    // Pin-slot — legend
    'pin-slot.legend.heading': 'Leyenda',
    'pin-slot.legend.v0':      'V₀  (velocidad tangente en B)',
    'pin-slot.legend.vr':      'Vᵣ  (componente radial a lo largo de la barra)',
    'pin-slot.legend.vperp':   'V⊥  (componente transversal)',
    'pin-slot.legend.rho':     'ρ  (segmento O → B)',
    'pin-slot.legend.bar':     'Barra OC',

    // Pin-slot — equations panel
    'pin-slot.equations.heading':          'Ecuaciones',
    'pin-slot.equations.section.setup':    'Geometría (O en el origen, A = (d, 0))',
    'pin-slot.equations.section.pin':      'Movimiento del pasador en la ranura (rapidez constante)',
    'pin-slot.equations.section.bar':      'Cinemática de la barra OC (derivada)',
    'pin-slot.equations.section.swing':    'Límite de oscilación de la barra  (d > r)',
    'pin-slot.equations.section.invariant':'Invariante de rapidez',
    'pin-slot.equations.note.swing':
      'Como d > r, O queda fuera del círculo y la barra nunca da una vuelta completa — ' +
      'oscila dentro de ±arcsin(r/d).',
    'pin-slot.equations.note.invariant':
      'La rapidez del pasador es constante (V₀), por lo que las componentes radial y ' +
      'transversal siempre satisfacen Vᵣ² + V⊥² = V₀².',

    // Quick-return page — meta
    'quick-return.page.canvas_aria': 'Simulador de mecanismo de retorno rápido — la manivela AB mueve la barra oscilante OQ y el carro herramienta P',

    // Quick-return — metrics
    'quick-return.metrics.heading':        'Métricas en vivo',
    'quick-return.metrics.phi':            'φ  (ángulo de manivela)',
    'quick-return.metrics.x':             'x(t)  (posición de herramienta)',
    'quick-return.metrics.v':             'v(t)  (velocidad de herramienta)',
    'quick-return.metrics.a':             'a(t)  (aceleración de herramienta)',
    'quick-return.metrics.derived_heading':'Resultados derivados',
    'quick-return.metrics.ratio_label':   'Relación de retorno rápido',
    'quick-return.metrics.ratio_note':    'Los tiempos de avance y retorno son distintos',
    'quick-return.metrics.alpha':         'α = arccos(r / L₂)',
    'quick-return.metrics.xmax':          'x_max (posiciones extremas)',
    'quick-return.metrics.v_phi0':        'v en φ = 0 (paso rápido)',
    'quick-return.metrics.v_phi_pi':      'v en φ = π (paso lento)',

    // Quick-return — controls
    'quick-return.controls.section.geometry':   'Geometría',
    'quick-return.controls.section.dynamics':   'Cinemática',
    'quick-return.controls.section.visibility': 'Visibilidad',
    'quick-return.controls.slider.r':           'Longitud de manivela r (u)',
    'quick-return.controls.slider.L2':          'Altura del centro de manivela L₂ (u)',
    'quick-return.controls.slider.L1':          'Altura de la ranura L₁ (u)',
    'quick-return.controls.slider.omega':        'Velocidad de manivela ω (rad/s)',
    'quick-return.controls.toggle.velocity':    'v  (velocidad de herramienta)',
    'quick-return.controls.toggle.acceleration':'a  (aceleración de herramienta)',
    'quick-return.controls.toggle.trace':       'Trayectoria de herramienta',
    'quick-return.controls.toggle.guides':      'Círculo guía y eje',
    'quick-return.controls.constraint.ok':      'L₂ > r ✓',
    'quick-return.controls.constraint.warn':    '⚠ L₂ debe ser > r',
    'quick-return.controls.btn.reset':          'Reiniciar a φ = 0',
    'quick-return.controls.btn.pause':          'Pausar',
    'quick-return.controls.btn.resume':         'Reanudar',
    'quick-return.controls.info.xB':            'Pasador de manivela B',
    'quick-return.controls.info.xP':            'Carro herramienta P',
    'quick-return.controls.info.constraint':    'Restricción dura',

    // Quick-return — legend
    'quick-return.legend.heading':      'Leyenda',
    'quick-return.legend.crank':        'Manivela AB',
    'quick-return.legend.bar':          'Barra oscilante OQ',
    'quick-return.legend.sliderB':      'Carro B (pasador de manivela)',
    'quick-return.legend.sliderP':      'Carro P (herramienta)',
    'quick-return.legend.velocity':     'v  (velocidad de herramienta)',
    'quick-return.legend.acceleration': 'a  (aceleración de herramienta)',

    // Quick-return — equations panel
    'quick-return.equations.heading':           'Ecuaciones',
    'quick-return.equations.section.geometry':  'Geometría (O en el origen, A = (0, L₂))',
    'quick-return.equations.section.kinematics':'Cinemática de la herramienta',
    'quick-return.equations.section.extremes':  'Posiciones extremas y relación de retorno rápido',
    'quick-return.equations.section.center':    'Velocidades al cruzar el centro (x = 0)',
    'quick-return.equations.note.ratio':
      'La manivela barre (2π − 2α) en un recorrido y 2α en el otro. ' +
      'Como ω es constante, la relación de tiempos es igual a la relación de ángulos.',
    'quick-return.equations.note.center':
      'La herramienta cruza x = 0 dos veces por revolución a distintas velocidades — ' +
      'la asimetría es la firma del mecanismo de retorno rápido.',

    // Kepler — mecánica orbital / transferencia a Marte (/kepler)
    'nav.kepler': 'Kepler',

    'kepler.page.canvas_aria': 'Simulador de mecánica orbital de Kepler — trayectoria de transferencia del vehículo de retorno de Marte',

    // Kepler — nombres de fase
    'kepler.phase.circular':  'Órbita circular',
    'kepler.phase.transfer1': 'Órbita de transferencia 1',
    'kepler.phase.transfer2': 'Órbita de transferencia 2',
    'kepler.phase.escape':    'Trayectoria de escape',

    // Kepler — métricas
    'kepler.metrics.heading':      'Métricas en vivo',
    'kepler.metrics.phase':        'Fase',
    'kepler.metrics.altitude':     'Altitud',
    'kepler.metrics.speed':        'Rapidez',
    'kepler.metrics.v_final':      'Rapidez final (tras C)',
    'kepler.metrics.derived':      'Propiedades orbitales',
    'kepler.metrics.orbit1_T':     'T₁  (órbita de transf. 1)',
    'kepler.metrics.orbit2_T':     'T₂  (órbita de transf. 2)',
    'kepler.metrics.h1':           'h₁  (momento angular)',
    'kepler.metrics.h2':           'h₂  (momento angular)',

    // Kepler — controles
    'kepler.controls.section.maneuvers':  'Maniobras Δv',
    'kepler.controls.section.animation':  'Animación',
    'kepler.controls.section.visibility': 'Visibilidad',
    'kepler.controls.slider.dv_a':        'Δv en A (km/s)',
    'kepler.controls.slider.dv_b':        'Δv en B (km/s)',
    'kepler.controls.slider.dv_c':        'Δv en C (km/s)',
    'kepler.controls.slider.anim_speed':  'Vel. simulación (× tiempo real)',
    'kepler.controls.toggle.velocity':    'Vector velocidad',
    'kepler.controls.toggle.orbits':      'Trayectorias orbitales',
    'kepler.controls.toggle.area_sweep':  'Barrido de área (Kepler 2)',
    'kepler.controls.toggle.trace':       'Estela del vehículo',
    'kepler.controls.btn.reset':          'Reiniciar',
    'kepler.controls.btn.pause':          'Pausar',
    'kepler.controls.btn.resume':         'Reanudar',
    'kepler.controls.info.problem':       'Vehículo de retorno de Marte',
    'kepler.controls.info.r_a':           'Altitud en A: 2.200 km',
    'kepler.controls.info.r_b':           'Altitud en B: 100.000 km',
    'kepler.controls.info.r_c':           'Altitud en C: 1.000 km',

    // Kepler — leyenda
    'kepler.legend.heading':     'Leyenda',
    'kepler.legend.spacecraft':  'Vehículo espacial',
    'kepler.legend.velocity':    'Vector velocidad',
    'kepler.legend.orbit0':      'Órbita circular (inicial)',
    'kepler.legend.orbit1':      'Órbita de transf. 1 (A → B)',
    'kepler.legend.orbit2':      'Órbita de transf. 2 (B → C)',
    'kepler.legend.escape':      'Trayectoria de escape',
    'kepler.legend.area_sweep':  'Área barrida (tiempo igual = área igual)',

    // Kepler — ecuaciones
    'kepler.equations.heading':             'Ecuaciones',
    'kepler.equations.section.kepler1':     '1.ª Ley de Kepler',
    'kepler.equations.section.kepler2':     '2.ª Ley de Kepler',
    'kepler.equations.section.kepler3':     '3.ª Ley de Kepler',
    'kepler.equations.section.vis_viva':    'Ecuación vis-viva',
    'kepler.equations.section.circ':        'Rapidez en órbita circular',
    'kepler.equations.section.mission':     'Solución de la Misión',
    'kepler.equations.note.kepler1':
      'Todas las órbitas son secciones cónicas con el cuerpo atractor en uno de los focos. ' +
      'Un círculo (e = 0) es el caso especial de una elipse donde ambos focos coinciden ' +
      'y el radio permanece constante r = a en toda la órbita. ' +
      'A medida que e crece hacia 1 la elipse se alarga; en e = 1 se convierte en parábola; ' +
      'por encima de 1 es una hipérbola (la trayectoria de escape de esta misión).',
    'kepler.equations.note.kepler2':
      'El momento cinético L = r × mv se conserva siempre que el torque neto sobre el cuerpo sea cero. ' +
      'En el movimiento orbital, la gravedad apunta del cuerpo orbitante hacia el cuerpo central (a lo largo de r), ' +
      'por lo que su torque τ = r × F = 0 — y L es constante en toda la órbita. ' +
      'Dividiendo por la masa se obtiene el momento cinético específico h = L/m = r × v⊥, ' +
      'también constante, que caracteriza completamente la forma de la órbita y la tasa de barrido. ' +
      'Una línea desde el cuerpo central barre áreas iguales en tiempos iguales — ' +
      'la velocidad areolar dA/dt = h/2 es constante. ' +
      'En consecuencia, el cuerpo se mueve más rápido cerca del periapsis (r pequeño, v grande) ' +
      'y más lento cerca del apoapsis (r grande, v pequeño).',
    'kepler.equations.note.kepler3':
      'El cuadrado del período orbital es proporcional al cubo del semieje mayor: ' +
      'T² ∝ a³. Para Marte: T² = (4π²/μ) × a³.',
    'kepler.equations.note.vis_viva':
      'Se deriva de la conservación de la energía. En cualquier punto de la órbita, ' +
      'la energía mecánica específica total E = v²/2 − μ/r = −μ/(2a) es constante.',
    'kepler.equations.note.mission':
      'Cadena de momento angular: h = r × v_⊥ se conserva dentro de cada órbita. ' +
      'Conociendo cualquier r y la rapidez tangencial, la órbita queda determinada.',

    // Kepler — aproximación de maniobra impulsiva
    'kepler.equations.section.impulsive': 'Aproximación de maniobra impulsiva',
    'kepler.equations.note.impulsive':
      'Cada Δv se modela como un impulso instantáneo: el tiempo de quema Δt → 0 ' +
      'y el arco recorrido durante la quema Δs ≈ 0. ' +
      'En consecuencia, la posición del vehículo se mantiene fija en A, B o C durante la maniobra — ' +
      'solo cambia el vector velocidad. ' +
      'Por eso la solución encadena directamente los momentos angulares en cada punto ' +
      'sin integrar la trayectoria durante la aceleración. ' +
      'La aproximación es válida cuando el tiempo de quema es despreciable frente al ' +
      'período orbital (aquí T₁ ≈ 107 h frente a una quema de segundos o minutos). ' +
      'Cuando esa relación no es pequeña, se requiere un modelo de empuje finito: la fuerza de empuje, ' +
      'la masa variable (ecuación de Tsiolkovsky) y el arco real recorrido deben integrarse — ' +
      'el resultado ya no es analítico.',

    // Units note (shared on both pages)
    'units.note':
      '«u» es una unidad de longitud genérica — elige la que quieras (metros, cm, píxeles). ' +
      'Las velocidades van en u/s, las aceleraciones en u/s² y las energías en u²/s² ' +
      '(la masa está normalizada a 1).',

    // Footer attribution (shown on every page)
    'footer.attribution':
      'Simulador interactivo desarrollado como apoyo didáctico para visualizar ' +
      'la trayectoria circular, en el marco de la cátedra de Mecánica Técnica ' +
      'de la UTN – FRBA.',
    'footer.related.prefix':
      '¿Querés ver también el campo eléctrico y el método de relajación? Pasá por',
    'footer.rlc.prefix':
      '¿Querés explorar los circuitos RLC en CA? Pasá por',
    'footer.nqm.prefix':
      '¿Querés explorar los diagramas de esfuerzos internos N, Q y M para pórticos planos? Visitá',
  },
} as const

export type TranslationKey = keyof (typeof translations)['en']

export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en'
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}
