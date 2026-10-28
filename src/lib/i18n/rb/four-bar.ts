// Strings for RB 5 — four-bar linkage (CCR N°10).

export const fourBar = {
  en: {
    "fb.page.canvas_aria":
      "Four-bar linkage simulator — crank CD turns at a constant rate, coupler BC links it to rocker AB, and the instantaneous centre of BC is marked",

    "fb.controls.section.instant": "Instant",
    "fb.controls.section.mechanism": "Mechanism",
    "fb.controls.section.visibility": "Visibility",
    "fb.controls.btn.statement": "Statement instant (CD vertical)",
    "fb.controls.slider.omega_cd": "ω_CD — angular velocity of the crank",
    "fb.controls.slider.rocker_len": "AB — length of the rocker (inferred)",
    "fb.controls.hint.rocker_len":
      "Not given in the statement: 1.2 m is read off the figure (AB·sin 30° = 0.6 m).",
    "fb.controls.slider.crank_len": "CD — length of the crank",
    "fb.controls.slider.coupler_len": "BC — length of the coupler",
    "fb.controls.toggle.velocity": "Velocities of B, C and E",
    "fb.controls.toggle.accel": "Accelerations of B, C and E",
    "fb.controls.toggle.center": "Instantaneous centre of BC (CIR)",
    "fb.controls.toggle.trace": "Path swept by E",
    "fb.controls.btn.reset": "Reset",
    "fb.controls.btn.play": "Play",
    "fb.controls.btn.pause": "Pause",

    "fb.canvas.v_b": "v_B",
    "fb.canvas.v_c": "v_C",
    "fb.canvas.v_e": "v_E",
    "fb.canvas.a_b": "a_B",
    "fb.canvas.a_c": "a_C",
    "fb.canvas.a_e": "a_E",
    "fb.canvas.cir": "CIR",

    "fb.metrics.heading": "Live Metrics",
    "fb.metrics.alpha": "α  (position of CD)",
    "fb.metrics.omega_cd": "ω_CD",
    "fb.metrics.speed_b": "v_B",
    "fb.metrics.accel_e": "a_E",
    "fb.metrics.gamma_bc": "γ_BC",
    "fb.metrics.gamma_ab": "γ_AB",
    "fb.metrics.answer_heading": "Answer",
    "fb.metrics.omega_ab": "ω_AB",
    "fb.metrics.omega_bc": "ω_BC",
    "fb.metrics.speed_e": "v_E",
    "fb.metrics.cir": "CIR of BC",
    "fb.metrics.cir_infinite": "at infinity (BC translates)",
    "fb.metrics.cw": "clockwise",
    "fb.metrics.ccw": "counterclockwise",

    "fb.legend.heading": "Legend",
    "fb.legend.v_c": "v_C — velocity of C, ω_CD×r_C/D",
    "fb.legend.v_b": "v_B — velocity of B, perpendicular to AB",
    "fb.legend.v_e": "v_E — velocity of the midpoint of BC",
    "fb.legend.a_c": "a_C — acceleration of C (centripetal, ω_CD is constant)",
    "fb.legend.a_b": "a_B — acceleration of B",
    "fb.legend.a_e": "a_E — acceleration of the midpoint of BC",
    "fb.legend.cir": "CIR — instantaneous centre of BC, where the perpendiculars to v_C and v_B meet",

    "fb.equations.heading": "Equations",
    "fb.equations.section.statement": "Statement",
    "fb.equations.statement.text":
      "Crank CD turns about the fixed pin D at ω_CD = 6 rad/s counterclockwise. With D at the origin: C = (0, 0.6), B = (−0.6, 0.6) m, and E = (−0.3, 0.6) m is the midpoint of BC. Rocker AB pivots about the fixed pin A and makes 30° with the horizontal. Find ω_AB, ω_BC, the velocity of E and the instantaneous centre of BC.",
    "fb.equations.section.theory": "Theory",
    "fb.equations.theory.cir":
      "B and C are two points of the rigid bar BC, and the direction of each velocity is known: v_C is perpendicular to CD and v_B is perpendicular to AB. The instantaneous centre of BC is where the perpendiculars to those velocities meet — here, x = 0 (the perpendicular through C) crossing the line AB. From it, every velocity of BC is just ω_BC times the distance to the CIR.",
    "fb.equations.theory.inferred":
      "The statement does not give the length of AB. It is inferred as 1.2 m from the figure (AB·sin 30° = 0.6 m, so A sits at floor level with D) and exposed as an adjustable input. ω_BC, v_E and the CIR do not depend on it — only ω_AB = |v_B| / AB does.",
    "fb.equations.theory.accel":
      "Accelerations close the same loop one derivative later. Since ω_CD is constant, a_C is purely centripetal; a_B written from BC and from AB must agree, which gives two scalar equations in γ_BC and γ_AB. Both systems become singular when C, B and A line up (a toggle), which is exactly where the crank reaches its stops.",
    "fb.equations.section.formulas": "Formulas",
    "fb.equations.section.reference": "Reference (statement instant)",
    "fb.equations.note.reference":
      "v_C = (−3.6, 0) m/s,   v_B = (−3.6, 6.235) m/s,   |v_B| = 7.2 m/s.\n" +
      "CIR of BC = (0, 0.946) m   →   ω_BC = −10.39 rad/s (clockwise).\n" +
      "ω_AB = |v_B| / AB = 6 rad/s (counterclockwise),   v_E = 4.76 m/s.",
  },
  es: {
    "fb.page.canvas_aria":
      "Simulador de mecanismo de cuatro barras — la manivela CD gira a velocidad constante, el acoplador BC la une con el balancín AB y se marca el centro instantáneo de BC",

    "fb.controls.section.instant": "Instante",
    "fb.controls.section.mechanism": "Mecanismo",
    "fb.controls.section.visibility": "Visibilidad",
    "fb.controls.btn.statement": "Instante del enunciado (CD vertical)",
    "fb.controls.slider.omega_cd": "ω_CD — velocidad angular de la manivela",
    "fb.controls.slider.rocker_len": "AB — longitud del balancín (inferida)",
    "fb.controls.hint.rocker_len":
      "No está en el enunciado: 1,2 m se lee de la figura (AB·sen 30° = 0,6 m).",
    "fb.controls.slider.crank_len": "CD — longitud de la manivela",
    "fb.controls.slider.coupler_len": "BC — longitud del acoplador",
    "fb.controls.toggle.velocity": "Velocidades de B, C y E",
    "fb.controls.toggle.accel": "Aceleraciones de B, C y E",
    "fb.controls.toggle.center": "Centro instantáneo de rotación de BC (CIR)",
    "fb.controls.toggle.trace": "Trayectoria que barre E",
    "fb.controls.btn.reset": "Reiniciar",
    "fb.controls.btn.play": "Reproducir",
    "fb.controls.btn.pause": "Pausar",

    "fb.canvas.v_b": "v_B",
    "fb.canvas.v_c": "v_C",
    "fb.canvas.v_e": "v_E",
    "fb.canvas.a_b": "a_B",
    "fb.canvas.a_c": "a_C",
    "fb.canvas.a_e": "a_E",
    "fb.canvas.cir": "CIR",

    "fb.metrics.heading": "Métricas en vivo",
    "fb.metrics.alpha": "α  (posición de CD)",
    "fb.metrics.omega_cd": "ω_CD",
    "fb.metrics.speed_b": "v_B",
    "fb.metrics.accel_e": "a_E",
    "fb.metrics.gamma_bc": "γ_BC",
    "fb.metrics.gamma_ab": "γ_AB",
    "fb.metrics.answer_heading": "Respuesta",
    "fb.metrics.omega_ab": "ω_AB",
    "fb.metrics.omega_bc": "ω_BC",
    "fb.metrics.speed_e": "v_E",
    "fb.metrics.cir": "CIR de BC",
    "fb.metrics.cir_infinite": "en el infinito (BC se traslada)",
    "fb.metrics.cw": "horario",
    "fb.metrics.ccw": "antihorario",

    "fb.legend.heading": "Leyenda",
    "fb.legend.v_c": "v_C — velocidad de C, ω_CD×r_C/D",
    "fb.legend.v_b": "v_B — velocidad de B, perpendicular a AB",
    "fb.legend.v_e": "v_E — velocidad del punto medio de BC",
    "fb.legend.a_c": "a_C — aceleración de C (centrípeta, ω_CD es constante)",
    "fb.legend.a_b": "a_B — aceleración de B",
    "fb.legend.a_e": "a_E — aceleración del punto medio de BC",
    "fb.legend.cir": "CIR — centro instantáneo de rotación de BC, donde se cortan las perpendiculares a v_C y v_B",

    "fb.equations.heading": "Ecuaciones",
    "fb.equations.section.statement": "Enunciado",
    "fb.equations.statement.text":
      "La manivela CD gira en torno al pasador fijo D con ω_CD = 6 rad/seg en sentido antihorario. Con D en el origen: C = (0; 0,6), B = (−0,6; 0,6) m, y E = (−0,3; 0,6) m es el punto medio de BC. El balancín AB pivota en el pasador fijo A y forma 30° con la horizontal. Hallar ω_AB, ω_BC, la velocidad de E y el centro instantáneo de rotación de BC.",
    "fb.equations.section.theory": "Teoría",
    "fb.equations.theory.cir":
      "B y C son dos puntos de la barra rígida BC y se conoce la dirección de cada velocidad: v_C es perpendicular a CD y v_B es perpendicular a AB. El centro instantáneo de rotación (CIR) de BC está donde se cortan las perpendiculares a esas velocidades — acá, x = 0 (la perpendicular por C) cortando la recta AB. A partir de él, toda velocidad de BC es simplemente ω_BC por la distancia al CIR.",
    "fb.equations.theory.inferred":
      "El enunciado no da la longitud de AB. Se infiere 1,2 m de la figura (AB·sen 30° = 0,6 m, o sea que A queda a la altura del piso, igual que D) y se la deja como entrada ajustable. ω_BC, v_E y el CIR no dependen de ella — solo ω_AB = |v_B| / AB.",
    "fb.equations.theory.accel":
      "Las aceleraciones cierran el mismo lazo una derivada después. Como ω_CD es constante, a_C es puramente centrípeta; a_B escrita desde BC y desde AB debe coincidir, lo que da dos ecuaciones escalares en γ_BC y γ_AB. Ambos sistemas se vuelven singulares cuando C, B y A quedan alineados (una posición de cambio), que es justo donde la manivela llega a sus topes.",
    "fb.equations.section.formulas": "Fórmulas",
    "fb.equations.section.reference": "Referencia (instante del enunciado)",
    "fb.equations.note.reference":
      "v_C = (−3,6; 0) m/s,   v_B = (−3,6; 6,235) m/s,   |v_B| = 7,2 m/s.\n" +
      "CIR de BC = (0; 0,946) m   →   ω_BC = −10,39 rad/s (horario).\n" +
      "ω_AB = |v_B| / AB = 6 rad/s (antihorario),   v_E = 4,76 m/s.",
  },
} as const;
