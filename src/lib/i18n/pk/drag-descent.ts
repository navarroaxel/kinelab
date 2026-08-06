export const dragDescent = {
  en: {
    "drag-descent.page.canvas_aria":
      "Cyclist with air drag simulator — acceleration from rest against quadratic drag",

    "drag-descent.controls.section.parameters": "Parameters",
    "drag-descent.controls.section.visibility": "Visibility",
    "drag-descent.controls.slider.a": "Driving term A",
    "drag-descent.controls.slider.b": "Drag coefficient B",
    "drag-descent.controls.slider.tmax": "Time horizon t_max",
    "drag-descent.controls.toggle.velocity": "Velocity vector",
    "drag-descent.controls.toggle.drag": "Drag vector (∝ v²)",
    "drag-descent.controls.toggle.trace": "Path trace",
    "drag-descent.controls.btn.reset": "Reset to t = 0",
    "drag-descent.controls.btn.pause": "Pause",
    "drag-descent.controls.btn.resume": "Resume",
    "drag-descent.controls.info.vmax": "vₘₐₓ = √(A/B)",
    "drag-descent.controls.info.k": "k = B·vₘₐₓ",
    "drag-descent.controls.info.thalf": "t½ = artanh(0.5)/k",

    "drag-descent.metrics.heading": "Live Metrics",
    "drag-descent.metrics.v": "v  (speed)",
    "drag-descent.metrics.x": "x  (distance)",
    "drag-descent.metrics.a": "a  (acceleration)",
    "drag-descent.metrics.vmax_pct": "v / vₘₐₓ",
    "drag-descent.metrics.t": "t  (elapsed)",

    "drag-descent.legend.heading": "Legend",
    "drag-descent.legend.velocity": "v  (velocity, → vₘₐₓ)",
    "drag-descent.legend.drag": "F_drag  (∝ v², opposes motion)",
    "drag-descent.legend.vmax_asymptote": "vₘₐₓ asymptote",

    "drag-descent.equations.heading": "Equations",
    "drag-descent.equations.section.statement": "Statement",
    "drag-descent.equations.statement.text":
      "a(v) = A − B·v², starting from rest (v₀ = 0, x₀ = 0). Find v(x), vₘₐₓ, and the time to reach vₘₐₓ/2.",
    "drag-descent.equations.section.closed_form": "Closed-form solution",
    "drag-descent.equations.section.reference": "Reference (default A, B)",
    "drag-descent.equations.note.reference":
      "With A = 0.122 m/s² and B = 0.0007 1/m: vₘₐₓ = 13.20 m/s, k = 0.009241 s⁻¹, t½ = 59.44 s, x(t½) = 205.5 m. At t = 59.4 s the readout should show v ≈ 6.60 m/s and x ≈ 205 m.",
    "drag-descent.equations.section.plots": "v–x, v–t and x–t curves",
    "drag-descent.plot.vt.title": "v(t) — velocity vs. time",
    "drag-descent.plot.xt.title": "x(t) — distance vs. time",
    "drag-descent.plot.vx.title": "v(x) — velocity vs. distance",
  },
  es: {
    "drag-descent.page.canvas_aria":
      "Simulador de ciclista con resistencia del aire — aceleración desde el reposo contra resistencia cuadrática",

    "drag-descent.controls.section.parameters": "Parámetros",
    "drag-descent.controls.section.visibility": "Visibilidad",
    "drag-descent.controls.slider.a": "Término motor A",
    "drag-descent.controls.slider.b": "Coeficiente de resistencia B",
    "drag-descent.controls.slider.tmax": "Horizonte temporal t_max",
    "drag-descent.controls.toggle.velocity": "Vector velocidad",
    "drag-descent.controls.toggle.drag": "Vector resistencia (∝ v²)",
    "drag-descent.controls.toggle.trace": "Trayectoria",
    "drag-descent.controls.btn.reset": "Reiniciar a t = 0",
    "drag-descent.controls.btn.pause": "Pausar",
    "drag-descent.controls.btn.resume": "Reanudar",
    "drag-descent.controls.info.vmax": "vₘₐₓ = √(A/B)",
    "drag-descent.controls.info.k": "k = B·vₘₐₓ",
    "drag-descent.controls.info.thalf": "t½ = artanh(0.5)/k",

    "drag-descent.metrics.heading": "Métricas en vivo",
    "drag-descent.metrics.v": "v  (rapidez)",
    "drag-descent.metrics.x": "x  (distancia)",
    "drag-descent.metrics.a": "a  (aceleración)",
    "drag-descent.metrics.vmax_pct": "v / vₘₐₓ",
    "drag-descent.metrics.t": "t  (transcurrido)",

    "drag-descent.legend.heading": "Leyenda",
    "drag-descent.legend.velocity": "v  (velocidad, → vₘₐₓ)",
    "drag-descent.legend.drag": "F_resist  (∝ v², opone al movimiento)",
    "drag-descent.legend.vmax_asymptote": "Asíntota vₘₐₓ",

    "drag-descent.equations.heading": "Ecuaciones",
    "drag-descent.equations.section.statement": "Enunciado",
    "drag-descent.equations.statement.text":
      "a(v) = A − B·v², partiendo del reposo (v₀ = 0, x₀ = 0). Hallar v(x), vₘₐₓ y el tiempo hasta vₘₐₓ/2.",
    "drag-descent.equations.section.closed_form": "Solución analítica",
    "drag-descent.equations.section.reference": "Referencia (A, B por defecto)",
    "drag-descent.equations.note.reference":
      "Con A = 0,122 m/s² y B = 0,0007 1/m: vₘₐₓ = 13,20 m/s, k = 0,009241 s⁻¹, t½ = 59,44 s, x(t½) = 205,5 m. En t = 59,4 s la lectura debería mostrar v ≈ 6,60 m/s y x ≈ 205 m.",
    "drag-descent.equations.section.plots": "Curvas v–x, v–t y x–t",
    "drag-descent.plot.vt.title": "v(t) — velocidad vs. tiempo",
    "drag-descent.plot.xt.title": "x(t) — distancia vs. tiempo",
    "drag-descent.plot.vx.title": "v(x) — velocidad vs. distancia",
  },
};
