export const stoppingDistance = {
  en: {
    "stopping-distance.page.canvas_aria":
      "Stopping distance simulator — three cars launch together, react, then brake to a stop",

    "stopping-distance.controls.section.speeds": "Launch speeds",
    "stopping-distance.controls.section.braking": "Reaction & braking",
    "stopping-distance.controls.section.visibility": "Visibility",
    "stopping-distance.controls.slider.speed1": "Car 1 speed",
    "stopping-distance.controls.slider.speed2": "Car 2 speed",
    "stopping-distance.controls.slider.speed3": "Car 3 speed",
    "stopping-distance.controls.slider.reaction_time": "Reaction time t_r",
    "stopping-distance.controls.slider.decel_factor": "Deceleration (× g)",
    "stopping-distance.controls.preset.dry": "Dry",
    "stopping-distance.controls.preset.wet": "Wet",
    "stopping-distance.controls.preset.ice": "Ice",
    "stopping-distance.controls.slider.obstacle_distance": "Obstacle distance",
    "stopping-distance.controls.toggle.obstacle_marker": "Obstacle marker",
    "stopping-distance.controls.toggle.trace": "Path trace",
    "stopping-distance.controls.btn.reset": "Reset to t = 0",
    "stopping-distance.controls.btn.pause": "Pause",
    "stopping-distance.controls.btn.resume": "Resume",

    "stopping-distance.metrics.heading": "Live Metrics",
    "stopping-distance.metrics.table.speed_kmh": "v₀ [km/h]",
    "stopping-distance.metrics.table.speed_ms": "v₀ [m/s]",
    "stopping-distance.metrics.table.d1": "d₁ [m]",
    "stopping-distance.metrics.table.tf": "t_f [s]",
    "stopping-distance.metrics.table.d2": "d₂ [m]",
    "stopping-distance.metrics.table.d": "D [m]",
    "stopping-distance.metrics.table.ttotal": "t_total [s]",
    "stopping-distance.metrics.obstacle_fail": "Hits obstacle",

    "stopping-distance.legend.heading": "Legend",
    "stopping-distance.legend.reaction": "Reaction phase (constant v)",
    "stopping-distance.legend.braking": "Braking phase (constant a)",
    "stopping-distance.legend.obstacle": "Obstacle",

    "stopping-distance.equations.heading": "Equations",
    "stopping-distance.equations.section.statement": "Statement",
    "stopping-distance.equations.statement.text":
      "0.7 s of reaction at constant speed, then braking at g/2 to a stop. Compare 40, 80 and 100 km/h and the area under v(t).",
    "stopping-distance.equations.section.formulas": "Per-case formulas",
    "stopping-distance.equations.section.reference":
      "Reference (t_r = 0.7 s, a = g/2)",
    "stopping-distance.equations.note.reference":
      "40 km/h → D = 20.36 m. 80 km/h → D = 65.89 m. 100 km/h → D = 98.10 m. D grows with v₀² — doubling speed roughly triples the total stopping distance here, not doubles it.",
    "stopping-distance.equations.section.plot": "v(t) with the swept area",
    "stopping-distance.plot.vt.title":
      "v(t) for the three cases — area = distance travelled",
  },
  es: {
    "stopping-distance.page.canvas_aria":
      "Simulador de distancia de frenado — tres autos parten juntos, reaccionan y luego frenan hasta detenerse",

    "stopping-distance.controls.section.speeds": "Velocidades de partida",
    "stopping-distance.controls.section.braking": "Reacción y frenado",
    "stopping-distance.controls.section.visibility": "Visibilidad",
    "stopping-distance.controls.slider.speed1": "Velocidad auto 1",
    "stopping-distance.controls.slider.speed2": "Velocidad auto 2",
    "stopping-distance.controls.slider.speed3": "Velocidad auto 3",
    "stopping-distance.controls.slider.reaction_time": "Tiempo de reacción t_r",
    "stopping-distance.controls.slider.decel_factor": "Desaceleración (× g)",
    "stopping-distance.controls.preset.dry": "Seco",
    "stopping-distance.controls.preset.wet": "Mojado",
    "stopping-distance.controls.preset.ice": "Hielo",
    "stopping-distance.controls.slider.obstacle_distance":
      "Distancia al obstáculo",
    "stopping-distance.controls.toggle.obstacle_marker":
      "Marcador de obstáculo",
    "stopping-distance.controls.toggle.trace": "Trayectoria",
    "stopping-distance.controls.btn.reset": "Reiniciar a t = 0",
    "stopping-distance.controls.btn.pause": "Pausar",
    "stopping-distance.controls.btn.resume": "Reanudar",

    "stopping-distance.metrics.heading": "Métricas en vivo",
    "stopping-distance.metrics.table.speed_kmh": "v₀ [km/h]",
    "stopping-distance.metrics.table.speed_ms": "v₀ [m/s]",
    "stopping-distance.metrics.table.d1": "d₁ [m]",
    "stopping-distance.metrics.table.tf": "t_f [s]",
    "stopping-distance.metrics.table.d2": "d₂ [m]",
    "stopping-distance.metrics.table.d": "D [m]",
    "stopping-distance.metrics.table.ttotal": "t_total [s]",
    "stopping-distance.metrics.obstacle_fail": "Choca el obstáculo",

    "stopping-distance.legend.heading": "Leyenda",
    "stopping-distance.legend.reaction": "Fase de reacción (v constante)",
    "stopping-distance.legend.braking": "Fase de frenado (a constante)",
    "stopping-distance.legend.obstacle": "Obstáculo",

    "stopping-distance.equations.heading": "Ecuaciones",
    "stopping-distance.equations.section.statement": "Enunciado",
    "stopping-distance.equations.statement.text":
      "0,7 s de reacción a velocidad constante, luego frenado a g/2 hasta detenerse. Comparar 40, 80 y 100 km/h y el área bajo v(t).",
    "stopping-distance.equations.section.formulas": "Fórmulas por caso",
    "stopping-distance.equations.section.reference":
      "Referencia (t_r = 0,7 s, a = g/2)",
    "stopping-distance.equations.note.reference":
      "40 km/h → D = 20,36 m. 80 km/h → D = 65,89 m. 100 km/h → D = 98,10 m. D crece con v₀² — duplicar la velocidad casi triplica la distancia total de frenado, no la duplica.",
    "stopping-distance.equations.section.plot": "v(t) con el área barrida",
    "stopping-distance.plot.vt.title":
      "v(t) para los tres casos — área = distancia recorrida",
  },
};
