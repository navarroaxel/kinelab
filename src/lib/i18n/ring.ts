export const ring = {
  en: {
    // Ring page — meta
    "ring.page.canvas_aria":
      "Vertical ring simulator — particle on the inside of a smooth ring",

    // Ring — metrics
    "ring.metrics.heading": "Live Metrics",
    "ring.metrics.theta": "θ  (angle from bottom)",
    "ring.metrics.v": "v  (speed)",
    "ring.metrics.n": "N  (normal force)",
    "ring.metrics.h": "h  (height)",
    "ring.metrics.ke": "KE  (kinetic)",
    "ring.metrics.pe": "PE  (potential)",
    "ring.metrics.vmin_label": "v_min = √(5·g·R)",
    "ring.metrics.vmin_pct": "of v_min",

    // Ring — controls
    "ring.controls.section.geometry": "Geometry & gravity",
    "ring.controls.section.dynamics": "Initial conditions",
    "ring.controls.section.visibility": "Visibility",
    "ring.controls.section.formulas": "Formulas",
    "ring.controls.slider.radius": "Radius R",
    "ring.controls.slider.gravity": "Gravity g",
    "ring.controls.slider.v0": "Initial speed v₀",
    "ring.controls.toggle.weight": "Weight (mg)",
    "ring.controls.toggle.normal": "Normal force (N)",
    "ring.controls.toggle.velocity": "Velocity (v)",
    "ring.controls.toggle.energy_bar": "Energy bar (KE / PE)",
    "ring.controls.toggle.trace": "Path trace",
    "ring.controls.toggle.vmin": "v_min threshold",
    "ring.controls.btn.reset": "Reset to bottom",
    "ring.controls.btn.vmin": "v₀ = v_min",
    "ring.controls.btn.pause": "Pause",
    "ring.controls.btn.resume": "Resume",
    "ring.controls.info.vmin": "v_min (complete loop)",
    "ring.controls.info.eom": "Equation of motion",
    "ring.controls.info.normal": "Normal force",

    // Ring — legend
    "ring.legend.heading": "Legend",
    "ring.legend.weight": "mg  (weight)",
    "ring.legend.normal": "N  (normal force)",
    "ring.legend.velocity": "v  (tangent velocity)",
    "ring.legend.ke": "KE  (kinetic energy)",
    "ring.legend.pe": "PE  (potential energy)",

    // Ring — energy bar
    "ring.energy.heading": "Energy",
    "ring.energy.ke": "KE",
    "ring.energy.pe": "PE",
    "ring.energy.total": "E",
    "ring.energy.drift_warning": "Numerical drift detected",
    "ring.energy.empty": "Set v₀ > 0 to see energy partitioning.",
    "ring.energy.ke_share_aria": "Kinetic energy share",
    "ring.energy.pe_share_aria": "Potential energy share",

    // Ring — equations panel
    "ring.equations.heading": "Equations",
    "ring.equations.section.eom": "Equation of motion",
    "ring.equations.section.normal": "Normal force",
    "ring.equations.section.vmin": "Minimum speed for a complete loop",
    "ring.equations.section.energy": "Energy conservation",
    "ring.equations.note.pendulum":
      "Same form as a pendulum — nonlinear, solved with RK4.",
    "ring.equations.note.contact": "Contact is maintained while N ≥ 0.",
    "ring.equations.note.energy":
      "The normal force N is always perpendicular to the velocity, so it does no work. " +
      "Gravity is the only force doing work, and it is conservative — therefore the total " +
      "mechanical energy E = KE + PE is conserved. Kinetic energy turns into potential energy " +
      "on the way up and back into kinetic energy on the way down. Any drift you see in E " +
      "comes from the numerical integrator, not from the physics.",

    // Ring — energy strip chart
    "ring.chart.energy.title": "Energy partitioning vs. time",
    "ring.chart.energy.empty": "Set v₀ > 0 to record the energy timeline.",
  },
  es: {
    // Ring page — meta
    "ring.page.canvas_aria":
      "Simulador del anillo vertical — partícula dentro de un anillo liso",

    // Ring — metrics
    "ring.metrics.heading": "Métricas en vivo",
    "ring.metrics.theta": "θ  (ángulo desde el fondo)",
    "ring.metrics.v": "v  (rapidez)",
    "ring.metrics.n": "N  (fuerza normal)",
    "ring.metrics.h": "h  (altura)",
    "ring.metrics.ke": "EC  (cinética)",
    "ring.metrics.pe": "EP  (potencial)",
    "ring.metrics.vmin_label": "v_min = √(5·g·R)",
    "ring.metrics.vmin_pct": "de v_min",

    // Ring — controls
    "ring.controls.section.geometry": "Geometría y gravedad",
    "ring.controls.section.dynamics": "Condiciones iniciales",
    "ring.controls.section.visibility": "Visibilidad",
    "ring.controls.section.formulas": "Fórmulas",
    "ring.controls.slider.radius": "Radio R",
    "ring.controls.slider.gravity": "Gravedad g",
    "ring.controls.slider.v0": "Rapidez inicial v₀",
    "ring.controls.toggle.weight": "Peso (mg)",
    "ring.controls.toggle.normal": "Fuerza normal (N)",
    "ring.controls.toggle.velocity": "Velocidad (v)",
    "ring.controls.toggle.energy_bar": "Barra de energía (EC / EP)",
    "ring.controls.toggle.trace": "Trayectoria",
    "ring.controls.toggle.vmin": "Umbral v_min",
    "ring.controls.btn.reset": "Volver al fondo",
    "ring.controls.btn.vmin": "v₀ = v_min",
    "ring.controls.btn.pause": "Pausar",
    "ring.controls.btn.resume": "Reanudar",
    "ring.controls.info.vmin": "v_min (vuelta completa)",
    "ring.controls.info.eom": "Ecuación de movimiento",
    "ring.controls.info.normal": "Fuerza normal",

    // Ring — legend
    "ring.legend.heading": "Leyenda",
    "ring.legend.weight": "mg  (peso)",
    "ring.legend.normal": "N  (fuerza normal)",
    "ring.legend.velocity": "v  (velocidad tangente)",
    "ring.legend.ke": "EC  (energía cinética)",
    "ring.legend.pe": "EP  (energía potencial)",

    // Ring — energy bar
    "ring.energy.heading": "Energía",
    "ring.energy.ke": "EC",
    "ring.energy.pe": "EP",
    "ring.energy.total": "E",
    "ring.energy.drift_warning": "Deriva numérica detectada",
    "ring.energy.empty": "Ajusta v₀ > 0 para ver la repartición de energía.",
    "ring.energy.ke_share_aria": "Proporción de energía cinética",
    "ring.energy.pe_share_aria": "Proporción de energía potencial",

    // Ring — equations panel
    "ring.equations.heading": "Ecuaciones",
    "ring.equations.section.eom": "Ecuación de movimiento",
    "ring.equations.section.normal": "Fuerza normal",
    "ring.equations.section.vmin": "Rapidez mínima para una vuelta completa",
    "ring.equations.section.energy": "Conservación de la energía",
    "ring.equations.note.pendulum":
      "Misma forma que un péndulo — no lineal, resuelta con RK4.",
    "ring.equations.note.contact": "El contacto se mantiene mientras N ≥ 0.",
    "ring.equations.note.energy":
      "La fuerza normal N es siempre perpendicular a la velocidad, por lo que no realiza trabajo. " +
      "La gravedad es la única fuerza que hace trabajo, y es conservativa — por lo tanto la energía " +
      "mecánica total E = EC + EP se conserva. La energía cinética se transforma en potencial al " +
      "subir y vuelve a ser cinética al bajar. Cualquier deriva visible en E proviene del integrador " +
      "numérico, no de la física.",

    // Ring — energy strip chart
    "ring.chart.energy.title": "Reparto de energía vs. tiempo",
    "ring.chart.energy.empty":
      "Ajusta v₀ > 0 para registrar la línea temporal de energía.",
  },
};
