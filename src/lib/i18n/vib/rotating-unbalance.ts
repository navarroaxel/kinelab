export const rotatingUnbalance = {
  en: {
    "vib1.canvas_aria":
      "Motor on 4 springs bouncing from its rotor's own unbalance",

    "vib1.controls.section.motor": "Motor & springs",
    "vib1.controls.slider.motor_mass": "Motor mass M",
    "vib1.controls.slider.rpm": "Rotor speed n",
    "vib1.controls.slider.damping_ratio": "Damping ratio ζ",
    "vib1.controls.section.unbalance": "Rotor unbalance",
    "vib1.controls.slider.unbalance_mass": "Unbalance mass m",
    "vib1.controls.slider.eccentricity": "Eccentricity e",
    "vib1.controls.btn.reset": "Reset",
    "vib1.controls.btn.pause": "Pause",
    "vib1.controls.btn.resume": "Resume",

    "vib1.metrics.heading": "Live readouts",
    "vib1.metrics.near_resonance": "Operating near resonance (r ≈ 1)",
    "vib1.metrics.singular_resonance":
      "Ideal resonance (ζ = 0, r = 1 exactly): the response is mathematically unbounded. The trace is shown at rest instead of an undefined value.",

    "vib1.legend.heading": "Legend",
    "vib1.legend.spring": "Springs (4 combined into k = springCount·k₁)",
    "vib1.legend.motor": "Motor body x(t) — vertical response",
    "vib1.legend.unbalance": "Rotor unbalance, orbiting at ω",

    "vib1.equations.heading": "Theory & formulas",
    "vib1.equations.section.statement": "Problem",
    "vib1.equations.statement.text":
      "A 25 kg motor sits on 4 springs of 1960 N/cm each. Its rotor carries an unbalance of 0.030 kg at an eccentricity of 15 cm, spinning at 1500 rpm. Find the amplitude of the steady-state vertical motion.",
    "vib1.equations.section.theory": "Why this curve looks different",
    "vib1.equations.theory.growing_force":
      "Unlike a constant-amplitude force, the exciting force here is F_0 = m·e·ω² — it grows with the square of the speed, because faster spin makes the same unbalance push harder.",
    "vib1.equations.theory.shape":
      "That extra r² turns the usual 1/D magnification into r²/D: the response starts at zero (not 1) at low speed and flattens to the asymptote m·e/M at high speed, instead of dying away to zero.",
    "vib1.equations.section.formulas": "Formulas",
    "vib1.equations.section.plot": "Response vs. frequency ratio",
    "vib1.plot.title": "Unbalance response amplitude vs. frequency ratio",
    "vib1.equations.plot.note":
      "The dashed line is the ζ = 0 curve and the m·e/M asymptote; the marker shows the current operating point r.",
  },
  es: {
    "vib1.canvas_aria":
      "Motor sobre 4 resortes vibrando por el desequilibrio de su propio rotor",

    "vib1.controls.section.motor": "Motor y resortes",
    "vib1.controls.slider.motor_mass": "Masa del motor M",
    "vib1.controls.slider.rpm": "Velocidad del rotor n",
    "vib1.controls.slider.damping_ratio": "Razón de amortiguamiento ζ",
    "vib1.controls.section.unbalance": "Desequilibrio del rotor",
    "vib1.controls.slider.unbalance_mass": "Masa de desequilibrio m",
    "vib1.controls.slider.eccentricity": "Excentricidad e",
    "vib1.controls.btn.reset": "Reiniciar",
    "vib1.controls.btn.pause": "Pausar",
    "vib1.controls.btn.resume": "Reanudar",

    "vib1.metrics.heading": "Lecturas en vivo",
    "vib1.metrics.near_resonance": "Funcionando cerca de la resonancia (r ≈ 1)",
    "vib1.metrics.singular_resonance":
      "Resonancia ideal (ζ = 0, r = 1 exacto): la respuesta es matemáticamente no acotada. Se muestra la traza en reposo en vez de un valor indefinido.",

    "vib1.legend.heading": "Referencias",
    "vib1.legend.spring": "Resortes (4 combinados en k = springCount·k₁)",
    "vib1.legend.motor": "Cuerpo del motor x(t) — respuesta vertical",
    "vib1.legend.unbalance": "Desequilibrio del rotor, orbitando a ω",

    "vib1.equations.heading": "Teoría y fórmulas",
    "vib1.equations.section.statement": "Enunciado",
    "vib1.equations.statement.text":
      "Un motor de 25 kg está apoyado sobre 4 resortes de 1960 N/cm cada uno. Su rotor tiene un desequilibrio de 0,030 kg a una excentricidad de 15 cm, girando a 1500 rpm. Hallar la amplitud del movimiento vertical en régimen permanente.",
    "vib1.equations.section.theory": "Por qué esta curva es distinta",
    "vib1.equations.theory.growing_force":
      "A diferencia de una fuerza de amplitud constante, la fuerza excitadora acá es F_0 = m·e·ω² — crece con el cuadrado de la velocidad, porque un giro más rápido empuja más con el mismo desequilibrio.",
    "vib1.equations.theory.shape":
      "Ese r² extra convierte la magnificación habitual 1/D en r²/D: la respuesta arranca en cero (no en 1) a baja velocidad y se aplana en la asíntota m·e/M a alta velocidad, en vez de apagarse a cero.",
    "vib1.equations.section.formulas": "Fórmulas",
    "vib1.equations.section.plot": "Respuesta vs. relación de frecuencias",
    "vib1.plot.title":
      "Amplitud de la respuesta por desequilibrio vs. relación de frecuencias",
    "vib1.equations.plot.note":
      "La línea punteada es la curva con ζ = 0 y la asíntota m·e/M; el marcador muestra el punto de operación actual r.",
  },
};
