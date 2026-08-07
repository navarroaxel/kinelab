export const springStop = {
  en: {
    "spring-stop.page.canvas_aria":
      "Spring-stop simulator — package sliding down an incline into a precompressed spring",

    "spring-stop.controls.section.package": "Package & incline",
    "spring-stop.controls.section.spring": "Spring",
    "spring-stop.controls.section.visibility": "Visibility",
    "spring-stop.controls.slider.mass": "Mass m",
    "spring-stop.controls.slider.angle": "Incline angle θ",
    "spring-stop.controls.slider.friction": "Friction coefficient μ",
    "spring-stop.controls.slider.distance": "Distance to spring L",
    "spring-stop.controls.slider.speed": "Speed at L, v₀",
    "spring-stop.controls.slider.spring_constant": "Spring constant k",
    "spring-stop.controls.slider.precompression": "Precompression x₀",
    "spring-stop.controls.toggle.package": "Sliding package",
    "spring-stop.controls.toggle.energy_bar": "Energy bar",
    "spring-stop.controls.btn.reset": "Reset",
    "spring-stop.controls.btn.pause": "Pause",
    "spring-stop.controls.btn.resume": "Resume",

    "spring-stop.canvas.invalid":
      "No physical solution — the package doesn't reach the spring with this speed/friction combination",
    "spring-stop.canvas.marker": "L",
    "spring-stop.canvas.kinetic_energy": "KE / KE₀",

    "spring-stop.symbol.additional_deformation": "delta",
    "spring-stop.symbol.max_force": "F_max",
    "spring-stop.symbol.precompression_force": "F_0",

    "spring-stop.metrics.heading": "Live Metrics",
    "spring-stop.metrics.precompression_force": "F_0  (precompression force)",
    "spring-stop.metrics.deformation": "delta  (additional deformation)",
    "spring-stop.metrics.max_force": "F_max  (peak spring force)",
    "spring-stop.metrics.valid": "Solution",

    "spring-stop.legend.heading": "Legend",
    "spring-stop.legend.package": "Package",
    "spring-stop.legend.spring": "Spring (precompressed)",
    "spring-stop.legend.velocity": "Instantaneous speed",

    "spring-stop.equations.heading": "Equations",
    "spring-stop.equations.section.statement": "Statement",
    "spring-stop.equations.statement.text":
      "A 70 kg package slides down a 20° incline (μ = 0.20) and passes a point 10 m from a spring (k = 30 kgf/cm) at 6 m/s. The spring is held precompressed 10 cm by two cables before the package arrives. Find the additional deformation and the maximum force on the package.",
    "spring-stop.equations.section.theory": "Theory",
    "spring-stop.equations.theory.energy":
      "Work–energy theorem: from the 10 m mark to the point of maximum compression (where the package is momentarily at rest), the package's kinetic energy is converted by gravity (doing positive work as it descends), friction (doing negative work over the whole path), and the spring (doing negative work as it compresses). Because the spring starts precompressed, its resisting force is already F_0 = k·x₀ at first contact and ramps up linearly to F_0 + k·delta — the work it absorbs is the trapezoidal area under that force-vs-deformation line, F_0·delta + ½·k·delta².",
    "spring-stop.equations.theory.quadratic":
      "Solving for delta: collecting every term into the work-energy balance gives a quadratic equation in delta. Its coefficients mix the spring stiffness with gravity and friction along the incline, so the physically meaningful root is the one that comes out positive — the other root is a mathematical artifact with no physical meaning here.",
    "spring-stop.equations.section.formulas": "Formulas",
    "spring-stop.equations.section.reference": "Reference (default values)",
    "spring-stop.equations.note.reference":
      "F_0 = k·x₀ = 29 430 N/m × 0.10 m ≈ 2 943 N.\n" +
      "Solving the quadratic gives delta ≈ 31.2 cm.\n" +
      "F_max = F_0 + k·delta ≈ 12 121 N.",
  },
  es: {
    "spring-stop.page.canvas_aria":
      "Simulador de tope con resorte — paquete deslizando por un plano inclinado hacia un resorte precomprimido",

    "spring-stop.controls.section.package": "Paquete y plano",
    "spring-stop.controls.section.spring": "Resorte",
    "spring-stop.controls.section.visibility": "Visibilidad",
    "spring-stop.controls.slider.mass": "Masa m",
    "spring-stop.controls.slider.angle": "Ángulo del plano θ",
    "spring-stop.controls.slider.friction": "Coeficiente de fricción μ",
    "spring-stop.controls.slider.distance": "Distancia al resorte L",
    "spring-stop.controls.slider.speed": "Velocidad en L, v₀",
    "spring-stop.controls.slider.spring_constant": "Constante del resorte k",
    "spring-stop.controls.slider.precompression": "Precompresión x₀",
    "spring-stop.controls.toggle.package": "Paquete deslizando",
    "spring-stop.controls.toggle.energy_bar": "Barra de energía",
    "spring-stop.controls.btn.reset": "Reiniciar",
    "spring-stop.controls.btn.pause": "Pausar",
    "spring-stop.controls.btn.resume": "Reanudar",

    "spring-stop.canvas.invalid":
      "No hay solución física — el paquete no llega al resorte con esta combinación de velocidad/fricción",
    "spring-stop.canvas.marker": "L",
    "spring-stop.canvas.kinetic_energy": "Ec / Ec₀",

    "spring-stop.symbol.additional_deformation": "delta",
    "spring-stop.symbol.max_force": "F_max",
    "spring-stop.symbol.precompression_force": "F_0",

    "spring-stop.metrics.heading": "Métricas en vivo",
    "spring-stop.metrics.precompression_force": "F_0  (fuerza de precompresión)",
    "spring-stop.metrics.deformation": "delta  (deformación adicional)",
    "spring-stop.metrics.max_force": "F_max  (fuerza máxima del resorte)",
    "spring-stop.metrics.valid": "Solución",

    "spring-stop.legend.heading": "Leyenda",
    "spring-stop.legend.package": "Paquete",
    "spring-stop.legend.spring": "Resorte (precomprimido)",
    "spring-stop.legend.velocity": "Velocidad instantánea",

    "spring-stop.equations.heading": "Ecuaciones",
    "spring-stop.equations.section.statement": "Enunciado",
    "spring-stop.equations.statement.text":
      "Un paquete de 70 kg desliza por un plano inclinado de 20° (μ = 0,20) y pasa por un punto a 10 m de un resorte (k = 30 kgf/cm) a 6 m/s. El resorte se mantiene precomprimido 10 cm mediante dos cables antes de que llegue el paquete. Hallar la deformación adicional y la fuerza máxima sobre el paquete.",
    "spring-stop.equations.section.theory": "Teoría",
    "spring-stop.equations.theory.energy":
      "Teorema del trabajo y la energía: desde la marca de 10 m hasta el punto de máxima compresión (donde el paquete queda momentáneamente en reposo), la energía cinética del paquete se transforma por la gravedad (que hace trabajo positivo al descender), la fricción (que hace trabajo negativo en todo el recorrido) y el resorte (que hace trabajo negativo al comprimirse). Como el resorte arranca precomprimido, su fuerza resistente ya es F_0 = k·x₀ en el primer contacto y crece linealmente hasta F_0 + k·delta — el trabajo que absorbe es el área trapezoidal bajo esa recta fuerza-deformación, F_0·delta + ½·k·delta².",
    "spring-stop.equations.theory.quadratic":
      "Despejando delta: reuniendo todos los términos del balance de trabajo y energía se obtiene una ecuación cuadrática en delta. Sus coeficientes combinan la rigidez del resorte con la gravedad y la fricción sobre el plano, así que la raíz físicamente válida es la que resulta positiva — la otra raíz es un artefacto matemático sin significado físico aquí.",
    "spring-stop.equations.section.formulas": "Fórmulas",
    "spring-stop.equations.section.reference": "Referencia (valores por defecto)",
    "spring-stop.equations.note.reference":
      "F_0 = k·x₀ = 29 430 N/m × 0,10 m ≈ 2 943 N.\n" +
      "Resolviendo la cuadrática, delta ≈ 31,2 cm.\n" +
      "F_max = F_0 + k·delta ≈ 12 121 N.",
  },
};
