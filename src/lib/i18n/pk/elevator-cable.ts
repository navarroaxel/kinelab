export const elevatorCable = {
  en: {
    "elevator-cable.page.canvas_aria":
      "Elevator and pulley simulator — a car descends as a reel unwinds cable at constant speed",

    "elevator-cable.controls.section.parameters": "Parameters",
    "elevator-cable.controls.section.visibility": "Visibility",
    "elevator-cable.controls.slider.b": "Horizontal offset b",
    "elevator-cable.controls.slider.v0": "Cable unwind speed v₀",
    "elevator-cable.controls.slider.x0": "Initial position x₀",
    "elevator-cable.controls.toggle.velocity": "Velocity indicator",
    "elevator-cable.controls.toggle.drum": "Reel C",
    "elevator-cable.controls.toggle.trace": "Car trail",
    "elevator-cable.controls.btn.reset": "Reset to t = 0",
    "elevator-cable.controls.btn.pause": "Pause",
    "elevator-cable.controls.btn.resume": "Resume",
    "elevator-cable.controls.warn.singular":
      "ẋ → ∞ at this instant — with the cable horizontal (x = 0), any finite cable payout requires infinite car speed.",

    "elevator-cable.metrics.heading": "Live Metrics",
    "elevator-cable.metrics.t": "t  (elapsed)",
    "elevator-cable.metrics.x": "x  (position)",
    "elevator-cable.metrics.xdot": "ẋ  (velocity)",
    "elevator-cable.metrics.xddot": "ẍ  (acceleration)",

    "elevator-cable.legend.heading": "Legend",
    "elevator-cable.legend.cable": "Cable A–B",
    "elevator-cable.legend.car": "Car (elevator)",
    "elevator-cable.legend.drum": "Reel C",

    "elevator-cable.equations.heading": "Equations",
    "elevator-cable.equations.section.statement": "Statement",
    "elevator-cable.equations.statement.text":
      "Cable unwinds from reel C at constant v₀. Find the elevator's velocity and acceleration as functions of time.",
    "elevator-cable.equations.section.formulas": "Formulas",
    "elevator-cable.equations.section.singularity":
      "Singularity at t = 0 (x₀ = 0)",
    "elevator-cable.equations.note.singularity":
      "With the cable horizontal, consuming cable at v₀ would require infinite speed — ẋ → ∞ as x → 0. This is the most interesting part of the exercise; x₀ can be raised above 0 to start past it.",
    "elevator-cable.equations.section.reference": "Reference invariants",
    "elevator-cable.equations.note.reference":
      "√(b² + x²) − (b + v₀t) ≈ 0 identically — this is how x(t) was derived, so it holds by construction. The course answer key cubes the radicand in ẋ, which is dimensionally inconsistent; the expressions above are the correct ones (its ẍ is correct).",
    "elevator-cable.equations.section.plots": "x(t), ẋ(t) and ẍ(t)",
    "elevator-cable.plot.x.title": "x(t) — position",
    "elevator-cable.plot.xdot.title": "ẋ(t) — velocity, → v₀ for large t",
    "elevator-cable.plot.xddot.title": "ẍ(t) — acceleration",
  },
  es: {
    "elevator-cable.page.canvas_aria":
      "Simulador de ascensor y polea — un carro desciende mientras un carrete desenrolla cable a velocidad constante",

    "elevator-cable.controls.section.parameters": "Parámetros",
    "elevator-cable.controls.section.visibility": "Visibilidad",
    "elevator-cable.controls.slider.b": "Desplazamiento horizontal b",
    "elevator-cable.controls.slider.v0": "Velocidad de desenrollado v₀",
    "elevator-cable.controls.slider.x0": "Posición inicial x₀",
    "elevator-cable.controls.toggle.velocity": "Indicador de velocidad",
    "elevator-cable.controls.toggle.drum": "Carrete C",
    "elevator-cable.controls.toggle.trace": "Estela del carro",
    "elevator-cable.controls.btn.reset": "Reiniciar a t = 0",
    "elevator-cable.controls.btn.pause": "Pausar",
    "elevator-cable.controls.btn.resume": "Reanudar",
    "elevator-cable.controls.warn.singular":
      "ẋ → ∞ en este instante — con el cable horizontal (x = 0), cualquier desenrollado finito exige velocidad infinita del carro.",

    "elevator-cable.metrics.heading": "Métricas en vivo",
    "elevator-cable.metrics.t": "t  (transcurrido)",
    "elevator-cable.metrics.x": "x  (posición)",
    "elevator-cable.metrics.xdot": "ẋ  (velocidad)",
    "elevator-cable.metrics.xddot": "ẍ  (aceleración)",

    "elevator-cable.legend.heading": "Leyenda",
    "elevator-cable.legend.cable": "Cable A–B",
    "elevator-cable.legend.car": "Carro (ascensor)",
    "elevator-cable.legend.drum": "Carrete C",

    "elevator-cable.equations.heading": "Ecuaciones",
    "elevator-cable.equations.section.statement": "Enunciado",
    "elevator-cable.equations.statement.text":
      "El cable se desenrolla del carrete C a v₀ constante. Hallar la velocidad y aceleración del ascensor en función del tiempo.",
    "elevator-cable.equations.section.formulas": "Fórmulas",
    "elevator-cable.equations.section.singularity":
      "Singularidad en t = 0 (x₀ = 0)",
    "elevator-cable.equations.note.singularity":
      "Con el cable horizontal, desenrollar a v₀ exigiría velocidad infinita — ẋ → ∞ cuando x → 0. Esta es la parte más interesante del ejercicio; x₀ puede aumentarse por encima de 0 para arrancar más allá de ese punto.",
    "elevator-cable.equations.section.reference": "Invariantes de referencia",
    "elevator-cable.equations.note.reference":
      "√(b² + x²) − (b + v₀t) ≈ 0 idénticamente — así es como se derivó x(t), por lo que se cumple por construcción. La clave de respuestas de la cátedra eleva al cubo el radicando en ẋ, lo cual es dimensionalmente inconsistente; las expresiones de arriba son las correctas (su ẍ sí es correcta).",
    "elevator-cable.equations.section.plots": "x(t), ẋ(t) y ẍ(t)",
    "elevator-cable.plot.x.title": "x(t) — posición",
    "elevator-cable.plot.xdot.title": "ẋ(t) — velocidad, → v₀ para t grande",
    "elevator-cable.plot.xddot.title": "ẍ(t) — aceleración",
  },
};
