export const railCarCoupling = {
  en: {
    "rail-car-coupling.page.canvas_aria":
      "Rail car coupling simulator — a moving car couples inelastically with a stationary one",

    "rail-car-coupling.controls.section.cars": "Cars",
    "rail-car-coupling.controls.section.coupling": "Coupling",
    "rail-car-coupling.controls.section.visibility": "Visibility",
    "rail-car-coupling.controls.slider.mass1": "Mass of car 1 (moving)",
    "rail-car-coupling.controls.slider.speed1": "Speed of car 1",
    "rail-car-coupling.controls.slider.mass2": "Mass of car 2 (at rest)",
    "rail-car-coupling.controls.slider.coupling_time": "Coupling duration Δt",
    "rail-car-coupling.controls.toggle.forces": "Impulsive-force arrows",
    "rail-car-coupling.controls.toggle.velocity_labels": "Live velocity readouts",
    "rail-car-coupling.controls.btn.reset": "Reset",
    "rail-car-coupling.controls.btn.pause": "Pause",
    "rail-car-coupling.controls.btn.resume": "Resume",

    "rail-car-coupling.canvas.force": "F_avg",
    "rail-car-coupling.canvas.coupling": "coupling",

    "rail-car-coupling.symbol.final_speed": "v_f",
    "rail-car-coupling.symbol.avg_force": "F_avg",

    "rail-car-coupling.metrics.heading": "Live Metrics",
    "rail-car-coupling.metrics.v1": "v₁  (before coupling)",
    "rail-car-coupling.metrics.vf": "v_f  (after coupling)",
    "rail-car-coupling.metrics.impulse": "J  (impulse exchanged)",
    "rail-car-coupling.metrics.avg_force": "F_avg  (mean impulsive force)",

    "rail-car-coupling.legend.heading": "Legend",
    "rail-car-coupling.legend.car1": "Car 1 (initially moving)",
    "rail-car-coupling.legend.car2": "Car 2 (initially at rest)",
    "rail-car-coupling.legend.force": "Impulsive coupling force",

    "rail-car-coupling.equations.heading": "Equations",
    "rail-car-coupling.equations.section.statement": "Statement",
    "rail-car-coupling.equations.statement.text":
      "A 40 t rail car moving at 2 km/h couples with a stationary 60 t car. Find the common speed after coupling, and the mean impulsive force on each car if coupling takes 3 s.",
    "rail-car-coupling.equations.section.theory": "Theory",
    "rail-car-coupling.equations.theory.momentum":
      "Coupling is a perfectly inelastic collision: the two cars end up moving together, so momentum conservation alone — m₁v₁ + m₂v₂ = (m₁+m₂)v_f — determines v_f without needing to know anything about the coupling mechanism itself (spring, buffer, latch...). Kinetic energy is not conserved here; it's what a perfectly inelastic collision spends holding the cars together.",
    "rail-car-coupling.equations.theory.impulse":
      "The impulse-momentum theorem turns the collision into something you can quote a force for: J = ∫F dt equals each car's own change in momentum, so J = m₁(v₁ − v_f) = m₂v_f exactly (Newton's third law — equal and opposite on each car). Dividing by how long the coupling actually takes gives the *average* force; the real, instantaneous force during a 3-second metal-on-metal impact is a spike, not a constant — this is only ever an average.",
    "rail-car-coupling.equations.section.formulas": "Formulas",
    "rail-car-coupling.equations.section.reference": "Reference (default values)",
    "rail-car-coupling.equations.note.reference":
      "v₁ = 2 km/h ≈ 0.556 m/s.\n" +
      "v_f = (40 000 × 0.556) / (40 000 + 60 000) ≈ 0.222 m/s ≈ 0.8 km/h.\n" +
      "J = 40 000 × (0.556 − 0.222) ≈ 13 333 N·s.\n" +
      "F_avg = 13 333 / 3 ≈ 4444 N on each car.",
    "rail-car-coupling.equations.section.plot": "Velocity during coupling",
    "rail-car-coupling.plot.vt.title":
      "v(t) — both cars' velocity converging to v_f during coupling",
  },
  es: {
    "rail-car-coupling.page.canvas_aria":
      "Simulador de acoplamiento de vagones — un vagón en movimiento se acopla inelásticamente con uno detenido",

    "rail-car-coupling.controls.section.cars": "Vagones",
    "rail-car-coupling.controls.section.coupling": "Acoplamiento",
    "rail-car-coupling.controls.section.visibility": "Visibilidad",
    "rail-car-coupling.controls.slider.mass1": "Masa del vagón 1 (en movimiento)",
    "rail-car-coupling.controls.slider.speed1": "Velocidad del vagón 1",
    "rail-car-coupling.controls.slider.mass2": "Masa del vagón 2 (detenido)",
    "rail-car-coupling.controls.slider.coupling_time": "Duración del acoplamiento Δt",
    "rail-car-coupling.controls.toggle.forces": "Flechas de fuerza impulsiva",
    "rail-car-coupling.controls.toggle.velocity_labels": "Lecturas de velocidad en vivo",
    "rail-car-coupling.controls.btn.reset": "Reiniciar",
    "rail-car-coupling.controls.btn.pause": "Pausar",
    "rail-car-coupling.controls.btn.resume": "Reanudar",

    "rail-car-coupling.canvas.force": "F_med",
    "rail-car-coupling.canvas.coupling": "acoplamiento",

    "rail-car-coupling.symbol.final_speed": "v_f",
    "rail-car-coupling.symbol.avg_force": "F_med",

    "rail-car-coupling.metrics.heading": "Métricas en vivo",
    "rail-car-coupling.metrics.v1": "v₁  (antes del acoplamiento)",
    "rail-car-coupling.metrics.vf": "v_f  (después del acoplamiento)",
    "rail-car-coupling.metrics.impulse": "J  (impulso intercambiado)",
    "rail-car-coupling.metrics.avg_force": "F_med  (fuerza impulsiva media)",

    "rail-car-coupling.legend.heading": "Leyenda",
    "rail-car-coupling.legend.car1": "Vagón 1 (inicialmente en movimiento)",
    "rail-car-coupling.legend.car2": "Vagón 2 (inicialmente detenido)",
    "rail-car-coupling.legend.force": "Fuerza impulsiva de acoplamiento",

    "rail-car-coupling.equations.heading": "Ecuaciones",
    "rail-car-coupling.equations.section.statement": "Enunciado",
    "rail-car-coupling.equations.statement.text":
      "Un vagón de 40 Tn que se mueve a 2 km/h se acopla con un vagón detenido de 60 Tn. Hallar la velocidad común después del acoplamiento, y la fuerza impulsiva media sobre cada vagón si el acoplamiento dura 3 s.",
    "rail-car-coupling.equations.section.theory": "Teoría",
    "rail-car-coupling.equations.theory.momentum":
      "El acoplamiento es un choque perfectamente inelástico: los dos vagones terminan moviéndose juntos, así que la sola conservación de la cantidad de movimiento — m₁v₁ + m₂v₂ = (m₁+m₂)v_f — determina v_f sin necesidad de conocer nada sobre el mecanismo de acople (resorte, tope, traba...). La energía cinética no se conserva aquí; es exactamente lo que un choque perfectamente inelástico gasta en mantener unidos a los vagones.",
    "rail-car-coupling.equations.theory.impulse":
      "El teorema del impulso y la cantidad de movimiento convierte el choque en algo a lo que se le puede asignar una fuerza: J = ∫F dt es igual al cambio de cantidad de movimiento de cada vagón, así que J = m₁(v₁ − v_f) = m₂v_f exactamente (tercera ley de Newton — igual y opuesta sobre cada vagón). Dividir por cuánto dura realmente el acoplamiento da la fuerza *media*; la fuerza real e instantánea durante un impacto metal-metal de 3 segundos es un pico, no una constante — esto siempre es solo un promedio.",
    "rail-car-coupling.equations.section.formulas": "Fórmulas",
    "rail-car-coupling.equations.section.reference": "Referencia (valores por defecto)",
    "rail-car-coupling.equations.note.reference":
      "v₁ = 2 km/h ≈ 0,556 m/s.\n" +
      "v_f = (40 000 × 0,556) / (40 000 + 60 000) ≈ 0,222 m/s ≈ 0,8 km/h.\n" +
      "J = 40 000 × (0,556 − 0,222) ≈ 13 333 N·s.\n" +
      "F_med = 13 333 / 3 ≈ 4444 N sobre cada vagón.",
    "rail-car-coupling.equations.section.plot": "Velocidad durante el acoplamiento",
    "rail-car-coupling.plot.vt.title":
      "v(t) — la velocidad de ambos vagones convergiendo a v_f durante el acoplamiento",
  },
};
