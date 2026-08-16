export const forcedVibration = {
  en: {
    "fv.title": "Forced Vibration with Viscous Damping",
    "fv.page.canvas_aria":
      "Forced vibration simulator — a mass on a spring and a dashpot driven by a harmonic force",

    "fv.controls.section.case": "Case",
    "fv.controls.section.system": "System",
    "fv.controls.section.force": "Applied force",
    "fv.controls.section.view": "View",
    "fv.controls.btn.forced": "Forced",
    "fv.controls.btn.free": "Free response",
    "fv.controls.btn.with_damping": "c = 500",
    "fv.controls.btn.no_damping": "c = 0",
    "fv.controls.slider.mass": "m — mass",
    "fv.controls.slider.stiffness": "k — stiffness",
    "fv.controls.slider.damping": "c — viscous damping",
    "fv.controls.slider.force_amplitude": "F₀ — force amplitude",
    "fv.controls.slider.forcing_omega": "ω — forcing frequency",
    "fv.controls.slider.slow_motion": "slow motion",
    "fv.controls.toggle.applied": "Applied force F(t)",
    "fv.controls.toggle.spring": "Spring force",
    "fv.controls.toggle.damper": "Damper force",
    "fv.controls.toggle.envelope": "Steady-state band ±X",
    "fv.controls.toggle.equilibrium": "Static equilibrium line",
    "fv.controls.btn.reset": "Reset",
    "fv.controls.btn.play": "Play",
    "fv.controls.btn.pause": "Pause",

    "fv.canvas.spring": "k",
    "fv.canvas.damper": "c",
    "fv.canvas.force": "F",
    "fv.canvas.equilibrium": "x = 0",
    "fv.canvas.amplitude": "X",

    "fv.metrics.heading": "Live Metrics",
    "fv.metrics.natural": "ω_n  (natural frequency)",
    "fv.metrics.natural_hz": "f_n",
    "fv.metrics.zeta": "ζ  (damping ratio)",
    "fv.metrics.ratio": "r = ω/ω_n",
    "fv.metrics.static": "δ_st = F₀/k",
    "fv.metrics.damped_omega": "ω_d  (damped frequency)",
    "fv.metrics.displacement": "x(t)",
    "fv.metrics.force": "F(t)",
    "fv.metrics.answer_heading": "Answer",
    "fv.metrics.amplitude": "X  with c = 500",
    "fv.metrics.amplitude_undamped": "X  with c = 0",
    "fv.metrics.magnification": "magnification ×",
    "fv.metrics.no_damper": "damper removed",
    "fv.metrics.free.undamped":
      "Free response, no damping: the mass rings at ω_n forever, with whatever amplitude it started with. Nothing takes energy out.",
    "fv.metrics.free.underdamped":
      "Free response, underdamped: rings at ω_d inside a decaying e^(−ζ·ω_n·t) envelope, losing the same fraction of amplitude every cycle.",
    "fv.metrics.free.critical":
      "Free response, critically damped: returns to equilibrium as fast as possible without overshooting — no oscillation at all.",
    "fv.metrics.free.overdamped":
      "Free response, overdamped: crawls back to equilibrium without oscillating, and slower than critical damping would.",

    "fv.legend.heading": "Legend",
    "fv.legend.force": "F(t) = F₀·cos(ω·t) — the applied force",
    "fv.legend.spring": "Spring force, −k·x",
    "fv.legend.damper": "Damper force, −c·ẋ",
    "fv.legend.envelope": "±X — the steady-state amplitude",

    "fv.equations.heading": "Equations",
    "fv.equations.section.statement": "Statement",
    "fv.equations.statement.text":
      "A 10 kg mass hangs from a spring of stiffness k = 100 kN/m in parallel with a viscous damper, and is driven by F = 1000·cos(120t) N. Calculate the steady-state amplitude of the mass for a viscous damping coefficient c = 500 N·s/m and for c = 0. Determine as well the natural or free response of the system, with and without damping.",
    "fv.equations.section.theory": "Theory",
    "fv.equations.theory.three":
      "Three numbers decide everything here. ω_n = √(k/m) = 100 rad/s is the system's own frequency, nothing to do with the force. ζ = c/(2√(k·m)) says how much damping there is as a fraction of the critical amount — 500/2000 = 0.25 here. And r = ω/ω_n = 1.2 says how hard the forcing pushes against that natural frequency. Everything the mass does is a function of those three.",
    "fv.equations.theory.steady":
      "The steady state is a sinusoid at the *forcing* frequency ω, never at ω_n — the system ends up doing what it is told, just with a size and a lag of its own choosing. Dividing the amplitude by δ_st = F₀/k, what the force would deflect the spring if applied slowly, leaves a pure magnification factor: X/δ_st = 1/√[(1−r²)² + (2ζr)²]. It is 1 at low frequency, peaks near r = 1 and dies away above it.",
    "fv.equations.theory.free":
      "The free response is the other half of the solution, the one the initial conditions set, and it is the only place ω_n appears in the motion. Undamped it rings at ω_n and never stops. Underdamped it rings a touch slower, at ω_d = ω_n√(1−ζ²) = 96.8 rad/s, inside an e^(−ζ·ω_n·t) = e^(−25t) envelope. That transient is exactly what you see dying out in the first plot before the steady state takes over.",
    "fv.equations.theory.damping_helps":
      "Worth noticing which way the damping goes here. At r = 1.2 the system is running *above* resonance, and removing the damper makes the amplitude worse, not better — 22.7 mm against 13.4 mm. Damping only ever helps near r = 1; far above it the (1−r²)² term dominates and the damper contributes little except, in this case, some welcome extra denominator. Drag ω down toward 100 rad/s and watch the two curves in the second plot separate dramatically.",
    "fv.equations.section.formulas": "Formulas",
    "fv.equations.section.reference": "Reference (statement values)",
    "fv.equations.note.reference":
      "ω_n = √(100000/10) = 100 rad/s,   c_c = 2√(100000×10) = 2000 N·s/m.\n" +
      "ζ = 500/2000 = 0.25,   r = 120/100 = 1.2,   δ_st = 1000/100000 = 10 mm.\n" +
      "X = 10 / √[(1 − 1.44)² + (2×0.25×1.2)²] = 10/√0.5536 = 13.44 mm  (c = 500).\n" +
      "X = 10 / |1 − 1.44| = 10/0.44 = 22.73 mm  (c = 0).\n" +
      "Free: ω_n = 100 rad/s undamped;  ω_d = 96.83 rad/s with an e^(−25t) envelope.",
    "fv.equations.section.response": "Response x(t)",
    "fv.equations.response.note":
      "Integrated from the chosen initial conditions, not assumed. With the force on you can watch the transient die out and leave the ±X band behind; with it off, this is the free response on its own.",
    "fv.equations.section.plot": "Magnification factor",
    "fv.equations.plot.note":
      "X/δ_st against the frequency ratio r, for the current damping and for none at all. The solid vertical line is where this system is running; the dashed one is resonance. The curves are clipped at 6 — without damping the undamped one is genuinely infinite at r = 1.",
    "fv.plot.response.title": "x(t) — displacement of the mass over time",
    "fv.plot.magnification.title":
      "X/δ_st against frequency ratio, with and without damping",
  },
  es: {
    "fv.title": "Vibración Forzada con Amortiguamiento Viscoso",
    "fv.page.canvas_aria":
      "Simulador de vibración forzada — una masa sobre un resorte y un amortiguador excitada por una fuerza armónica",

    "fv.controls.section.case": "Caso",
    "fv.controls.section.system": "Sistema",
    "fv.controls.section.force": "Fuerza aplicada",
    "fv.controls.section.view": "Vista",
    "fv.controls.btn.forced": "Forzada",
    "fv.controls.btn.free": "Respuesta libre",
    "fv.controls.btn.with_damping": "c = 500",
    "fv.controls.btn.no_damping": "c = 0",
    "fv.controls.slider.mass": "m — masa",
    "fv.controls.slider.stiffness": "k — rigidez",
    "fv.controls.slider.damping": "c — amortiguamiento viscoso",
    "fv.controls.slider.force_amplitude": "F₀ — amplitud de la fuerza",
    "fv.controls.slider.forcing_omega": "ω — frecuencia de excitación",
    "fv.controls.slider.slow_motion": "cámara lenta",
    "fv.controls.toggle.applied": "Fuerza aplicada F(t)",
    "fv.controls.toggle.spring": "Fuerza del resorte",
    "fv.controls.toggle.damper": "Fuerza del amortiguador",
    "fv.controls.toggle.envelope": "Banda estacionaria ±X",
    "fv.controls.toggle.equilibrium": "Línea de equilibrio estático",
    "fv.controls.btn.reset": "Reiniciar",
    "fv.controls.btn.play": "Reproducir",
    "fv.controls.btn.pause": "Pausar",

    "fv.canvas.spring": "k",
    "fv.canvas.damper": "c",
    "fv.canvas.force": "F",
    "fv.canvas.equilibrium": "x = 0",
    "fv.canvas.amplitude": "X",

    "fv.metrics.heading": "Métricas en vivo",
    "fv.metrics.natural": "ω_n  (frecuencia natural)",
    "fv.metrics.natural_hz": "f_n",
    "fv.metrics.zeta": "ζ  (factor de amortiguamiento)",
    "fv.metrics.ratio": "r = ω/ω_n",
    "fv.metrics.static": "δ_st = F₀/k",
    "fv.metrics.damped_omega": "ω_d  (frecuencia amortiguada)",
    "fv.metrics.displacement": "x(t)",
    "fv.metrics.force": "F(t)",
    "fv.metrics.answer_heading": "Respuesta",
    "fv.metrics.amplitude": "X  con c = 500",
    "fv.metrics.amplitude_undamped": "X  con c = 0",
    "fv.metrics.magnification": "amplificación ×",
    "fv.metrics.no_damper": "sin amortiguador",
    "fv.metrics.free.undamped":
      "Respuesta libre sin amortiguamiento: la masa oscila a ω_n indefinidamente, con la amplitud con la que arrancó. Nada le saca energía.",
    "fv.metrics.free.underdamped":
      "Respuesta libre subamortiguada: oscila a ω_d dentro de una envolvente decreciente e^(−ζ·ω_n·t), perdiendo la misma fracción de amplitud en cada ciclo.",
    "fv.metrics.free.critical":
      "Respuesta libre con amortiguamiento crítico: vuelve al equilibrio lo más rápido posible sin pasarse — sin oscilar nada.",
    "fv.metrics.free.overdamped":
      "Respuesta libre sobreamortiguada: vuelve al equilibrio sin oscilar, y más lento de lo que lo haría con amortiguamiento crítico.",

    "fv.legend.heading": "Leyenda",
    "fv.legend.force": "F(t) = F₀·cos(ω·t) — la fuerza aplicada",
    "fv.legend.spring": "Fuerza del resorte, −k·x",
    "fv.legend.damper": "Fuerza del amortiguador, −c·ẋ",
    "fv.legend.envelope": "±X — la amplitud en estado estacionario",

    "fv.equations.heading": "Ecuaciones",
    "fv.equations.section.statement": "Enunciado",
    "fv.equations.statement.text":
      "Una masa de 10 kg cuelga de un resorte de rigidez k = 100 kN/m en paralelo con un amortiguador viscoso, y está sometida a F = 1000·cos(120t) N. Calcular la amplitud en estado estacionario de la masa sometida a una fuerza periódica para un coeficiente de amortiguamiento viscoso c = 500 N·s/m y para c = 0. Determinar además la respuesta natural o libre del sistema con y sin amortiguamiento.",
    "fv.equations.section.theory": "Teoría",
    "fv.equations.theory.three":
      "Acá todo lo deciden tres números. ω_n = √(k/m) = 100 rad/s es la frecuencia propia del sistema, sin relación con la fuerza. ζ = c/(2√(k·m)) dice cuánto amortiguamiento hay como fracción del crítico — 500/2000 = 0,25 en este caso. Y r = ω/ω_n = 1,2 dice con cuánta insistencia la excitación empuja contra esa frecuencia natural. Todo lo que hace la masa es función de esos tres.",
    "fv.equations.theory.steady":
      "El estado estacionario es una sinusoide a la frecuencia de *excitación* ω, nunca a ω_n — el sistema termina haciendo lo que se le ordena, solo que con un tamaño y un retraso propios. Dividiendo la amplitud por δ_st = F₀/k, lo que la fuerza deformaría al resorte si se aplicara lentamente, queda un factor de amplificación puro: X/δ_st = 1/√[(1−r²)² + (2ζr)²]. Vale 1 a baja frecuencia, tiene un pico cerca de r = 1 y se apaga por encima.",
    "fv.equations.theory.free":
      "La respuesta libre es la otra mitad de la solución, la que fijan las condiciones iniciales, y es el único lugar donde ω_n aparece en el movimiento. Sin amortiguar oscila a ω_n y no para nunca. Subamortiguada oscila un poco más lento, a ω_d = ω_n√(1−ζ²) = 96,8 rad/s, dentro de una envolvente e^(−ζ·ω_n·t) = e^(−25t). Ese transitorio es exactamente lo que se ve morir en el primer gráfico antes de que quede el estacionario.",
    "fv.equations.theory.damping_helps":
      "Vale la pena notar para qué lado juega el amortiguamiento acá. Con r = 1,2 el sistema trabaja *por encima* de la resonancia, y sacar el amortiguador empeora la amplitud en vez de mejorarla — 22,7 mm contra 13,4 mm. El amortiguamiento solo ayuda de verdad cerca de r = 1; muy por encima manda el término (1−r²)² y el amortiguador aporta poco, salvo, en este caso, algo de denominador extra que se agradece. Bajá ω hacia 100 rad/s y mirá cómo se separan las dos curvas del segundo gráfico.",
    "fv.equations.section.formulas": "Fórmulas",
    "fv.equations.section.reference": "Referencia (valores del enunciado)",
    "fv.equations.note.reference":
      "ω_n = √(100000/10) = 100 rad/s,   c_c = 2√(100000×10) = 2000 N·s/m.\n" +
      "ζ = 500/2000 = 0,25,   r = 120/100 = 1,2,   δ_st = 1000/100000 = 10 mm.\n" +
      "X = 10 / √[(1 − 1,44)² + (2×0,25×1,2)²] = 10/√0,5536 = 13,44 mm  (c = 500).\n" +
      "X = 10 / |1 − 1,44| = 10/0,44 = 22,73 mm  (c = 0).\n" +
      "Libre: ω_n = 100 rad/s sin amortiguar;  ω_d = 96,83 rad/s con envolvente e^(−25t).",
    "fv.equations.section.response": "Respuesta x(t)",
    "fv.equations.response.note":
      "Integrada desde las condiciones iniciales elegidas, no supuesta. Con la fuerza activa se ve morir el transitorio y quedar la banda ±X; con la fuerza apagada, esto es la respuesta libre sola.",
    "fv.equations.section.plot": "Factor de amplificación",
    "fv.equations.plot.note":
      "X/δ_st en función de la relación de frecuencias r, con el amortiguamiento actual y sin nada. La línea vertical llena es dónde trabaja este sistema; la de trazos es la resonancia. Las curvas están recortadas en 6 — sin amortiguamiento la curva es genuinamente infinita en r = 1.",
    "fv.plot.response.title": "x(t) — desplazamiento de la masa en el tiempo",
    "fv.plot.magnification.title":
      "X/δ_st en función de la relación de frecuencias, con y sin amortiguamiento",
  },
};
