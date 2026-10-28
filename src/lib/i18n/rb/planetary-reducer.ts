// Strings for RB 7 — planetary reducer (CCR N°15).

export const planetaryReducer = {
  en: {
    "pr.page.canvas_aria":
      "Planetary reducer simulator — a sun gear drives three planets that roll inside a fixed ring, carried by an output arm",
    "pr.page.slow_motion": "Slow motion ×{scale} — every number shown is the real one",

    "pr.controls.section.mechanism": "Mechanism",
    "pr.controls.section.animation": "Animation",
    "pr.controls.section.visibility": "Visibility",
    "pr.controls.btn.statement": "Statement values (1200 rpm, r = 20 cm)",
    "pr.controls.slider.rpm_sun": "ω_A — sun speed",
    "pr.controls.slider.sun_radius": "r_A — sun radius",
    "pr.controls.slider.planet_radius": "r — planet radius",
    "pr.controls.derived.ring": "r_E = r_A + 2r — ring radius (derived)",
    "pr.controls.slider.time_scale": "Slow motion factor",
    "pr.controls.toggle.velocity": "Velocities v_J and v_O",
    "pr.controls.toggle.center": "Planet's instantaneous centre (CIR)",
    "pr.controls.toggle.carrier": "Carrier arm",
    "pr.controls.toggle.marks": "Rim marks (show each spin)",
    "pr.controls.btn.reset": "Reset",
    "pr.controls.btn.play": "Play",
    "pr.controls.btn.pause": "Pause",

    "pr.canvas.v_j": "v_J",
    "pr.canvas.v_o": "v_O",
    "pr.canvas.cir": "CIR",
    "pr.canvas.ring": "E (fixed)",

    "pr.metrics.heading": "Live Metrics",
    "pr.metrics.sun_angle": "Sun A turned",
    "pr.metrics.carrier_angle": "Carrier turned",
    "pr.metrics.planet_spin": "Planet B spun",
    "pr.metrics.ring_radius": "r_E (derived)",
    "pr.metrics.answer_heading": "Answer",
    "pr.metrics.v_j": "v_J — sun–planet contact",
    "pr.metrics.v_o": "v_O — planet centre",
    "pr.metrics.omega_planet": "ω_planet",
    "pr.metrics.omega_carrier": "ω_carrier",
    "pr.metrics.ratio": "Reduction ratio",
    "pr.metrics.cw": "clockwise",
    "pr.metrics.ccw": "counterclockwise",

    "pr.legend.heading": "Legend",
    "pr.legend.sun": "A — sun gear (input)",
    "pr.legend.planet": "B, C, D — planets",
    "pr.legend.ring": "E — fixed ring",
    "pr.legend.carrier": "Carrier arm (output)",
    "pr.legend.velocity": "v_J, v_O — velocity of the contact and of the planet centre",
    "pr.legend.cir": "CIR — planet's instantaneous centre of rotation, on the fixed ring",

    "pr.equations.heading": "Equations",
    "pr.equations.section.statement": "Statement",
    "pr.equations.statement.text":
      "Sun gear A and the three planets B, C and D all have radius r = 20 cm. The outer ring E is fixed. Sun A turns at 1200 rpm counterclockwise. Find the speed of the sun–planet contact point and of the planet centre, the angular velocity of the planets, and the angular velocity of the carrier arm that holds their centres.",
    "pr.equations.section.theory": "Theory",
    "pr.equations.theory.cir":
      "The planet rolls without slipping on the fixed ring, so its point of contact with the ring has zero velocity: that point is the planet's instantaneous centre of rotation (CIR). The whole solution hangs off it.",
    "pr.equations.theory.chain":
      "J, the sun–planet contact, belongs to both bodies, so its speed is the sun's rim speed, v_J = ω_A·r_A. J lies a full diameter (2r) from the CIR, which gives ω_planet. The planet centre O lies one radius from it, so v_O is exactly half of v_J. O travels on a circle of radius r_A + r, which gives the carrier's ω.",
    "pr.equations.theory.ring":
      "The ring's inner radius is not in the statement. The sun and the planet both touch the ring's diameter line, so r_E = r_A + 2r = 60 cm. Derived here, not given.",
    "pr.equations.theory.senses":
      "The planet turns the opposite way to the sun (it rolls inside a fixed ring) and the carrier follows the sun. Planets C and D are there only to balance the load: each has exactly the kinematics of B and adds nothing to the solution.",
    "pr.equations.section.formulas": "Formulas",
    "pr.equations.section.reference": "Reference (statement values)",
    "pr.equations.note.reference":
      "v_J = 25.13 m/s,   v_O = 12.57 m/s.\n" +
      "ω_planet = 600 rpm clockwise,   ω_carrier = 300 rpm counterclockwise.\n" +
      "Reduction ratio ω_carrier / ω_A = r_A / (r_A + r_E) = 1/4.",
  },
  es: {
    "pr.page.canvas_aria":
      "Simulador de reductor planetario — un engranaje solar impulsa tres planetas que ruedan dentro de una corona fija, sostenidos por un brazo de salida",
    "pr.page.slow_motion":
      "Cámara lenta ×{scale} — todos los números mostrados son los reales",

    "pr.controls.section.mechanism": "Mecanismo",
    "pr.controls.section.animation": "Animación",
    "pr.controls.section.visibility": "Visibilidad",
    "pr.controls.btn.statement": "Valores del enunciado (1200 rpm, r = 20 cm)",
    "pr.controls.slider.rpm_sun": "ω_A — velocidad del solar",
    "pr.controls.slider.sun_radius": "r_A — radio del solar",
    "pr.controls.slider.planet_radius": "r — radio de los planetas",
    "pr.controls.derived.ring": "r_E = r_A + 2r — radio de la corona (derivado)",
    "pr.controls.slider.time_scale": "Factor de cámara lenta",
    "pr.controls.toggle.velocity": "Velocidades v_J y v_O",
    "pr.controls.toggle.center": "Centro instantáneo de rotación (CIR) del planeta",
    "pr.controls.toggle.carrier": "Brazo portaplanetas",
    "pr.controls.toggle.marks": "Marcas en el borde (muestran cada giro)",
    "pr.controls.btn.reset": "Reiniciar",
    "pr.controls.btn.play": "Reproducir",
    "pr.controls.btn.pause": "Pausar",

    "pr.canvas.v_j": "v_J",
    "pr.canvas.v_o": "v_O",
    "pr.canvas.cir": "CIR",
    "pr.canvas.ring": "E (fija)",

    "pr.metrics.heading": "Métricas en vivo",
    "pr.metrics.sun_angle": "Giro del solar A",
    "pr.metrics.carrier_angle": "Giro del brazo",
    "pr.metrics.planet_spin": "Giro del planeta B",
    "pr.metrics.ring_radius": "r_E (derivado)",
    "pr.metrics.answer_heading": "Respuesta",
    "pr.metrics.v_j": "v_J — contacto solar–planeta",
    "pr.metrics.v_o": "v_O — centro del planeta",
    "pr.metrics.omega_planet": "ω_planeta",
    "pr.metrics.omega_carrier": "ω_brazo",
    "pr.metrics.ratio": "Relación de reducción",
    "pr.metrics.cw": "horario",
    "pr.metrics.ccw": "antihorario",

    "pr.legend.heading": "Leyenda",
    "pr.legend.sun": "A — engranaje solar (entrada)",
    "pr.legend.planet": "B, C, D — planetas",
    "pr.legend.ring": "E — corona fija",
    "pr.legend.carrier": "Brazo portaplanetas (salida)",
    "pr.legend.velocity": "v_J, v_O — velocidad del contacto y del centro del planeta",
    "pr.legend.cir":
      "CIR — centro instantáneo de rotación del planeta, sobre la corona fija",

    "pr.equations.heading": "Ecuaciones",
    "pr.equations.section.statement": "Enunciado",
    "pr.equations.statement.text":
      "El engranaje solar A y los tres planetas B, C y D tienen todos radio r = 20 cm. La corona exterior E está fija. El solar A gira a 1200 rpm en sentido antihorario. Hallar la velocidad del punto de contacto solar–planeta y del centro del planeta, la velocidad angular de los planetas y la velocidad angular del brazo que sostiene sus centros.",
    "pr.equations.section.theory": "Teoría",
    "pr.equations.theory.cir":
      "El planeta rueda sin deslizar sobre la corona fija, así que su punto de contacto con la corona tiene velocidad nula: ese punto es el centro instantáneo de rotación (CIR) del planeta. Toda la solución cuelga de él.",
    "pr.equations.theory.chain":
      "J, el contacto solar–planeta, pertenece a ambos cuerpos, así que su velocidad es la del borde del solar, v_J = ω_A·r_A. J está a un diámetro completo (2r) del CIR, lo que da ω_planeta. El centro O del planeta está a un radio, así que v_O es exactamente la mitad de v_J. O recorre una circunferencia de radio r_A + r, lo que da la ω del brazo.",
    "pr.equations.theory.ring":
      "El radio interior de la corona no está en el enunciado. El solar y el planeta apoyan ambos sobre la recta diametral de la corona, así que r_E = r_A + 2r = 60 cm. Se deduce acá, no es dato.",
    "pr.equations.theory.senses":
      "El planeta gira en sentido contrario al solar (rueda dentro de una corona fija) y el brazo sigue al solar. Los planetas C y D están sólo para equilibrar la carga: cada uno tiene exactamente la cinemática de B y no aporta nada a la solución.",
    "pr.equations.section.formulas": "Fórmulas",
    "pr.equations.section.reference": "Referencia (valores del enunciado)",
    "pr.equations.note.reference":
      "v_J = 25,13 m/s,   v_O = 12,57 m/s.\n" +
      "ω_planeta = 600 rpm en sentido horario,   ω_brazo = 300 rpm en sentido antihorario.\n" +
      "Relación de reducción ω_brazo / ω_A = r_A / (r_A + r_E) = 1/4.",
  },
} as const;
