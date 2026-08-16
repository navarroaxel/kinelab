export const bankedCurve = {
  en: {
    "bc.title": "Banked Curve with Friction (3D)",
    "bc.page.canvas_aria":
      "Banked curve simulator — a car rounding a banked circular track, with its free body drawn in an orbitable 3D view",

    "bc.controls.section.driving": "Driving",
    "bc.controls.section.track": "Track",
    "bc.controls.section.car": "Car",
    "bc.controls.section.visibility": "Visibility",
    "bc.controls.slider.speed": "v — constant speed",
    "bc.controls.slider.bank": "θ — bank angle",
    "bc.controls.slider.radius": "ρ — radius of curvature",
    "bc.controls.slider.mu": "μs — static friction coefficient",
    "bc.controls.slider.mass": "m — mass of the car",
    "bc.controls.btn.v_min": "v min",
    "bc.controls.btn.v_ideal": "v ideal",
    "bc.controls.btn.v_max": "v max",
    "bc.controls.hint.mass":
      "Watch the speed limits while you drag this: they do not move. Only the forces do.",
    "bc.controls.toggle.forces": "Free body at the tyres (N, W, f)",
    "bc.controls.toggle.net": "Resultant m·v²/ρ",
    "bc.controls.toggle.track": "Road surface",
    "bc.controls.toggle.path": "Circular path",
    "bc.controls.toggle.axes": "Centre and vertical axis",
    "bc.controls.btn.reset_camera": "Reset camera",
    "bc.controls.btn.reset": "Reset",
    "bc.controls.btn.pause": "Pause",
    "bc.controls.btn.resume": "Resume",
    "bc.controls.hint.drag":
      "Drag the canvas to orbit — flatten the camera to read the bank as a cross-section.",

    "bc.canvas.normal": "N",
    "bc.canvas.weight": "W",
    "bc.canvas.friction": "f",
    "bc.canvas.net": "m·v²/ρ",
    "bc.canvas.centre": "O",
    "bc.canvas.slip_up": "Too fast — the car slides up the bank",
    "bc.canvas.slip_down": "Too slow — the car slides down the bank",

    "bc.metrics.heading": "Live Metrics",
    "bc.metrics.speed": "v  (speed)",
    "bc.metrics.speed_kmh": "v",
    "bc.metrics.normal": "N  (normal force)",
    "bc.metrics.friction": "f  (+ down the slope)",
    "bc.metrics.mu_required": "μ_req  (needed / available)",
    "bc.metrics.net": "m·v²/ρ  (resultant)",
    "bc.metrics.answer_heading": "Answer",
    "bc.metrics.min": "v_min  (13-54)",
    "bc.metrics.max": "v_max  (13-53)",
    "bc.metrics.unbounded": "no upper limit",
    "bc.metrics.slip_up":
      "Above v_max: the road would need more friction than μs to stop the car climbing the bank.",
    "bc.metrics.slip_down":
      "Below v_min: the road would need more friction than μs to stop the car sliding down the bank.",

    "bc.legend.heading": "Legend",
    "bc.legend.normal": "N — normal force, perpendicular to the road",
    "bc.legend.weight": "W = m·g — weight",
    "bc.legend.friction": "f — friction, along the road surface",
    "bc.legend.net": "m·v²/ρ — the resultant, horizontal toward the centre",
    "bc.legend.path": "The car's horizontal circular path",

    "bc.equations.heading": "Equations",
    "bc.equations.section.statement": "Statement",
    "bc.equations.statement.text":
      "13-53 — The sports car has a mass of 1700 kg and travels horizontally along a 20° banked track which is circular and has a radius of curvature ρ = 100 m. If the coefficient of static friction between the tyres and the track is μs = 0.2, determine the maximum constant speed at which the car can travel without sliding up the slope. Neglect the size of the car. 13-54 — With the same data, determine the minimum speed at which the car can travel around the track without sliding down the slope.",
    "bc.equations.section.theory": "Theory",
    "bc.equations.theory.axes":
      "The car goes round a *horizontal* circle, so despite the bank there is no vertical acceleration at all and the acceleration is purely centripetal, m·v²/ρ pointing at the centre. That picks the two axes for you: one horizontal toward the centre, one vertical. Resolving N and f on those two axes and solving the pair gives N = m·(g·cos θ + (v²/ρ)·sen θ) and f = m·((v²/ρ)·cos θ − g·sen θ), where f is counted positive down the slope.",
    "bc.equations.theory.mass":
      "Both of those scale with m, so their ratio does not: the coefficient the road must actually supply, μ_req = f/N, is completely independent of the car. The 1700 kg in the statement never reaches the answer — it only sets how big the forces are. Drag the mass slider and watch the two speed limits refuse to move.",
    "bc.equations.theory.limits":
      "There is a speed where the bank alone does the whole job — v_ideal = √(ρ·g·tan θ), the point where f = 0 and the friction arrow disappears. Above it the car tends to climb and friction must hold it down; below it the car tends to slide in and friction must hold it up. Setting f = ±μN and solving for v gives the two limits, and the answer to both parts of the exercise is just those two roots.",
    "bc.equations.theory.degenerate":
      "Two edges fall straight out of those formulas. Once μ ≥ tan θ there is no minimum at all: friction alone holds the car parked on the bank, and v_min drops to zero. And once μ ≥ cot θ the denominator of v_max vanishes — no speed is too fast, because the faster you go the harder the road presses back. Both are reachable with the sliders.",
    "bc.equations.section.formulas": "Formulas",
    "bc.equations.section.reference": "Reference (statement values)",
    "bc.equations.note.reference":
      "tan 20° = 0.3640,   ρ·g = 100 × 9.81 = 981 m²/s².\n" +
      "v_max = √( 981 × (0.3640 + 0.2) / (1 − 0.2 × 0.3640) ) = √596.7 = 24.4 m/s  (88 km/h).\n" +
      "v_min = √( 981 × (0.3640 − 0.2) / (1 + 0.2 × 0.3640) ) = √149.9 = 12.2 m/s  (44 km/h).\n" +
      "v_ideal = √( 981 × 0.3640 ) = 18.9 m/s  (68 km/h), where no friction is needed at all.",
    "bc.equations.section.plot": "Friction the road has to supply",
    "bc.equations.plot.note":
      "μ_req(v) = f/N, the coefficient the road must deliver at each speed — the same curve for any mass. The safe band is where it stays between ±μs, and the two crossings are exactly v_min and v_max. The solid vertical line is the speed you are driving at.",
    "bc.plot.mu.title":
      "μ_req(v) — friction coefficient the road must supply, against speed",
  },
  es: {
    "bc.title": "Curva Peraltada con Fricción (3D)",
    "bc.page.canvas_aria":
      "Simulador de curva peraltada — un auto recorriendo una pista circular peraltada, con su diagrama de cuerpo libre en una vista 3D orbitable",

    "bc.controls.section.driving": "Marcha",
    "bc.controls.section.track": "Pista",
    "bc.controls.section.car": "Auto",
    "bc.controls.section.visibility": "Visibilidad",
    "bc.controls.slider.speed": "v — rapidez constante",
    "bc.controls.slider.bank": "θ — ángulo de peralte",
    "bc.controls.slider.radius": "ρ — radio de curvatura",
    "bc.controls.slider.mu": "μs — coeficiente de fricción estática",
    "bc.controls.slider.mass": "m — masa del auto",
    "bc.controls.btn.v_min": "v mín",
    "bc.controls.btn.v_ideal": "v ideal",
    "bc.controls.btn.v_max": "v máx",
    "bc.controls.hint.mass":
      "Mirá los límites de rapidez mientras movés esto: no se mueven. Solo cambian las fuerzas.",
    "bc.controls.toggle.forces": "Cuerpo libre en las llantas (N, P, f)",
    "bc.controls.toggle.net": "Resultante m·v²/ρ",
    "bc.controls.toggle.track": "Superficie de la pista",
    "bc.controls.toggle.path": "Trayectoria circular",
    "bc.controls.toggle.axes": "Centro y eje vertical",
    "bc.controls.btn.reset_camera": "Reiniciar cámara",
    "bc.controls.btn.reset": "Reiniciar",
    "bc.controls.btn.pause": "Pausar",
    "bc.controls.btn.resume": "Reanudar",
    "bc.controls.hint.drag":
      "Arrastrá el lienzo para orbitar — bajá la cámara para leer el peralte como un corte transversal.",

    "bc.canvas.normal": "N",
    "bc.canvas.weight": "P",
    "bc.canvas.friction": "f",
    "bc.canvas.net": "m·v²/ρ",
    "bc.canvas.centre": "O",
    "bc.canvas.slip_up": "Demasiado rápido — el auto se desliza cuesta arriba",
    "bc.canvas.slip_down": "Demasiado lento — el auto se desliza cuesta abajo",

    "bc.metrics.heading": "Métricas en vivo",
    "bc.metrics.speed": "v  (rapidez)",
    "bc.metrics.speed_kmh": "v",
    "bc.metrics.normal": "N  (fuerza normal)",
    "bc.metrics.friction": "f  (+ cuesta abajo)",
    "bc.metrics.mu_required": "μ_req  (necesario / disponible)",
    "bc.metrics.net": "m·v²/ρ  (resultante)",
    "bc.metrics.answer_heading": "Respuesta",
    "bc.metrics.min": "v_min  (13-54)",
    "bc.metrics.max": "v_max  (13-53)",
    "bc.metrics.unbounded": "sin límite superior",
    "bc.metrics.slip_up":
      "Por encima de v_max: la pista necesitaría más fricción que μs para impedir que el auto trepe el peralte.",
    "bc.metrics.slip_down":
      "Por debajo de v_min: la pista necesitaría más fricción que μs para impedir que el auto se deslice cuesta abajo.",

    "bc.legend.heading": "Leyenda",
    "bc.legend.normal": "N — fuerza normal, perpendicular a la pista",
    "bc.legend.weight": "P = m·g — peso",
    "bc.legend.friction": "f — fricción, sobre la superficie de la pista",
    "bc.legend.net": "m·v²/ρ — la resultante, horizontal hacia el centro",
    "bc.legend.path": "La trayectoria circular horizontal del auto",

    "bc.equations.heading": "Ecuaciones",
    "bc.equations.section.statement": "Enunciado",
    "bc.equations.statement.text":
      "13-53 — La masa del auto deportivo es de 1700 kg y viaja horizontalmente a lo largo de una pista inclinada 20° la cual es circular y tiene un radio de curvatura ρ = 100 m. Si el coeficiente de fricción estática entre las llantas y la pista es μs = 0,2, determine la rapidez máxima constante a la cual puede viajar el automóvil sin que se deslice cuesta arriba. Ignore el tamaño del auto. 13-54 — Con los mismos datos, determine la rapidez mínima a que el automóvil puede circular alrededor de la pista sin que se deslice cuesta abajo.",
    "bc.equations.section.theory": "Teoría",
    "bc.equations.theory.axes":
      "El auto recorre una circunferencia *horizontal*, así que a pesar del peralte no hay ninguna aceleración vertical y la aceleración es puramente centrípeta, m·v²/ρ apuntando al centro. Eso elige los dos ejes por vos: uno horizontal hacia el centro y otro vertical. Descomponiendo N y f en esos dos ejes y resolviendo el par se obtiene N = m·(g·cos θ + (v²/ρ)·sen θ) y f = m·((v²/ρ)·cos θ − g·sen θ), con f contada positiva cuesta abajo.",
    "bc.equations.theory.mass":
      "Las dos escalan con m, así que su cociente no: el coeficiente que la pista realmente tiene que aportar, μ_req = f/N, es completamente independiente del auto. Los 1700 kg del enunciado nunca llegan a la respuesta — solo fijan cuán grandes son las fuerzas. Movés el slider de masa y los dos límites de rapidez se niegan a moverse.",
    "bc.equations.theory.limits":
      "Hay una rapidez donde el peralte hace todo el trabajo solo — v_ideal = √(ρ·g·tan θ), el punto donde f = 0 y la flecha de fricción desaparece. Por encima el auto tiende a trepar y la fricción tiene que retenerlo; por debajo tiende a caer hacia adentro y la fricción tiene que sostenerlo. Poniendo f = ±μN y despejando v salen los dos límites, y la respuesta a las dos partes del ejercicio son justamente esas dos raíces.",
    "bc.equations.theory.degenerate":
      "Dos casos límite salen directo de esas fórmulas. Cuando μ ≥ tan θ ya no hay mínimo: la fricción sola sostiene al auto detenido sobre el peralte y v_min cae a cero. Y cuando μ ≥ cot θ el denominador de v_max se anula — ninguna rapidez es demasiado, porque cuanto más rápido vas más fuerte te aprieta la pista. Ambos se alcanzan con los sliders.",
    "bc.equations.section.formulas": "Fórmulas",
    "bc.equations.section.reference": "Referencia (valores del enunciado)",
    "bc.equations.note.reference":
      "tan 20° = 0,3640,   ρ·g = 100 × 9,81 = 981 m²/s².\n" +
      "v_max = √( 981 × (0,3640 + 0,2) / (1 − 0,2 × 0,3640) ) = √596,7 = 24,4 m/s  (88 km/h).\n" +
      "v_min = √( 981 × (0,3640 − 0,2) / (1 + 0,2 × 0,3640) ) = √149,9 = 12,2 m/s  (44 km/h).\n" +
      "v_ideal = √( 981 × 0,3640 ) = 18,9 m/s  (68 km/h), donde no hace falta nada de fricción.",
    "bc.equations.section.plot": "Fricción que la pista tiene que aportar",
    "bc.equations.plot.note":
      "μ_req(v) = f/N, el coeficiente que la pista debe entregar a cada rapidez — la misma curva para cualquier masa. La banda segura es donde se mantiene entre ±μs, y los dos cruces son exactamente v_min y v_max. La línea vertical llena es la rapidez a la que estás yendo.",
    "bc.plot.mu.title":
      "μ_req(v) — coeficiente de fricción que la pista debe aportar, en función de la rapidez",
  },
};
