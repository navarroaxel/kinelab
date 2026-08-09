export const hoist = {
  en: {
    "hoist.page.canvas_aria":
      "Hoist simulator — electric motor lifting a load, assisted by a counterweight through a movable pulley",

    "hoist.controls.section.load": "Load & counterweight",
    "hoist.controls.section.motor": "Motor (wattmeter)",
    "hoist.controls.section.visibility": "Visibility",
    "hoist.controls.slider.load_mass": "Load mass m",
    "hoist.controls.slider.speed": "Load's lifting speed v",
    "hoist.controls.slider.counterweight_mass": "Counterweight mass m_c",
    "hoist.controls.slider.wattmeter": "Wattmeter B reading",
    "hoist.controls.toggle.load": "Cable, counterweight and rising load",
    "hoist.controls.toggle.power_flow": "Power-flow arrows",
    "hoist.controls.btn.reset": "Reset",
    "hoist.controls.btn.pause": "Pause",
    "hoist.controls.btn.resume": "Resume",
    "hoist.controls.warn.exceeds":
      "⚠ Pₘ > Pₑ at this wattmeter reading — physically impossible (η would exceed 100%). Raise the reading to at least the mechanical power shown below.",

    "hoist.canvas.warn.not_possible": "η > 100% — not possible",

    "hoist.metrics.heading": "Live Metrics",
    "hoist.metrics.efficiency": "η  (motor efficiency)",
    "hoist.metrics.counterweight_speed": "v_c  (counterweight speed)",

    "hoist.legend.heading": "Legend",
    "hoist.legend.cable": "Cable, fixed pulley and counterweight",
    "hoist.legend.load": "Load, via the movable pulley",
    "hoist.legend.p_elec": "Pₑ, electrical power into the motor",
    "hoist.legend.p_mech": "Pₘ, mechanical power net of the counterweight's assist",

    "hoist.equations.heading": "Equations",
    "hoist.equations.section.statement": "Statement",
    "hoist.equations.statement.text":
      "Motor A hoists a 300 kg load at a constant 2 m/s via an inextensible cable and massless pulleys. A 100 kg counterweight, roped through a movable pulley that rides the load, descends at 4 m/s and partly relieves the motor. Wattmeter B, wired to motor A, reads 2.2 kW. Find the motor's efficiency.",
    "hoist.equations.section.theory": "Theory",
    "hoist.equations.theory.pulley_ratio":
      "Why the counterweight falls twice as fast: the movable pulley rides on the load, held up by two strands of the same rope — one running to a fixed anchor, the other over a fixed pulley to the counterweight. Both strands must shorten together as the load rises, so for every metre the load climbs, one metre of rope is taken up on EACH strand — two metres total — which the counterweight (at the single far end) must supply by falling twice as far, twice as fast.",
    "hoist.equations.theory.counterweight":
      "The counterweight discharges the motor: with two strands sharing the load's weight, each carries T₂ = m·g/2. That tension continues through the fixed pulley to the counterweight, but the counterweight's own weight pulls back the other way, so the motor only feels the difference: T₁ = T₂ − m_c·g. A heavier counterweight — up to m·g/2 — subtracts more, right down to zero motor tension.",
    "hoist.equations.theory.wattmeter":
      "The wattmeter measures the motor's real electrical input directly, in watts — no need to separately read voltage, current and power factor as in a three-phase nameplate calculation.",
    "hoist.equations.section.formulas": "Formulas",
    "hoist.equations.formula.pulley":
      "v_c = 2v  (movable-pulley kinematic constraint)",
    "hoist.equations.formula.tension2": "T₂ = m·g / 2",
    "hoist.equations.formula.tension1": "T₁ = T₂ − m_c·g",
    "hoist.equations.section.reference": "Reference (default values)",
    "hoist.equations.note.reference":
      "v_c = 2 × 2 m/s = 4 m/s.\n" +
      "T₂ = 300 × 9.81 / 2 = 1471.5 N (150 kgf).\n" +
      "T₁ = 1471.5 − 100 × 9.81 = 490.5 N (50 kgf).\n" +
      "Pₘ = T₁ × v_c = 490.5 × 4 ≈ 1.96 kW.\n" +
      "η = Pₘ / Pₑ = 1962 / 2200 ≈ 89.2%.",
    "hoist.equations.section.plot": "Efficiency vs. wattmeter reading",
    "hoist.plot.eta_p.title": "η(B) — efficiency vs. wattmeter reading",
  },
  es: {
    "hoist.page.canvas_aria":
      "Simulador de montacargas — motor eléctrico elevando una carga, asistido por un contrapeso mediante una polea móvil",

    "hoist.controls.section.load": "Carga y contrapeso",
    "hoist.controls.section.motor": "Motor (vatímetro)",
    "hoist.controls.section.visibility": "Visibilidad",
    "hoist.controls.slider.load_mass": "Masa de la carga m",
    "hoist.controls.slider.speed": "Velocidad de la carga v",
    "hoist.controls.slider.counterweight_mass": "Masa del contrapeso m_c",
    "hoist.controls.slider.wattmeter": "Lectura del vatímetro B",
    "hoist.controls.toggle.load": "Cable, contrapeso y carga en ascenso",
    "hoist.controls.toggle.power_flow": "Flechas de flujo de potencia",
    "hoist.controls.btn.reset": "Reiniciar",
    "hoist.controls.btn.pause": "Pausar",
    "hoist.controls.btn.resume": "Reanudar",
    "hoist.controls.warn.exceeds":
      "⚠ Pₘ > Pₑ con esta lectura del vatímetro — físicamente imposible (η superaría el 100%). Subí la lectura al menos hasta la potencia mecánica indicada abajo.",

    "hoist.canvas.warn.not_possible": "η > 100% — no es posible",

    "hoist.metrics.heading": "Métricas en vivo",
    "hoist.metrics.efficiency": "η  (rendimiento del motor)",
    "hoist.metrics.counterweight_speed": "v_c  (velocidad del contrapeso)",

    "hoist.legend.heading": "Leyenda",
    "hoist.legend.cable": "Cable, polea fija y contrapeso",
    "hoist.legend.load": "Carga, vía la polea móvil",
    "hoist.legend.p_elec": "Pₑ, potencia eléctrica hacia el motor",
    "hoist.legend.p_mech": "Pₘ, potencia mecánica neta de la asistencia del contrapeso",

    "hoist.equations.heading": "Ecuaciones",
    "hoist.equations.section.statement": "Enunciado",
    "hoist.equations.statement.text":
      "El motor A eleva una carga de 300 kg a velocidad constante de 2 m/s mediante un cable inextensible y poleas de masa despreciable. Un contrapeso de 100 kg, enhebrado mediante una polea móvil que viaja con la carga, desciende a 4 m/s y alivia parcialmente al motor. El vatímetro B, conectado al motor A, acusa 2,2 kW. Hallar el rendimiento del motor.",
    "hoist.equations.section.theory": "Teoría",
    "hoist.equations.theory.pulley_ratio":
      "Por qué el contrapeso cae al doble de velocidad: la polea móvil viaja con la carga, sostenida por dos tramos de la misma cuerda — uno hacia un anclaje fijo, el otro sobre una polea fija hacia el contrapeso. Ambos tramos deben acortarse juntos a medida que la carga sube, así que por cada metro que sube la carga, se recoge un metro de cuerda en CADA tramo — dos metros en total — que el contrapeso (en el único extremo libre) debe aportar cayendo el doble de rápido.",
    "hoist.equations.theory.counterweight":
      "El contrapeso descarga al motor: con dos tramos repartiendo el peso de la carga, cada uno lleva T₂ = m·g/2. Esa tensión continúa a través de la polea fija hacia el contrapeso, pero el propio peso del contrapeso tira en sentido contrario, así que el motor solo siente la diferencia: T₁ = T₂ − m_c·g. Un contrapeso más pesado —hasta m·g/2— resta más, hasta anular por completo la tensión que debe aportar el motor.",
    "hoist.equations.theory.wattmeter":
      "El vatímetro mide directamente la potencia eléctrica real que consume el motor, en watts — sin necesidad de leer por separado tensión, corriente y factor de potencia como en un cálculo a partir de la chapa de un motor trifásico.",
    "hoist.equations.section.formulas": "Fórmulas",
    "hoist.equations.formula.pulley":
      "v_c = 2v  (vínculo cinemático de la polea móvil)",
    "hoist.equations.formula.tension2": "T₂ = m·g / 2",
    "hoist.equations.formula.tension1": "T₁ = T₂ − m_c·g",
    "hoist.equations.section.reference": "Referencia (valores por defecto)",
    "hoist.equations.note.reference":
      "v_c = 2 × 2 m/s = 4 m/s.\n" +
      "T₂ = 300 × 9,81 / 2 = 1471,5 N (150 kgf).\n" +
      "T₁ = 1471,5 − 100 × 9,81 = 490,5 N (50 kgf).\n" +
      "Pₘ = T₁ × v_c = 490,5 × 4 ≈ 1,96 kW.\n" +
      "η = Pₘ / Pₑ = 1962 / 2200 ≈ 89,2%.",
    "hoist.equations.section.plot": "Rendimiento vs. lectura del vatímetro",
    "hoist.plot.eta_p.title": "η(B) — rendimiento vs. lectura del vatímetro",
  },
};
