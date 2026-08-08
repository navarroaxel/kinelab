export const pulleyFriction = {
  en: {
    "pulley-friction.page.canvas_aria":
      "Pulley-and-friction simulator — block A dragged across the flat while block B is hauled up an incline via a shared cable",

    "pulley-friction.controls.section.blocks": "Blocks",
    "pulley-friction.controls.section.geometry": "Geometry",
    "pulley-friction.controls.section.visibility": "Visibility",
    "pulley-friction.controls.slider.weight_a": "Weight of A",
    "pulley-friction.controls.slider.weight_b": "Weight of B",
    "pulley-friction.controls.slider.friction": "Friction coefficient μ",
    "pulley-friction.controls.slider.incline_angle": "Incline angle α",
    "pulley-friction.controls.slider.pull_angle": "Pull angle θ",
    "pulley-friction.controls.toggle.blocks": "Blocks & cable",
    "pulley-friction.controls.toggle.force_sweep": "Force diagram",
    "pulley-friction.controls.btn.reset": "Reset",
    "pulley-friction.controls.btn.pause": "Pause",
    "pulley-friction.controls.btn.resume": "Resume",
    "pulley-friction.controls.btn.set_optimal": "Set θ to optimum",

    "pulley-friction.canvas.block_a": "A",
    "pulley-friction.canvas.block_b": "B",
    "pulley-friction.canvas.force": "F",
    "pulley-friction.canvas.tension": "T",
    "pulley-friction.canvas.friction": "f",

    "pulley-friction.symbol.applied_force": "F(θ)",
    "pulley-friction.symbol.tension": "T",
    "pulley-friction.symbol.optimal_angle": "θ_opt",
    "pulley-friction.symbol.minimum_force": "F_min",
    "pulley-friction.equations.formula.velocity_note": "(movable pulley on A)",

    "pulley-friction.metrics.heading": "Live Metrics",
    "pulley-friction.metrics.tension": "T  (cable tension)",
    "pulley-friction.metrics.applied_force": "F(θ)  (applied force)",
    "pulley-friction.metrics.optimal_angle": "θ_opt  (optimal pull angle)",
    "pulley-friction.metrics.minimum_force": "F_min  (minimum applied force)",

    "pulley-friction.legend.heading": "Legend",
    "pulley-friction.legend.block_a": "Block A (dragged, angle θ pull)",
    "pulley-friction.legend.block_b": "Block B (hauled up the incline)",
    "pulley-friction.legend.force": "Applied force F",
    "pulley-friction.legend.tension": "Cable tension T",
    "pulley-friction.legend.cable": "Cable over the pulley",

    "pulley-friction.equations.heading": "Equations",
    "pulley-friction.equations.section.statement": "Statement",
    "pulley-friction.equations.statement.text":
      "Block A (weight 1000 N) rests on a horizontal floor (μ = 0.25) and is hitched to a movable pulley; the cable runs from block B (weight 200 N, on a 37° incline, same μ) over two fixed pulleys, around A's movable pulley, and back to a fixed anchor point. A force F, applied to A at an angle θ above the horizontal, drags both blocks at constant velocity. Find F(θ), the angle that minimizes it, and the ratio between A's and B's velocities.",
    "pulley-friction.equations.section.theory": "Theory",
    "pulley-friction.equations.theory.tension":
      "Block B moves up the incline at constant velocity, so the net force along the slope is zero: the cable tension T balances gravity's component down the slope plus friction (which always opposes B's motion, i.e. also points down the slope here). That gives T = P_B · (sin α + μ·cos α), independent of anything happening at block A.",
    "pulley-friction.equations.theory.applied_force":
      "For block A, pulling at angle θ above the horizontal does two things at once: it reduces the normal force on the floor (part of F now supports some of A's weight), which lowers the friction A must overcome, but it also throws away a cos θ fraction of F on lifting instead of pulling. Balancing forces along and perpendicular to the floor for constant velocity gives F(θ) = (μ·P_A + 2T) / (cos θ + μ·sin θ) — the same functional form as the classic 'minimum force to drag a crate' problem, just with the movable pulley's 2T added on top of A's own friction debt.",
    "pulley-friction.equations.theory.optimal":
      "Minimizing F(θ) over θ (setting dF/dθ = 0) gives the same clean result as that classic problem: θ_opt = arctan(μ), regardless of the weights or T. At that angle the denominator cos θ + μ·sin θ reaches its maximum value √(1+μ²), so F_min = (μ·P_A + 2T) / √(1+μ²).",
    "pulley-friction.equations.theory.velocity_ratio":
      "Block A is hitched to a movable pulley, not tied directly to the cable: the same cable runs from B, over two fixed pulleys, around A's pulley, and back to a fixed anchor point, so TWO parallel cable segments — each at the same tension T — pull on A's pulley at once, doubling the force it feels to 2T. That mechanical advantage cuts both ways: for A's pulley to advance a distance d, BOTH of its segments must shorten by d, pulling 2d of cable through the fixed anchor — which is exactly the distance B travels. So v_B = 2·v_A at every instant: A moves at half of B's speed.",
    "pulley-friction.equations.section.formulas": "Formulas",
    "pulley-friction.equations.section.reference": "Reference (default values)",
    "pulley-friction.equations.note.reference":
      "T = 200 N × (sin 37° + 0.25·cos 37°) ≈ 160.3 N, so A's pulley feels 2T ≈ 320.6 N.\n" +
      "θ_opt = arctan(0.25) ≈ 14.0°, giving F_min ≈ 553.6 N.\n" +
      "v_B = 2·v_A at every instant.",
  },
  es: {
    "pulley-friction.page.canvas_aria":
      "Simulador de poleas y rozamiento — bloque A arrastrado sobre el piso mientras el bloque B es izado por un plano inclinado con un cable compartido",

    "pulley-friction.controls.section.blocks": "Bloques",
    "pulley-friction.controls.section.geometry": "Geometría",
    "pulley-friction.controls.section.visibility": "Visibilidad",
    "pulley-friction.controls.slider.weight_a": "Peso de A",
    "pulley-friction.controls.slider.weight_b": "Peso de B",
    "pulley-friction.controls.slider.friction": "Coeficiente de fricción μ",
    "pulley-friction.controls.slider.incline_angle": "Ángulo del plano α",
    "pulley-friction.controls.slider.pull_angle": "Ángulo de tiro θ",
    "pulley-friction.controls.toggle.blocks": "Bloques y cable",
    "pulley-friction.controls.toggle.force_sweep": "Diagrama de fuerzas",
    "pulley-friction.controls.btn.reset": "Reiniciar",
    "pulley-friction.controls.btn.pause": "Pausar",
    "pulley-friction.controls.btn.resume": "Reanudar",
    "pulley-friction.controls.btn.set_optimal": "Fijar θ al óptimo",

    "pulley-friction.canvas.block_a": "A",
    "pulley-friction.canvas.block_b": "B",
    "pulley-friction.canvas.force": "F",
    "pulley-friction.canvas.tension": "T",
    "pulley-friction.canvas.friction": "f",

    "pulley-friction.symbol.applied_force": "F(θ)",
    "pulley-friction.symbol.tension": "T",
    "pulley-friction.symbol.optimal_angle": "θ_opt",
    "pulley-friction.symbol.minimum_force": "F_min",
    "pulley-friction.equations.formula.velocity_note": "(polea móvil en A)",

    "pulley-friction.metrics.heading": "Métricas en vivo",
    "pulley-friction.metrics.tension": "T  (tensión del cable)",
    "pulley-friction.metrics.applied_force": "F(θ)  (fuerza aplicada)",
    "pulley-friction.metrics.optimal_angle": "θ_opt  (ángulo óptimo de tiro)",
    "pulley-friction.metrics.minimum_force": "F_min  (fuerza aplicada mínima)",

    "pulley-friction.legend.heading": "Leyenda",
    "pulley-friction.legend.block_a": "Bloque A (arrastrado, tiro a ángulo θ)",
    "pulley-friction.legend.block_b": "Bloque B (izado por el plano)",
    "pulley-friction.legend.force": "Fuerza aplicada F",
    "pulley-friction.legend.tension": "Tensión del cable T",
    "pulley-friction.legend.cable": "Cable sobre la polea",

    "pulley-friction.equations.heading": "Ecuaciones",
    "pulley-friction.equations.section.statement": "Enunciado",
    "pulley-friction.equations.statement.text":
      "El bloque A (peso 1000 N) descansa sobre un piso horizontal (μ = 0,25) y está sujeto a una polea móvil; el cable va desde el bloque B (peso 200 N, sobre un plano inclinado a 37°, mismo μ) sobre dos poleas fijas, alrededor de la polea móvil de A, y vuelve a un punto fijo. Una fuerza F, aplicada a A con un ángulo θ sobre la horizontal, arrastra a ambos bloques a velocidad constante. Hallar F(θ), el ángulo que la minimiza y la relación entre las velocidades de A y B.",
    "pulley-friction.equations.section.theory": "Teoría",
    "pulley-friction.equations.theory.tension":
      "El bloque B sube por el plano a velocidad constante, así que la fuerza neta a lo largo de la pendiente es nula: la tensión del cable T equilibra la componente del peso hacia abajo del plano más la fricción (que siempre se opone al movimiento de B, es decir, también apunta hacia abajo del plano aquí). Eso da T = P_B · (sen α + μ·cos α), independiente de lo que ocurra en el bloque A.",
    "pulley-friction.equations.theory.applied_force":
      "Para el bloque A, tirar con un ángulo θ sobre la horizontal hace dos cosas a la vez: reduce la fuerza normal sobre el piso (parte de F ahora sostiene algo del peso de A), lo que disminuye la fricción que A debe superar, pero también desperdicia una fracción cos θ de F en levantar en lugar de tirar. Equilibrando fuerzas a lo largo y perpendicular al piso para velocidad constante se obtiene F(θ) = (μ·P_A + 2T) / (cos θ + μ·sen θ) — la misma forma funcional que el problema clásico de la 'fuerza mínima para arrastrar un cajón', solo que con el 2T de la polea móvil sumado a la deuda de fricción propia de A.",
    "pulley-friction.equations.theory.optimal":
      "Minimizar F(θ) respecto a θ (haciendo dF/dθ = 0) da el mismo resultado limpio que ese problema clásico: θ_opt = arctan(μ), sin importar los pesos ni T. En ese ángulo el denominador cos θ + μ·sen θ alcanza su valor máximo √(1+μ²), así que F_min = (μ·P_A + 2T) / √(1+μ²).",
    "pulley-friction.equations.theory.velocity_ratio":
      "El bloque A está sujeto a una polea móvil, no atado directamente al cable: el mismo cable va desde B, sobre dos poleas fijas, alrededor de la polea de A, y vuelve a un punto fijo — así que DOS tramos paralelos del cable, cada uno con la misma tensión T, tiran a la vez de la polea de A, duplicando la fuerza que siente a 2T. Esa ventaja mecánica funciona en ambos sentidos: para que la polea de A avance una distancia d, sus dos tramos deben acortarse cada uno en d, liberando 2d de cable a través del punto fijo — que es exactamente la distancia que recorre B. Entonces v_B = 2·v_A en todo instante: A se mueve a la mitad de la velocidad de B.",
    "pulley-friction.equations.section.formulas": "Fórmulas",
    "pulley-friction.equations.section.reference": "Referencia (valores por defecto)",
    "pulley-friction.equations.note.reference":
      "T = 200 N × (sen 37° + 0,25·cos 37°) ≈ 160,3 N, por lo que la polea de A siente 2T ≈ 320,6 N.\n" +
      "θ_opt = arctan(0,25) ≈ 14,0°, con F_min ≈ 553,6 N.\n" +
      "v_B = 2·v_A en todo instante.",
  },
};
