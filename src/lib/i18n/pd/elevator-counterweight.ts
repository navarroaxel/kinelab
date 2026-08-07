export const elevatorCounterweight = {
  en: {
    "elevator-counterweight.page.canvas_aria":
      "Elevator and counterweight simulator — a motor-driven pulley that can either drive or brake the system",

    "elevator-counterweight.controls.section.masses": "Masses",
    "elevator-counterweight.controls.section.motion": "Motion",
    "elevator-counterweight.controls.section.visibility": "Visibility",
    "elevator-counterweight.controls.slider.elevator_mass": "Elevator mass m_E",
    "elevator-counterweight.controls.slider.counterweight_mass":
      "Counterweight mass m_W",
    "elevator-counterweight.controls.slider.velocity":
      "Elevator velocity v (+ up, − down)",
    "elevator-counterweight.controls.slider.acceleration":
      "Elevator acceleration a",
    "elevator-counterweight.controls.btn.case_a": "Case a) −3 m/s, a=0",
    "elevator-counterweight.controls.btn.case_b": "Case b) +3 m/s, a=−0.5",
    "elevator-counterweight.controls.toggle.cars": "Elevator + counterweight",
    "elevator-counterweight.controls.btn.reset": "Reset",
    "elevator-counterweight.controls.btn.pause": "Pause",
    "elevator-counterweight.controls.btn.resume": "Resume",

    "elevator-counterweight.canvas.elevator": "E",
    "elevator-counterweight.canvas.counterweight": "W",
    "elevator-counterweight.canvas.motor": "M",
    "elevator-counterweight.canvas.driving": "driving",
    "elevator-counterweight.canvas.braking": "braking",

    "elevator-counterweight.metrics.heading": "Live Metrics",
    "elevator-counterweight.metrics.power": "|P|  (motor power)",
    "elevator-counterweight.metrics.note.driving":
      "The motor is driving — gravity alone (elevator heavier than counterweight) can't sustain this motion on its own.",
    "elevator-counterweight.metrics.note.braking":
      "The motor is braking — gravity alone would accelerate the system faster than this, so the motor absorbs the excess.",

    "elevator-counterweight.legend.heading": "Legend",
    "elevator-counterweight.legend.elevator": "Elevator E",
    "elevator-counterweight.legend.counterweight": "Counterweight W",
    "elevator-counterweight.legend.driving": "Motor driving",
    "elevator-counterweight.legend.braking": "Motor braking",

    "elevator-counterweight.equations.heading": "Equations",
    "elevator-counterweight.equations.section.statement": "Statement",
    "elevator-counterweight.equations.statement.text":
      "A 3000 kg elevator E is connected to a 1000 kg counterweight W over a motor-driven pulley. Find the motor's power a) descending at a constant 3 m/s, and b) ascending at 3 m/s while decelerating at 0.5 m/s².",
    "elevator-counterweight.equations.section.theory": "Theory",
    "elevator-counterweight.equations.theory.text":
      "The pulley here isn't passive — a real elevator motor drives it, so it can push the cable's tension imbalance either way. Rather than solve for the two cable tensions separately, the power delivered equals the rate of change of the system's total mechanical energy (kinetic + potential), since the cable does no net work of its own. Because m_E > m_W, gravity alone would make the elevator accelerate downward — so descending at *constant* speed actually needs the motor to brake (P < 0), while ascending needs it to drive (P > 0), even while decelerating.",
    "elevator-counterweight.equations.section.formulas": "Formulas",
    "elevator-counterweight.equations.formula.note":
      "v > 0 means the elevator moves up (counterweight moves down at the same speed); P < 0 means the motor is braking, not driving.",
    "elevator-counterweight.equations.section.reference": "Reference (the two named cases)",
    "elevator-counterweight.equations.note.reference":
      "a) v = −3 m/s, a = 0: P = (4000)(−3)(0) + (2000)(9.81)(−3) = −58.86 kW — the motor brakes.\n" +
      "b) v = +3 m/s, a = −0.5: P = (4000)(3)(−0.5) + (2000)(9.81)(3) = 52.86 kW — the motor drives.",
    "elevator-counterweight.plot.title": "Motor power",
  },
  es: {
    "elevator-counterweight.page.canvas_aria":
      "Simulador de elevador y contrapeso — una polea accionada por motor que puede impulsar o frenar el sistema",

    "elevator-counterweight.controls.section.masses": "Masas",
    "elevator-counterweight.controls.section.motion": "Movimiento",
    "elevator-counterweight.controls.section.visibility": "Visibilidad",
    "elevator-counterweight.controls.slider.elevator_mass": "Masa del elevador m_E",
    "elevator-counterweight.controls.slider.counterweight_mass":
      "Masa del contrapeso m_W",
    "elevator-counterweight.controls.slider.velocity":
      "Velocidad del elevador v (+ arriba, − abajo)",
    "elevator-counterweight.controls.slider.acceleration":
      "Aceleración del elevador a",
    "elevator-counterweight.controls.btn.case_a": "Caso a) −3 m/s, a=0",
    "elevator-counterweight.controls.btn.case_b": "Caso b) +3 m/s, a=−0,5",
    "elevator-counterweight.controls.toggle.cars": "Elevador + contrapeso",
    "elevator-counterweight.controls.btn.reset": "Reiniciar",
    "elevator-counterweight.controls.btn.pause": "Pausar",
    "elevator-counterweight.controls.btn.resume": "Reanudar",

    "elevator-counterweight.canvas.elevator": "E",
    "elevator-counterweight.canvas.counterweight": "W",
    "elevator-counterweight.canvas.motor": "M",
    "elevator-counterweight.canvas.driving": "impulsando",
    "elevator-counterweight.canvas.braking": "frenando",

    "elevator-counterweight.metrics.heading": "Métricas en vivo",
    "elevator-counterweight.metrics.power": "|P|  (potencia del motor)",
    "elevator-counterweight.metrics.note.driving":
      "El motor está impulsando — la gravedad sola (elevador más pesado que el contrapeso) no puede sostener este movimiento por sí misma.",
    "elevator-counterweight.metrics.note.braking":
      "El motor está frenando — la gravedad sola aceleraría el sistema más rápido que esto, así que el motor absorbe el exceso.",

    "elevator-counterweight.legend.heading": "Leyenda",
    "elevator-counterweight.legend.elevator": "Elevador E",
    "elevator-counterweight.legend.counterweight": "Contrapeso W",
    "elevator-counterweight.legend.driving": "Motor impulsando",
    "elevator-counterweight.legend.braking": "Motor frenando",

    "elevator-counterweight.equations.heading": "Ecuaciones",
    "elevator-counterweight.equations.section.statement": "Enunciado",
    "elevator-counterweight.equations.statement.text":
      "Un elevador E de 3000 kg se conecta a un contrapeso W de 1000 kg mediante una polea accionada por un motor. Hallar la potencia del motor a) descendiendo a velocidad constante de 3 m/s, y b) ascendiendo a 3 m/s mientras desacelera a 0,5 m/s².",
    "elevator-counterweight.equations.section.theory": "Teoría",
    "elevator-counterweight.equations.theory.text":
      "La polea aquí no es pasiva — un motor de elevador real la acciona, así que puede empujar el desequilibrio de tensión del cable en cualquier sentido. En lugar de resolver por separado las dos tensiones del cable, la potencia entregada es igual a la tasa de cambio de la energía mecánica total del sistema (cinética + potencial), ya que el cable no realiza trabajo neto propio. Como m_E > m_W, la gravedad sola haría que el elevador acelere hacia abajo — así que descender a velocidad *constante* en realidad necesita que el motor frene (P < 0), mientras que ascender necesita que impulse (P > 0), incluso mientras desacelera.",
    "elevator-counterweight.equations.section.formulas": "Fórmulas",
    "elevator-counterweight.equations.formula.note":
      "v > 0 significa que el elevador sube (el contrapeso baja a la misma velocidad); P < 0 significa que el motor está frenando, no impulsando.",
    "elevator-counterweight.equations.section.reference": "Referencia (los dos casos nombrados)",
    "elevator-counterweight.equations.note.reference":
      "a) v = −3 m/s, a = 0: P = (4000)(−3)(0) + (2000)(9,81)(−3) = −58,86 kW — el motor frena.\n" +
      "b) v = +3 m/s, a = −0,5: P = (4000)(3)(−0,5) + (2000)(9,81)(3) = 52,86 kW — el motor impulsa.",
    "elevator-counterweight.plot.title": "Potencia del motor",
  },
};
