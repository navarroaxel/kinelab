export const quickReturn = {
  en: {
    // Quick-return page — meta
    "quick-return.page.canvas_aria":
      "Quick-return mechanism simulator — crank AB drives oscillating bar OQ and tool slider P",

    // Quick-return — metrics
    "quick-return.metrics.heading": "Live Metrics",
    "quick-return.metrics.phi": "φ  (crank angle)",
    "quick-return.metrics.x": "x(t)  (tool position)",
    "quick-return.metrics.v": "v(t)  (tool velocity)",
    "quick-return.metrics.a": "a(t)  (tool acceleration)",
    "quick-return.metrics.derived_heading": "Derived Results",
    "quick-return.metrics.ratio_label": "Quick-return ratio",
    "quick-return.metrics.ratio_note":
      "Cutting and return strokes take unequal time",
    "quick-return.metrics.alpha": "α = arccos(r / L₂)",
    "quick-return.metrics.xmax": "x_max (extreme positions)",
    "quick-return.metrics.v_phi0": "v at φ = 0 (fast pass)",
    "quick-return.metrics.v_phi_pi": "v at φ = π (slow pass)",

    // Quick-return — controls
    "quick-return.controls.section.geometry": "Geometry",
    "quick-return.controls.section.dynamics": "Kinematics",
    "quick-return.controls.section.visibility": "Visibility",
    "quick-return.controls.slider.r": "Crank length r (u)",
    "quick-return.controls.slider.L2": "Crank-center height L₂ (u)",
    "quick-return.controls.slider.L1": "Slot height L₁ (u)",
    "quick-return.controls.slider.omega": "Crank speed ω (rad/s)",
    "quick-return.controls.toggle.velocity": "v  (tool velocity)",
    "quick-return.controls.toggle.acceleration": "a  (tool acceleration)",
    "quick-return.controls.toggle.trace": "Tool path trace",
    "quick-return.controls.toggle.guides": "Guide circle & axis",
    "quick-return.controls.constraint.ok": "L₂ > r ✓",
    "quick-return.controls.constraint.warn": "⚠ L₂ must be > r",
    "quick-return.controls.btn.reset": "Reset to φ = 0",
    "quick-return.controls.btn.pause": "Pause",
    "quick-return.controls.btn.resume": "Resume",
    "quick-return.controls.info.xB": "Crank pin B",
    "quick-return.controls.info.xP": "Tool slider P",
    "quick-return.controls.info.constraint": "Hard constraint",

    // Quick-return — legend
    "quick-return.legend.heading": "Legend",
    "quick-return.legend.crank": "Crank AB",
    "quick-return.legend.bar": "Oscillating bar OQ",
    "quick-return.legend.sliderB": "Slider B (crank pin)",
    "quick-return.legend.sliderP": "Slider P (tool)",
    "quick-return.legend.velocity": "v  (tool velocity)",
    "quick-return.legend.acceleration": "a  (tool acceleration)",

    // Quick-return — equations panel
    "quick-return.equations.heading": "Equations",
    "quick-return.equations.section.geometry":
      "Geometry (O at origin, A = (0, L₂))",
    "quick-return.equations.section.kinematics": "Tool kinematics",
    "quick-return.equations.section.extremes":
      "Extreme positions & quick-return ratio",
    "quick-return.equations.section.center": "Center-crossing speeds (x = 0)",
    "quick-return.equations.note.ratio":
      "The crank sweeps (2π − 2α) for one stroke and 2α for the other. " +
      "Since ω is constant the time ratio equals the angle ratio.",
    "quick-return.equations.note.center":
      "The tool crosses x = 0 twice per revolution at different speeds — " +
      "the asymmetry is the signature of the quick-return mechanism.",
  },
  es: {
    // Quick-return page — meta
    "quick-return.page.canvas_aria":
      "Simulador de mecanismo de retorno rápido — la manivela AB mueve la barra oscilante OQ y el carro herramienta P",

    // Quick-return — metrics
    "quick-return.metrics.heading": "Métricas en vivo",
    "quick-return.metrics.phi": "φ  (ángulo de manivela)",
    "quick-return.metrics.x": "x(t)  (posición de herramienta)",
    "quick-return.metrics.v": "v(t)  (velocidad de herramienta)",
    "quick-return.metrics.a": "a(t)  (aceleración de herramienta)",
    "quick-return.metrics.derived_heading": "Resultados derivados",
    "quick-return.metrics.ratio_label": "Relación de retorno rápido",
    "quick-return.metrics.ratio_note":
      "Los tiempos de avance y retorno son distintos",
    "quick-return.metrics.alpha": "α = arccos(r / L₂)",
    "quick-return.metrics.xmax": "x_max (posiciones extremas)",
    "quick-return.metrics.v_phi0": "v en φ = 0 (paso rápido)",
    "quick-return.metrics.v_phi_pi": "v en φ = π (paso lento)",

    // Quick-return — controls
    "quick-return.controls.section.geometry": "Geometría",
    "quick-return.controls.section.dynamics": "Cinemática",
    "quick-return.controls.section.visibility": "Visibilidad",
    "quick-return.controls.slider.r": "Longitud de manivela r (u)",
    "quick-return.controls.slider.L2": "Altura del centro de manivela L₂ (u)",
    "quick-return.controls.slider.L1": "Altura de la ranura L₁ (u)",
    "quick-return.controls.slider.omega": "Velocidad de manivela ω (rad/s)",
    "quick-return.controls.toggle.velocity": "v  (velocidad de herramienta)",
    "quick-return.controls.toggle.acceleration":
      "a  (aceleración de herramienta)",
    "quick-return.controls.toggle.trace": "Trayectoria de herramienta",
    "quick-return.controls.toggle.guides": "Círculo guía y eje",
    "quick-return.controls.constraint.ok": "L₂ > r ✓",
    "quick-return.controls.constraint.warn": "⚠ L₂ debe ser > r",
    "quick-return.controls.btn.reset": "Reiniciar a φ = 0",
    "quick-return.controls.btn.pause": "Pausar",
    "quick-return.controls.btn.resume": "Reanudar",
    "quick-return.controls.info.xB": "Pasador de manivela B",
    "quick-return.controls.info.xP": "Carro herramienta P",
    "quick-return.controls.info.constraint": "Restricción dura",

    // Quick-return — legend
    "quick-return.legend.heading": "Leyenda",
    "quick-return.legend.crank": "Manivela AB",
    "quick-return.legend.bar": "Barra oscilante OQ",
    "quick-return.legend.sliderB": "Carro B (pasador de manivela)",
    "quick-return.legend.sliderP": "Carro P (herramienta)",
    "quick-return.legend.velocity": "v  (velocidad de herramienta)",
    "quick-return.legend.acceleration": "a  (aceleración de herramienta)",

    // Quick-return — equations panel
    "quick-return.equations.heading": "Ecuaciones",
    "quick-return.equations.section.geometry":
      "Geometría (O en el origen, A = (0, L₂))",
    "quick-return.equations.section.kinematics": "Cinemática de la herramienta",
    "quick-return.equations.section.extremes":
      "Posiciones extremas y relación de retorno rápido",
    "quick-return.equations.section.center":
      "Velocidades al cruzar el centro (x = 0)",
    "quick-return.equations.note.ratio":
      "La manivela barre (2π − 2α) en un recorrido y 2α en el otro. " +
      "Como ω es constante, la relación de tiempos es igual a la relación de ángulos.",
    "quick-return.equations.note.center":
      "La herramienta cruza x = 0 dos veces por revolución a distintas velocidades — " +
      "la asimetría es la firma del mecanismo de retorno rápido.",
  },
};
