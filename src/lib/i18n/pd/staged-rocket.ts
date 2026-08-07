export const stagedRocket = {
  en: {
    "staged-rocket.page.canvas_aria":
      "Staged rocket simulator — comparing a single-stage and a two-stage rocket carrying the same payload",

    "staged-rocket.controls.section.payload": "Shared (payload & propellant)",
    "staged-rocket.controls.section.single": "Single-stage rocket",
    "staged-rocket.controls.section.two": "Two-stage rocket (each stage)",
    "staged-rocket.controls.section.visibility": "Visibility",
    "staged-rocket.controls.slider.payload": "Payload mass",
    "staged-rocket.controls.slider.fuel_rate": "Fuel consumption rate q",
    "staged-rocket.controls.slider.exhaust": "Exhaust velocity v_rel",
    "staged-rocket.controls.slider.single_mass": "Total mass (incl. fuel)",
    "staged-rocket.controls.slider.single_fuel": "Fuel mass",
    "staged-rocket.controls.slider.two_mass": "Total mass per stage (incl. fuel)",
    "staged-rocket.controls.slider.two_fuel": "Fuel mass per stage",
    "staged-rocket.controls.toggle.single": "Single-stage rocket",
    "staged-rocket.controls.toggle.two": "Two-stage rocket",
    "staged-rocket.controls.btn.reset": "Reset",
    "staged-rocket.controls.btn.pause": "Pause",
    "staged-rocket.controls.btn.resume": "Resume",

    "staged-rocket.canvas.single": "Single stage",
    "staged-rocket.canvas.two_stage": "Two stage",
    "staged-rocket.canvas.separation": "stage A separates",

    "staged-rocket.metrics.heading": "Live Metrics",
    "staged-rocket.metrics.v_single": "v_max  (single stage)",
    "staged-rocket.metrics.v_sep": "v_sep  (stage A separation)",
    "staged-rocket.metrics.v_two": "v_max  (two stage)",
    "staged-rocket.metrics.gain": "Δv  (staging advantage)",

    "staged-rocket.legend.heading": "Legend",
    "staged-rocket.legend.single": "Single-stage rocket",
    "staged-rocket.legend.two_stage": "Two-stage rocket",
    "staged-rocket.legend.casing": "Spent stage-A casing",

    "staged-rocket.equations.heading": "Equations",
    "staged-rocket.equations.section.statement": "Statement",
    "staged-rocket.equations.statement.text":
      "A 540 kg payload sits atop a 19 Tn rocket (17.8 Tn of fuel), burning propellant at 225 kg/s with an exhaust speed of 3600 m/s. Find the payload's maximum speed. Then compare against a two-stage redesign — two 9.5 Tn stages (8.9 Tn fuel each) — finding the speed when stage A separates, and the final maximum speed.",
    "staged-rocket.equations.section.theory": "Theory",
    "staged-rocket.equations.theory.rocket_eq":
      "Why max speed happens exactly at burnout: while the engine fires, thrust (q·v_rel) exceeds weight for any reasonable rocket, so the rocket keeps accelerating throughout the burn. The instant the fuel runs out, thrust vanishes and only gravity remains — deceleration from then on. So v(t) is increasing right up to burnout and decreasing right after: burnout is the peak, no calculus needed to see it.",
    "staged-rocket.equations.theory.staging":
      "Why staging helps: v(t) = v_0 + v_rel·ln(m_0/m(t)) − g·t rewards a LARGE mass ratio m_0/m(t). Dropping the spent stage-A shell before igniting stage B means stage B's burn starts from a much smaller m_0 (dead weight gone), giving it a bigger ratio — and its own maximum speed builds on top of v_sep already gained. Same total propellant, same total structure, but split into two burns beats one.",
    "staged-rocket.equations.section.formulas": "Formulas",
    "staged-rocket.equations.section.reference": "Reference (default values)",
    "staged-rocket.equations.note.reference":
      "Single stage: burns for 79.1 s, reaching v_max ≈ 7931 m/s at burnout.\n" +
      "Two stage: stage A burns for 39.6 s, separating at v_sep ≈ 1800 m/s.\n" +
      "Stage B then burns for another 39.6 s, reaching v_max ≈ 9244 m/s — about 1313 m/s faster than the single-stage design, despite identical total mass and propellant.",
    "staged-rocket.equations.section.plot": "Speed vs. time",
    "staged-rocket.plot.vt.title":
      "v(t) — single-stage plateauing lower than the two-stage design",
  },
  es: {
    "staged-rocket.page.canvas_aria":
      "Simulador de cohete por etapas — comparando un cohete de una sola etapa y uno de dos etapas con la misma carga útil",

    "staged-rocket.controls.section.payload": "Compartido (carga y propelente)",
    "staged-rocket.controls.section.single": "Cohete de una etapa",
    "staged-rocket.controls.section.two": "Cohete de dos etapas (cada una)",
    "staged-rocket.controls.section.visibility": "Visibilidad",
    "staged-rocket.controls.slider.payload": "Masa de la carga útil",
    "staged-rocket.controls.slider.fuel_rate": "Tasa de consumo de combustible q",
    "staged-rocket.controls.slider.exhaust": "Velocidad de escape v_rel",
    "staged-rocket.controls.slider.single_mass": "Masa total (incl. combustible)",
    "staged-rocket.controls.slider.single_fuel": "Masa de combustible",
    "staged-rocket.controls.slider.two_mass": "Masa total por etapa (incl. combustible)",
    "staged-rocket.controls.slider.two_fuel": "Masa de combustible por etapa",
    "staged-rocket.controls.toggle.single": "Cohete de una etapa",
    "staged-rocket.controls.toggle.two": "Cohete de dos etapas",
    "staged-rocket.controls.btn.reset": "Reiniciar",
    "staged-rocket.controls.btn.pause": "Pausar",
    "staged-rocket.controls.btn.resume": "Reanudar",

    "staged-rocket.canvas.single": "Una etapa",
    "staged-rocket.canvas.two_stage": "Dos etapas",
    "staged-rocket.canvas.separation": "se desprende la etapa A",

    "staged-rocket.metrics.heading": "Métricas en vivo",
    "staged-rocket.metrics.v_single": "v_máx  (una etapa)",
    "staged-rocket.metrics.v_sep": "v_sep  (separación de la etapa A)",
    "staged-rocket.metrics.v_two": "v_máx  (dos etapas)",
    "staged-rocket.metrics.gain": "Δv  (ventaja por etapas)",

    "staged-rocket.legend.heading": "Leyenda",
    "staged-rocket.legend.single": "Cohete de una etapa",
    "staged-rocket.legend.two_stage": "Cohete de dos etapas",
    "staged-rocket.legend.casing": "Cubierta gastada de la etapa A",

    "staged-rocket.equations.heading": "Ecuaciones",
    "staged-rocket.equations.section.statement": "Enunciado",
    "staged-rocket.equations.statement.text":
      "Una carga útil de 540 kg se monta sobre un cohete de 19 Tn (17,8 Tn de combustible), que consume propelente a 225 kg/s con una velocidad de escape de 3600 m/s. Hallar la rapidez máxima de la carga útil. Luego comparar contra un rediseño de dos etapas — dos etapas de 9,5 Tn (8,9 Tn de combustible cada una) — hallando la rapidez cuando se desprende la etapa A, y la rapidez máxima final.",
    "staged-rocket.equations.section.theory": "Teoría",
    "staged-rocket.equations.theory.rocket_eq":
      "Por qué la rapidez máxima ocurre exactamente en el apagado: mientras el motor funciona, el empuje (q·v_rel) supera al peso para cualquier cohete razonable, así que el cohete sigue acelerando durante toda la combustión. En el instante en que se acaba el combustible, el empuje desaparece y solo queda la gravedad — desde ahí, desaceleración. Así que v(t) crece hasta el apagado y decrece justo después: el apagado es el pico, sin necesitar cálculo para verlo.",
    "staged-rocket.equations.theory.staging":
      "Por qué las etapas ayudan: v(t) = v_0 + v_rel·ln(m_0/m(t)) − g·t premia una relación de masas m_0/m(t) GRANDE. Descartar la cubierta gastada de la etapa A antes de encender la etapa B hace que la combustión de B parta de un m_0 mucho menor (sin peso muerto), dándole una relación mayor — y su propia rapidez máxima se construye sobre la v_sep ya ganada. Mismo propelente total, misma estructura total, pero repartida en dos combustiones supera a una sola.",
    "staged-rocket.equations.section.formulas": "Fórmulas",
    "staged-rocket.equations.section.reference": "Referencia (valores por defecto)",
    "staged-rocket.equations.note.reference":
      "Una etapa: quema durante 79,1 s, alcanzando v_máx ≈ 7931 m/s en el apagado.\n" +
      "Dos etapas: la etapa A quema durante 39,6 s, separándose a v_sep ≈ 1800 m/s.\n" +
      "La etapa B quema otros 39,6 s, alcanzando v_máx ≈ 9244 m/s — unos 1313 m/s más rápido que el diseño de una etapa, a pesar de tener la misma masa total y el mismo propelente.",
    "staged-rocket.equations.section.plot": "Rapidez vs. tiempo",
    "staged-rocket.plot.vt.title":
      "v(t) — una etapa se estanca más abajo que el diseño de dos etapas",
  },
};
