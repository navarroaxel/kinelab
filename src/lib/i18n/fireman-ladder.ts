export const firemanLadder = {
  en: {
    "fl.title": "Fireman's Ladder (3D)",
    "fl.page.canvas_aria":
      "Fireman's ladder simulator — a ladder elevating, extending and rotating about a vertical axis, drawn in an orbitable 3D view",

    "fl.controls.section.rotation": "Rotation",
    "fl.controls.section.extension": "Extension",
    "fl.controls.section.instant": "Instant",
    "fl.controls.section.visibility": "Visibility",
    "fl.controls.slider.omega1": "ω₁ — turret, about the vertical axis",
    "fl.controls.slider.omega2": "ω₂ — elevation rate",
    "fl.controls.slider.s_dot": "ṡ — extension speed",
    "fl.controls.slider.s0": "s₀ — extension at t = 0",
    "fl.controls.slider.theta20": "θ₂₀ — elevation at t = 0",
    "fl.controls.toggle.velocity": "Total velocity v",
    "fl.controls.toggle.velocity_parts": "Velocity terms (Ω×r, v_rel)",
    "fl.controls.toggle.accel": "Total acceleration a",
    "fl.controls.toggle.accel_parts": "Acceleration terms (Euler, centripetal, Coriolis)",
    "fl.controls.toggle.trace": "Trail of B",
    "fl.controls.toggle.axes": "World axes and ω arcs",
    "fl.controls.toggle.grid": "Ground grid",
    "fl.controls.toggle.truck": "Truck and turntable",
    "fl.controls.btn.statement": "Statement instant (s = 10 m, θ₂ = 30°)",
    "fl.controls.btn.reset_camera": "Reset camera",
    "fl.controls.btn.reset": "Reset",
    "fl.controls.btn.pause": "Pause",
    "fl.controls.btn.resume": "Resume",
    "fl.controls.hint.drag": "Drag the canvas to orbit the camera.",

    "fl.canvas.point_b": "B",
    "fl.canvas.pivot": "A",
    "fl.canvas.v": "v",
    "fl.canvas.v_transport": "Ω×r",
    "fl.canvas.v_rel": "v_rel",
    "fl.canvas.a": "a",
    "fl.canvas.a_euler": "Ω̇×r",
    "fl.canvas.a_centripetal": "Ω×(Ω×r)",
    "fl.canvas.a_coriolis": "2Ω×v_rel",
    "fl.canvas.omega1": "ω₁",
    "fl.canvas.omega2": "ω₂",
    "fl.canvas.theta2": "θ₂",
    "fl.canvas.s": "s",

    "fl.metrics.heading": "Live Metrics",
    "fl.metrics.s": "s  (extension)",
    "fl.metrics.theta2": "θ₂  (elevation)",
    "fl.metrics.speed": "|v|  (speed of B)",
    "fl.metrics.accel": "|a|  (acceleration of B)",
    "fl.metrics.v_components": "v  (x, y, z)",
    "fl.metrics.a_components": "a  (x, y, z)",
    "fl.metrics.a_euler": "|Ω̇×r|  (Euler)",
    "fl.metrics.a_centripetal": "|Ω×(Ω×r)|  (centripetal)",
    "fl.metrics.a_coriolis": "|2Ω×v_rel|  (Coriolis)",
    "fl.metrics.frame_note":
      "Components in the turret body frame: x̂ = elevation axis, ŷ = horizontal in the ladder plane, ẑ = up.",

    "fl.legend.heading": "Legend",
    "fl.legend.v": "v — total velocity of B",
    "fl.legend.v_transport": "Ω×r — transport (frame-dragging) velocity",
    "fl.legend.v_rel": "v_rel — sliding along the ladder",
    "fl.legend.a": "a — total acceleration of B",
    "fl.legend.a_euler": "Ω̇×r — Euler (angular-acceleration) term",
    "fl.legend.a_centripetal": "Ω×(Ω×r) — centripetal term",
    "fl.legend.a_coriolis": "2Ω×v_rel — Coriolis term",
    "fl.legend.trace": "Trail swept by B",

    "fl.equations.heading": "Equations",
    "fl.equations.section.statement": "Statement",
    "fl.equations.statement.text":
      "CCR N°14 — A fire truck's ladder elevates at a constant angular velocity ω₂ = 0.5 rad/s. At the same time it rotates about a vertical axis at a constant ω₁ = 0.8 rad/s and extends at a constant 1.5 m/s. Find the velocity and the acceleration at point B when s = 10 m and θ₂ = 30°.",
    "fl.equations.section.theory": "Theory",
    "fl.equations.theory.frame":
      "Attach a frame to the turret, with x̂ along the horizontal elevation axis, ŷ horizontal inside the ladder plane and ẑ up. In that frame B does something trivial — it just slides outward at a constant ṡ, so v_rel = ṡû and a_rel = 0. Everything else in the answer comes from the frame itself rotating.",
    "fl.equations.theory.omega_dot":
      "The frame's total angular velocity is the sum of the two rotations, Ω = ω₂x̂ + ω₁ẑ. Both rates are constant in magnitude, which tempts you to write Ω̇ = 0 — but x̂ is itself being dragged around ẑ by ω₁, so Ω̇ = ω₂·(ω₁ẑ × x̂) = ω₁ω₂ŷ. Dropping that Euler term is the classic mistake in this exercise.",
    "fl.equations.theory.terms":
      "The Coriolis term 2Ω×v_rel and the Euler term Ω̇×r both point out of the ladder plane, in opposite senses along x̂ — orbit the camera to see them fight each other. With the statement's numbers they nearly cancel, which is why the total acceleration ends up almost entirely inside the ladder plane and why |v| ≈ 8.68 m/s and |a| ≈ 8.67 m/s² come out coincidentally close.",
    "fl.equations.section.formulas": "Formulas",
    "fl.equations.section.reference": "Reference (statement instant)",
    "fl.equations.note.reference":
      "r = (0; 8.660; 5) m,   Ω = (0.5; 0; 0.8) rad/s,   Ω̇ = (0; 0.4; 0) rad/s².\n" +
      "Ω×r = (−6.928; −2.500; 4.330) m/s,   v_rel = (0; 1.299; 0.750) m/s.\n" +
      "v = (−6.928; −1.201; 5.080) m/s  →  |v| ≈ 8.675 m/s.\n" +
      "Ω̇×r = (2; 0; 0),   Ω×(Ω×r) = (2; −7.708; −1.250),   2Ω×v_rel = (−2.078; −0.750; 1.299) m/s².\n" +
      "a = (1.922; −8.458; 0.049) m/s²  →  |a| ≈ 8.673 m/s².",
    "fl.equations.section.plot": "Magnitudes vs. extension",
    "fl.equations.plot.note":
      "Sweeping s at the current elevation. The dashed line marks the ladder's current extension.",
    "fl.plot.magnitudes.title":
      "|v|(s) and |a|(s) at the current elevation θ₂",
  },
  es: {
    "fl.title": "Escalera de Bomberos (3D)",
    "fl.page.canvas_aria":
      "Simulador de escalera de bomberos — una escalera que se eleva, se extiende y gira en torno a un eje vertical, dibujada en una vista 3D orbitable",

    "fl.controls.section.rotation": "Rotación",
    "fl.controls.section.extension": "Extensión",
    "fl.controls.section.instant": "Instante",
    "fl.controls.section.visibility": "Visibilidad",
    "fl.controls.slider.omega1": "ω₁ — torreta, en torno al eje vertical",
    "fl.controls.slider.omega2": "ω₂ — velocidad de elevación",
    "fl.controls.slider.s_dot": "ṡ — velocidad de extensión",
    "fl.controls.slider.s0": "s₀ — extensión en t = 0",
    "fl.controls.slider.theta20": "θ₂₀ — elevación en t = 0",
    "fl.controls.toggle.velocity": "Velocidad total v",
    "fl.controls.toggle.velocity_parts": "Términos de velocidad (Ω×r, v_rel)",
    "fl.controls.toggle.accel": "Aceleración total a",
    "fl.controls.toggle.accel_parts": "Términos de aceleración (Euler, centrípeta, Coriolis)",
    "fl.controls.toggle.trace": "Traza de B",
    "fl.controls.toggle.axes": "Ejes y arcos de ω",
    "fl.controls.toggle.grid": "Grilla del suelo",
    "fl.controls.toggle.truck": "Camión y plataforma giratoria",
    "fl.controls.btn.statement": "Instante del enunciado (s = 10 m, θ₂ = 30°)",
    "fl.controls.btn.reset_camera": "Reiniciar cámara",
    "fl.controls.btn.reset": "Reiniciar",
    "fl.controls.btn.pause": "Pausar",
    "fl.controls.btn.resume": "Reanudar",
    "fl.controls.hint.drag": "Arrastrá el lienzo para orbitar la cámara.",

    "fl.canvas.point_b": "B",
    "fl.canvas.pivot": "A",
    "fl.canvas.v": "v",
    "fl.canvas.v_transport": "Ω×r",
    "fl.canvas.v_rel": "v_rel",
    "fl.canvas.a": "a",
    "fl.canvas.a_euler": "Ω̇×r",
    "fl.canvas.a_centripetal": "Ω×(Ω×r)",
    "fl.canvas.a_coriolis": "2Ω×v_rel",
    "fl.canvas.omega1": "ω₁",
    "fl.canvas.omega2": "ω₂",
    "fl.canvas.theta2": "θ₂",
    "fl.canvas.s": "s",

    "fl.metrics.heading": "Métricas en vivo",
    "fl.metrics.s": "s  (extensión)",
    "fl.metrics.theta2": "θ₂  (elevación)",
    "fl.metrics.speed": "|v|  (velocidad de B)",
    "fl.metrics.accel": "|a|  (aceleración de B)",
    "fl.metrics.v_components": "v  (x, y, z)",
    "fl.metrics.a_components": "a  (x, y, z)",
    "fl.metrics.a_euler": "|Ω̇×r|  (Euler)",
    "fl.metrics.a_centripetal": "|Ω×(Ω×r)|  (centrípeta)",
    "fl.metrics.a_coriolis": "|2Ω×v_rel|  (Coriolis)",
    "fl.metrics.frame_note":
      "Componentes en la terna solidaria a la torreta: x̂ = eje de elevación, ŷ = horizontal en el plano de la escalera, ẑ = vertical.",

    "fl.legend.heading": "Leyenda",
    "fl.legend.v": "v — velocidad total de B",
    "fl.legend.v_transport": "Ω×r — velocidad de arrastre",
    "fl.legend.v_rel": "v_rel — deslizamiento a lo largo de la escalera",
    "fl.legend.a": "a — aceleración total de B",
    "fl.legend.a_euler": "Ω̇×r — término de Euler (aceleración angular)",
    "fl.legend.a_centripetal": "Ω×(Ω×r) — término centrípeto",
    "fl.legend.a_coriolis": "2Ω×v_rel — término de Coriolis",
    "fl.legend.trace": "Traza barrida por B",

    "fl.equations.heading": "Ecuaciones",
    "fl.equations.section.statement": "Enunciado",
    "fl.equations.statement.text":
      "CCR N°14 — La escalera de bomberos se eleva con una velocidad angular constante ω₂ = 0,5 rad/seg. Simultáneamente, gira en torno a un eje vertical con una velocidad angular constante ω₁ = 0,8 rad/seg y se extiende con velocidad constante de 1,5 m/s. Determinar la velocidad y aceleración en el punto B cuando s = 10 m y θ₂ = 30°.",
    "fl.equations.section.theory": "Teoría",
    "fl.equations.theory.frame":
      "Se fija una terna a la torreta, con x̂ sobre el eje horizontal de elevación, ŷ horizontal dentro del plano de la escalera y ẑ hacia arriba. En esa terna B hace algo trivial — solo desliza hacia afuera con ṡ constante, así que v_rel = ṡû y a_rel = 0. Todo el resto de la respuesta proviene de que la terna misma rota.",
    "fl.equations.theory.omega_dot":
      "La velocidad angular total de la terna es la suma de las dos rotaciones, Ω = ω₂x̂ + ω₁ẑ. Ambas son constantes en módulo, lo que tienta a escribir Ω̇ = 0 — pero x̂ es arrastrado en torno a ẑ por ω₁, así que Ω̇ = ω₂·(ω₁ẑ × x̂) = ω₁ω₂ŷ. Olvidar ese término de Euler es el error clásico de este ejercicio.",
    "fl.equations.theory.terms":
      "El término de Coriolis 2Ω×v_rel y el de Euler Ω̇×r apuntan ambos fuera del plano de la escalera, en sentidos opuestos según x̂ — orbitá la cámara para verlos oponerse. Con los números del enunciado casi se cancelan, y por eso la aceleración total queda casi enteramente dentro del plano de la escalera, y |v| ≈ 8,68 m/s y |a| ≈ 8,67 m/s² resultan casualmente parecidos.",
    "fl.equations.section.formulas": "Fórmulas",
    "fl.equations.section.reference": "Referencia (instante del enunciado)",
    "fl.equations.note.reference":
      "r = (0; 8,660; 5) m,   Ω = (0,5; 0; 0,8) rad/s,   Ω̇ = (0; 0,4; 0) rad/s².\n" +
      "Ω×r = (−6,928; −2,500; 4,330) m/s,   v_rel = (0; 1,299; 0,750) m/s.\n" +
      "v = (−6,928; −1,201; 5,080) m/s  →  |v| ≈ 8,675 m/s.\n" +
      "Ω̇×r = (2; 0; 0),   Ω×(Ω×r) = (2; −7,708; −1,250),   2Ω×v_rel = (−2,078; −0,750; 1,299) m/s².\n" +
      "a = (1,922; −8,458; 0,049) m/s²  →  |a| ≈ 8,673 m/s².",
    "fl.equations.section.plot": "Módulos en función de la extensión",
    "fl.equations.plot.note":
      "Barriendo s con la elevación actual. La línea de trazos marca la extensión actual de la escalera.",
    "fl.plot.magnitudes.title":
      "|v|(s) y |a|(s) con la elevación θ₂ actual",
  },
};
