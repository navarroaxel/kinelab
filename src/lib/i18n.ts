export type Language = 'en' | 'es'

export const LANGUAGES: Language[] = ['en', 'es']

export const translations = {
  en: {
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
    'controls.toggle.polar_accel': 'Polar acceleration (aᵣ, aₒ)',
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
    'legend.r_theta_dot': 'rθ̇ · eₒ  (transverse velocity)',
    'legend.polar_accel': 'Polar acceleration (aᵣ, aₒ)',
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
      'the polar one depends on the chosen pole. Moving the pole changes aᵣ and aₒ but ' +
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
    'nav.aria_label': 'Simulators',
    'nav.polar':      'Polar',
    'nav.ring':       'Ring',
    'nav.pin_slot':   'Pin–Slot',

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
    'pin-slot.controls.slider.d':           'Center distance d (u)',
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
  },
  es: {
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
    'controls.toggle.polar_accel': 'Aceleración polar (aᵣ, aₒ)',
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
    'legend.r_theta_dot': 'rθ̇ · eₒ  (velocidad transversal)',
    'legend.polar_accel': 'Aceleración polar (aᵣ, aₒ)',
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
      'la polar depende del polo elegido. Mover el polo cambia aᵣ y aₒ pero deja aₜ y aₙ intactas.',

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
    'nav.aria_label': 'Simuladores',
    'nav.polar':      'Polar',
    'nav.ring':       'Anillo',
    'nav.pin_slot':   'Pasador',

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
    'pin-slot.controls.slider.d':           'Distancia entre centros d (u)',
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
  },
} as const

export type TranslationKey = keyof (typeof translations)['en']

export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en'
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}
