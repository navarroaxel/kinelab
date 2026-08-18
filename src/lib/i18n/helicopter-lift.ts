export const helicopterLift = {
  en: {
    "hl.title": "Helicopter Hover Lift",
    "hl.page.canvas_aria":
      "Helicopter hover simulator — steady downwash through the rotor wake",

    "hl.controls.section.rotor": "Rotor wake",
    "hl.controls.section.craft": "Helicopter",
    "hl.controls.section.visibility": "Visibility",
    "hl.controls.slider.exhaust_velocity": "Downwash speed v",
    "hl.controls.slider.wake_diameter": "Wake diameter d",
    "hl.controls.slider.heli_weight": "Helicopter + crew weight W",
    "hl.controls.slider.air_density": "Air weight density γ",
    "hl.controls.toggle.airflow": "Downwash streaks",
    "hl.controls.toggle.forces": "Thrust / weight vectors",
    "hl.controls.btn.reset": "Reset",
    "hl.controls.btn.pause": "Pause",
    "hl.controls.btn.resume": "Resume",

    "hl.metrics.heading": "Live Metrics",
    "hl.metrics.wake_area": "A  (wake area)",
    "hl.metrics.mass_flow": "ṁ  (mass flow rate)",
    "hl.metrics.max_load": "L_max  (max. extra load)",

    "hl.legend.heading": "Legend",
    "hl.legend.wake": "Wake column boundary",
    "hl.legend.airflow": "Downwash (air accelerated to v)",
    "hl.legend.thrust": "T, thrust reaction on the helicopter",
    "hl.legend.weight": "W, helicopter + crew weight",

    "hl.equations.heading": "Equations",
    "hl.equations.section.statement": "Statement",
    "hl.equations.statement.text":
      "Hibbeler, Engineering Mechanics: Dynamics — steady flow of a fluid stream. The helicopter shown can produce a maximum downward air speed of 80 ft/s in a wake 30 ft in diameter. If the weight of the helicopter and crew is 3 500 lb, and the weight density of air is taken as 0.076 lb/ft³, determine the maximum load the helicopter can lift while hovering.",
    "hl.equations.section.theory": "Theory",
    "hl.equations.theory.steady_flow":
      "Steady flow of a fluid stream: the rotor continuously draws in air from far above (essentially at rest) and expels it downward through the wake at speed v. Treating the air passing through the wake per unit time as a control volume, Newton's second law for a steady stream gives ΣF = ṁ·(v_out − v_in). With v_in ≈ 0, the force the rotor exerts on the air — and by reaction, the thrust T the air exerts on the helicopter — is T = ṁ·v.",
    "hl.equations.theory.density":
      "From weight density to mass flow: γ (lb/ft³) is a weight density, not a mass density, so it must be divided by g before it multiplies a volume flow rate. The mass flow rate through the wake area A is ṁ = (γ/g)·A·v — density becomes mass density, times the volume of air swept per second, A·v. Because thrust is T = ṁ·v, it grows with the square of the downwash speed.",
    "hl.equations.section.formulas": "Formulas",
    "hl.equations.section.reference": "Reference (default values)",
    "hl.equations.note.reference":
      "A = (π/4)×30² ≈ 706.9 ft².\n" +
      "ṁ = (0.076/32.2)×706.9×80 ≈ 133.5 slug/s.\n" +
      "T = 133.5×80 ≈ 10 677 lb.\n" +
      "L_max = 10 677 − 3 500 ≈ 7 177 lb.",
    "hl.equations.section.plot": "Max. load vs. downwash speed",
    "hl.plot.load_v.title": "L_max(v) — max. load vs. downwash speed",
    "hl.equations.note.units":
      "Imperial units throughout, as in the original statement: ft, lb (weight/force), slug (mass), and g = 32.2 ft/s².",
  },
  es: {
    "hl.title": "Sustentación de un Helicóptero",
    "hl.page.canvas_aria":
      "Simulador de sustentación de helicóptero — flujo permanente de aire a través de la estela del rotor",

    "hl.controls.section.rotor": "Estela del rotor",
    "hl.controls.section.craft": "Helicóptero",
    "hl.controls.section.visibility": "Visibilidad",
    "hl.controls.slider.exhaust_velocity": "Rapidez de la corriente descendente v",
    "hl.controls.slider.wake_diameter": "Diámetro de la estela d",
    "hl.controls.slider.heli_weight": "Peso helicóptero + tripulación W",
    "hl.controls.slider.air_density": "Peso específico del aire γ",
    "hl.controls.toggle.airflow": "Trazos del flujo descendente",
    "hl.controls.toggle.forces": "Vectores empuje / peso",
    "hl.controls.btn.reset": "Reiniciar",
    "hl.controls.btn.pause": "Pausar",
    "hl.controls.btn.resume": "Reanudar",

    "hl.metrics.heading": "Métricas en vivo",
    "hl.metrics.wake_area": "A  (área de la estela)",
    "hl.metrics.mass_flow": "ṁ  (caudal másico)",
    "hl.metrics.max_load": "L_max  (carga extra máxima)",

    "hl.legend.heading": "Leyenda",
    "hl.legend.wake": "Contorno de la columna de estela",
    "hl.legend.airflow": "Corriente descendente (aire acelerado a v)",
    "hl.legend.thrust": "T, reacción de empuje sobre el helicóptero",
    "hl.legend.weight": "W, peso del helicóptero + tripulación",

    "hl.equations.heading": "Ecuaciones",
    "hl.equations.section.statement": "Enunciado",
    "hl.equations.statement.text":
      "Hibbeler, Ingeniería Mecánica: Dinámica — flujo permanente de una corriente fluida. El helicóptero que se muestra en la figura puede producir una rapidez máxima del aire hacia abajo de 80 ft/s en una estela de 30 ft de diámetro. Si el peso del helicóptero y la tripulación es de 3 500 lb y se supone 0,076 lb/ft³ para el aire, determine la carga máxima que el helicóptero puede levantar cuando está suspendido en el aire.",
    "hl.equations.section.theory": "Teoría",
    "hl.equations.theory.steady_flow":
      "Flujo permanente de una corriente fluida: el rotor toma aire continuamente desde muy arriba (prácticamente en reposo) y lo expulsa hacia abajo a través de la estela con rapidez v. Tomando el aire que atraviesa la estela por unidad de tiempo como volumen de control, la segunda ley de Newton para una corriente permanente da ΣF = ṁ·(v_sal − v_ent). Con v_ent ≈ 0, la fuerza que el rotor ejerce sobre el aire —y por reacción, el empuje T que el aire ejerce sobre el helicóptero— es T = ṁ·v.",
    "hl.equations.theory.density":
      "Del peso específico al caudal másico: γ (lb/ft³) es un peso específico, no una densidad de masa, así que hay que dividirlo por g antes de multiplicarlo por un caudal volumétrico. El caudal másico a través del área de estela A es ṁ = (γ/g)·A·v — la densidad se vuelve densidad de masa, multiplicada por el volumen de aire barrido por segundo, A·v. Como el empuje es T = ṁ·v, crece con el cuadrado de la rapidez de la corriente descendente.",
    "hl.equations.section.formulas": "Fórmulas",
    "hl.equations.section.reference": "Referencia (valores por defecto)",
    "hl.equations.note.reference":
      "A = (π/4)×30² ≈ 706,9 ft².\n" +
      "ṁ = (0,076/32,2)×706,9×80 ≈ 133,5 slug/s.\n" +
      "T = 133,5×80 ≈ 10 677 lb.\n" +
      "L_max = 10 677 − 3 500 ≈ 7 177 lb.",
    "hl.equations.section.plot": "Carga máx. vs. rapidez de la corriente",
    "hl.plot.load_v.title":
      "L_max(v) — carga máxima vs. rapidez de la corriente descendente",
    "hl.equations.note.units":
      "Unidades imperiales en todo el ejercicio, como en el enunciado original: ft, lb (peso/fuerza), slug (masa) y g = 32,2 ft/s².",
  },
};
