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

    // Strip chart panels
    'chart.velocity.title': 'Polar velocity vs. time',
    'chart.accel.title':    'Tangential acceleration vs. time',

    // Navigation between simulators
    'nav.aria_label': 'Simulators',
    'nav.polar': 'Polar',
    'nav.ring':  'Ring',
    'nav.bar':   'Bar',

    // Polar page — meta
    'polar.page.canvas_aria': 'Polar coordinates simulator — animated circular motion',

    // Ring page — meta
    'ring.page.canvas_aria': 'Vertical ring simulator — particle on the inside of a smooth ring',

    // Bar page — meta
    'bar.page.canvas_aria': 'Rotating bar simulator — particle sliding freely along a bar that spins at constant ω',

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

    // Bar — metrics
    'bar.metrics.heading':   'Live Metrics',
    'bar.metrics.r':         'r  (radial position)',
    'bar.metrics.r_dot':     'ṙ  (radial velocity)',
    'bar.metrics.theta':     'θ  (bar angle)',
    'bar.metrics.v':         'v  (total speed)',
    'bar.metrics.ar':        'aᵣ  (net radial)',
    'bar.metrics.ao':        'aₒ  (Coriolis)',
    'bar.metrics.n':         'N  (force from bar)',
    'bar.metrics.t':         't  (elapsed time)',
    'bar.metrics.ar_note':   'Net radial force = 0 (no friction)',
    'bar.metrics.ejection':  'Ejection at',
    'bar.metrics.never':     'never reaches L (with current ICs)',
    'bar.metrics.bar_length':'Bar length',
    'bar.metrics.ejected':   'Particle has left the bar',

    // Bar — controls
    'bar.controls.section.bar':         'Bar',
    'bar.controls.section.dynamics':    'Initial conditions',
    'bar.controls.section.visibility':  'Visibility',
    'bar.controls.section.info':        'Reference',
    'bar.controls.slider.omega':        'Angular velocity ω',
    'bar.controls.slider.length':       'Bar length L',
    'bar.controls.slider.r0':           'Initial position r₀',
    'bar.controls.slider.rdot0':        'Initial radial vel. ṙ₀',
    'bar.controls.toggle.ar':           'Radial acceleration aᵣ (= 0)',
    'bar.controls.toggle.ao':           'Coriolis acceleration aₒ',
    'bar.controls.toggle.n':            'Normal force N from bar',
    'bar.controls.toggle.vcomp':        'Velocity components (ṙ, rω)',
    'bar.controls.toggle.trace':        'Particle trail',
    'bar.controls.toggle.ghost':        'Bar rotation history',
    'bar.controls.btn.reset':           'Reset',
    'bar.controls.btn.pause':           'Pause',
    'bar.controls.btn.resume':          'Resume',
    'bar.controls.info.solution':       'Solution',
    'bar.controls.info.ejection':       'Ejection time',
    'bar.controls.info.coriolis':       'Coriolis force',

    // Bar — legend
    'bar.legend.heading': 'Legend',
    'bar.legend.bar':     'rotating bar',
    'bar.legend.r':       'r  (pivot → P)',
    'bar.legend.vr':      'ṙ · eᵣ  (radial velocity)',
    'bar.legend.vt':      'r·ω · eₒ  (transverse velocity)',
    'bar.legend.ao':      'aₒ = 2·ṙ·ω  (Coriolis)',
    'bar.legend.n':       'N  (normal force from bar)',
    'bar.legend.ar':      'aᵣ = 0  (no friction)',
    'bar.legend.ejection':'ejection velocity (lab frame)',

    // Bar — equations panel
    'bar.equations.heading':             'Equations',
    'bar.equations.section.radial':      'Equation of motion (radial)',
    'bar.equations.section.normal':      'Normal force (transverse)',
    'bar.equations.section.solution':    'Exact analytical solution',
    'bar.equations.section.insight':     'Key insight',
    'bar.equations.note.radial':
      'No radial force (smooth bar). The particle accelerates outward purely ' +
      'because of the rotation — this is the centrifugal effect in the lab frame.',
    'bar.equations.note.normal':
      'The bar must push the particle transversally to keep it co-rotating. ' +
      'This is the Coriolis term 2·ṙ·ω — it grows as the particle speeds up radially.',
    'bar.equations.note.solution':
      'Unlike the ring simulation (which needs RK4), this ODE has a closed-form ' +
      'solution. The simulator evaluates it exactly each frame — no numerical drift.',
    'bar.equations.note.insight':
      'The net radial acceleration is zero. The particle "falls outward" not because ' +
      'a force pushes it, but because there is no inward force to keep it in circular ' +
      'motion. Compare with the ring: there, N prevents this outward drift.',

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

    // Strip charts
    'chart.velocity.title': 'Velocidad polar vs. tiempo',
    'chart.accel.title':    'Aceleración tangencial vs. tiempo',

    // Navigation between simulators
    'nav.aria_label': 'Simuladores',
    'nav.polar': 'Polar',
    'nav.ring':  'Anillo',
    'nav.bar':   'Barra',

    // Polar page — meta
    'polar.page.canvas_aria': 'Simulador de coordenadas polares — movimiento circular animado',

    // Ring page — meta
    'ring.page.canvas_aria': 'Simulador del anillo vertical — partícula dentro de un anillo liso',

    // Bar page — meta
    'bar.page.canvas_aria': 'Simulador de barra rotante — partícula que desliza libremente sobre una barra con ω constante',

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

    // Bar — metrics
    'bar.metrics.heading':   'Métricas en vivo',
    'bar.metrics.r':         'r  (posición radial)',
    'bar.metrics.r_dot':     'ṙ  (velocidad radial)',
    'bar.metrics.theta':     'θ  (ángulo de la barra)',
    'bar.metrics.v':         'v  (rapidez total)',
    'bar.metrics.ar':        'aᵣ  (radial neta)',
    'bar.metrics.ao':        'aₒ  (Coriolis)',
    'bar.metrics.n':         'N  (fuerza de la barra)',
    'bar.metrics.t':         't  (tiempo transcurrido)',
    'bar.metrics.ar_note':   'Fuerza radial neta = 0 (sin rozamiento)',
    'bar.metrics.ejection':  'Eyección en',
    'bar.metrics.never':     'no alcanza L (con estas CIs)',
    'bar.metrics.bar_length':'Largo de la barra',
    'bar.metrics.ejected':   'La partícula salió de la barra',

    // Bar — controls
    'bar.controls.section.bar':         'Barra',
    'bar.controls.section.dynamics':    'Condiciones iniciales',
    'bar.controls.section.visibility':  'Visibilidad',
    'bar.controls.section.info':        'Referencia',
    'bar.controls.slider.omega':        'Velocidad angular ω',
    'bar.controls.slider.length':       'Largo de la barra L',
    'bar.controls.slider.r0':           'Posición inicial r₀',
    'bar.controls.slider.rdot0':        'Vel. radial inicial ṙ₀',
    'bar.controls.toggle.ar':           'Aceleración radial aᵣ (= 0)',
    'bar.controls.toggle.ao':           'Aceleración de Coriolis aₒ',
    'bar.controls.toggle.n':            'Fuerza normal N de la barra',
    'bar.controls.toggle.vcomp':        'Componentes de velocidad (ṙ, rω)',
    'bar.controls.toggle.trace':        'Trayectoria de la partícula',
    'bar.controls.toggle.ghost':        'Historial de la barra',
    'bar.controls.btn.reset':           'Reiniciar',
    'bar.controls.btn.pause':           'Pausar',
    'bar.controls.btn.resume':          'Reanudar',
    'bar.controls.info.solution':       'Solución',
    'bar.controls.info.ejection':       'Tiempo de eyección',
    'bar.controls.info.coriolis':       'Fuerza de Coriolis',

    // Bar — legend
    'bar.legend.heading': 'Leyenda',
    'bar.legend.bar':     'barra rotante',
    'bar.legend.r':       'r  (pivote → P)',
    'bar.legend.vr':      'ṙ · eᵣ  (velocidad radial)',
    'bar.legend.vt':      'r·ω · eₒ  (velocidad transversal)',
    'bar.legend.ao':      'aₒ = 2·ṙ·ω  (Coriolis)',
    'bar.legend.n':       'N  (fuerza normal de la barra)',
    'bar.legend.ar':      'aᵣ = 0  (sin rozamiento)',
    'bar.legend.ejection':'velocidad de eyección (marco lab.)',

    // Bar — equations panel
    'bar.equations.heading':             'Ecuaciones',
    'bar.equations.section.radial':      'Ecuación de movimiento (radial)',
    'bar.equations.section.normal':      'Fuerza normal (transversal)',
    'bar.equations.section.solution':    'Solución analítica exacta',
    'bar.equations.section.insight':     'Idea clave',
    'bar.equations.note.radial':
      'No hay fuerza radial (barra lisa). La partícula se acelera hacia afuera ' +
      'únicamente por la rotación — es el efecto centrífugo visto desde el marco del laboratorio.',
    'bar.equations.note.normal':
      'La barra debe empujar a la partícula transversalmente para mantenerla girando con ella. ' +
      'Ese es el término de Coriolis 2·ṙ·ω — crece a medida que la partícula acelera radialmente.',
    'bar.equations.note.solution':
      'A diferencia del anillo (que necesita RK4), esta EDO tiene solución cerrada. ' +
      'El simulador la evalúa exactamente en cada cuadro — sin deriva numérica.',
    'bar.equations.note.insight':
      'La aceleración radial neta es cero. La partícula «cae hacia afuera» no porque ' +
      'una fuerza la empuje, sino porque no hay fuerza hacia adentro que la mantenga en ' +
      'movimiento circular. Compara con el anillo: allí N evita ese alejamiento radial.',

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
  },
} as const

export type TranslationKey = keyof (typeof translations)['en']

export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en'
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}
