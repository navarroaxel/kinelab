export const escalator = {
  en: {
    "escalator.page.canvas_aria":
      "Escalator simulator — three-phase motor lifting passengers at constant speed",

    "escalator.controls.section.motor": "Motor (nameplate)",
    "escalator.controls.section.load": "Load",
    "escalator.controls.section.visibility": "Visibility",
    "escalator.controls.slider.voltage": "Line voltage V",
    "escalator.controls.slider.current": "Line current I",
    "escalator.controls.slider.power_factor": "Power factor cos φ",
    "escalator.controls.slider.num_people": "Passengers n",
    "escalator.controls.slider.person_mass": "Avg. mass per person",
    "escalator.controls.slider.height": "Height h",
    "escalator.controls.slider.lift_time": "Lift time t",
    "escalator.controls.toggle.passengers": "Riders on the belt",
    "escalator.controls.toggle.power_flow": "Power-flow arrows",
    "escalator.controls.btn.reset": "Reset",
    "escalator.controls.btn.pause": "Pause",
    "escalator.controls.btn.resume": "Resume",

    "escalator.canvas.p_elec": "Pₑ",
    "escalator.canvas.p_mech": "Pₘ",
    "escalator.canvas.motor": "M",

    "escalator.symbol.electrical": "P_electrical",
    "escalator.symbol.mechanical": "P_mechanical",

    "escalator.metrics.heading": "Live Metrics",
    "escalator.metrics.p_elec": "Pₑ",
    "escalator.metrics.p_mech": "Pₘ",
    "escalator.metrics.efficiency": "η  (efficiency)",
    "escalator.metrics.climb_speed": "v  (climb speed)",
    "escalator.metrics.work": "W  (work per trip)",

    "escalator.legend.heading": "Legend",
    "escalator.legend.belt": "Escalator belt",
    "escalator.legend.riders": "Riders (count scaled to n)",
    "escalator.legend.p_elec": "P_electrical into the motor",
    "escalator.legend.p_mech": "P_mechanical out to the belt",

    "escalator.equations.heading": "Equations",
    "escalator.equations.section.statement": "Statement",
    "escalator.equations.statement.text":
      "A three-phase motor (380 V line, 5.365 A per line, cos φ = 0.9) drives an escalator that lifts up to 30 people (75 kg average) 7 m in 1 minute. Find the efficiency of the escalator/motor assembly.",
    "escalator.equations.section.theory": "Theory",
    "escalator.equations.theory.three_phase":
      "Three-phase power: a balanced three-phase supply delivers power through all three lines at once, so the total is √3 times the single-line product V·I — not simply V·I as it would be for a single-phase circuit. cos φ is the power factor: an induction motor's winding is mostly inductive, so its current lags the voltage by an angle φ, and only the in-phase component V·I·cos φ does real work — the rest sloshes back and forth as reactive power without being consumed.",
    "escalator.equations.theory.mechanical":
      "Mechanical power: lifting is just gaining gravitational potential energy over time. Raising n people of mass m by a height h takes work n·m·g·h, and dividing by the time t gives the useful power the escalator must deliver, P_mechanical — the same rate a single elevator would need, just averaged over a continuous stream of riders.",
    "escalator.equations.theory.losses":
      "Where does the rest go? A real motor/escalator assembly never converts 100% of its electrical input into useful lift. Electrical losses (Joule heating I²R in the windings, iron losses in the core) and mechanical losses (friction in bearings, the gearbox, and the step chain) all end up as waste heat. The efficiency η = P_mechanical / P_electrical is exactly the fraction that escapes that waste and reaches the passengers.",
    "escalator.equations.section.formulas": "Formulas",
    "escalator.equations.section.reference": "Reference (default values)",
    "escalator.equations.note.reference":
      "P_electrical = √3 × 380 V × 5.365 A × 0.9 ≈ 3.18 kW.\n" +
      "P_mechanical = (30 × 75 kg × 9.81 × 7 m) / 60 s ≈ 2.58 kW.\n" +
      "η = P_mechanical / P_electrical ≈ 81.0%.",
    "escalator.equations.section.plot": "Efficiency vs. passenger count",
    "escalator.plot.eta_n.title":
      "η(n) — efficiency vs. number of passengers",
  },
  es: {
    "escalator.page.canvas_aria":
      "Simulador de escalera mecánica — motor trifásico elevando pasajeros a velocidad constante",

    "escalator.controls.section.motor": "Motor (chapa)",
    "escalator.controls.section.load": "Carga",
    "escalator.controls.section.visibility": "Visibilidad",
    "escalator.controls.slider.voltage": "Tensión de línea V",
    "escalator.controls.slider.current": "Corriente de línea I",
    "escalator.controls.slider.power_factor": "Coseno fi cos φ",
    "escalator.controls.slider.num_people": "Pasajeros n",
    "escalator.controls.slider.person_mass": "Masa promedio por persona",
    "escalator.controls.slider.height": "Altura h",
    "escalator.controls.slider.lift_time": "Tiempo de elevación t",
    "escalator.controls.toggle.passengers": "Pasajeros en la cinta",
    "escalator.controls.toggle.power_flow": "Flechas de flujo de potencia",
    "escalator.controls.btn.reset": "Reiniciar",
    "escalator.controls.btn.pause": "Pausar",
    "escalator.controls.btn.resume": "Reanudar",

    "escalator.canvas.p_elec": "Pₑ",
    "escalator.canvas.p_mech": "Pₘ",
    "escalator.canvas.motor": "M",

    "escalator.symbol.electrical": "P_electrica",
    "escalator.symbol.mechanical": "P_mecanica",

    "escalator.metrics.heading": "Métricas en vivo",
    "escalator.metrics.p_elec": "Pₑ",
    "escalator.metrics.p_mech": "Pₘ",
    "escalator.metrics.efficiency": "η  (rendimiento)",
    "escalator.metrics.climb_speed": "v  (velocidad de elevación)",
    "escalator.metrics.work": "W  (trabajo por viaje)",

    "escalator.legend.heading": "Leyenda",
    "escalator.legend.belt": "Cinta de la escalera",
    "escalator.legend.riders": "Pasajeros (cantidad según n)",
    "escalator.legend.p_elec": "P_electrica hacia el motor",
    "escalator.legend.p_mech": "P_mecanica hacia la cinta",

    "escalator.equations.heading": "Ecuaciones",
    "escalator.equations.section.statement": "Enunciado",
    "escalator.equations.statement.text":
      "Un motor trifásico (380 V de línea, 5,365 A por línea, cos φ = 0,9) acciona una escalera mecánica que eleva hasta 30 personas (75 kg en promedio) 7 m en 1 minuto. Hallar el rendimiento del conjunto escalera/motor.",
    "escalator.equations.section.theory": "Teoría",
    "escalator.equations.theory.three_phase":
      "Potencia trifásica: una alimentación trifásica equilibrada entrega potencia por las tres líneas a la vez, así que el total es √3 veces el producto V·I de una sola línea — no simplemente V·I como en un circuito monofásico. cos φ es el factor de potencia: el bobinado de un motor asincrónico es principalmente inductivo, por lo que la corriente atrasa a la tensión un ángulo φ, y solo la componente en fase V·I·cos φ realiza trabajo útil — el resto va y viene como potencia reactiva sin consumirse.",
    "escalator.equations.theory.mechanical":
      "Potencia mecánica: elevar es simplemente ganar energía potencial gravitatoria en el tiempo. Subir n personas de masa m una altura h requiere un trabajo n·m·g·h, y dividiendo por el tiempo t se obtiene la potencia útil que debe entregar la escalera, P_mecanica — la misma que necesitaría un solo ascensor, promediada sobre un flujo continuo de pasajeros.",
    "escalator.equations.theory.losses":
      "¿Adónde va el resto? Un conjunto motor/escalera real nunca convierte el 100% de su entrada eléctrica en elevación útil. Las pérdidas eléctricas (efecto Joule I²R en los bobinados, pérdidas en el hierro del núcleo) y las pérdidas mecánicas (fricción en los rodamientos, la caja reductora y la cadena de peldaños) terminan como calor disipado. El rendimiento η = P_mecanica / P_electrica es exactamente la fracción que escapa a ese desperdicio y llega a los pasajeros.",
    "escalator.equations.section.formulas": "Fórmulas",
    "escalator.equations.section.reference": "Referencia (valores por defecto)",
    "escalator.equations.note.reference":
      "P_electrica = √3 × 380 V × 5,365 A × 0,9 ≈ 3,18 kW.\n" +
      "P_mecanica = (30 × 75 kg × 9,81 × 7 m) / 60 s ≈ 2,58 kW.\n" +
      "η = P_mecanica / P_electrica ≈ 81,0%.",
    "escalator.equations.section.plot": "Rendimiento vs. cantidad de pasajeros",
    "escalator.plot.eta_n.title":
      "η(n) — rendimiento vs. cantidad de pasajeros",
  },
};
