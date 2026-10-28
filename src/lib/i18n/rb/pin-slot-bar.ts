// Strings for RB 8 — pin sliding in a slotted bar (CCR N°16).

export const pinSlotBar = {
  en: {
    "psb.page.canvas_aria":
      "Linkage simulator — bar BO rotates at a constant rate about O and pin A, fixed to bar AC, slides in its slot",

    "psb.controls.section.instant": "Instant",
    "psb.controls.section.mechanism": "Mechanism",
    "psb.controls.section.visibility": "Visibility",
    "psb.controls.btn.statement": "Statement instant (θ = 45°)",
    "psb.controls.slider.omega_bo": "ω_BO — angular velocity of BO",
    "psb.controls.slider.arm_length": "L — length CA",
    "psb.controls.slider.pivot_ox": "O_x — pivot O, horizontal",
    "psb.controls.slider.pivot_oy": "O_y — pivot O, vertical",
    "psb.controls.toggle.velocity": "Velocity of the pin, v_A",
    "psb.controls.toggle.velocity_parts": "Split into transport and relative",
    "psb.controls.toggle.accel": "Acceleration of the pin, a_A",
    "psb.controls.toggle.accel_parts": "Transport, Coriolis and relative terms",
    "psb.controls.toggle.angles": "φ and θ arcs",
    "psb.controls.toggle.trace": "Path swept by the pin",
    "psb.controls.btn.reset": "Reset",
    "psb.controls.btn.play": "Play",
    "psb.controls.btn.pause": "Pause",

    "psb.canvas.v": "v_A",
    "psb.canvas.v_arr": "v_arr",
    "psb.canvas.v_rel": "v_rel",
    "psb.canvas.a": "a_A",
    "psb.canvas.a_arr": "a_arr",
    "psb.canvas.a_cor": "a_cor",
    "psb.canvas.a_rel": "a_rel",
    "psb.canvas.phi": "φ",
    "psb.canvas.theta": "θ",

    "psb.metrics.heading": "Live Metrics",
    "psb.metrics.phi": "φ  (position of BO)",
    "psb.metrics.theta": "θ  (position of AC)",
    "psb.metrics.r": "r = OA",
    "psb.metrics.r_dot": "ṙ  (pin sliding along BO)",
    "psb.metrics.speed": "v_A",
    "psb.metrics.accel": "a_A",
    "psb.metrics.answer_heading": "Answer",
    "psb.metrics.omega_ac": "ω_AC",
    "psb.metrics.alpha_ac": "α_AC",
    "psb.metrics.cw": "clockwise",
    "psb.metrics.ccw": "counterclockwise",

    "psb.legend.heading": "Legend",
    "psb.legend.velocity": "v_A — total velocity of the pin",
    "psb.legend.v_arr": "v_arr — transport term, Ω_BO×r",
    "psb.legend.v_rel": "v_rel — sliding velocity along the slot, ṙ",
    "psb.legend.accel": "a_A — total acceleration of the pin",
    "psb.legend.a_arr": "a_arr — transport (centripetal) term, −ω_BO²·r",
    "psb.legend.a_cor": "a_cor — Coriolis term, 2·Ω_BO×v_rel",
    "psb.legend.a_rel": "a_rel — sliding acceleration along the slot, r̈",

    "psb.equations.heading": "Equations",
    "psb.equations.section.statement": "Statement",
    "psb.equations.statement.text":
      "Bar BO rotates about the fixed point O at a constant ω_BO = 2 rad/s clockwise. Pin A, fixed to the end of bar AC (which pivots about the fixed point C), slides freely inside BO's slot. At the instant shown, θ = 45° and AC is horizontal, with A = (20, 0) cm and O = (40, 20) cm measured from C. Find the angular velocity and angular acceleration of bar AC.",
    "psb.equations.section.theory": "Theory",
    "psb.equations.theory.swap":
      "This is /oscillating-bar's mechanism with the driven and driving roles swapped: there, the constant-ω member carries the pin at a fixed reach and the other bar carries the slot; here, the constant-ω member (BO) carries the slot and the fixed-length arm (AC) carries the pin. So ω_AC and α_AC — not the slot's own angle — are what the rotating-frame decomposition has to solve for.",
    "psb.equations.theory.loop":
      "At every instant, A is the intersection of the line through O at angle φ with the circle of radius L about C — algebra, not an ODE. Both bars must agree on the pin's velocity and acceleration: writing v_A and a_A once from BO's rotating frame (transport + relative, since AC is not attached to it) and once from AC's own pure rotation about C gives two vector equations, each linear in the two remaining unknowns (ṙ, ω_AC and then r̈, α_AC).",
    "psb.equations.theory.coriolis":
      "The Coriolis term 2·Ω_BO×v_rel is about twice the size of the transport term here — drop it and α_AC comes out as 24 rad/s² instead of 32. Notice also that v_rel points back toward O while a_rel points away from it: the pin is sliding inward but decelerating, about to reverse.",
    "psb.equations.section.formulas": "Formulas",
    "psb.equations.section.reference": "Reference (statement instant)",
    "psb.equations.note.reference":
      "r = |OA| = 28.28 cm,   ṙ = −56.57 cm/s,   r̈ = 791.96 cm/s².\n" +
      "v_arr = (−40, 40),   v_rel = (40, 40),   v_A = (0, 80) cm/s  →  ω_AC = 4 rad/s, counterclockwise.\n" +
      "a_arr = (80, 80),   a_cor = (160, −160),   a_rel = (−560, −560),   a_A = (−320, −640) cm/s²  →  α_AC = 32 rad/s², clockwise.",
  },
  es: {
    "psb.page.canvas_aria":
      "Simulador de mecanismo — la barra BO gira a velocidad constante en torno a O y el pasador A, fijo a la barra AC, desliza en su ranura",

    "psb.controls.section.instant": "Instante",
    "psb.controls.section.mechanism": "Mecanismo",
    "psb.controls.section.visibility": "Visibilidad",
    "psb.controls.btn.statement": "Instante del enunciado (θ = 45°)",
    "psb.controls.slider.omega_bo": "ω_BO — velocidad angular de BO",
    "psb.controls.slider.arm_length": "L — longitud CA",
    "psb.controls.slider.pivot_ox": "O_x — pivote O, horizontal",
    "psb.controls.slider.pivot_oy": "O_y — pivote O, vertical",
    "psb.controls.toggle.velocity": "Velocidad del pasador, v_A",
    "psb.controls.toggle.velocity_parts": "Descomposición: arrastre y relativa",
    "psb.controls.toggle.accel": "Aceleración del pasador, a_A",
    "psb.controls.toggle.accel_parts": "Términos de arrastre, Coriolis y relativo",
    "psb.controls.toggle.angles": "Arcos de φ y θ",
    "psb.controls.toggle.trace": "Trayectoria que barre el pasador",
    "psb.controls.btn.reset": "Reiniciar",
    "psb.controls.btn.play": "Reproducir",
    "psb.controls.btn.pause": "Pausar",

    "psb.canvas.v": "v_A",
    "psb.canvas.v_arr": "v_arr",
    "psb.canvas.v_rel": "v_rel",
    "psb.canvas.a": "a_A",
    "psb.canvas.a_arr": "a_arr",
    "psb.canvas.a_cor": "a_cor",
    "psb.canvas.a_rel": "a_rel",
    "psb.canvas.phi": "φ",
    "psb.canvas.theta": "θ",

    "psb.metrics.heading": "Métricas en vivo",
    "psb.metrics.phi": "φ  (posición de BO)",
    "psb.metrics.theta": "θ  (posición de AC)",
    "psb.metrics.r": "r = OA",
    "psb.metrics.r_dot": "ṙ  (deslizamiento del pasador sobre BO)",
    "psb.metrics.speed": "v_A",
    "psb.metrics.accel": "a_A",
    "psb.metrics.answer_heading": "Respuesta",
    "psb.metrics.omega_ac": "ω_AC",
    "psb.metrics.alpha_ac": "α_AC",
    "psb.metrics.cw": "horario",
    "psb.metrics.ccw": "antihorario",

    "psb.legend.heading": "Leyenda",
    "psb.legend.velocity": "v_A — velocidad total del pasador",
    "psb.legend.v_arr": "v_arr — término de arrastre, Ω_BO×r",
    "psb.legend.v_rel": "v_rel — velocidad de deslizamiento sobre la ranura, ṙ",
    "psb.legend.accel": "a_A — aceleración total del pasador",
    "psb.legend.a_arr": "a_arr — término de arrastre (centrípeto), −ω_BO²·r",
    "psb.legend.a_cor": "a_cor — término de Coriolis, 2·Ω_BO×v_rel",
    "psb.legend.a_rel": "a_rel — aceleración de deslizamiento sobre la ranura, r̈",

    "psb.equations.heading": "Ecuaciones",
    "psb.equations.section.statement": "Enunciado",
    "psb.equations.statement.text":
      "La barra BO gira en torno al punto fijo O a velocidad angular constante ω_BO = 2 rad/seg en sentido horario. El pasador A, fijo al extremo de la barra AC (que pivota en el punto fijo C), desliza libremente dentro de la ranura de BO. En el instante mostrado, θ = 45° y AC es horizontal, con A = (20, 0) cm y O = (40, 20) cm medidos desde C. Hallar la velocidad y aceleración angulares de la barra AC.",
    "psb.equations.section.theory": "Teoría",
    "psb.equations.theory.swap":
      "Este es el mecanismo de /oscillating-bar con los roles de impulsora e impulsada invertidos: allí, el miembro de ω constante lleva el pasador a un alcance fijo y la otra barra lleva la ranura; acá, el miembro de ω constante (BO) lleva la ranura y el brazo de longitud fija (AC) lleva el pasador. Por eso ω_AC y α_AC — no el ángulo de la ranura — son lo que hay que despejar de la descomposición en la terna móvil.",
    "psb.equations.theory.loop":
      "En cada instante, A es la intersección entre la recta que pasa por O con ángulo φ y la circunferencia de radio L en torno a C — álgebra, no una ecuación diferencial. Las dos barras deben coincidir en la velocidad y aceleración del pasador: escribiendo v_A y a_A una vez desde la terna móvil de BO (arrastre + relativa, ya que AC no está fija a ella) y otra vez desde la rotación pura de AC en torno a C, se obtienen dos ecuaciones vectoriales, cada una lineal en las dos incógnitas que quedan (ṙ, ω_AC y luego r̈, α_AC).",
    "psb.equations.theory.coriolis":
      "El término de Coriolis 2·Ω_BO×v_rel es acá el doble del término de arrastre — si se lo omite, α_AC da 24 rad/s² en vez de 32. Notá también que v_rel apunta hacia O mientras que a_rel apunta en sentido contrario: el pasador desliza hacia adentro pero frenando, a punto de invertir el sentido.",
    "psb.equations.section.formulas": "Fórmulas",
    "psb.equations.section.reference": "Referencia (instante del enunciado)",
    "psb.equations.note.reference":
      "r = |OA| = 28,28 cm,   ṙ = −56,57 cm/s,   r̈ = 791,96 cm/s².\n" +
      "v_arr = (−40, 40),   v_rel = (40, 40),   v_A = (0, 80) cm/s  →  ω_AC = 4 rad/s, antihorario.\n" +
      "a_arr = (80, 80),   a_cor = (160, −160),   a_rel = (−560, −560),   a_A = (−320, −640) cm/s²  →  α_AC = 32 rad/s², horario.",
  },
};
