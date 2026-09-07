export const massRelease = {
  en: {
    "vib6.canvas_aria": "A mass hanging from a spring after a second mass is removed",

    "vib6.controls.section.masses": "Masses",
    "vib6.controls.slider.remaining_mass": "Remaining mass M₁",
    "vib6.controls.slider.hanging_mass": "Removed mass M₂",
    "vib6.controls.section.spring": "Spring & damper",
    "vib6.controls.slider.stiffness": "Stiffness k",
    "vib6.controls.slider.damping": "Damping c",
    "vib6.controls.btn.reset": "Reset",
    "vib6.controls.btn.pause": "Pause",
    "vib6.controls.btn.resume": "Resume",

    "vib6.metrics.heading": "Live readouts",
    "vib6.metrics.regime": "Regime",
    "vib6.metrics.settling_time": "Settling time",
    "vib6.metrics.slack_warning":
      "The spring would have to push to keep up with this swing — physically unrealisable. The dashed portion of the trace marks where.",

    "vib6.regime.undamped": "Undamped",
    "vib6.regime.underdamped": "Underdamped",
    "vib6.regime.critical": "Critically damped",
    "vib6.regime.overdamped": "Overdamped",

    "vib6.legend.heading": "Legend",
    "vib6.legend.spring": "Spring",
    "vib6.legend.mass": "Remaining mass M₁, x(t)",
    "vib6.legend.slack": "Spring slack (unrealisable)",

    "vib6.equations.heading": "Theory & formulas",
    "vib6.equations.section.statement": "Problem",
    "vib6.equations.statement.text":
      "M₁ = 0.5 kg and M₂ = 0.8 kg hang together from a spring. M₂ is suddenly removed at t = 0. Find the free vibration of M₁ about its new equilibrium — VIB 6 with an undamped spring (k = 0.196 N/cm), VIB 7 with a dashpot added (k = 3.92 N/cm, c = 0.98 N·s/cm).",
    "vib6.equations.section.theory": "Why the amplitude is x₀ = M₂g/k, independent of M₁",
    "vib6.equations.theory.new_equilibrium":
      "Removing M₂ shifts the equilibrium up by exactly the deflection its own weight used to add, M₂g/k. Neither position nor velocity can jump, so M₁ starts this new motion at rest, displaced x₀ = M₂g/k below the new equilibrium — M₁ itself never enters the amplitude, only ω₀ and ζ.",
    "vib6.equations.theory.slack":
      "This rig's own numbers make the spring go slack: the swing (x₀ = 40 cm) is larger than the deflection M₁ alone would produce at rest (25 cm), so the trough of the oscillation asks the spring to push rather than pull — something a real spring can't do. No textbook figure shows this; the dashed portion of the trace below is where it would happen.",
    "vib6.equations.theory.critical_comparison":
      "The dashed ζ = 1 curve holds M₁, M₂ and k fixed and asks what critical damping alone would do. This overdamped rig (ζ = 3.5) takes roughly 7× longer to settle than that critically-damped comparison — more damping is not always a faster return to rest.",
    "vib6.equations.section.formulas": "Formulas",
    "vib6.equations.section.response": "Response over time",
    "vib6.plot.title": "Displacement from the new equilibrium over time",
    "vib6.plot.slack_label": "Slack portion",
    "vib6.equations.response.note":
      "x(t) measured from the new equilibrium, so it starts at x₀ and ends at 0.",
  },
  es: {
    "vib6.canvas_aria":
      "Una masa colgada de un resorte luego de retirar una segunda masa",

    "vib6.controls.section.masses": "Masas",
    "vib6.controls.slider.remaining_mass": "Masa que queda M₁",
    "vib6.controls.slider.hanging_mass": "Masa retirada M₂",
    "vib6.controls.section.spring": "Resorte y amortiguador",
    "vib6.controls.slider.stiffness": "Rigidez k",
    "vib6.controls.slider.damping": "Amortiguamiento c",
    "vib6.controls.btn.reset": "Reiniciar",
    "vib6.controls.btn.pause": "Pausar",
    "vib6.controls.btn.resume": "Reanudar",

    "vib6.metrics.heading": "Lecturas en vivo",
    "vib6.metrics.regime": "Régimen",
    "vib6.metrics.settling_time": "Tiempo de asentamiento",
    "vib6.metrics.slack_warning":
      "El resorte debería empujar para seguir esta oscilación — físicamente irrealizable. La parte punteada de la traza marca dónde.",

    "vib6.regime.undamped": "No amortiguado",
    "vib6.regime.underdamped": "Subamortiguado",
    "vib6.regime.critical": "Críticamente amortiguado",
    "vib6.regime.overdamped": "Sobreamortiguado",

    "vib6.legend.heading": "Referencias",
    "vib6.legend.spring": "Resorte",
    "vib6.legend.mass": "Masa que queda M₁, x(t)",
    "vib6.legend.slack": "Resorte flojo (irrealizable)",

    "vib6.equations.heading": "Teoría y fórmulas",
    "vib6.equations.section.statement": "Enunciado",
    "vib6.equations.statement.text":
      "M₁ = 0,5 kg y M₂ = 0,8 kg cuelgan juntas de un resorte. M₂ se retira de golpe en t = 0. Hallar la vibración libre de M₁ respecto a su nuevo equilibrio — VIB 6 con un resorte sin amortiguar (k = 0,196 N/cm), VIB 7 con un amortiguador agregado (k = 3,92 N/cm, c = 0,98 N·s/cm).",
    "vib6.equations.section.theory":
      "Por qué la amplitud es x₀ = M₂g/k, independiente de M₁",
    "vib6.equations.theory.new_equilibrium":
      "Retirar M₂ desplaza el equilibrio hacia arriba exactamente la deformación que su propio peso agregaba, M₂g/k. Ni la posición ni la velocidad pueden saltar, así que M₁ arranca este nuevo movimiento en reposo, desplazada x₀ = M₂g/k por debajo del nuevo equilibrio — M₁ misma nunca entra en la amplitud, solo en ω₀ y ζ.",
    "vib6.equations.theory.slack":
      "Los propios números de este sistema hacen que el resorte quede flojo: la oscilación (x₀ = 40 cm) es mayor que la deformación que M₁ sola produciría en reposo (25 cm), así que el valle de la oscilación le pide al resorte que empuje en vez de tirar — algo que un resorte real no puede hacer. Ninguna figura de manual muestra esto; la parte punteada de la traza de abajo es donde sucedería.",
    "vib6.equations.theory.critical_comparison":
      "La curva punteada ζ = 1 mantiene fijas M₁, M₂ y k y pregunta qué haría solo el amortiguamiento crítico. Este sistema sobreamortiguado (ζ = 3,5) tarda aproximadamente 7 veces más en asentarse que esa comparación críticamente amortiguada — más amortiguamiento no siempre significa un retorno más rápido al reposo.",
    "vib6.equations.section.formulas": "Fórmulas",
    "vib6.equations.section.response": "Respuesta en el tiempo",
    "vib6.plot.title": "Desplazamiento respecto al nuevo equilibrio en el tiempo",
    "vib6.plot.slack_label": "Parte floja",
    "vib6.equations.response.note":
      "x(t) medido desde el nuevo equilibrio, así que arranca en x₀ y termina en 0.",
  },
};
