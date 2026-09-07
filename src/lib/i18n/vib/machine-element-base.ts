export const machineElementBase = {
  en: {
    "vib4.canvas_aria":
      "Machine element riding above a moving support through a spring and damper",

    "vib4.controls.section.element": "Element",
    "vib4.controls.slider.mass": "Element mass M",
    "vib4.controls.slider.damping": "Damping c",
    "vib4.controls.section.support": "Moving support",
    "vib4.controls.slider.amplitude": "Support amplitude y_M",
    "vib4.controls.slider.omega": "Support frequency ω",
    "vib4.controls.btn.reset": "Reset",
    "vib4.controls.btn.pause": "Pause",
    "vib4.controls.btn.resume": "Resume",

    "vib4.metrics.heading": "Live readouts",
    "vib4.metrics.singular_resonance":
      "Ideal resonance (ζ = 0, r = 1 exactly): the response is mathematically unbounded. The trace is shown at rest instead of an undefined value.",

    "vib4.legend.heading": "Legend",
    "vib4.legend.support": "Moving support S(t)",
    "vib4.legend.spring": "Springs (2 combined into k = springCount·k₁)",
    "vib4.legend.damper": "Damper c",
    "vib4.legend.element": "Element x(t) — response",

    "vib4.equations.heading": "Theory & formulas",
    "vib4.equations.section.statement": "Problem",
    "vib4.equations.statement.text":
      "A 400 kg machine element rests on 2 springs of 392 N/cm each and a damper of 39.2 N·s/cm. Its support moves harmonically at ω = 7.5 rad/s with amplitude 3 mm. Find the amplitude and phase lag of the steady-state response.",
    "vib4.equations.section.theory": "Damping helps here — the opposite of isolation",
    "vib4.equations.theory.damping_helps":
      "The operating point r = 0.536 sits well below the r = √2 crossover. Below that crossover more damping *shrinks* the response — the exact opposite of a vibration-isolation problem, where damping only helps once you're past r = √2.",
    "vib4.equations.section.formulas": "Formulas",
    "vib4.equations.section.response": "Time response",
    "vib4.plot.response.title": "Support and element displacement over time",
    "vib4.equations.response.note":
      "S(t) and x(t) plotted over the same time axis — the small phase lag (about 7°) between them is the δ in the metrics.",
    "vib4.equations.section.plot": "Transmissibility vs. frequency ratio",
    "vib4.plot.transmissibility.title":
      "Displacement transmissibility vs. frequency ratio",
    "vib4.equations.plot.note":
      "The dashed vertical line marks r = √2, where every ζ crosses T = 1; the solid marker shows the current operating point, to the left of that crossing.",
  },
  es: {
    "vib4.canvas_aria":
      "Elemento de máquina montado sobre un soporte móvil mediante un resorte y un amortiguador",

    "vib4.controls.section.element": "Elemento",
    "vib4.controls.slider.mass": "Masa del elemento M",
    "vib4.controls.slider.damping": "Amortiguamiento c",
    "vib4.controls.section.support": "Soporte móvil",
    "vib4.controls.slider.amplitude": "Amplitud del soporte y_M",
    "vib4.controls.slider.omega": "Frecuencia del soporte ω",
    "vib4.controls.btn.reset": "Reiniciar",
    "vib4.controls.btn.pause": "Pausar",
    "vib4.controls.btn.resume": "Reanudar",

    "vib4.metrics.heading": "Lecturas en vivo",
    "vib4.metrics.singular_resonance":
      "Resonancia ideal (ζ = 0, r = 1 exacto): la respuesta es matemáticamente no acotada. Se muestra la traza en reposo en vez de un valor indefinido.",

    "vib4.legend.heading": "Referencias",
    "vib4.legend.support": "Soporte móvil S(t)",
    "vib4.legend.spring": "Resortes (2 combinados en k = springCount·k₁)",
    "vib4.legend.damper": "Amortiguador c",
    "vib4.legend.element": "Elemento x(t) — respuesta",

    "vib4.equations.heading": "Teoría y fórmulas",
    "vib4.equations.section.statement": "Enunciado",
    "vib4.equations.statement.text":
      "Un elemento de máquina de 400 kg descansa sobre 2 resortes de 392 N/cm cada uno y un amortiguador de 39,2 N·s/cm. Su soporte se mueve armónicamente a ω = 7,5 rad/s con amplitud 3 mm. Hallar la amplitud y el desfasaje de la respuesta en régimen permanente.",
    "vib4.equations.section.theory": "Acá el amortiguamiento ayuda — lo opuesto al aislamiento",
    "vib4.equations.theory.damping_helps":
      "El punto de operación r = 0,536 está bien por debajo del cruce r = √2. Por debajo de ese cruce, más amortiguamiento *reduce* la respuesta — justo lo opuesto a un problema de aislamiento de vibraciones, donde el amortiguamiento solo ayuda pasado r = √2.",
    "vib4.equations.section.formulas": "Fórmulas",
    "vib4.equations.section.response": "Respuesta en el tiempo",
    "vib4.plot.response.title": "Desplazamiento del soporte y del elemento en el tiempo",
    "vib4.equations.response.note":
      "S(t) y x(t) graficados sobre el mismo eje temporal — el pequeño desfasaje (unos 7°) entre ambas es la δ de las métricas.",
    "vib4.equations.section.plot": "Transmisibilidad vs. relación de frecuencias",
    "vib4.plot.transmissibility.title":
      "Transmisibilidad de desplazamiento vs. relación de frecuencias",
    "vib4.equations.plot.note":
      "La línea vertical punteada marca r = √2, donde toda curva ζ cruza T = 1; el marcador sólido muestra el punto de operación actual, a la izquierda de ese cruce.",
  },
};
