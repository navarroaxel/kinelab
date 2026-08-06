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

    "escalator.metrics.heading": "Live Metrics",
    "escalator.metrics.p_elec": "P_elec  (electrical input)",
    "escalator.metrics.p_mech": "P_mech  (mechanical output)",
    "escalator.metrics.efficiency": "η  (efficiency)",
    "escalator.metrics.climb_speed": "v  (climb speed)",
    "escalator.metrics.work": "W  (work per trip)",

    "escalator.legend.heading": "Legend",
    "escalator.legend.belt": "Escalator belt",
    "escalator.legend.riders": "Riders (count scaled to n)",
    "escalator.legend.p_elec": "P_elec into the motor",
    "escalator.legend.p_mech": "P_mech out to the belt",

    "escalator.equations.heading": "Equations",
    "escalator.equations.section.statement": "Statement",
    "escalator.equations.statement.text":
      "A three-phase motor (380 V line, 5.365 A per line, cos φ = 0.9) drives an escalator that lifts up to 30 people (75 kg average) 7 m in 1 minute. Find the efficiency of the escalator/motor assembly.",
    "escalator.equations.section.formulas": "Formulas",
    "escalator.equations.section.reference": "Reference (default values)",
    "escalator.equations.note.reference":
      "P_elec = √3 × 380 V × 5.365 A × 0.9 ≈ 3.18 kW. P_mech = (30 × 75 kg × 9.81 × 7 m) / 60 s ≈ 2.58 kW. η = P_mech / P_elec ≈ 81.0%.",
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

    "escalator.metrics.heading": "Métricas en vivo",
    "escalator.metrics.p_elec": "P_elec  (potencia eléctrica)",
    "escalator.metrics.p_mech": "P_mec  (potencia mecánica)",
    "escalator.metrics.efficiency": "η  (rendimiento)",
    "escalator.metrics.climb_speed": "v  (velocidad de elevación)",
    "escalator.metrics.work": "W  (trabajo por viaje)",

    "escalator.legend.heading": "Leyenda",
    "escalator.legend.belt": "Cinta de la escalera",
    "escalator.legend.riders": "Pasajeros (cantidad según n)",
    "escalator.legend.p_elec": "P_elec hacia el motor",
    "escalator.legend.p_mech": "P_mec hacia la cinta",

    "escalator.equations.heading": "Ecuaciones",
    "escalator.equations.section.statement": "Enunciado",
    "escalator.equations.statement.text":
      "Un motor trifásico (380 V de línea, 5,365 A por línea, cos φ = 0,9) acciona una escalera mecánica que eleva hasta 30 personas (75 kg en promedio) 7 m en 1 minuto. Hallar el rendimiento del conjunto escalera/motor.",
    "escalator.equations.section.formulas": "Fórmulas",
    "escalator.equations.section.reference": "Referencia (valores por defecto)",
    "escalator.equations.note.reference":
      "P_elec = √3 × 380 V × 5,365 A × 0,9 ≈ 3,18 kW. P_mec = (30 × 75 kg × 9,81 × 7 m) / 60 s ≈ 2,58 kW. η = P_mec / P_elec ≈ 81,0%.",
    "escalator.equations.section.plot": "Rendimiento vs. cantidad de pasajeros",
    "escalator.plot.eta_n.title":
      "η(n) — rendimiento vs. cantidad de pasajeros",
  },
};
