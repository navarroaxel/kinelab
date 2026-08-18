export const jetClimb = {
  en: {
    "jc.title": "Jet Climb to Level Flight",
    "jc.page.canvas_aria":
      "Jet aircraft simulator — leveling off from a steady climb, speed approaching its terminal value under quadratic drag",

    "jc.controls.section.climb": "Climb",
    "jc.controls.section.engines": "Engines",
    "jc.controls.section.visibility": "Visibility",
    "jc.controls.slider.mass": "Aircraft mass m",
    "jc.controls.slider.angle": "Climb angle θ",
    "jc.controls.slider.climb_speed": "Climb speed v_0",
    "jc.controls.slider.mass_flow": "Intake mass flow ṁ",
    "jc.controls.slider.exhaust_velocity": "Exhaust velocity (rel.) v_rel",
    "jc.controls.toggle.vectors": "Thrust / drag vectors",
    "jc.controls.toggle.speed_lines": "Speed lines",
    "jc.controls.btn.reset": "Reset",
    "jc.controls.btn.pause": "Pause",
    "jc.controls.btn.resume": "Resume",

    "jc.metrics.heading": "Live Metrics",
    "jc.metrics.a0": "a_0  (initial accel.)",
    "jc.metrics.vmax": "v_max  (terminal speed)",

    "jc.legend.heading": "Legend",
    "jc.legend.path": "Climb path → level flight",
    "jc.legend.speed_lines": "Speed lines (scroll rate ∝ v)",
    "jc.legend.thrust": "T, engine thrust",
    "jc.legend.drag": "D, aerodynamic drag (∝ v²)",

    "jc.equations.heading": "Equations",
    "jc.equations.section.statement": "Statement",
    "jc.equations.statement.text":
      "A 16-Mg jet aircraft maintains a constant speed of 774 km/h while climbing at an angle of 18°. The plane takes in air at the rate of 300 kg/s and discharges it with a velocity, relative to the plane, of 665 m/s. If the pilot changes to a horizontal flight while maintaining the same engine setting, determine (a) the aircraft's initial acceleration, and (b) the maximum horizontal speed it will attain. Assume that the drag due to air friction is proportional to the square of the speed.",
    "jc.equations.section.theory": "Theory",
    "jc.equations.theory.thrust":
      "Steady-flow thrust: the same control-volume argument as a rocket or a helicopter's rotor — the engines take in air at (essentially) the plane's own speed and expel it at v_rel relative to the aircraft. The momentum change per unit time is the thrust, T = ṁ·v_rel, and it doesn't depend on the aircraft's own speed as long as the mass flow and relative exhaust speed stay the same.",
    "jc.equations.theory.climb":
      "The climb fixes the drag law: during the climb, speed is constant, so ΣF along the flight path is zero — thrust balances drag plus the weight component pulling the plane back down the incline, T = D_0 + m·g·sen θ. With D = k·v² for some constant k, that one equation at v_0 pins down k.",
    "jc.equations.theory.level":
      "Leveling off: the instant the pilot flies horizontal, v hasn't changed yet, so drag is still D_0 — but gravity no longer has a component along the path, so the net force jumps to T − D_0 = m·g·sen θ, giving a_0 = g·sen θ exactly. From there, m·dv/dt = T − k·v² is a separable ODE with an exact tanh solution; speed climbs from v_0 and asymptotically approaches the terminal speed v_max = √(T/k), where thrust and drag finally balance again.",
    "jc.equations.section.formulas": "Formulas",
    "jc.equations.section.reference": "Reference (default values)",
    "jc.equations.note.reference":
      "T = 300×665 = 199 500 N.\n" +
      "v_0 = 774/3.6 = 215 m/s; m·g·sen 18° ≈ 48 503 N; D_0 = T − 48 503 ≈ 150 997 N; k ≈ 3.266 N·s²/m².\n" +
      "a_0 = g·sen 18° ≈ 3.03 m/s².\n" +
      "v_max = √(T/k) ≈ 247.1 m/s ≈ 889.7 km/h.",
    "jc.equations.section.plot": "Speed vs. time after leveling off",
    "jc.plot.speed_t.title": "v(t) — horizontal speed after leveling off",
    "jc.equations.note.units":
      "SI units throughout: kg, m/s, N, and g = 9.81 m/s², as in the original statement.",
  },
  es: {
    "jc.title": "Ascenso de un Avión a Vuelo Horizontal",
    "jc.page.canvas_aria":
      "Simulador de avión a propulsión — pasando de un ascenso constante a vuelo horizontal, con la rapidez acercándose a su valor terminal bajo arrastre cuadrático",

    "jc.controls.section.climb": "Ascenso",
    "jc.controls.section.engines": "Motores",
    "jc.controls.section.visibility": "Visibilidad",
    "jc.controls.slider.mass": "Masa del avión m",
    "jc.controls.slider.angle": "Ángulo de ascenso θ",
    "jc.controls.slider.climb_speed": "Rapidez de ascenso v_0",
    "jc.controls.slider.mass_flow": "Caudal másico de admisión ṁ",
    "jc.controls.slider.exhaust_velocity": "Velocidad de descarga (rel.) v_rel",
    "jc.controls.toggle.vectors": "Vectores empuje / arrastre",
    "jc.controls.toggle.speed_lines": "Líneas de velocidad",
    "jc.controls.btn.reset": "Reiniciar",
    "jc.controls.btn.pause": "Pausar",
    "jc.controls.btn.resume": "Reanudar",

    "jc.metrics.heading": "Métricas en vivo",
    "jc.metrics.a0": "a_0  (aceleración inicial)",
    "jc.metrics.vmax": "v_max  (rapidez terminal)",

    "jc.legend.heading": "Leyenda",
    "jc.legend.path": "Trayectoria de ascenso → vuelo horizontal",
    "jc.legend.speed_lines": "Líneas de velocidad (desplazamiento ∝ v)",
    "jc.legend.thrust": "T, empuje de los motores",
    "jc.legend.drag": "D, arrastre aerodinámico (∝ v²)",

    "jc.equations.heading": "Ecuaciones",
    "jc.equations.section.statement": "Enunciado",
    "jc.equations.statement.text":
      "Un avión a propulsión de 16 Mg mantiene una rapidez constante de 774 km/h mientras asciende a un ángulo de 18°. El avión succiona aire a razón de 300 kg/s y lo descarga con una velocidad, relativa a la nave, de 665 m/s. Si el piloto cambia a vuelo horizontal mientras mantiene los motores funcionando igual que antes, determine a) la aceleración inicial del avión, y b) la máxima rapidez horizontal que alcanzará. Suponga que el arrastre debido a la fricción del aire es proporcional al cuadrado de la rapidez.",
    "jc.equations.section.theory": "Teoría",
    "jc.equations.theory.thrust":
      "Empuje en flujo permanente: el mismo argumento de volumen de control que en un cohete o el rotor de un helicóptero — los motores toman aire a (esencialmente) la rapidez propia del avión y lo expulsan a v_rel relativa a la nave. El cambio de cantidad de movimiento por unidad de tiempo es el empuje, T = ṁ·v_rel, y no depende de la rapidez propia del avión mientras el caudal másico y la velocidad de descarga relativa se mantengan iguales.",
    "jc.equations.theory.climb":
      "El ascenso fija la ley de arrastre: durante el ascenso la rapidez es constante, así que ΣF a lo largo de la trayectoria es cero — el empuje equilibra el arrastre más la componente del peso que tira al avión hacia abajo por la pendiente, T = D_0 + m·g·sen θ. Con D = k·v² para alguna constante k, esa única ecuación en v_0 determina k.",
    "jc.equations.theory.level":
      "Al nivelar el vuelo: en el instante en que el piloto pasa a vuelo horizontal, v todavía no cambió, así que el arrastre sigue siendo D_0 — pero la gravedad ya no tiene componente a lo largo de la trayectoria, así que la fuerza neta salta a T − D_0 = m·g·sen θ, dando a_0 = g·sen θ exactamente. A partir de ahí, m·dv/dt = T − k·v² es una ecuación diferencial separable con solución exacta en tanh; la rapidez crece desde v_0 y se acerca asintóticamente a la rapidez terminal v_max = √(T/k), donde empuje y arrastre vuelven a equilibrarse.",
    "jc.equations.section.formulas": "Fórmulas",
    "jc.equations.section.reference": "Referencia (valores por defecto)",
    "jc.equations.note.reference":
      "T = 300×665 = 199 500 N.\n" +
      "v_0 = 774/3,6 = 215 m/s; m·g·sen 18° ≈ 48 503 N; D_0 = T − 48 503 ≈ 150 997 N; k ≈ 3,266 N·s²/m².\n" +
      "a_0 = g·sen 18° ≈ 3,03 m/s².\n" +
      "v_max = √(T/k) ≈ 247,1 m/s ≈ 889,7 km/h.",
    "jc.equations.section.plot": "Rapidez vs. tiempo tras nivelar el vuelo",
    "jc.plot.speed_t.title":
      "v(t) — rapidez horizontal tras nivelar el vuelo",
    "jc.equations.note.units":
      "Unidades del SI en todo el ejercicio: kg, m/s, N y g = 9,81 m/s², como en el enunciado original.",
  },
};
