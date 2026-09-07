export const pressureGauge = {
  en: {
    "vib5.plot.title": "Reading error vs. frequency ratio, with the error limit",

    "vib5.controls.section.gauge": "Gauge",
    "vib5.controls.slider.stiffness": "Spring stiffness k",
    "vib5.controls.slider.cycles_per_minute": "Pulsation rate",
    "vib5.controls.section.error_limit": "Error limit",
    "vib5.controls.btn.reset": "Reset",

    "vib5.metrics.heading": "Live readouts",
    "vib5.metrics.design_rule":
      "The natural frequency needs to stay at least this many times the pulsation rate — that ratio, not the mass, is the design rule worth remembering.",

    "vib5.legend.heading": "Legend",
    "vib5.legend.curve": "ε(r) — reading error, ζ = 0",
    "vib5.legend.limit": "Error limit (dashed)",
    "vib5.legend.rmax": "r_max — the largest ratio the limit allows",

    "vib5.equations.heading": "Theory & formulas",
    "vib5.equations.section.statement": "Problem",
    "vib5.equations.statement.text":
      "A pressure gauge uses a spring of 175 N/cm. The pressure pulsates at 600 cycles/min. Find the maximum piston mass that keeps the reading error under 2 %.",
    "vib5.equations.section.theory": "The mass is not the point — the ratio is",
    "vib5.equations.theory.design_rule":
      "Solving for M is really solving for how far ω_0 must sit above ω: the design rule is a frequency margin ω_0/ω = √[(1+ε)/ε], not a mass — 10.05× for 1 % error, 7.14× for 2 %, 4.58× for 5 %.",
    "vib5.equations.theory.seismograph":
      "This is the same spring-mass instrument as an accelerometer or seismograph, just run the other way: those are deliberately built with r ≫ 1 (a soft spring, heavy mass) so they track acceleration instead of under-reading it.",
    "vib5.equations.section.formulas": "Formulas",
  },
  es: {
    "vib5.plot.title":
      "Error de lectura vs. relación de frecuencias, con el límite de error",

    "vib5.controls.section.gauge": "Manómetro",
    "vib5.controls.slider.stiffness": "Rigidez del resorte k",
    "vib5.controls.slider.cycles_per_minute": "Frecuencia de pulsación",
    "vib5.controls.section.error_limit": "Límite de error",
    "vib5.controls.btn.reset": "Reiniciar",

    "vib5.metrics.heading": "Lecturas en vivo",
    "vib5.metrics.design_rule":
      "La frecuencia natural debe mantenerse al menos esta cantidad de veces la frecuencia de pulsación — esa razón, no la masa, es la regla de diseño que vale la pena recordar.",

    "vib5.legend.heading": "Referencias",
    "vib5.legend.curve": "ε(r) — error de lectura, ζ = 0",
    "vib5.legend.limit": "Límite de error (punteado)",
    "vib5.legend.rmax": "r_max — la mayor relación que el límite permite",

    "vib5.equations.heading": "Teoría y fórmulas",
    "vib5.equations.section.statement": "Enunciado",
    "vib5.equations.statement.text":
      "Un manómetro usa un resorte de 175 N/cm. La presión pulsa a 600 ciclos/min. Hallar la masa máxima del pistón que mantiene el error de lectura por debajo del 2 %.",
    "vib5.equations.section.theory": "La masa no es el punto — la razón sí",
    "vib5.equations.theory.design_rule":
      "Despejar M en realidad despeja cuánto debe estar ω_0 por encima de ω: la regla de diseño es un margen de frecuencia ω_0/ω = √[(1+ε)/ε], no una masa — 10,05× para 1 % de error, 7,14× para 2 %, 4,58× para 5 %.",
    "vib5.equations.theory.seismograph":
      "Es el mismo instrumento resorte-masa que un acelerómetro o sismógrafo, solo que usado al revés: esos se construyen a propósito con r ≫ 1 (resorte blando, masa pesada) para seguir la aceleración en vez de subestimarla.",
    "vib5.equations.section.formulas": "Fórmulas",
  },
};
