export const cableBlocks = {
  en: {
    "cable-blocks.page.canvas_aria":
      "Cable and pulleys simulator — two blocks pulled toward each other by independent motors",

    "cable-blocks.controls.section.parameters": "Parameters",
    "cable-blocks.controls.section.visibility": "Visibility",
    "cable-blocks.controls.slider.ad": "Motor D acceleration a_D",
    "cable-blocks.controls.slider.ccoeff": "Motor C coefficient (a_C = c·t²)",
    "cable-blocks.controls.slider.d0": "Initial gap d₀",
    "cable-blocks.controls.slider.runsa": "Cable runs on A's side",
    "cable-blocks.controls.toggle.velocity": "Velocity vectors",
    "cable-blocks.controls.toggle.trace": "Position trace",
    "cable-blocks.controls.btn.reset": "Reset to t = 0",
    "cable-blocks.controls.btn.pause": "Pause",
    "cable-blocks.controls.btn.resume": "Resume",

    "cable-blocks.metrics.heading": "Live Metrics",
    "cable-blocks.metrics.t": "t  (elapsed)",
    "cable-blocks.metrics.sa": "s_A  (block A travelled)",
    "cable-blocks.metrics.sb": "s_B  (block B travelled)",
    "cable-blocks.metrics.va": "v_A  (rightward)",
    "cable-blocks.metrics.vb": "v_B  (rightward-positive convention)",
    "cable-blocks.metrics.d": "d  (remaining gap)",
    "cable-blocks.metrics.tmeet": "t_meet",

    "cable-blocks.legend.heading": "Legend",
    "cable-blocks.legend.blocka": "Block A (motor C, runsA cable runs)",
    "cable-blocks.legend.blockb": "Block B (motor D, single run)",
    "cable-blocks.legend.gap": "d  (remaining gap)",

    "cable-blocks.equations.heading": "Equations",
    "cable-blocks.equations.section.statement": "Statement",
    "cable-blocks.equations.statement.text":
      "Motor D pulls block B with a_D = 5 m/s². Motor C pulls block A (through 2 cable runs) with a_C = 3t² m/s². Both start from rest with an initial gap d = 3 m. Find the time and velocities when they meet.",
    "cable-blocks.equations.section.formulas": "Formulas",
    "cable-blocks.equations.section.solve": "Meeting condition",
    "cable-blocks.equations.note.solve":
      "s_A(t) + s_B(t) = d₀ is biquadratic in t — substitute u = t² and solve the resulting quadratic directly, no bisection needed.",
    "cable-blocks.equations.section.reference":
      "Reference (default parameters)",
    "cable-blocks.equations.note.reference":
      "t = 1.0656 s, s_B = 2.839 m, s_A = 0.161 m, v_B = 5.33 m/s (leftward), v_A = 0.605 m/s (rightward).",
    "cable-blocks.equations.note.sign":
      "Positive is defined to the right, so v_B is reported negative even though the exercise's answer key labels both speeds \"v_A\" — the simulator's arrows make the direction unambiguous.",
    "cable-blocks.equations.section.plots": "s(t) and v(t) for both blocks",
    "cable-blocks.plot.st.title": "s(t) — distance travelled",
    "cable-blocks.plot.vt.title": "v(t) — speed",
  },
  es: {
    "cable-blocks.page.canvas_aria":
      "Simulador de cable y poleas — dos bloques tirados uno hacia el otro por motores independientes",

    "cable-blocks.controls.section.parameters": "Parámetros",
    "cable-blocks.controls.section.visibility": "Visibilidad",
    "cable-blocks.controls.slider.ad": "Aceleración del motor D, a_D",
    "cable-blocks.controls.slider.ccoeff":
      "Coeficiente del motor C (a_C = c·t²)",
    "cable-blocks.controls.slider.d0": "Separación inicial d₀",
    "cable-blocks.controls.slider.runsa": "Ramales de cable del lado de A",
    "cable-blocks.controls.toggle.velocity": "Vectores de velocidad",
    "cable-blocks.controls.toggle.trace": "Trayectoria",
    "cable-blocks.controls.btn.reset": "Reiniciar a t = 0",
    "cable-blocks.controls.btn.pause": "Pausar",
    "cable-blocks.controls.btn.resume": "Reanudar",

    "cable-blocks.metrics.heading": "Métricas en vivo",
    "cable-blocks.metrics.t": "t  (transcurrido)",
    "cable-blocks.metrics.sa": "s_A  (recorrido de A)",
    "cable-blocks.metrics.sb": "s_B  (recorrido de B)",
    "cable-blocks.metrics.va": "v_A  (hacia la derecha)",
    "cable-blocks.metrics.vb": "v_B  (convención positiva a la derecha)",
    "cable-blocks.metrics.d": "d  (separación restante)",
    "cable-blocks.metrics.tmeet": "t_encuentro",

    "cable-blocks.legend.heading": "Leyenda",
    "cable-blocks.legend.blocka": "Bloque A (motor C, runsA ramales)",
    "cable-blocks.legend.blockb": "Bloque B (motor D, un ramal)",
    "cable-blocks.legend.gap": "d  (separación restante)",

    "cable-blocks.equations.heading": "Ecuaciones",
    "cable-blocks.equations.section.statement": "Enunciado",
    "cable-blocks.equations.statement.text":
      "El motor D tira del bloque B con a_D = 5 m/s². El motor C tira del bloque A (a través de 2 ramales) con a_C = 3t² m/s². Ambos parten del reposo con una separación inicial d = 3 m. Hallar el tiempo y las velocidades al encontrarse.",
    "cable-blocks.equations.section.formulas": "Fórmulas",
    "cable-blocks.equations.section.solve": "Condición de encuentro",
    "cable-blocks.equations.note.solve":
      "s_A(t) + s_B(t) = d₀ es bicuadrática en t — sustituyendo u = t² se resuelve la cuadrática resultante directamente, sin bisección.",
    "cable-blocks.equations.section.reference":
      "Referencia (parámetros por defecto)",
    "cable-blocks.equations.note.reference":
      "t = 1,0656 s, s_B = 2,839 m, s_A = 0,161 m, v_B = 5,33 m/s (hacia la izquierda), v_A = 0,605 m/s (hacia la derecha).",
    "cable-blocks.equations.note.sign":
      'Se define positivo hacia la derecha, por lo que v_B se reporta negativa aunque la clave de respuestas del ejercicio llame "v_A" a ambas velocidades — las flechas del simulador dejan la dirección sin ambigüedad.',
    "cable-blocks.equations.section.plots": "s(t) y v(t) de ambos bloques",
    "cable-blocks.plot.st.title": "s(t) — distancia recorrida",
    "cable-blocks.plot.vt.title": "v(t) — rapidez",
  },
};
