export const viscousImpact = {
  en: {
    "viscous-impact.page.canvas_aria":
      "Viscous impact simulator — a bullet decelerating linearly with distance through a plate and into a thick block",

    "viscous-impact.controls.section.bullet": "Bullet & plate",
    "viscous-impact.controls.section.visibility": "Visibility",
    "viscous-impact.controls.slider.mass": "Bullet mass",
    "viscous-impact.controls.slider.entry_speed": "Entry speed v_e",
    "viscous-impact.controls.slider.exit_speed": "Exit speed v_s",
    "viscous-impact.controls.slider.thickness": "Plate thickness e",
    "viscous-impact.controls.toggle.bullet": "Bullet + track",
    "viscous-impact.controls.toggle.velocity": "Velocity arrow",
    "viscous-impact.controls.btn.reset": "Reset",
    "viscous-impact.controls.btn.pause": "Pause",
    "viscous-impact.controls.btn.resume": "Resume",

    "viscous-impact.canvas.plate": "plate",
    "viscous-impact.canvas.block": "thick block (same material)",
    "viscous-impact.canvas.invalid": "Exit speed must be less than entry speed",

    "viscous-impact.metrics.heading": "Live Metrics",
    "viscous-impact.metrics.decel": "dv/dx  (deceleration rate)",
    "viscous-impact.metrics.k": "k  (drag constant)",
    "viscous-impact.metrics.penetration": "x_max  (penetration depth)",
    "viscous-impact.metrics.warn.invalid":
      "⚠ Exit speed must be less than entry speed for the bullet to be decelerating.",

    "viscous-impact.legend.heading": "Legend",
    "viscous-impact.legend.plate": "Plate (25 mm by default)",
    "viscous-impact.legend.bullet": "Bullet",
    "viscous-impact.legend.velocity": "Velocity direction",

    "viscous-impact.equations.heading": "Equations",
    "viscous-impact.equations.section.statement": "Statement",
    "viscous-impact.equations.statement.text":
      "A 14 g bullet at 500 m/s crosses a 25 mm plate and exits at 200 m/s, slowed by a viscous force F = −kv. Find how far it would penetrate a thick block of the same material.",
    "viscous-impact.equations.section.theory": "Theory",
    "viscous-impact.equations.theory.text":
      "Why v(x) is linear, not exponential: viscous drag F = −kv usually gives an exponential decay in TIME (as in the parachutist, PD 2) — but here we track the bullet through a fixed thickness, not a fixed duration. Writing acceleration as v·dv/dx (the standard trick for motion in a known DISTANCE) turns ma = −kv into m·v·dv/dx = −kv, and the v cancels: dv/dx = −k/m is simply constant. Speed falls off linearly with distance traveled, however it varies with time.",
    "viscous-impact.equations.section.formulas": "Formulas",
    "viscous-impact.equations.section.reference": "Reference (default values)",
    "viscous-impact.equations.note.reference":
      "k/m = (500 − 200) / 0.025 = 12 000 /s.\n" +
      "k = 0.014 kg × 12 000 /s = 168 N·s/m.\n" +
      "x_max = 500 / 12 000 ≈ 0.0417 m = 41.7 mm.",
    "viscous-impact.equations.section.plot": "Speed vs. penetration depth",
    "viscous-impact.plot.vx.title": "v(x) — speed falling off linearly with depth",
  },
  es: {
    "viscous-impact.page.canvas_aria":
      "Simulador de impacto viscoso — una bala que se frena linealmente con la distancia al atravesar una placa y penetrar un bloque grueso",

    "viscous-impact.controls.section.bullet": "Bala y placa",
    "viscous-impact.controls.section.visibility": "Visibilidad",
    "viscous-impact.controls.slider.mass": "Masa de la bala",
    "viscous-impact.controls.slider.entry_speed": "Velocidad de entrada v_e",
    "viscous-impact.controls.slider.exit_speed": "Velocidad de salida v_s",
    "viscous-impact.controls.slider.thickness": "Espesor de la placa e",
    "viscous-impact.controls.toggle.bullet": "Bala + trayectoria",
    "viscous-impact.controls.toggle.velocity": "Flecha de velocidad",
    "viscous-impact.controls.btn.reset": "Reiniciar",
    "viscous-impact.controls.btn.pause": "Pausar",
    "viscous-impact.controls.btn.resume": "Reanudar",

    "viscous-impact.canvas.plate": "placa",
    "viscous-impact.canvas.block": "bloque grueso (mismo material)",
    "viscous-impact.canvas.invalid":
      "La velocidad de salida debe ser menor que la de entrada",

    "viscous-impact.metrics.heading": "Métricas en vivo",
    "viscous-impact.metrics.decel": "dv/dx  (tasa de desaceleración)",
    "viscous-impact.metrics.k": "k  (constante de arrastre)",
    "viscous-impact.metrics.penetration": "x_max  (profundidad de penetración)",
    "viscous-impact.metrics.warn.invalid":
      "⚠ La velocidad de salida debe ser menor que la de entrada para que la bala se esté frenando.",

    "viscous-impact.legend.heading": "Leyenda",
    "viscous-impact.legend.plate": "Placa (25 mm por defecto)",
    "viscous-impact.legend.bullet": "Bala",
    "viscous-impact.legend.velocity": "Dirección de la velocidad",

    "viscous-impact.equations.heading": "Ecuaciones",
    "viscous-impact.equations.section.statement": "Enunciado",
    "viscous-impact.equations.statement.text":
      "Una bala de 14 g a 500 m/s atraviesa una placa de 25 mm y sale a 200 m/s, frenada por una fuerza viscosa F = −kv. Hallar cuánto penetraría en un bloque grueso del mismo material.",
    "viscous-impact.equations.section.theory": "Teoría",
    "viscous-impact.equations.theory.text":
      "Por qué v(x) es lineal y no exponencial: la resistencia viscosa F = −kv suele dar una caída exponencial en el TIEMPO (como en el paracaidista, PD 2) — pero aquí seguimos a la bala a través de un espesor fijo, no de una duración fija. Escribir la aceleración como v·dv/dx (el truco habitual para movimiento en una DISTANCIA conocida) convierte ma = −kv en m·v·dv/dx = −kv, y la v se cancela: dv/dx = −k/m es simplemente constante. La rapidez cae linealmente con la distancia recorrida, aunque varíe con el tiempo.",
    "viscous-impact.equations.section.formulas": "Fórmulas",
    "viscous-impact.equations.section.reference": "Referencia (valores por defecto)",
    "viscous-impact.equations.note.reference":
      "k/m = (500 − 200) / 0,025 = 12 000 /s.\n" +
      "k = 0,014 kg × 12 000 /s = 168 N·s/m.\n" +
      "x_max = 500 / 12 000 ≈ 0,0417 m = 41,7 mm.",
    "viscous-impact.equations.section.plot": "Rapidez vs. profundidad de penetración",
    "viscous-impact.plot.vx.title":
      "v(x) — la rapidez cae linealmente con la profundidad",
  },
};
