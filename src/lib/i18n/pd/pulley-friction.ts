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

    "pulley-friction.symbol.applied_force": "F_theta",
    "pulley-friction.symbol.tension": "T",
    "pulley-friction.symbol.optimal_angle": "theta_opt",
    "pulley-friction.symbol.minimum_force": "F_min",

    "pulley-friction.metrics.heading": "Live Metrics",
    "pulley-friction.metrics.tension": "T  (cable tension)",
    "pulley-friction.metrics.applied_force": "F(θ)  (applied force)",
    "pulley-friction.metrics.optimal_angle": "theta_opt  (optimal pull angle)",
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
      "Block A (weight 1000 N) rests on a horizontal floor (μ = 0.25) and is connected by a cable over a pulley to block B (weight 200 N) on a 37° incline (same μ). A force F, applied to A at an angle θ above the horizontal, drags both blocks at constant velocity. Find F(θ), the angle that minimizes it, and the ratio between A's and B's velocities.",
    "pulley-friction.equations.section.theory": "Theory",
    "pulley-friction.equations.theory.tension":
      "Block B moves up the incline at constant velocity, so the net force along the slope is zero: the cable tension T balances gravity's component down the slope plus friction (which always opposes B's motion, i.e. also points down the slope here). That gives T = weightB · (sin α + μ·cos α), independent of anything happening at block A.",
    "pulley-friction.equations.theory.applied_force":
      "For block A, pulling at angle θ above the horizontal does two things at once: it reduces the normal force on the floor (part of F now supports some of A's weight), which lowers the friction A must overcome, but it also throws away a cos θ fraction of F on lifting instead of pulling. Balancing forces along and perpendicular to the floor for constant velocity gives F(θ) = (μ·weightA + T) / (cos θ + μ·sin θ) — the same functional form as the classic 'minimum force to drag a crate' problem, just with T added on top of A's own friction debt.",
    "pulley-friction.equations.theory.optimal":
      "Minimizing F(θ) over θ (setting dF/dθ = 0) gives the same clean result as that classic problem: θ_opt = arctan(μ), regardless of the weights or T. At that angle the denominator cos θ + μ·sin θ reaches its maximum value √(1+μ²), so F_min = (μ·weightA + T) / √(1+μ²).",
    "pulley-friction.equations.theory.velocity_ratio":
      "The cable is inextensible and runs over a single fixed pulley — a 1:1 redirection, not a mechanical-advantage system — so the speed at which cable is paid out on A's side must equal the speed it's taken up on B's side. The two blocks therefore move at exactly the same speed at every instant: v_A = v_B.",
    "pulley-friction.equations.section.formulas": "Formulas",
    "pulley-friction.equations.section.reference": "Reference (default values)",
    "pulley-friction.equations.note.reference":
      "T = 200 N × (sin 37° + 0.25·cos 37°) ≈ 160.3 N.\n" +
      "θ_opt = arctan(0.25) ≈ 14.0°, giving F_min ≈ 398.0 N.\n" +
      "v_A = v_B at every instant.",
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

    "pulley-friction.symbol.applied_force": "F_theta",
    "pulley-friction.symbol.tension": "T",
    "pulley-friction.symbol.optimal_angle": "theta_opt",
    "pulley-friction.symbol.minimum_force": "F_min",

    "pulley-friction.metrics.heading": "Métricas en vivo",
    "pulley-friction.metrics.tension": "T  (tensión del cable)",
    "pulley-friction.metrics.applied_force": "F(θ)  (fuerza aplicada)",
    "pulley-friction.metrics.optimal_angle": "theta_opt  (ángulo óptimo de tiro)",
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
      "El bloque A (peso 1000 N) descansa sobre un piso horizontal (μ = 0,25) y está conectado mediante un cable, a través de una polea, al bloque B (peso 200 N) sobre un plano inclinado a 37° (mismo μ). Una fuerza F, aplicada a A con un ángulo θ sobre la horizontal, arrastra a ambos bloques a velocidad constante. Hallar F(θ), el ángulo que la minimiza y la relación entre las velocidades de A y B.",
    "pulley-friction.equations.section.theory": "Teoría",
    "pulley-friction.equations.theory.tension":
      "El bloque B sube por el plano a velocidad constante, así que la fuerza neta a lo largo de la pendiente es nula: la tensión del cable T equilibra la componente del peso hacia abajo del plano más la fricción (que siempre se opone al movimiento de B, es decir, también apunta hacia abajo del plano aquí). Eso da T = pesoB · (sen α + μ·cos α), independiente de lo que ocurra en el bloque A.",
    "pulley-friction.equations.theory.applied_force":
      "Para el bloque A, tirar con un ángulo θ sobre la horizontal hace dos cosas a la vez: reduce la fuerza normal sobre el piso (parte de F ahora sostiene algo del peso de A), lo que disminuye la fricción que A debe superar, pero también desperdicia una fracción cos θ de F en levantar en lugar de tirar. Equilibrando fuerzas a lo largo y perpendicular al piso para velocidad constante se obtiene F(θ) = (μ·pesoA + T) / (cos θ + μ·sen θ) — la misma forma funcional que el problema clásico de la 'fuerza mínima para arrastrar un cajón', solo que con T sumada a la deuda de fricción propia de A.",
    "pulley-friction.equations.theory.optimal":
      "Minimizar F(θ) respecto a θ (haciendo dF/dθ = 0) da el mismo resultado limpio que ese problema clásico: θ_opt = arctan(μ), sin importar los pesos ni T. En ese ángulo el denominador cos θ + μ·sen θ alcanza su valor máximo √(1+μ²), así que F_min = (μ·pesoA + T) / √(1+μ²).",
    "pulley-friction.equations.theory.velocity_ratio":
      "El cable es inextensible y pasa por una única polea fija — una simple redirección 1:1, no un sistema con ventaja mecánica — así que la velocidad con que se libera cable del lado de A debe igualar la velocidad con que se recoge del lado de B. Los dos bloques se mueven entonces exactamente a la misma velocidad en todo instante: v_A = v_B.",
    "pulley-friction.equations.section.formulas": "Fórmulas",
    "pulley-friction.equations.section.reference": "Referencia (valores por defecto)",
    "pulley-friction.equations.note.reference":
      "T = 200 N × (sen 37° + 0,25·cos 37°) ≈ 160,3 N.\n" +
      "θ_opt = arctan(0,25) ≈ 14,0°, con F_min ≈ 398,0 N.\n" +
      "v_A = v_B en todo instante.",
  },
};
