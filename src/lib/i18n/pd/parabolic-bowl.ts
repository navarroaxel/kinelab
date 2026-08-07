export const parabolicBowl = {
  en: {
    "parabolic-bowl.page.canvas_aria":
      "Parabolic bowl simulator — a sphere sliding without friction between two supports, checked against a roller-coaster design limit",

    "parabolic-bowl.controls.section.track": "Sphere & track",
    "parabolic-bowl.controls.section.visibility": "Visibility",
    "parabolic-bowl.controls.slider.mass": "Sphere mass m",
    "parabolic-bowl.controls.slider.sag": "Sag (flecha) H",
    "parabolic-bowl.controls.slider.span": "Span (vano) L",
    "parabolic-bowl.controls.slider.g_limit": "Design limit",
    "parabolic-bowl.controls.toggle.sphere": "Sphere + track",
    "parabolic-bowl.controls.toggle.normal": "Normal-force arrow",
    "parabolic-bowl.controls.btn.reset": "Reset",
    "parabolic-bowl.controls.btn.pause": "Pause",
    "parabolic-bowl.controls.btn.resume": "Resume",

    "parabolic-bowl.canvas.exceeds": "⚠ Exceeds design limit",
    "parabolic-bowl.canvas.ok": "Within design limit",

    "parabolic-bowl.metrics.heading": "Live Metrics",
    "parabolic-bowl.metrics.a_bottom": "a  (vertex acceleration)",
    "parabolic-bowl.metrics.n_bottom": "N(0)  (normal force at vertex)",
    "parabolic-bowl.metrics.min_span": "L_min  (for this sag & limit)",
    "parabolic-bowl.metrics.warn.exceeds":
      "⚠ At the vertex, the sphere's acceleration exceeds the design limit — widen the span or reduce the sag.",

    "parabolic-bowl.legend.heading": "Legend",
    "parabolic-bowl.legend.track": "Parabolic track",
    "parabolic-bowl.legend.sphere": "Sphere",
    "parabolic-bowl.legend.speed": "Speed readout",
    "parabolic-bowl.legend.normal": "Normal force N",

    "parabolic-bowl.equations.heading": "Equations",
    "parabolic-bowl.equations.section.statement": "Statement",
    "parabolic-bowl.equations.statement.text":
      "A sphere starts from rest at A and slides without friction along a parabolic profile with sag H and span L. Find the normal reaction as a function of x, and the L-to-H ratio that keeps the vertex acceleration under 4g (a roller-coaster design criterion).",
    "parabolic-bowl.equations.section.theory": "Theory",
    "parabolic-bowl.equations.theory.energy":
      "Energy conservation gives the speed at any point without needing the equation of motion: starting from rest at height H above the vertex, v² = 2g·(H − y(x)) — the sphere is fastest exactly where it's lowest.",
    "parabolic-bowl.equations.theory.curvature":
      "The normal force needs the track's curvature, not just its height: N − mg·cos θ = m·v²/ρ, where θ is the tangent's angle from horizontal and ρ is the radius of curvature. At the vertex the tangent is horizontal (θ=0, cos θ=1) and the parabola's curvature is exactly 1/ρ = y'' — the constant 8H/L² — which is why the vertex has the cleanest, and often the largest, N.",
    "parabolic-bowl.equations.section.formulas": "Formulas",
    "parabolic-bowl.equations.section.reference": "Reference (default values)",
    "parabolic-bowl.equations.note.reference":
      "a(vertex) = 16 × 9.81 × 2² / 6² ≈ 17.44 m/s² ≈ 1.78g — within the 4g limit.\n" +
      "N(0) = m·g·(1 + 16H²/L²) ≈ 27.3 N for m = 1 kg.\n" +
      "Design rule: L ≥ 4H/√(g_limit) — for the 4g criterion, L ≥ 2H exactly.",
    "parabolic-bowl.equations.section.plot": "Normal force along the track",
    "parabolic-bowl.plot.nx.title": "N(x) — normal force vs. position, minimum at the edges",
  },
  es: {
    "parabolic-bowl.page.canvas_aria":
      "Simulador de trayectoria parabólica — una esfera deslizando sin fricción entre dos apoyos, verificada contra un límite de diseño tipo montaña rusa",

    "parabolic-bowl.controls.section.track": "Esfera y trayectoria",
    "parabolic-bowl.controls.section.visibility": "Visibilidad",
    "parabolic-bowl.controls.slider.mass": "Masa de la esfera m",
    "parabolic-bowl.controls.slider.sag": "Flecha H",
    "parabolic-bowl.controls.slider.span": "Vano L",
    "parabolic-bowl.controls.slider.g_limit": "Límite de diseño",
    "parabolic-bowl.controls.toggle.sphere": "Esfera + trayectoria",
    "parabolic-bowl.controls.toggle.normal": "Flecha de fuerza normal",
    "parabolic-bowl.controls.btn.reset": "Reiniciar",
    "parabolic-bowl.controls.btn.pause": "Pausar",
    "parabolic-bowl.controls.btn.resume": "Reanudar",

    "parabolic-bowl.canvas.exceeds": "⚠ Supera el límite de diseño",
    "parabolic-bowl.canvas.ok": "Dentro del límite de diseño",

    "parabolic-bowl.metrics.heading": "Métricas en vivo",
    "parabolic-bowl.metrics.a_bottom": "a  (aceleración en el vértice)",
    "parabolic-bowl.metrics.n_bottom": "N(0)  (normal en el vértice)",
    "parabolic-bowl.metrics.min_span": "L_mín  (para esta flecha y límite)",
    "parabolic-bowl.metrics.warn.exceeds":
      "⚠ En el vértice, la aceleración de la esfera supera el límite de diseño — ampliá el vano o reducí la flecha.",

    "parabolic-bowl.legend.heading": "Leyenda",
    "parabolic-bowl.legend.track": "Trayectoria parabólica",
    "parabolic-bowl.legend.sphere": "Esfera",
    "parabolic-bowl.legend.speed": "Lectura de rapidez",
    "parabolic-bowl.legend.normal": "Fuerza normal N",

    "parabolic-bowl.equations.heading": "Ecuaciones",
    "parabolic-bowl.equations.section.statement": "Enunciado",
    "parabolic-bowl.equations.statement.text":
      "Una esfera parte del reposo en A y se desliza sin fricción por un perfil parabólico de flecha H y vano L. Hallar la reacción normal en función de x, y la relación L/H que mantiene la aceleración en el vértice por debajo de 4g (criterio de diseño de montaña rusa).",
    "parabolic-bowl.equations.section.theory": "Teoría",
    "parabolic-bowl.equations.theory.energy":
      "La conservación de la energía da la rapidez en cualquier punto sin necesitar la ecuación de movimiento: partiendo del reposo a una altura H sobre el vértice, v² = 2g·(H − y(x)) — la esfera es más rápida exactamente donde está más baja.",
    "parabolic-bowl.equations.theory.curvature":
      "La fuerza normal necesita la curvatura de la trayectoria, no solo su altura: N − mg·cos θ = m·v²/ρ, donde θ es el ángulo de la tangente respecto de la horizontal y ρ es el radio de curvatura. En el vértice la tangente es horizontal (θ=0, cos θ=1) y la curvatura de la parábola es exactamente 1/ρ = y'' — la constante 8H/L² — por eso el vértice tiene el N más simple, y muchas veces el más grande.",
    "parabolic-bowl.equations.section.formulas": "Fórmulas",
    "parabolic-bowl.equations.section.reference": "Referencia (valores por defecto)",
    "parabolic-bowl.equations.note.reference":
      "a(vértice) = 16 × 9,81 × 2² / 6² ≈ 17,44 m/s² ≈ 1,78g — dentro del límite de 4g.\n" +
      "N(0) = m·g·(1 + 16H²/L²) ≈ 27,3 N para m = 1 kg.\n" +
      "Regla de diseño: L ≥ 4H/√(g_límite) — para el criterio de 4g, L ≥ 2H exactamente.",
    "parabolic-bowl.equations.section.plot": "Fuerza normal a lo largo de la trayectoria",
    "parabolic-bowl.plot.nx.title":
      "N(x) — fuerza normal vs. posición, mínima en los extremos",
  },
};
