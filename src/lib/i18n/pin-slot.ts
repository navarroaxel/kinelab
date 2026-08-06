export const pinSlot = {
  en: {
    // Pin-slot page — meta
    "pin-slot.page.canvas_aria":
      "Pin-in-circular-slot simulator — pin B drives pivoted bar OC",

    // Pin-slot — metrics
    "pin-slot.metrics.heading": "Live Metrics",
    "pin-slot.metrics.phi": "Φ  (pin angle on slot)",
    "pin-slot.metrics.theta": "θ  (bar angle)",
    "pin-slot.metrics.rho": "ρ  (|OB|)",
    "pin-slot.metrics.vr": "Vᵣ  (radial, along bar)",
    "pin-slot.metrics.vperp": "V⊥  (transverse)",
    "pin-slot.metrics.omega": "ω  (bar angular vel.)",
    "pin-slot.metrics.gamma": "γ  (bar angular accel.)",

    // Pin-slot — controls
    "pin-slot.controls.section.geometry": "Geometry",
    "pin-slot.controls.section.dynamics": "Kinematics",
    "pin-slot.controls.section.visibility": "Visibility",
    "pin-slot.controls.slider.r": "Slot radius r (u)",
    "pin-slot.controls.slider.d": "Center distance d (O–A)",
    "pin-slot.controls.slider.v0": "Pin speed V₀ (u/s)",
    "pin-slot.controls.toggle.v0": "V₀  (tangent velocity)",
    "pin-slot.controls.toggle.vr": "Vᵣ  (radial component)",
    "pin-slot.controls.toggle.vperp": "V⊥  (transverse component)",
    "pin-slot.controls.toggle.angles": "Φ and θ angle arcs",
    "pin-slot.controls.toggle.rho": "ρ segment (O→B)",
    "pin-slot.controls.constraint.ok": "d > r ✓",
    "pin-slot.controls.constraint.warn": "⚠ d must be > r",
    "pin-slot.controls.btn.reset": "Reset to Φ = 0",
    "pin-slot.controls.btn.pause": "Pause",
    "pin-slot.controls.btn.resume": "Resume",
    "pin-slot.controls.info.omega": "Pin angular rate",
    "pin-slot.controls.info.omega_bar": "Bar angular velocity",

    // Pin-slot — legend
    "pin-slot.legend.heading": "Legend",
    "pin-slot.legend.v0": "V₀  (tangent velocity at B)",
    "pin-slot.legend.vr": "Vᵣ  (radial component along bar)",
    "pin-slot.legend.vperp": "V⊥  (transverse component)",
    "pin-slot.legend.rho": "ρ  (O → B segment)",
    "pin-slot.legend.bar": "Bar OC",

    // Pin-slot — equations panel
    "pin-slot.equations.heading": "Equations",
    "pin-slot.equations.section.setup": "Geometry (O at origin, A = (d, 0))",
    "pin-slot.equations.section.pin": "Pin motion on the slot (constant speed)",
    "pin-slot.equations.section.bar": "Bar OC kinematics (derived)",
    "pin-slot.equations.section.swing": "Bar swing limit  (d > r)",
    "pin-slot.equations.section.invariant": "Speed invariant",
    "pin-slot.equations.note.swing":
      "Because d > r, O lies outside the circle and the bar never completes a full revolution — " +
      "it swings back and forth within ±arcsin(r/d).",
    "pin-slot.equations.note.invariant":
      "The total speed of the pin is constant (V₀), so the radial and transverse " +
      "components always satisfy Vᵣ² + V⊥² = V₀².",
  },
  es: {
    // Pin-slot page — meta
    "pin-slot.page.canvas_aria":
      "Simulador de pasador en ranura circular — el pasador B mueve la barra articulada OC",

    // Pin-slot — metrics
    "pin-slot.metrics.heading": "Métricas en vivo",
    "pin-slot.metrics.phi": "Φ  (ángulo del pasador en ranura)",
    "pin-slot.metrics.theta": "θ  (ángulo de la barra)",
    "pin-slot.metrics.rho": "ρ  (|OB|)",
    "pin-slot.metrics.vr": "Vᵣ  (radial, a lo largo de barra)",
    "pin-slot.metrics.vperp": "V⊥  (transversal)",
    "pin-slot.metrics.omega": "ω  (vel. angular de barra)",
    "pin-slot.metrics.gamma": "γ  (acel. angular de barra)",

    // Pin-slot — controls
    "pin-slot.controls.section.geometry": "Geometría",
    "pin-slot.controls.section.dynamics": "Cinemática",
    "pin-slot.controls.section.visibility": "Visibilidad",
    "pin-slot.controls.slider.r": "Radio de ranura r (u)",
    "pin-slot.controls.slider.d": "Distancia entre centros d (O–A)",
    "pin-slot.controls.slider.v0": "Rapidez del pasador V₀ (u/s)",
    "pin-slot.controls.toggle.v0": "V₀  (velocidad tangente)",
    "pin-slot.controls.toggle.vr": "Vᵣ  (componente radial)",
    "pin-slot.controls.toggle.vperp": "V⊥  (componente transversal)",
    "pin-slot.controls.toggle.angles": "Arcos de Φ y θ",
    "pin-slot.controls.toggle.rho": "Segmento ρ (O→B)",
    "pin-slot.controls.constraint.ok": "d > r ✓",
    "pin-slot.controls.constraint.warn": "⚠ d debe ser > r",
    "pin-slot.controls.btn.reset": "Reiniciar a Φ = 0",
    "pin-slot.controls.btn.pause": "Pausar",
    "pin-slot.controls.btn.resume": "Reanudar",
    "pin-slot.controls.info.omega": "Velocidad angular del pasador",
    "pin-slot.controls.info.omega_bar": "Velocidad angular de la barra",

    // Pin-slot — legend
    "pin-slot.legend.heading": "Leyenda",
    "pin-slot.legend.v0": "V₀  (velocidad tangente en B)",
    "pin-slot.legend.vr": "Vᵣ  (componente radial a lo largo de la barra)",
    "pin-slot.legend.vperp": "V⊥  (componente transversal)",
    "pin-slot.legend.rho": "ρ  (segmento O → B)",
    "pin-slot.legend.bar": "Barra OC",

    // Pin-slot — equations panel
    "pin-slot.equations.heading": "Ecuaciones",
    "pin-slot.equations.section.setup":
      "Geometría (O en el origen, A = (d, 0))",
    "pin-slot.equations.section.pin":
      "Movimiento del pasador en la ranura (rapidez constante)",
    "pin-slot.equations.section.bar": "Cinemática de la barra OC (derivada)",
    "pin-slot.equations.section.swing":
      "Límite de oscilación de la barra  (d > r)",
    "pin-slot.equations.section.invariant": "Invariante de rapidez",
    "pin-slot.equations.note.swing":
      "Como d > r, O queda fuera del círculo y la barra nunca da una vuelta completa — " +
      "oscila dentro de ±arcsin(r/d).",
    "pin-slot.equations.note.invariant":
      "La rapidez del pasador es constante (V₀), por lo que las componentes radial y " +
      "transversal siempre satisfacen Vᵣ² + V⊥² = V₀².",
  },
};
