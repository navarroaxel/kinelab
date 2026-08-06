export const kepler = {
  en: {
    // Kepler — orbital mechanics / Mars transfer (/kepler)
    "kepler.page.canvas_aria":
      "Kepler orbital mechanics simulator — Mars return vehicle transfer trajectory",

    // Kepler — phase names
    "kepler.phase.circular": "Circular orbit",
    "kepler.phase.transfer1": "Transfer orbit 1",
    "kepler.phase.transfer2": "Transfer orbit 2",
    "kepler.phase.escape": "Escape trajectory",

    // Kepler — metrics
    "kepler.metrics.heading": "Live Metrics",
    "kepler.metrics.phase": "Phase",
    "kepler.metrics.altitude": "Altitude",
    "kepler.metrics.speed": "Speed",
    "kepler.metrics.v_final": "Final speed (after C)",
    "kepler.metrics.derived": "Orbital Properties",
    "kepler.metrics.orbit1_T": "T₁  (transfer orbit 1)",
    "kepler.metrics.orbit2_T": "T₂  (transfer orbit 2)",
    "kepler.metrics.h1": "h₁  (angular momentum)",
    "kepler.metrics.h2": "h₂  (angular momentum)",

    // Kepler — controls
    "kepler.controls.section.maneuvers": "Δv Maneuvers",
    "kepler.controls.section.animation": "Animation",
    "kepler.controls.section.visibility": "Visibility",
    "kepler.controls.slider.dv_a": "Δv at A (km/s)",
    "kepler.controls.slider.dv_b": "Δv at B (km/s)",
    "kepler.controls.slider.dv_c": "Δv at C (km/s)",
    "kepler.controls.slider.anim_speed": "Sim. speed (× real time)",
    "kepler.controls.toggle.velocity": "Velocity vector",
    "kepler.controls.toggle.orbits": "Orbit paths",
    "kepler.controls.toggle.area_sweep": "Area sweep (Kepler 2)",
    "kepler.controls.toggle.trace": "Spacecraft trail",
    "kepler.controls.btn.reset": "Reset",
    "kepler.controls.btn.pause": "Pause",
    "kepler.controls.btn.resume": "Resume",
    "kepler.controls.info.problem": "Mars return vehicle",
    "kepler.controls.info.r_a": "Altitude at A: 2,200 km",
    "kepler.controls.info.r_b": "Altitude at B: 100,000 km",
    "kepler.controls.info.r_c": "Altitude at C: 1,000 km",

    // Kepler — legend
    "kepler.legend.heading": "Legend",
    "kepler.legend.spacecraft": "Spacecraft",
    "kepler.legend.velocity": "Velocity vector",
    "kepler.legend.orbit0": "Circular orbit (initial)",
    "kepler.legend.orbit1": "Transfer orbit 1 (A → B)",
    "kepler.legend.orbit2": "Transfer orbit 2 (B → C)",
    "kepler.legend.escape": "Escape trajectory",
    "kepler.legend.area_sweep": "Swept area (equal time = equal area)",

    // Kepler — equations
    "kepler.equations.heading": "Equations",
    "kepler.equations.section.kepler1": "Kepler's 1st Law",
    "kepler.equations.section.kepler2": "Kepler's 2nd Law",
    "kepler.equations.section.kepler3": "Kepler's 3rd Law",
    "kepler.equations.section.vis_viva": "Vis-viva equation",
    "kepler.equations.section.circ": "Circular orbit speed",
    "kepler.equations.section.mission": "Mission solution",
    "kepler.equations.note.kepler1":
      "All orbits are conic sections with the attracting body at one focus. " +
      "A circle (e = 0) is the special case of an ellipse where both foci coincide " +
      "and the radius stays constant at r = a throughout the orbit. " +
      "As e grows toward 1 the ellipse elongates; at e = 1 it opens into a parabola; " +
      "above 1 it becomes a hyperbola (the escape trajectories in this mission).",
    "kepler.equations.note.kepler2":
      "Angular momentum L = r × mv is conserved whenever the net torque on a body is zero. " +
      "For orbital motion, gravity always points from the orbiting body toward the central body (along r), " +
      "so its torque τ = r × F = 0 — and L is constant throughout the orbit. " +
      "Dividing by mass gives the specific angular momentum h = L/m = r × v⊥, " +
      "also constant, which fully characterises the orbit's shape and rate of sweeping. " +
      "A line from the central body sweeps equal areas in equal time intervals — " +
      "the areal velocity dA/dt = h/2 is constant. " +
      "As a consequence, the body moves faster near periapsis (small r, large v) " +
      "and slower near apoapsis (large r, small v).",
    "kepler.equations.note.kepler3":
      "The square of the orbital period is proportional to the cube of the " +
      "semi-major axis: T² ∝ a³. For Mars: T² = (4π²/μ) × a³.",
    "kepler.equations.note.vis_viva":
      "Derived from conservation of energy. At any point on the orbit, " +
      "the total specific mechanical energy E = v²/2 − μ/r = −μ/(2a) is constant.",
    "kepler.equations.note.mission":
      "Angular-momentum chain: h = r × v_⊥ is conserved within each orbit. " +
      "Knowing any r and the tangential speed uniquely determines the entire orbit.",

    // Kepler — impulsive maneuver approximation
    "kepler.equations.section.impulsive": "Impulsive maneuver approximation",
    "kepler.equations.impulsive.burn": "Δt → 0,  Δs ≈ 0  during each burn",
    "kepler.equations.impulsive.position":
      "position fixed at A, B, C  →  only v changes",
    "kepler.equations.note.impulsive":
      "Each Δv is modelled as an instantaneous impulse: the burn time Δt → 0 " +
      "and the arc flown during the burn Δs ≈ 0. " +
      "As a result, the spacecraft's position is fixed at A, B, or C during the maneuver — " +
      "only the velocity vector changes. " +
      "This is why the solution chains angular momenta directly at each point " +
      "without integrating the trajectory during the burn. " +
      "The approximation is valid when the burn duration is negligible compared to the " +
      "orbital period (here T₁ ≈ 107 h vs. a burn of seconds or minutes). " +
      "When that ratio is not small, a finite-burn model is required: the thrust force, " +
      "the varying mass (Tsiolkovsky equation), and the arc actually flown must all be " +
      "integrated — the result is no longer analytic.",
  },
  es: {
    // Kepler — mecánica orbital / transferencia a Marte (/kepler)
    "kepler.page.canvas_aria":
      "Simulador de mecánica orbital de Kepler — trayectoria de transferencia del vehículo de retorno de Marte",

    // Kepler — nombres de fase
    "kepler.phase.circular": "Órbita circular",
    "kepler.phase.transfer1": "Órbita de transferencia 1",
    "kepler.phase.transfer2": "Órbita de transferencia 2",
    "kepler.phase.escape": "Trayectoria de escape",

    // Kepler — métricas
    "kepler.metrics.heading": "Métricas en vivo",
    "kepler.metrics.phase": "Fase",
    "kepler.metrics.altitude": "Altitud",
    "kepler.metrics.speed": "Rapidez",
    "kepler.metrics.v_final": "Rapidez final (tras C)",
    "kepler.metrics.derived": "Propiedades orbitales",
    "kepler.metrics.orbit1_T": "T₁  (órbita de transf. 1)",
    "kepler.metrics.orbit2_T": "T₂  (órbita de transf. 2)",
    "kepler.metrics.h1": "h₁  (momento angular)",
    "kepler.metrics.h2": "h₂  (momento angular)",

    // Kepler — controles
    "kepler.controls.section.maneuvers": "Maniobras Δv",
    "kepler.controls.section.animation": "Animación",
    "kepler.controls.section.visibility": "Visibilidad",
    "kepler.controls.slider.dv_a": "Δv en A (km/s)",
    "kepler.controls.slider.dv_b": "Δv en B (km/s)",
    "kepler.controls.slider.dv_c": "Δv en C (km/s)",
    "kepler.controls.slider.anim_speed": "Vel. simulación (× tiempo real)",
    "kepler.controls.toggle.velocity": "Vector velocidad",
    "kepler.controls.toggle.orbits": "Trayectorias orbitales",
    "kepler.controls.toggle.area_sweep": "Barrido de área (Kepler 2)",
    "kepler.controls.toggle.trace": "Estela del vehículo",
    "kepler.controls.btn.reset": "Reiniciar",
    "kepler.controls.btn.pause": "Pausar",
    "kepler.controls.btn.resume": "Reanudar",
    "kepler.controls.info.problem": "Vehículo de retorno de Marte",
    "kepler.controls.info.r_a": "Altitud en A: 2.200 km",
    "kepler.controls.info.r_b": "Altitud en B: 100.000 km",
    "kepler.controls.info.r_c": "Altitud en C: 1.000 km",

    // Kepler — leyenda
    "kepler.legend.heading": "Leyenda",
    "kepler.legend.spacecraft": "Vehículo espacial",
    "kepler.legend.velocity": "Vector velocidad",
    "kepler.legend.orbit0": "Órbita circular (inicial)",
    "kepler.legend.orbit1": "Órbita de transf. 1 (A → B)",
    "kepler.legend.orbit2": "Órbita de transf. 2 (B → C)",
    "kepler.legend.escape": "Trayectoria de escape",
    "kepler.legend.area_sweep": "Área barrida (tiempo igual = área igual)",

    // Kepler — ecuaciones
    "kepler.equations.heading": "Ecuaciones",
    "kepler.equations.section.kepler1": "1.ª Ley de Kepler",
    "kepler.equations.section.kepler2": "2.ª Ley de Kepler",
    "kepler.equations.section.kepler3": "3.ª Ley de Kepler",
    "kepler.equations.section.vis_viva": "Ecuación vis-viva",
    "kepler.equations.section.circ": "Rapidez en órbita circular",
    "kepler.equations.section.mission": "Solución de la Misión",
    "kepler.equations.note.kepler1":
      "Todas las órbitas son secciones cónicas con el cuerpo atractor en uno de los focos. " +
      "Un círculo (e = 0) es el caso especial de una elipse donde ambos focos coinciden " +
      "y el radio permanece constante r = a en toda la órbita. " +
      "A medida que e crece hacia 1 la elipse se alarga; en e = 1 se convierte en parábola; " +
      "por encima de 1 es una hipérbola (la trayectoria de escape de esta misión).",
    "kepler.equations.note.kepler2":
      "El momento cinético L = r × mv se conserva siempre que el torque neto sobre el cuerpo sea cero. " +
      "En el movimiento orbital, la gravedad apunta del cuerpo orbitante hacia el cuerpo central (a lo largo de r), " +
      "por lo que su torque τ = r × F = 0 — y L es constante en toda la órbita. " +
      "Dividiendo por la masa se obtiene el momento cinético específico h = L/m = r × v⊥, " +
      "también constante, que caracteriza completamente la forma de la órbita y la tasa de barrido. " +
      "Una línea desde el cuerpo central barre áreas iguales en tiempos iguales — " +
      "la velocidad areolar dA/dt = h/2 es constante. " +
      "En consecuencia, el cuerpo se mueve más rápido cerca del periapsis (r pequeño, v grande) " +
      "y más lento cerca del apoapsis (r grande, v pequeño).",
    "kepler.equations.note.kepler3":
      "El cuadrado del período orbital es proporcional al cubo del semieje mayor: " +
      "T² ∝ a³. Para Marte: T² = (4π²/μ) × a³.",
    "kepler.equations.note.vis_viva":
      "Se deriva de la conservación de la energía. En cualquier punto de la órbita, " +
      "la energía mecánica específica total E = v²/2 − μ/r = −μ/(2a) es constante.",
    "kepler.equations.note.mission":
      "Cadena de momento angular: h = r × v_⊥ se conserva dentro de cada órbita. " +
      "Conociendo cualquier r y la rapidez tangencial, la órbita queda determinada.",

    // Kepler — aproximación de maniobra impulsiva
    "kepler.equations.section.impulsive": "Aproximación de maniobra impulsiva",
    "kepler.equations.impulsive.burn": "Δt → 0,  Δs ≈ 0  por quema",
    "kepler.equations.impulsive.position":
      "posición fija en A, B, C  →  solo v cambia",
    "kepler.equations.note.impulsive":
      "Cada Δv se modela como un impulso instantáneo: el tiempo de quema Δt → 0 " +
      "y el arco recorrido durante la quema Δs ≈ 0. " +
      "En consecuencia, la posición del vehículo se mantiene fija en A, B o C durante la maniobra — " +
      "solo cambia el vector velocidad. " +
      "Por eso la solución encadena directamente los momentos angulares en cada punto " +
      "sin integrar la trayectoria durante la aceleración. " +
      "La aproximación es válida cuando el tiempo de quema es despreciable frente al " +
      "período orbital (aquí T₁ ≈ 107 h frente a una quema de segundos o minutos). " +
      "Cuando esa relación no es pequeña, se requiere un modelo de empuje finito: la fuerza de empuje, " +
      "la masa variable (ecuación de Tsiolkovsky) y el arco real recorrido deben integrarse — " +
      "el resultado ya no es analítico.",
  },
};
