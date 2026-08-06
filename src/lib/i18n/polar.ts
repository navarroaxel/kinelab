export const polar = {
  en: {
    // ControlsPanel — sections
    "controls.section.geometry": "Geometry",
    "controls.section.dynamics": "Dynamics",
    "controls.section.visibility": "Visibility",

    // ControlsPanel — sliders
    "controls.slider.pole_x": "Pole X",
    "controls.slider.pole_y": "Pole Y",
    "controls.slider.radius": "Radius",

    // ControlsPanel — visibility toggles
    "controls.toggle.polar_velocity": "Polar velocity (ṙ, rθ̇)",
    "controls.toggle.cartesian": "Cartesian coords (x, y)",
    "controls.toggle.r_vector": "Vector r",
    "controls.toggle.polar_accel": "Polar acceleration (aᵣ, aθ)",
    "controls.toggle.normal_accel": "Normal acceleration (aₙ)",
    "controls.toggle.trace": "Path trace",

    // ControlsPanel — buttons
    "controls.btn.pole_center": "Pole to center",
    "controls.btn.reset_alpha": "Reset α",
    "controls.btn.pause": "Pause",
    "controls.btn.resume": "Resume",

    // PolarMetrics
    "metrics.heading": "Live Metrics",
    "metrics.r": "r  (magnitude)",
    "metrics.theta": "θ  (polar angle)",
    "metrics.r_dot": "ṙ  (radial vel.)",
    "metrics.r_theta_dot": "rθ̇  (transverse vel.)",
    "metrics.omega": "ω  (current)",
    "metrics.at": "aₜ  (tangential)",

    // VectorLegend
    "legend.heading": "Legend",
    "legend.r": "r  (pole → P)",
    "legend.r_dot": "ṙ · eᵣ  (radial velocity)",
    "legend.r_theta_dot": "rθ̇ · eθ  (transverse velocity)",
    "legend.polar_accel": "Polar acceleration (aᵣ, aθ)",
    "legend.normal_accel": "Normal acceleration aₙ",

    // EquationsPanel
    "equations.heading": "Equations",
    "equations.section.position": "Position & r vector",
    "equations.section.polar_velocity": "Polar velocity",
    "equations.note.omega_dot": "ω̇ = α  (non-uniform when α ≠ 0)",
    "equations.section.polar_accel": "Polar acceleration",
    "equations.section.tangential": "Tangential acceleration",
    "equations.section.normal": "Normal acceleration",
    "equations.footer":
      "Pole at center → ṙ = 0, rθ̇ = R·ω = const. " +
      "Move the pole off-center → both components become non-zero " +
      "even though the path remains a perfect circle. " +
      "Set α ≠ 0 → ω varies in time and the motion is non-uniform.",
    "equations.section.decomp_heading": "Two decompositions of a",
    "equations.decomp.intrinsic_heading": "Intrinsic basis (t, n)",
    "equations.decomp.at":
      "Measures the change in speed: aₜ > 0 speeds up, aₜ < 0 slows down. " +
      "Vanishes in uniform circular motion.",
    "equations.decomp.an":
      "Bends the trajectory without changing |v|. Never vanishes while the particle is turning.",
    "equations.decomp.polar_heading": "Polar basis (r, θ)",
    "equations.decomp.ar":
      "Includes the term −r·θ̇², which is why it is generally negative even when r is not " +
      "changing: the unit vector eᵣ rotates with the particle.",
    "equations.decomp.atheta":
      "Contains the Coriolis-like term 2·ṙ·θ̇, which couples radial and angular motion.",
    "equations.decomp.relation":
      "Both pairs add up to the same vector a. The intrinsic basis follows the trajectory; " +
      "the polar one depends on the chosen pole. Moving the pole changes aᵣ and aθ but " +
      "leaves aₜ and aₙ untouched.",

    // Strip chart panels
    "chart.velocity.title": "Polar velocity vs. time",
    "chart.accel.title": "Tangential acceleration vs. time",

    // Phasor diagrams
    "phasor.velocity.title": "Velocity phasor",
    "phasor.acceleration.title": "Acceleration phasor",
    "phasor.basis.intrinsic": "Intrinsic (t, n)",
    "phasor.basis.polar": "Polar (r, θ)",
    "phasor.vn.zero": "vₙ = 0 (v ⊥ R)",

    // Polar page — meta
    "polar.page.canvas_aria":
      "Polar coordinates simulator — animated circular motion",
  },
  es: {
    // ControlsPanel — sections
    "controls.section.geometry": "Geometría",
    "controls.section.dynamics": "Dinámica",
    "controls.section.visibility": "Visibilidad",

    // ControlsPanel — sliders
    "controls.slider.pole_x": "Polo X",
    "controls.slider.pole_y": "Polo Y",
    "controls.slider.radius": "Radio",

    // ControlsPanel — visibility toggles
    "controls.toggle.polar_velocity": "Velocidad polar (ṙ, rθ̇)",
    "controls.toggle.cartesian": "Coordenadas cartesianas (x, y)",
    "controls.toggle.r_vector": "Vector r",
    "controls.toggle.polar_accel": "Aceleración polar (aᵣ, aθ)",
    "controls.toggle.normal_accel": "Aceleración normal (aₙ)",
    "controls.toggle.trace": "Trayectoria",

    // ControlsPanel — buttons
    "controls.btn.pole_center": "Polo al centro",
    "controls.btn.reset_alpha": "Reiniciar α",
    "controls.btn.pause": "Pausar",
    "controls.btn.resume": "Reanudar",

    // PolarMetrics
    "metrics.heading": "Métricas en vivo",
    "metrics.r": "r  (magnitud)",
    "metrics.theta": "θ  (ángulo polar)",
    "metrics.r_dot": "ṙ  (vel. radial)",
    "metrics.r_theta_dot": "rθ̇  (vel. transversal)",
    "metrics.omega": "ω  (actual)",
    "metrics.at": "aₜ  (tangencial)",

    // VectorLegend
    "legend.heading": "Leyenda",
    "legend.r": "r  (polo → P)",
    "legend.r_dot": "ṙ · eᵣ  (velocidad radial)",
    "legend.r_theta_dot": "rθ̇ · eθ  (velocidad transversal)",
    "legend.polar_accel": "Aceleración polar (aᵣ, aθ)",
    "legend.normal_accel": "Aceleración normal aₙ",

    // EquationsPanel
    "equations.heading": "Ecuaciones",
    "equations.section.position": "Posición y vector r",
    "equations.section.polar_velocity": "Velocidad polar",
    "equations.note.omega_dot": "ω̇ = α  (no uniforme cuando α ≠ 0)",
    "equations.section.polar_accel": "Aceleración polar",
    "equations.section.tangential": "Aceleración tangencial",
    "equations.section.normal": "Aceleración normal",
    "equations.footer":
      "Polo en el centro → ṙ = 0, rθ̇ = R·ω = const. " +
      "Mueve el polo fuera del centro → ambas componentes se vuelven " +
      "distintas de cero aunque la trayectoria sigue siendo un círculo perfecto. " +
      "Si α ≠ 0 → ω varía en el tiempo y el movimiento no es uniforme.",
    "equations.section.decomp_heading": "Dos descomposiciones de a",
    "equations.decomp.intrinsic_heading": "Base intrínseca (t, n)",
    "equations.decomp.at":
      "Mide el cambio de rapidez: aₜ > 0 acelera, aₜ < 0 frena. " +
      "Se anula en movimiento circular uniforme.",
    "equations.decomp.an":
      "Curva la trayectoria sin cambiar |v|. Nunca se anula mientras la partícula gire.",
    "equations.decomp.polar_heading": "Base polar (r, θ)",
    "equations.decomp.ar":
      "Incluye el término −r·θ̇², por eso suele ser negativa aun cuando r no cambia: " +
      "el versor eᵣ rota con la partícula.",
    "equations.decomp.atheta":
      "Contiene el término tipo Coriolis 2·ṙ·θ̇, que acopla el movimiento radial con el angular.",
    "equations.decomp.relation":
      "Ambos pares suman el mismo vector a. La base intrínseca acompaña a la trayectoria; " +
      "la polar depende del polo elegido. Mover el polo cambia aᵣ y aθ pero deja aₜ y aₙ intactas.",

    // Strip charts
    "chart.velocity.title": "Velocidad polar vs. tiempo",
    "chart.accel.title": "Aceleración tangencial vs. tiempo",

    // Phasor diagrams
    "phasor.velocity.title": "Diagrama fasorial — velocidad",
    "phasor.acceleration.title": "Diagrama fasorial — aceleración",
    "phasor.basis.intrinsic": "Intrínseca (t, n)",
    "phasor.basis.polar": "Polar (r, θ)",
    "phasor.vn.zero": "vₙ = 0 (v ⊥ R)",

    // Polar page — meta
    "polar.page.canvas_aria":
      "Simulador de coordenadas polares — movimiento circular animado",
  },
};
