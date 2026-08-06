export const radarTracking = {
  en: {
    "radar-tracking.page.canvas_aria":
      "Radar tracking simulator — an aircraft on a curved path tracked by a fixed (draggable) radar",

    "radar-tracking.controls.section.parameters": "Parameters",
    "radar-tracking.controls.section.visibility": "Visibility",
    "radar-tracking.controls.slider.v0": "Speed at the lowest point v₀",
    "radar-tracking.controls.slider.at": "Tangential acceleration a_t",
    "radar-tracking.controls.slider.rho": "Trajectory radius ρ",
    "radar-tracking.controls.hint.drag":
      "Drag the radar on the canvas to reposition it.",
    "radar-tracking.controls.toggle.velocity": "Velocity (ê_r / ê_θ)",
    "radar-tracking.controls.toggle.acceleration": "Acceleration (ê_r / ê_θ)",
    "radar-tracking.controls.toggle.radarline": "r vector + θ dimension",
    "radar-tracking.controls.toggle.trace": "Aircraft trail",
    "radar-tracking.controls.btn.reset": "Reset to t = 0",
    "radar-tracking.controls.btn.pause": "Pause",
    "radar-tracking.controls.btn.resume": "Resume",

    "radar-tracking.metrics.heading": "Live Metrics",
    "radar-tracking.metrics.r": "r  (distance to aircraft)",
    "radar-tracking.metrics.theta": "θ  (bearing)",
    "radar-tracking.metrics.rdot": "ṙ",
    "radar-tracking.metrics.thetadot": "θ̇",
    "radar-tracking.metrics.rddot": "r̈",
    "radar-tracking.metrics.thetaddot": "θ̈",

    "radar-tracking.legend.heading": "Legend",
    "radar-tracking.legend.trajectory": "Aircraft trajectory",
    "radar-tracking.legend.aircraft": "Aircraft",
    "radar-tracking.legend.radar": "Radar (draggable)",
    "radar-tracking.legend.r": "r  (radar → aircraft)",

    "radar-tracking.equations.heading": "Equations",
    "radar-tracking.equations.section.statement": "Statement",
    "radar-tracking.equations.statement.text":
      "At the lowest point of a vertical trajectory: v = 150 m/s horizontal, a_t = 25 m/s², ρ = 2000 m. Radar 800 m horizontally and 600 m below. Find ṙ, r̈, θ̇, θ̈.",
    "radar-tracking.equations.section.formulas": "Formulas",
    "radar-tracking.equations.section.reference":
      "Reference (t = 0, at the stated instant)",
    "radar-tracking.equations.note.reference":
      "r = 1000 m, θ = 36.87°, ṙ = 120 m/s, r̈ = 34.85 m/s², θ̇ = −0.09 rad/s, θ̈ = +0.0156 rad/s².",
    "radar-tracking.equations.note.sign":
      "The course answer key gives θ̈ = −0.0156. The correct sign is positive: θ̇ is negative and its magnitude decreases as the aircraft moves away, which requires θ̈ > 0 — confirmed both by projection and by differentiating θ = arctan(y/x). The animation makes this self-evident, since |θ̇| visibly decays.",
    "radar-tracking.equations.section.plots": "r, θ, ṙ and θ̇ vs. time",
    "radar-tracking.plot.r.title": "r(t)",
    "radar-tracking.plot.theta.title": "θ(t)",
    "radar-tracking.plot.rdot.title": "ṙ(t)",
    "radar-tracking.plot.thetadot.title": "θ̇(t)",
  },
  es: {
    "radar-tracking.page.canvas_aria":
      "Simulador de rastreo por radar — una aeronave en trayectoria curva rastreada por un radar fijo (arrastrable)",

    "radar-tracking.controls.section.parameters": "Parámetros",
    "radar-tracking.controls.section.visibility": "Visibilidad",
    "radar-tracking.controls.slider.v0": "Rapidez en el punto más bajo v₀",
    "radar-tracking.controls.slider.at": "Aceleración tangencial a_t",
    "radar-tracking.controls.slider.rho": "Radio de la trayectoria ρ",
    "radar-tracking.controls.hint.drag":
      "Arrastrá el radar en el lienzo para reposicionarlo.",
    "radar-tracking.controls.toggle.velocity": "Velocidad (ê_r / ê_θ)",
    "radar-tracking.controls.toggle.acceleration": "Aceleración (ê_r / ê_θ)",
    "radar-tracking.controls.toggle.radarline": "Vector r + dimensión θ",
    "radar-tracking.controls.toggle.trace": "Estela de la aeronave",
    "radar-tracking.controls.btn.reset": "Reiniciar a t = 0",
    "radar-tracking.controls.btn.pause": "Pausar",
    "radar-tracking.controls.btn.resume": "Reanudar",

    "radar-tracking.metrics.heading": "Métricas en vivo",
    "radar-tracking.metrics.r": "r  (distancia a la aeronave)",
    "radar-tracking.metrics.theta": "θ  (rumbo)",
    "radar-tracking.metrics.rdot": "ṙ",
    "radar-tracking.metrics.thetadot": "θ̇",
    "radar-tracking.metrics.rddot": "r̈",
    "radar-tracking.metrics.thetaddot": "θ̈",

    "radar-tracking.legend.heading": "Leyenda",
    "radar-tracking.legend.trajectory": "Trayectoria de la aeronave",
    "radar-tracking.legend.aircraft": "Aeronave",
    "radar-tracking.legend.radar": "Radar (arrastrable)",
    "radar-tracking.legend.r": "r  (radar → aeronave)",

    "radar-tracking.equations.heading": "Ecuaciones",
    "radar-tracking.equations.section.statement": "Enunciado",
    "radar-tracking.equations.statement.text":
      "En el punto más bajo de una trayectoria vertical: v = 150 m/s horizontal, a_t = 25 m/s², ρ = 2000 m. Radar a 800 m horizontales y 600 m por debajo. Hallar ṙ, r̈, θ̇, θ̈.",
    "radar-tracking.equations.section.formulas": "Fórmulas",
    "radar-tracking.equations.section.reference":
      "Referencia (t = 0, en el instante dado)",
    "radar-tracking.equations.note.reference":
      "r = 1000 m, θ = 36,87°, ṙ = 120 m/s, r̈ = 34,85 m/s², θ̇ = −0,09 rad/s, θ̈ = +0,0156 rad/s².",
    "radar-tracking.equations.note.sign":
      "La clave de respuestas de la cátedra da θ̈ = −0,0156. El signo correcto es positivo: θ̇ es negativa y su magnitud disminuye a medida que la aeronave se aleja, lo cual exige θ̈ > 0 — confirmado tanto por proyección como derivando θ = arctan(y/x). La animación lo hace evidente, ya que |θ̇| decae visiblemente.",
    "radar-tracking.equations.section.plots": "r, θ, ṙ y θ̇ vs. tiempo",
    "radar-tracking.plot.r.title": "r(t)",
    "radar-tracking.plot.theta.title": "θ(t)",
    "radar-tracking.plot.rdot.title": "ṙ(t)",
    "radar-tracking.plot.thetadot.title": "θ̇(t)",
  },
};
