export const parabolicSpring = {
  en: {
    "ps.title": "Block on a Parabolic Path with a Spring",
    "ps.page.canvas_aria":
      "Parabolic path simulator — a block sliding on a smooth parabola, held by a horizontal spring, with its free body drawn at the contact point",

    "ps.controls.section.instant": "Instant",
    "ps.controls.section.path": "Path",
    "ps.controls.section.spring": "Spring and block",
    "ps.controls.section.visibility": "Visibility",
    "ps.controls.slider.start_x": "x at t = 0",
    "ps.controls.slider.start_speed": "v at t = 0",
    "ps.controls.slider.vertex": "a — height of the vertex",
    "ps.controls.slider.curvature": "b — how sharply the path falls",
    "ps.controls.slider.stiffness": "k — spring stiffness",
    "ps.controls.slider.natural_length": "L₀ — unstretched length",
    "ps.controls.slider.mass": "m — mass of the block",
    "ps.controls.btn.statement": "Statement instant (x = 1 m, v = 4 m/s)",
    "ps.controls.toggle.weight": "Weight W",
    "ps.controls.toggle.spring_force": "Spring force F_s",
    "ps.controls.toggle.normal": "Normal force N",
    "ps.controls.toggle.tangential": "Resultant along the path (m·v̇)",
    "ps.controls.toggle.frame": "t̂ / n̂ unit vectors",
    "ps.controls.toggle.curvature": "Osculating circle (ρ)",
    "ps.controls.toggle.spring": "Spring, anchor B and roller guide",
    "ps.controls.btn.reset": "Reset",
    "ps.controls.btn.play": "Play",
    "ps.controls.btn.pause": "Pause",

    "ps.canvas.weight": "W",
    "ps.canvas.spring": "F_s",
    "ps.canvas.normal": "N",
    "ps.canvas.tangential": "m·v̇",
    "ps.canvas.anchor": "B",
    "ps.canvas.block": "A",
    "ps.canvas.tangent": "t",
    "ps.canvas.normal_dir": "n",
    "ps.canvas.contact_lost": "N < 0 — the block would leave the path",

    "ps.metrics.heading": "Live Metrics",
    "ps.metrics.x": "x",
    "ps.metrics.y": "y",
    "ps.metrics.speed": "v  (speed)",
    "ps.metrics.incline": "path inclination",
    "ps.metrics.rho": "ρ  (radius of curvature)",
    "ps.metrics.spring": "F_s  (spring force)",
    "ps.metrics.answer_heading": "Answer",
    "ps.metrics.normal": "N  (normal force)",
    "ps.metrics.tangential": "v̇  (rate of increase of speed)",
    "ps.metrics.contact_lost":
      "The path can only push, so a negative N means the block would fly off rather than be held on. Below this speed the model stops describing the motion.",

    "ps.legend.heading": "Legend",
    "ps.legend.path": "The smooth parabolic path y = a − b·x²",
    "ps.legend.weight": "W = m·g — weight of the block",
    "ps.legend.spring": "F_s = k·(x − L₀) — spring force, always horizontal",
    "ps.legend.normal": "N — normal force from the path",
    "ps.legend.tangential": "m·v̇ — the resultant along the path",
    "ps.legend.curvature": "Osculating circle — its radius is ρ",

    "ps.equations.heading": "Equations",
    "ps.equations.section.statement": "Statement",
    "ps.equations.statement.text":
      "Hibbeler, Engineering Mechanics: Dynamics — problem 13-74. The 6 kg block can move only along the smooth parabolic path. The attached spring limits the motion and, because of the roller guide, always remains horizontal as the block descends. If the stiffness of the spring is k = 10 N/m and its unstretched length is 0.5 m, determine the normal force of the path on the block at the instant x = 1 m, when the speed of the block is 4 m/s. Also, what is the rate of increase of the block's speed at this point? Neglect the mass of the roller and the spring.",
    "ps.equations.section.theory": "Theory",
    "ps.equations.theory.frame":
      "The block is stuck to a curve, so the natural axes are the curve's own: t̂ along the path and n̂ toward the centre of curvature. Both are read straight off y(x) — t̂ = (1, y′)/√(1+y′²) and n̂ = (y′, −1)/√(1+y′²) — and so is the radius of curvature, ρ = (1+y′²)^(3/2)/|y″|. At x = 1 the slope is −1, so the path runs 45° downhill and ρ = 2√2 m.",
    "ps.equations.theory.spring":
      "The roller guide is what makes the spring easy: it keeps the spring horizontal, so its length is just x and its stretch is x − L₀ — no geometry to work out. At x = 1 m that is a 0.5 m stretch and a 5 N pull back toward B. Note it can also be *compressed*: for x < L₀ the spring pushes the block outward instead, which is what gets it moving at all if you start it near the vertex.",
    "ps.equations.theory.decouple":
      "Because the path is smooth, N is perpendicular to the motion and does no work — it never appears in the tangential equation. That splits the problem cleanly in two: ΣF_t = m·v̇ gives the rate of increase of speed from the weight and the spring alone, and ΣF_n = m·v²/ρ then gives N. Notice v̇ comes out a function of position only; the 4 m/s in the statement is needed for N and for nothing else.",
    "ps.equations.theory.liftoff":
      "The path can only push the block, never pull it. N = applied·n̂ − m·v²/ρ falls as v², so above a certain speed it would have to go negative — meaning the block flies off the curve instead of following it. Wind the starting speed up and the simulator says so rather than plotting a force the surface could not exert.",
    "ps.equations.section.formulas": "Formulas",
    "ps.equations.section.reference": "Reference (statement instant)",
    "ps.equations.note.reference":
      "At x = 1 m:  y = 1.5 m,  y′ = −1,  y″ = −1,  ρ = 2√2 = 2.828 m.\n" +
      "Spring:  stretch = 1 − 0.5 = 0.5 m,  F_s = 10 × 0.5 = 5 N toward B.\n" +
      "Tangential:  m·v̇ = W·sin 45° − F_s·cos 45° = (58.86 − 5)/√2 = 38.09 N  →  v̇ = 6.35 m/s².\n" +
      "Normal:  (W + F_s)/√2 − N = m·v²/ρ  →  45.16 − N = 6 × 16 / 2.828 = 33.94\n" +
      "N = 11.2 N.",
    "ps.equations.section.plot": "Normal force along the descent",
    "ps.equations.plot.note":
      "N(x) over the whole path, with the speed at each point taken from energy conservation starting at the chosen instant — so this is the force the block will actually feel on the way down, not a fixed-speed sweep. Where the curve dips below zero the block would leave the path. The solid vertical line is where the block is now.",
    "ps.plot.normal.title":
      "N(x) — normal force along the path, speeds from energy conservation",
  },
  es: {
    "ps.title": "Bloque en Trayectoria Parabólica con Resorte",
    "ps.page.canvas_aria":
      "Simulador de trayectoria parabólica — un bloque deslizando sobre una parábola lisa, sujeto por un resorte horizontal, con su diagrama de cuerpo libre en el punto de contacto",

    "ps.controls.section.instant": "Instante",
    "ps.controls.section.path": "Trayectoria",
    "ps.controls.section.spring": "Resorte y bloque",
    "ps.controls.section.visibility": "Visibilidad",
    "ps.controls.slider.start_x": "x en t = 0",
    "ps.controls.slider.start_speed": "v en t = 0",
    "ps.controls.slider.vertex": "a — altura del vértice",
    "ps.controls.slider.curvature": "b — cuán rápido cae la trayectoria",
    "ps.controls.slider.stiffness": "k — rigidez del resorte",
    "ps.controls.slider.natural_length": "L₀ — longitud no alargada",
    "ps.controls.slider.mass": "m — masa del bloque",
    "ps.controls.btn.statement": "Instante del enunciado (x = 1 m, v = 4 m/s)",
    "ps.controls.toggle.weight": "Peso P",
    "ps.controls.toggle.spring_force": "Fuerza del resorte F_s",
    "ps.controls.toggle.normal": "Fuerza normal N",
    "ps.controls.toggle.tangential": "Resultante sobre la trayectoria (m·v̇)",
    "ps.controls.toggle.frame": "Versores t̂ / n̂",
    "ps.controls.toggle.curvature": "Círculo osculador (ρ)",
    "ps.controls.toggle.spring": "Resorte, anclaje B y guía de rodillo",
    "ps.controls.btn.reset": "Reiniciar",
    "ps.controls.btn.play": "Reproducir",
    "ps.controls.btn.pause": "Pausar",

    "ps.canvas.weight": "P",
    "ps.canvas.spring": "F_s",
    "ps.canvas.normal": "N",
    "ps.canvas.tangential": "m·v̇",
    "ps.canvas.anchor": "B",
    "ps.canvas.block": "A",
    "ps.canvas.tangent": "t",
    "ps.canvas.normal_dir": "n",
    "ps.canvas.contact_lost":
      "N < 0 — el bloque se despegaría de la trayectoria",

    "ps.metrics.heading": "Métricas en vivo",
    "ps.metrics.x": "x",
    "ps.metrics.y": "y",
    "ps.metrics.speed": "v  (rapidez)",
    "ps.metrics.incline": "inclinación de la trayectoria",
    "ps.metrics.rho": "ρ  (radio de curvatura)",
    "ps.metrics.spring": "F_s  (fuerza del resorte)",
    "ps.metrics.answer_heading": "Respuesta",
    "ps.metrics.normal": "N  (fuerza normal)",
    "ps.metrics.tangential": "v̇  (tasa de incremento de la rapidez)",
    "ps.metrics.contact_lost":
      "La trayectoria solo puede empujar, así que una N negativa significa que el bloque saldría despedido en vez de mantenerse sobre ella. A partir de esa rapidez el modelo deja de describir el movimiento.",

    "ps.legend.heading": "Leyenda",
    "ps.legend.path": "La trayectoria parabólica lisa y = a − b·x²",
    "ps.legend.weight": "P = m·g — peso del bloque",
    "ps.legend.spring":
      "F_s = k·(x − L₀) — fuerza del resorte, siempre horizontal",
    "ps.legend.normal": "N — fuerza normal de la trayectoria",
    "ps.legend.tangential": "m·v̇ — la resultante sobre la trayectoria",
    "ps.legend.curvature": "Círculo osculador — su radio es ρ",

    "ps.equations.heading": "Ecuaciones",
    "ps.equations.section.statement": "Enunciado",
    "ps.equations.statement.text":
      "Hibbeler, Ingeniería Mecánica: Dinámica — problema 13-74. El bloque de 6 kg sólo puede moverse a lo largo de la trayectoria parabólica lisa. El resorte conectado limita el movimiento y, debido a la guía de rodillo, siempre permanece horizontal cuando el bloque desciende. Si la rigidez del resorte es k = 10 N/m y su longitud no alargada es de 0,5 m, determine la fuerza normal de la trayectoria sobre el bloque en el instante x = 1 m, cuando la rapidez del bloque es de 4 m/s. Además, ¿cuál es la tasa de incremento de la rapidez del bloque en este punto? Ignore la masa del rodillo y el resorte.",
    "ps.equations.section.theory": "Teoría",
    "ps.equations.theory.frame":
      "El bloque está obligado a seguir una curva, así que los ejes naturales son los de la curva: t̂ sobre la trayectoria y n̂ hacia el centro de curvatura. Los dos se leen directo de y(x) — t̂ = (1, y′)/√(1+y′²) y n̂ = (y′, −1)/√(1+y′²) — y también el radio de curvatura, ρ = (1+y′²)^(3/2)/|y″|. En x = 1 la pendiente es −1, así que la trayectoria baja a 45° y ρ = 2√2 m.",
    "ps.equations.theory.spring":
      "La guía de rodillo es lo que vuelve fácil al resorte: lo mantiene horizontal, así que su longitud es simplemente x y su alargamiento es x − L₀ — no hay geometría que resolver. En x = 1 m eso es un alargamiento de 0,5 m y un tirón de 5 N hacia B. Ojo que también puede estar *comprimido*: para x < L₀ el resorte empuja al bloque hacia afuera, que es justamente lo que lo pone en movimiento si arrancás cerca del vértice.",
    "ps.equations.theory.decouple":
      "Como la trayectoria es lisa, N es perpendicular al movimiento y no hace trabajo — nunca aparece en la ecuación tangencial. Eso parte el problema limpiamente en dos: ΣF_t = m·v̇ da la tasa de incremento de la rapidez solo con el peso y el resorte, y recién después ΣF_n = m·v²/ρ da N. Notá que v̇ resulta función de la posición nada más; los 4 m/s del enunciado hacen falta para N y para nada más.",
    "ps.equations.theory.liftoff":
      "La trayectoria solo puede empujar al bloque, nunca tirar de él. N = aplicada·n̂ − m·v²/ρ cae como v², así que por encima de cierta rapidez tendría que hacerse negativa — es decir, el bloque sale despedido en vez de seguir la curva. Subí la rapidez inicial y el simulador lo avisa en lugar de dibujar una fuerza que la superficie no podría ejercer.",
    "ps.equations.section.formulas": "Fórmulas",
    "ps.equations.section.reference": "Referencia (instante del enunciado)",
    "ps.equations.note.reference":
      "En x = 1 m:  y = 1,5 m,  y′ = −1,  y″ = −1,  ρ = 2√2 = 2,828 m.\n" +
      "Resorte:  alargamiento = 1 − 0,5 = 0,5 m,  F_s = 10 × 0,5 = 5 N hacia B.\n" +
      "Tangencial:  m·v̇ = P·sen 45° − F_s·cos 45° = (58,86 − 5)/√2 = 38,09 N  →  v̇ = 6,35 m/s².\n" +
      "Normal:  (P + F_s)/√2 − N = m·v²/ρ  →  45,16 − N = 6 × 16 / 2,828 = 33,94\n" +
      "N = 11,2 N.",
    "ps.equations.section.plot": "Fuerza normal a lo largo del descenso",
    "ps.equations.plot.note":
      "N(x) sobre toda la trayectoria, con la rapidez en cada punto sacada de la conservación de la energía a partir del instante elegido — así que esta es la fuerza que el bloque realmente va a sentir mientras baja, no un barrido a rapidez fija. Donde la curva cae por debajo de cero el bloque se despegaría. La línea vertical llena es dónde está el bloque ahora.",
    "ps.plot.normal.title":
      "N(x) — fuerza normal sobre la trayectoria, con rapideces por conservación de la energía",
  },
};
