export const vehiclePower = {
  en: {
    "vehicle-power.page.canvas_aria":
      "Vehicle power simulator — fitting rolling and aerodynamic resistance from two calibration readings, then predicting power at other speeds and grades",

    "vehicle-power.controls.section.vehicle": "Vehicle",
    "vehicle-power.controls.section.calibration": "Calibration (two readings)",
    "vehicle-power.controls.warn.invalid_calibration":
      "⚠ Speeds 1 and 2 are too close together — the two-point fit for a and b becomes singular. Move them further apart.",
    "vehicle-power.controls.section.prediction": "Prediction",
    "vehicle-power.controls.section.visibility": "Visibility",
    "vehicle-power.controls.slider.mass": "Vehicle mass m",
    "vehicle-power.controls.slider.calib_speed1": "Speed 1",
    "vehicle-power.controls.slider.calib_power1": "Power at speed 1",
    "vehicle-power.controls.slider.calib_speed2": "Speed 2",
    "vehicle-power.controls.slider.calib_power2": "Power at speed 2",
    "vehicle-power.controls.slider.target_speed": "Flat-road target speed",
    "vehicle-power.controls.slider.slope_speed": "Graded-road target speed",
    "vehicle-power.controls.slider.grade": "Road grade θ",
    "vehicle-power.controls.toggle.forces": "Drive / resistance arrows",
    "vehicle-power.controls.toggle.grade_force": "Grade force (weight along slope)",
    "vehicle-power.controls.btn.reset": "Reset",
    "vehicle-power.controls.btn.pause": "Pause",
    "vehicle-power.controls.btn.resume": "Resume",

    "vehicle-power.canvas.flat": "Flat road",
    "vehicle-power.canvas.slope": "Grade",
    "vehicle-power.canvas.drive": "drive",
    "vehicle-power.canvas.resist": "resist",
    "vehicle-power.canvas.grade": "mg sin θ",

    "vehicle-power.symbol.flat": "P_flat",
    "vehicle-power.symbol.slope": "P_slope",

    "vehicle-power.metrics.heading": "Live Metrics",
    "vehicle-power.metrics.a": "a  (rolling resistance)",
    "vehicle-power.metrics.b": "b  (aerodynamic drag)",
    "vehicle-power.metrics.p_flat": "P_flat  (target speed, flat)",
    "vehicle-power.metrics.p_slope": "P_slope  (target speed, graded)",
    "vehicle-power.metrics.grade_force": "mg sin θ  (grade force)",

    "vehicle-power.legend.heading": "Legend",
    "vehicle-power.legend.drive": "Drive force (from the wheels)",
    "vehicle-power.legend.resist": "Rolling + aerodynamic resistance",
    "vehicle-power.legend.grade": "Weight component along the grade",

    "vehicle-power.equations.heading": "Equations",
    "vehicle-power.equations.section.statement": "Statement",
    "vehicle-power.equations.statement.text":
      "A 1600 kg vehicle's total resistance is F(v) = a + bv². Delivering 6 kW to the wheels sustains 50 km/h; 10 kW sustains 60 km/h, both on a flat road. Find the power needed for 90 km/h flat, and for 60 km/h on a 5° grade.",
    "vehicle-power.equations.section.theory": "Theory",
    "vehicle-power.equations.theory.calibration":
      "Fitting a and b: at constant speed, the drive force exactly balances the resistance, so the power delivered is P(v) = F(v)·v = a·v + b·v³ — a cubic in v with no constant or quadratic term. Two (speed, power) readings give two linear equations in the unknowns a and b, solved directly; predicting power at any other flat-road speed is then just plugging v into the same formula.",
    "vehicle-power.equations.theory.grade":
      "On a grade: climbing at angle θ adds a constant uphill pull, m·g·sin θ, to the resistance — it doesn't depend on speed, unlike rolling or aerodynamic drag. The extra power to overcome it is (m·g·sin θ)·v, added on top of the flat-road power at the same speed.",
    "vehicle-power.equations.section.formulas": "Formulas",
    "vehicle-power.equations.section.reference": "Reference (default values)",
    "vehicle-power.equations.note.reference":
      "a ≈ 50.2 N, b ≈ 1.979 N·s²/m² (fitted from 6 kW@50 km/h and 10 kW@60 km/h).\n" +
      "P(90 km/h, flat) ≈ 32.2 kW.\n" +
      "mg sin(5°) ≈ 1368 N → P(60 km/h, 5° grade) ≈ 32.8 kW.",
    "vehicle-power.equations.section.plot": "Power vs. speed (flat road)",
    "vehicle-power.plot.pv.title": "P(v) — power vs. speed, fitted from two readings",
  },
  es: {
    "vehicle-power.page.canvas_aria":
      "Simulador de potencia de un vehículo — ajustando la resistencia por rodadura y aerodinámica a partir de dos lecturas de calibración, y prediciendo la potencia a otras velocidades y pendientes",

    "vehicle-power.controls.section.vehicle": "Vehículo",
    "vehicle-power.controls.section.calibration": "Calibración (dos lecturas)",
    "vehicle-power.controls.warn.invalid_calibration":
      "⚠ Las velocidades 1 y 2 están demasiado cerca — el ajuste de dos puntos para a y b se vuelve singular. Alejalas un poco.",
    "vehicle-power.controls.section.prediction": "Predicción",
    "vehicle-power.controls.section.visibility": "Visibilidad",
    "vehicle-power.controls.slider.mass": "Masa del vehículo m",
    "vehicle-power.controls.slider.calib_speed1": "Velocidad 1",
    "vehicle-power.controls.slider.calib_power1": "Potencia a velocidad 1",
    "vehicle-power.controls.slider.calib_speed2": "Velocidad 2",
    "vehicle-power.controls.slider.calib_power2": "Potencia a velocidad 2",
    "vehicle-power.controls.slider.target_speed": "Velocidad objetivo (llano)",
    "vehicle-power.controls.slider.slope_speed": "Velocidad objetivo (pendiente)",
    "vehicle-power.controls.slider.grade": "Pendiente del camino θ",
    "vehicle-power.controls.toggle.forces": "Flechas de arrastre / resistencia",
    "vehicle-power.controls.toggle.grade_force":
      "Fuerza de pendiente (peso a lo largo del camino)",
    "vehicle-power.controls.btn.reset": "Reiniciar",
    "vehicle-power.controls.btn.pause": "Pausar",
    "vehicle-power.controls.btn.resume": "Reanudar",

    "vehicle-power.canvas.flat": "Camino llano",
    "vehicle-power.canvas.slope": "Pendiente",
    "vehicle-power.canvas.drive": "tracción",
    "vehicle-power.canvas.resist": "resistencia",
    "vehicle-power.canvas.grade": "mg sen θ",

    "vehicle-power.symbol.flat": "P_llano",
    "vehicle-power.symbol.slope": "P_pendiente",

    "vehicle-power.metrics.heading": "Métricas en vivo",
    "vehicle-power.metrics.a": "a  (resistencia por rodadura)",
    "vehicle-power.metrics.b": "b  (resistencia aerodinámica)",
    "vehicle-power.metrics.p_flat": "P_llano  (velocidad objetivo, llano)",
    "vehicle-power.metrics.p_slope": "P_pendiente  (velocidad objetivo, con pendiente)",
    "vehicle-power.metrics.grade_force": "mg sen θ  (fuerza de pendiente)",

    "vehicle-power.legend.heading": "Leyenda",
    "vehicle-power.legend.drive": "Fuerza de tracción (desde las ruedas)",
    "vehicle-power.legend.resist": "Resistencia por rodadura + aerodinámica",
    "vehicle-power.legend.grade": "Componente del peso a lo largo de la pendiente",

    "vehicle-power.equations.heading": "Ecuaciones",
    "vehicle-power.equations.section.statement": "Enunciado",
    "vehicle-power.equations.statement.text":
      "La resistencia total de un vehículo de 1600 kg es F(v) = a + bv². Entregar 6 kW a las ruedas sostiene 50 km/h; 10 kW sostiene 60 km/h, ambos en camino horizontal. Hallar la potencia necesaria para 90 km/h en llano, y para 60 km/h con una pendiente de 5°.",
    "vehicle-power.equations.section.theory": "Teoría",
    "vehicle-power.equations.theory.calibration":
      "Ajuste de a y b: a velocidad constante, la fuerza de tracción equilibra exactamente la resistencia, por lo que la potencia entregada es P(v) = F(v)·v = a·v + b·v³ — un cúbico en v sin término constante ni cuadrático. Dos lecturas (velocidad, potencia) dan dos ecuaciones lineales en las incógnitas a y b, que se resuelven directamente; predecir la potencia a otra velocidad en llano es simplemente reemplazar v en la misma fórmula.",
    "vehicle-power.equations.theory.grade":
      "En una pendiente: subir con ángulo θ agrega una fuerza constante cuesta arriba, m·g·sen θ, a la resistencia — no depende de la velocidad, a diferencia del rozamiento por rodadura o el arrastre aerodinámico. La potencia extra para vencerla es (m·g·sen θ)·v, sumada a la potencia en llano a la misma velocidad.",
    "vehicle-power.equations.section.formulas": "Fórmulas",
    "vehicle-power.equations.section.reference": "Referencia (valores por defecto)",
    "vehicle-power.equations.note.reference":
      "a ≈ 50,2 N, b ≈ 1,979 N·s²/m² (ajustados con 6 kW a 50 km/h y 10 kW a 60 km/h).\n" +
      "P(90 km/h, llano) ≈ 32,2 kW.\n" +
      "mg sen(5°) ≈ 1368 N → P(60 km/h, pendiente 5°) ≈ 32,8 kW.",
    "vehicle-power.equations.section.plot": "Potencia vs. velocidad (camino llano)",
    "vehicle-power.plot.pv.title":
      "P(v) — potencia vs. velocidad, ajustada con dos lecturas",
  },
};
