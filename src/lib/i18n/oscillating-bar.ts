export const oscillatingBar = {
  en: {
    "ob.title": "Rotating Bar Driving an Oscillating Bar",
    "ob.page.canvas_aria":
      "Linkage simulator — bar OA turns at a constant rate and its pin A slides along bar BC, which pivots about B",

    "ob.controls.section.instant": "Instant",
    "ob.controls.section.mechanism": "Mechanism",
    "ob.controls.section.visibility": "Visibility",
    "ob.controls.slider.target_theta": "θ the exercise asks about",
    "ob.controls.hint.swing": "BC can only swing to",
    "ob.controls.btn.statement": "Statement instant (θ = 20°)",
    "ob.controls.slider.omega": "ω — angular velocity of OA",
    "ob.controls.slider.bar_length": "b — length OA",
    "ob.controls.slider.separation": "OB — distance between pivots",
    "ob.controls.toggle.velocity": "Velocity of the pin, v_A",
    "ob.controls.toggle.velocity_parts": "Split into sliding and swinging",
    "ob.controls.toggle.accel": "Acceleration of the pin, a_A",
    "ob.controls.toggle.accel_parts": "Rotating-frame terms of a_A",
    "ob.controls.toggle.angles": "θ and ω arcs, and the OB baseline",
    "ob.controls.toggle.trace": "Circle swept by the pin",
    "ob.controls.btn.reset": "Reset",
    "ob.controls.btn.play": "Play",
    "ob.controls.btn.pause": "Pause",

    "ob.canvas.v_a": "v_A",
    "ob.canvas.slide": "ṙ",
    "ob.canvas.across": "r·θ̇",
    "ob.canvas.a_a": "a_A",
    "ob.canvas.euler": "α×r",
    "ob.canvas.centripetal": "Ω×(Ω×r)",
    "ob.canvas.coriolis": "2Ω×v_rel",
    "ob.canvas.relative": "a_rel",
    "ob.canvas.omega": "ω",
    "ob.canvas.theta": "θ",

    "ob.metrics.heading": "Live Metrics",
    "ob.metrics.phi": "φ  (position of OA)",
    "ob.metrics.theta": "θ  (inclination of BC)",
    "ob.metrics.reach": "r = BA",
    "ob.metrics.reach_rate": "ṙ  (pin sliding along BC)",
    "ob.metrics.pin_speed": "v_A = b·ω",
    "ob.metrics.pin_accel": "a_A = b·ω²",
    "ob.metrics.answer_heading": "Answer",
    "ob.metrics.bar_omega": "ω_BC",
    "ob.metrics.bar_alpha": "α_BC",
    "ob.metrics.cw": "clockwise",
    "ob.metrics.ccw": "counterclockwise",

    "ob.legend.heading": "Legend",
    "ob.legend.velocity": "v_A — velocity of the pin, ⟂ to OA, magnitude b·ω",
    "ob.legend.slide": "ṙ — the part that slides along BC",
    "ob.legend.across": "r·θ̇ — the part that swings BC",
    "ob.legend.accel": "a_A — acceleration of the pin, b·ω² toward O",
    "ob.legend.euler": "α×r — Euler term",
    "ob.legend.centripetal": "Ω×(Ω×r) — centripetal term",
    "ob.legend.coriolis": "2Ω×v_rel — Coriolis term",
    "ob.legend.relative": "a_rel = r̈ — sliding acceleration along BC",

    "ob.equations.heading": "Equations",
    "ob.equations.section.statement": "Statement",
    "ob.equations.statement.text":
      "Bar OA rotates at a constant angular velocity ω counterclockwise. The pin A can slide freely along bar BC. Determine the angular velocity and angular acceleration of bar BC when θ = 20°. Take ω = 3 rad/s and b = 1 m, with OB = 2b.",
    "ob.equations.section.theory": "Theory",
    "ob.equations.theory.loop":
      "Put O at the origin and B at (d, 0). The pin is at A = b·(cos φ, sen φ), so the geometry closes in one line: tan θ = b·sen φ / (d − b·cos φ). Everything else is differentiation. Because ω is constant, φ̈ = 0, so θ̇ = ω·dθ/dφ and θ̈ = ω²·d²θ/dφ² — no second term to carry, and the two derivatives come out in closed form rather than needing anything numerical.",
    "ob.equations.theory.swing":
      "θ̇ vanishes when cos φ = b/d, and that is the whole character of this mechanism: BC does not go round with OA, it *oscillates* between ±arcsen(b/d) — ±30° for the statement's OB = 2b. Those turning points are exactly where OA comes out perpendicular to AB. Push the pivots together until OB = OA and something else happens: θ̇ collapses to a constant −ω/2 and θ̈ vanishes, so the driven bar turns uniformly at half speed. The slider stops just short of it, since φ = 0 is singular there.",
    "ob.equations.theory.frame":
      "The textbook route is a rotating frame attached to BC. The pin's own motion is easy — v_A is b·ω perpendicular to OA and a_A is b·ω² straight back at O, since ω is constant. Splitting v_A along and across BC gives ṙ and r·θ̇ in one step. The acceleration needs all four terms, a_A = α×r + Ω×(Ω×r) + 2Ω×v_rel + a_rel, and the Coriolis one is the classic omission: the pin is sliding while its frame turns, so 2Ω×v_rel is not zero. Switch the terms on and watch them close on a_A.",
    "ob.equations.theory.sense":
      "One sign worth being careful with: θ is measured at B from the line back toward O, so the ray B→A points leftward. Raising the far end C *increases* θ but rotates that ray clockwise. So ω_BC = −θ̇ in the usual counterclockwise convention, which is why the answer below reads 1.90 rad/s clockwise while θ is growing.",
    "ob.equations.section.formulas": "Formulas",
    "ob.equations.section.reference": "Reference (statement instant)",
    "ob.equations.note.reference":
      "θ = 20° needs sen(φ + θ) = (d/b)·sen θ = 0.6840, so φ = 43.16° − 20° = 23.16°.\n" +
      "D = 4 + 1 − 4·cos 23.16° = 1.3221,   r = 1.1499 m,   ṙ = 2.052 m/s.\n" +
      "θ̇ = 3 × (2·cos 23.16° − 1) / 1.3221 = 1.903 rad/s  →  ω_BC = 1.90 rad/s, clockwise.\n" +
      "θ̈ = −9 × 6 · sen 23.16° / 1.3221² = −12.15 rad/s²  →  α_BC = 12.15 rad/s², counterclockwise.",
    "ob.equations.section.plot": "How BC moves over one turn of OA",
    "ob.equations.plot.note":
      "ω_BC in rad/s and α_BC in rad/s², against the crank angle φ. The solid vertical line is where the mechanism is now. ω_BC crosses zero twice a turn — those are the ends of the swing, at ±",
    "ob.plot.rates.title":
      "ω_BC(φ) and α_BC(φ) — angular velocity and acceleration of the driven bar",
  },
  es: {
    "ob.title": "Barra Giratoria que Impulsa una Barra Oscilante",
    "ob.page.canvas_aria":
      "Simulador de mecanismo — la barra OA gira a velocidad constante y su pasador A desliza sobre la barra BC, que pivota en B",

    "ob.controls.section.instant": "Instante",
    "ob.controls.section.mechanism": "Mecanismo",
    "ob.controls.section.visibility": "Visibilidad",
    "ob.controls.slider.target_theta": "θ que pide el ejercicio",
    "ob.controls.hint.swing": "BC solo puede oscilar hasta",
    "ob.controls.btn.statement": "Instante del enunciado (θ = 20°)",
    "ob.controls.slider.omega": "ω — velocidad angular de OA",
    "ob.controls.slider.bar_length": "b — longitud OA",
    "ob.controls.slider.separation": "OB — distancia entre pivotes",
    "ob.controls.toggle.velocity": "Velocidad del pasador, v_A",
    "ob.controls.toggle.velocity_parts": "Descomposición: deslizamiento y giro",
    "ob.controls.toggle.accel": "Aceleración del pasador, a_A",
    "ob.controls.toggle.accel_parts": "Términos de a_A en la terna móvil",
    "ob.controls.toggle.angles": "Arcos de θ y ω, y la línea OB",
    "ob.controls.toggle.trace": "Circunferencia que barre el pasador",
    "ob.controls.btn.reset": "Reiniciar",
    "ob.controls.btn.play": "Reproducir",
    "ob.controls.btn.pause": "Pausar",

    "ob.canvas.v_a": "v_A",
    "ob.canvas.slide": "ṙ",
    "ob.canvas.across": "r·θ̇",
    "ob.canvas.a_a": "a_A",
    "ob.canvas.euler": "α×r",
    "ob.canvas.centripetal": "Ω×(Ω×r)",
    "ob.canvas.coriolis": "2Ω×v_rel",
    "ob.canvas.relative": "a_rel",
    "ob.canvas.omega": "ω",
    "ob.canvas.theta": "θ",

    "ob.metrics.heading": "Métricas en vivo",
    "ob.metrics.phi": "φ  (posición de OA)",
    "ob.metrics.theta": "θ  (inclinación de BC)",
    "ob.metrics.reach": "r = BA",
    "ob.metrics.reach_rate": "ṙ  (deslizamiento del pasador sobre BC)",
    "ob.metrics.pin_speed": "v_A = b·ω",
    "ob.metrics.pin_accel": "a_A = b·ω²",
    "ob.metrics.answer_heading": "Respuesta",
    "ob.metrics.bar_omega": "ω_BC",
    "ob.metrics.bar_alpha": "α_BC",
    "ob.metrics.cw": "horario",
    "ob.metrics.ccw": "antihorario",

    "ob.legend.heading": "Leyenda",
    "ob.legend.velocity": "v_A — velocidad del pasador, ⟂ a OA, de módulo b·ω",
    "ob.legend.slide": "ṙ — la parte que desliza sobre BC",
    "ob.legend.across": "r·θ̇ — la parte que hace girar a BC",
    "ob.legend.accel": "a_A — aceleración del pasador, b·ω² hacia O",
    "ob.legend.euler": "α×r — término de Euler",
    "ob.legend.centripetal": "Ω×(Ω×r) — término centrípeto",
    "ob.legend.coriolis": "2Ω×v_rel — término de Coriolis",
    "ob.legend.relative": "a_rel = r̈ — aceleración de deslizamiento sobre BC",

    "ob.equations.heading": "Ecuaciones",
    "ob.equations.section.statement": "Enunciado",
    "ob.equations.statement.text":
      "La barra OA gira a velocidad angular ω constante en sentido contrario a las agujas del reloj. El pasador A puede deslizarse libremente sobre la barra BC. Determinar la velocidad y aceleración angulares de la barra BC cuando θ = 20°. Tomar ω = 3 rad/seg y b = 1 m, con OB = 2b.",
    "ob.equations.section.theory": "Teoría",
    "ob.equations.theory.loop":
      "Poné O en el origen y B en (d, 0). El pasador está en A = b·(cos φ, sen φ), así que la geometría se cierra en un renglón: tan θ = b·sen φ / (d − b·cos φ). Todo lo demás es derivar. Como ω es constante, φ̈ = 0, así que θ̇ = ω·dθ/dφ y θ̈ = ω²·d²θ/dφ² — no hay segundo término que arrastrar, y las dos derivadas salen en forma cerrada sin necesidad de nada numérico.",
    "ob.equations.theory.swing":
      "θ̇ se anula cuando cos φ = b/d, y ahí está todo el carácter de este mecanismo: BC no da la vuelta junto con OA, *oscila* entre ±arcsen(b/d) — ±30° con el OB = 2b del enunciado. Esos puntos de retorno son exactamente donde OA queda perpendicular a AB. Acercá los pivotes hasta OB = OA y pasa otra cosa: θ̇ se vuelve la constante −ω/2 y θ̈ se anula, así que la barra impulsada gira uniformemente a la mitad de la velocidad. El slider se detiene justo antes, porque ahí φ = 0 es singular.",
    "ob.equations.theory.frame":
      "El camino del libro es una terna móvil solidaria a BC. El movimiento del pasador en sí es fácil — v_A es b·ω perpendicular a OA y a_A es b·ω² derecho hacia O, porque ω es constante. Descomponer v_A a lo largo y a través de BC da ṙ y r·θ̇ de una. La aceleración necesita los cuatro términos, a_A = α×r + Ω×(Ω×r) + 2Ω×v_rel + a_rel, y el de Coriolis es la omisión clásica: el pasador desliza mientras su terna gira, así que 2Ω×v_rel no es cero. Activá los términos y mirá cómo cierran sobre a_A.",
    "ob.equations.theory.sense":
      "Un signo que conviene cuidar: θ se mide en B desde la línea que vuelve hacia O, así que el rayo B→A apunta hacia la izquierda. Levantar el extremo C *aumenta* θ pero hace girar ese rayo en sentido horario. Por eso ω_BC = −θ̇ en la convención antihoraria habitual, y por eso la respuesta de abajo dice 1,90 rad/s en sentido horario mientras θ está creciendo.",
    "ob.equations.section.formulas": "Fórmulas",
    "ob.equations.section.reference": "Referencia (instante del enunciado)",
    "ob.equations.note.reference":
      "θ = 20° exige sen(φ + θ) = (d/b)·sen θ = 0,6840, así que φ = 43,16° − 20° = 23,16°.\n" +
      "D = 4 + 1 − 4·cos 23,16° = 1,3221,   r = 1,1499 m,   ṙ = 2,052 m/s.\n" +
      "θ̇ = 3 × (2·cos 23,16° − 1) / 1,3221 = 1,903 rad/s  →  ω_BC = 1,90 rad/s, horario.\n" +
      "θ̈ = −9 × 6 · sen 23,16° / 1,3221² = −12,15 rad/s²  →  α_BC = 12,15 rad/s², antihorario.",
    "ob.equations.section.plot": "Cómo se mueve BC en una vuelta de OA",
    "ob.equations.plot.note":
      "ω_BC en rad/s y α_BC en rad/s², en función del ángulo φ de la manivela. La línea vertical llena es dónde está el mecanismo ahora. ω_BC cruza el cero dos veces por vuelta — son los extremos de la oscilación, en ±",
    "ob.plot.rates.title":
      "ω_BC(φ) y α_BC(φ) — velocidad y aceleración angulares de la barra impulsada",
  },
};
