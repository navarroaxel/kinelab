export const atwood = {
  en: {
    "atwood.page.canvas_aria":
      "Atwood machine simulator — two masses over a pulley, one rising, one descending",

    "atwood.controls.section.masses": "Masses",
    "atwood.controls.section.pulley": "Pulley",
    "atwood.controls.section.visibility": "Visibility",
    "atwood.controls.slider.mass1": "Mass m₁",
    "atwood.controls.slider.mass2": "Mass m₂",
    "atwood.controls.slider.pulley_inertia": "Pulley moment of inertia I",
    "atwood.controls.slider.pulley_radius": "Pulley radius r",
    "atwood.controls.toggle.masses": "Masses & cable",
    "atwood.controls.toggle.forces": "Forces & velocity",
    "atwood.controls.btn.reset": "Reset",
    "atwood.controls.btn.pause": "Pause",
    "atwood.controls.btn.resume": "Resume",

    "atwood.canvas.mass1": "m₁",
    "atwood.canvas.mass2": "m₂",
    "atwood.canvas.tension": "T",
    "atwood.canvas.caption_massless": "Massless pulley: T equal on both sides",
    "atwood.canvas.caption_inertia": "With inertia: T₁ ≠ T₂, and (T₂ − T₁)·R = I·α",

    "atwood.symbol.acceleration": "a",
    "atwood.symbol.tension1": "T_1",
    "atwood.symbol.tension2": "T_2",

    "atwood.metrics.heading": "Live Metrics",
    "atwood.metrics.acceleration": "a  (system acceleration)",
    "atwood.metrics.tension1": "T_1  (tension, m₁ side)",
    "atwood.metrics.tension2": "T_2  (tension, m₂ side)",

    "atwood.legend.heading": "Legend",
    "atwood.legend.mass1": "m₁ (lighter — rises)",
    "atwood.legend.mass2": "m₂ (heavier — descends)",
    "atwood.legend.tension1": "Tension on m₁'s side",
    "atwood.legend.tension2": "Tension on m₂'s side",
    "atwood.legend.cable": "Inextensible cable",

    "atwood.equations.heading": "Equations",
    "atwood.equations.section.statement": "Statement",
    "atwood.equations.statement.text":
      "Atwood machine: neglecting the pulley's mass and friction, find the acceleration of m₁ and the tension T when the system moves under gravity alone. Solve using Newton's second law and the work–kinetic energy theorem. How does the equation of motion change when the pulley's moment of inertia is taken into account?",
    "atwood.equations.section.theory": "Theory",
    "atwood.equations.theory.newton":
      "Newton's second law on each mass, plus the string constraint (both masses share the same acceleration magnitude, since the cable is inextensible): m₂g − T = m₂a for the descending mass, T − m₁g = m₁a for the rising one. Adding both equations eliminates T and gives a = (m₂ − m₁)g / (m₁ + m₂) directly — the classic massless-pulley result, where the tension is the same on both sides.",
    "atwood.equations.theory.work_energy":
      "The same result follows from the work–energy theorem: over a displacement d, gravity does net work (m₂ − m₁)g·d (m₂ loses height, m₁ gains it, at the same rate), and since the pulley is massless and frictionless, no energy is lost to it. That work equals the gain in kinetic energy of both masses, ½(m₁+m₂)v², and differentiating v² = 2ad with respect to d recovers the same a = (m₂ − m₁)g / (m₁ + m₂).",
    "atwood.equations.theory.pulley_inertia":
      "With a real pulley of moment of inertia I and radius r, the string can no longer pull with equal tension on both sides — some of the net torque now has to spin the pulley itself up (or down) rather than just accelerate the masses. Writing (T₂ − T₁)·r = I·α with α = a/r and combining with both masses' equations gives a = (m₂ − m₁)g / (m₁ + m₂ + I/r²): the pulley behaves exactly like extra inertial mass I/r² added to the system, always making the acceleration smaller than the massless-pulley case, and now T₁ ≠ T₂.",
    "atwood.equations.section.formulas": "Formulas",
    "atwood.equations.section.reference": "Reference (default values)",
    "atwood.equations.note.reference":
      "With I = 0 (massless pulley): a = (8−5)×9.81 / (5+8) ≈ 2.26 m/s², T ≈ 60.4 N on both sides.\n" +
      "Increasing I splits the tension: T_2 stays above T_1 (m2's own weight is bigger to begin with), and a decreases below the massless-pulley value.",
  },
  es: {
    "atwood.page.canvas_aria":
      "Simulador de la máquina de Atwood — dos masas sobre una polea, una subiendo y otra bajando",

    "atwood.controls.section.masses": "Masas",
    "atwood.controls.section.pulley": "Polea",
    "atwood.controls.section.visibility": "Visibilidad",
    "atwood.controls.slider.mass1": "Masa m₁",
    "atwood.controls.slider.mass2": "Masa m₂",
    "atwood.controls.slider.pulley_inertia": "Momento de inercia de la polea I",
    "atwood.controls.slider.pulley_radius": "Radio de la polea r",
    "atwood.controls.toggle.masses": "Masas y cable",
    "atwood.controls.toggle.forces": "Fuerzas y velocidad",
    "atwood.controls.btn.reset": "Reiniciar",
    "atwood.controls.btn.pause": "Pausar",
    "atwood.controls.btn.resume": "Reanudar",

    "atwood.canvas.mass1": "m₁",
    "atwood.canvas.mass2": "m₂",
    "atwood.canvas.tension": "T",
    "atwood.canvas.caption_massless": "Polea sin masa: T igual en ambos ramales",
    "atwood.canvas.caption_inertia": "Con inercia: T₁ ≠ T₂, y (T₂ − T₁)·R = I·α",

    "atwood.symbol.acceleration": "a",
    "atwood.symbol.tension1": "T_1",
    "atwood.symbol.tension2": "T_2",

    "atwood.metrics.heading": "Métricas en vivo",
    "atwood.metrics.acceleration": "a  (aceleración del sistema)",
    "atwood.metrics.tension1": "T_1  (tensión, lado m₁)",
    "atwood.metrics.tension2": "T_2  (tensión, lado m₂)",

    "atwood.legend.heading": "Leyenda",
    "atwood.legend.mass1": "m₁ (más liviana — sube)",
    "atwood.legend.mass2": "m₂ (más pesada — baja)",
    "atwood.legend.tension1": "Tensión del lado de m₁",
    "atwood.legend.tension2": "Tensión del lado de m₂",
    "atwood.legend.cable": "Cable inextensible",

    "atwood.equations.heading": "Ecuaciones",
    "atwood.equations.section.statement": "Enunciado",
    "atwood.equations.statement.text":
      "Máquina de Atwood: despreciando la masa de la polea y las fuerzas de fricción, encontrar la aceleración de m₁ y la tensión T cuando el sistema se mueve bajo la acción de la gravedad. Resolver por la segunda ley de Newton y por el principio de trabajo y energía cinética. ¿Cómo cambia la ecuación del movimiento considerando el momento de inercia de la polea?",
    "atwood.equations.section.theory": "Teoría",
    "atwood.equations.theory.newton":
      "Segunda ley de Newton en cada masa, más el vínculo de la cuerda (ambas masas comparten la misma magnitud de aceleración, porque el cable es inextensible): m₂g − T = m₂a para la masa que desciende, T − m₁g = m₁a para la que sube. Sumando ambas ecuaciones se elimina T y se obtiene directamente a = (m₂ − m₁)g / (m₁ + m₂) — el resultado clásico de la polea sin masa, donde la tensión es igual en ambos lados.",
    "atwood.equations.theory.work_energy":
      "El mismo resultado se obtiene por el principio de trabajo y energía: en un desplazamiento d, la gravedad realiza un trabajo neto (m₂ − m₁)g·d (m₂ pierde altura, m₁ la gana, a la misma tasa), y como la polea no tiene masa ni fricción, no se pierde energía en ella. Ese trabajo es igual al incremento de energía cinética de ambas masas, ½(m₁+m₂)v², y derivando v² = 2ad respecto de d se recupera la misma a = (m₂ − m₁)g / (m₁ + m₂).",
    "atwood.equations.theory.pulley_inertia":
      "Con una polea real de momento de inercia I y radio r, la cuerda ya no puede tirar con igual tensión de ambos lados — parte del torque neto ahora debe acelerar angularmente a la propia polea en lugar de solo acelerar las masas. Escribiendo (T₂ − T₁)·r = I·α con α = a/r y combinando con las ecuaciones de ambas masas se obtiene a = (m₂ − m₁)g / (m₁ + m₂ + I/r²): la polea se comporta exactamente como una masa inercial adicional I/r² sumada al sistema, siempre reduciendo la aceleración respecto del caso sin masa, y ahora T₁ ≠ T₂.",
    "atwood.equations.section.formulas": "Fórmulas",
    "atwood.equations.section.reference": "Referencia (valores por defecto)",
    "atwood.equations.note.reference":
      "Con I = 0 (polea sin masa): a = (8−5)×9,81 / (5+8) ≈ 2,26 m/s², T ≈ 60,4 N en ambos lados.\n" +
      "Al aumentar I la tensión se divide: T_2 se mantiene por encima de T_1 (el peso propio de m2 ya era mayor), y a disminuye respecto del valor de la polea sin masa.",
  },
};
