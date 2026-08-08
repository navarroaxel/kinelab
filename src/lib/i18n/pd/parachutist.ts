export const parachutist = {
  en: {
    "parachutist.page.canvas_aria":
      "Parachutist simulator — descent speed converging exponentially to terminal velocity",

    "parachutist.controls.section.parameters": "Parameters",
    "parachutist.controls.section.visibility": "Visibility",
    "parachutist.controls.slider.mass": "Mass m",
    "parachutist.controls.slider.beta": "Drag coefficient β",
    "parachutist.controls.slider.v0": "Initial speed v_0",
    "parachutist.controls.toggle.parachutist": "Falling figure",
    "parachutist.controls.toggle.terminal": "Terminal-speed readout",
    "parachutist.controls.btn.reset": "Reset",
    "parachutist.controls.btn.pause": "Pause",
    "parachutist.controls.btn.resume": "Resume",

    "parachutist.canvas.terminal": "v_t",

    "parachutist.metrics.heading": "Live Metrics",
    "parachutist.metrics.vt": "v_t  (terminal speed)",
    "parachutist.metrics.tau": "τ  (time constant)",
    "parachutist.metrics.note.no_bound":
      "Speed never grows without bound — it always converges to v_t, whether v_0 starts above or below it.",

    "parachutist.legend.heading": "Legend",
    "parachutist.legend.figure": "Parachutist",
    "parachutist.legend.velocity": "Velocity vector",
    "parachutist.legend.canopy": "Canopy",

    "parachutist.equations.heading": "Equations",
    "parachutist.equations.section.statement": "Statement",
    "parachutist.equations.statement.text":
      "A parachutist of mass m starts at z = 0 moving down at v_0. Air resistance is proportional to speed, βv. Find v(t), the distance fallen, and whether speed grows without bound.",
    "parachutist.equations.section.theory": "Theory",
    "parachutist.equations.theory.text":
      "This is a linear, first-order ODE — one of the few drag problems with an exact closed form. Splitting v into a constant part and a decaying part makes the structure obvious: v_t = mg/β is the equilibrium speed where gravity and drag exactly balance (dv/dt = 0), and (v_0 − v_t)·e^(−t/τ) is everything left over from starting away from that equilibrium, dying out with time constant τ = m/β. Whether v_0 is above or below v_t, the exponential term shrinks to zero and v(t) settles at v_t — it can never overshoot or diverge.",
    "parachutist.equations.section.formulas": "Formulas",
    "parachutist.equations.section.reference": "Reference (default values)",
    "parachutist.equations.note.reference":
      "v_t = 80 × 9.81 / 100 ≈ 7.85 m/s.\n" +
      "τ = 80 / 100 = 0.8 s.\n" +
      "Starting at v_0 = 20 m/s, the parachutist decelerates toward 7.85 m/s, reaching it to within 1% in about 5τ ≈ 4 s.",
    "parachutist.equations.section.plot": "Speed vs. time",
    "parachutist.plot.vt.title": "v(t) — approaching terminal speed exponentially",
  },
  es: {
    "parachutist.page.canvas_aria":
      "Simulador de paracaidista — la velocidad de descenso converge exponencialmente a la velocidad terminal",

    "parachutist.controls.section.parameters": "Parámetros",
    "parachutist.controls.section.visibility": "Visibilidad",
    "parachutist.controls.slider.mass": "Masa m",
    "parachutist.controls.slider.beta": "Coeficiente de arrastre β",
    "parachutist.controls.slider.v0": "Velocidad inicial v_0",
    "parachutist.controls.toggle.parachutist": "Figura en caída",
    "parachutist.controls.toggle.terminal": "Lectura de velocidad terminal",
    "parachutist.controls.btn.reset": "Reiniciar",
    "parachutist.controls.btn.pause": "Pausar",
    "parachutist.controls.btn.resume": "Reanudar",

    "parachutist.canvas.terminal": "v_t",

    "parachutist.metrics.heading": "Métricas en vivo",
    "parachutist.metrics.vt": "v_t  (velocidad terminal)",
    "parachutist.metrics.tau": "τ  (constante de tiempo)",
    "parachutist.metrics.note.no_bound":
      "La velocidad nunca crece indefinidamente — siempre converge a v_t, ya sea que v_0 empiece por encima o por debajo.",

    "parachutist.legend.heading": "Leyenda",
    "parachutist.legend.figure": "Paracaidista",
    "parachutist.legend.velocity": "Vector velocidad",
    "parachutist.legend.canopy": "Paracaídas",

    "parachutist.equations.heading": "Ecuaciones",
    "parachutist.equations.section.statement": "Enunciado",
    "parachutist.equations.statement.text":
      "Un paracaidista de masa m parte de z = 0 moviéndose hacia abajo con v_0. La resistencia del aire es proporcional a la velocidad, βv. Hallar v(t), la distancia recorrida, y si la velocidad crece indefinidamente.",
    "parachutist.equations.section.theory": "Teoría",
    "parachutist.equations.theory.text":
      "Esta es una EDO lineal de primer orden — uno de los pocos problemas de resistencia con solución cerrada exacta. Separar v en una parte constante y una parte que decae hace evidente la estructura: v_t = mg/β es la velocidad de equilibrio donde la gravedad y la resistencia se equilibran exactamente (dv/dt = 0), y (v_0 − v_t)·e^(−t/τ) es todo lo que sobra de partir lejos de ese equilibrio, extinguiéndose con constante de tiempo τ = m/β. Ya sea que v_0 esté por encima o por debajo de v_t, el término exponencial se reduce a cero y v(t) se estabiliza en v_t — nunca puede sobrepasarla ni diverger.",
    "parachutist.equations.section.formulas": "Fórmulas",
    "parachutist.equations.section.reference": "Referencia (valores por defecto)",
    "parachutist.equations.note.reference":
      "v_t = 80 × 9,81 / 100 ≈ 7,85 m/s.\n" +
      "τ = 80 / 100 = 0,8 s.\n" +
      "Partiendo de v_0 = 20 m/s, el paracaidista desacelera hacia 7,85 m/s, alcanzándola con un 1% de margen en unos 5τ ≈ 4 s.",
    "parachutist.equations.section.plot": "Velocidad vs. tiempo",
    "parachutist.plot.vt.title":
      "v(t) — aproximándose exponencialmente a la velocidad terminal",
  },
};
