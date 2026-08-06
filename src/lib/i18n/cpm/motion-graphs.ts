export const motionGraphs = {
  en: {
    "motion-graphs.page.canvas_aria":
      "Motion graph builder — drag the v(t) polyline vertices to see a(t) and x(t) recompute live",

    "motion-graphs.controls.section.presets": "TP presets",
    "motion-graphs.controls.section.editing": "Editing",
    "motion-graphs.controls.section.visibility": "Visibility",
    "motion-graphs.controls.preset.case1": "Case 1",
    "motion-graphs.controls.preset.case2": "Case 2",
    "motion-graphs.controls.preset.case3": "Case 3",
    "motion-graphs.controls.preset.case4": "Case 4",
    "motion-graphs.controls.btn.add_segment": "Add segment",
    "motion-graphs.controls.btn.remove_segment": "Remove segment",
    "motion-graphs.controls.toggle.snap": "Snap to grid",
    "motion-graphs.controls.toggle.acceleration": "a(t) panel",
    "motion-graphs.controls.toggle.position": "x(t) panel",
    "motion-graphs.controls.toggle.markers": "Extrema markers",
    "motion-graphs.controls.slider.scrub": "Scrub time",
    "motion-graphs.controls.btn.reset": "Reset",
    "motion-graphs.controls.hint.drag":
      "Drag a vertex to edit v(t). Interior vertices move freely; the first and last only move vertically.",

    "motion-graphs.metrics.heading": "Live Metrics",
    "motion-graphs.metrics.t": "t  (scrub time)",
    "motion-graphs.metrics.v": "v(t)",
    "motion-graphs.metrics.a": "a(t)",
    "motion-graphs.metrics.x": "x(t)",
    "motion-graphs.metrics.xfinal": "x  (final)",

    "motion-graphs.legend.heading": "Legend",
    "motion-graphs.legend.velocity": "v(t)  (editable polyline)",
    "motion-graphs.legend.acceleration": "a(t)  (piecewise constant)",
    "motion-graphs.legend.position": "x(t)  (exact integration)",
    "motion-graphs.legend.marker": "Extremum of x  (v = 0)",

    "motion-graphs.equations.heading": "Equations",
    "motion-graphs.equations.section.statement": "Statement",
    "motion-graphs.equations.statement.text":
      "Given a piecewise-linear v(t) with x₀ = 0, construct a(t) and x(t).",
    "motion-graphs.equations.section.formulas": "Per-segment formulas",
    "motion-graphs.equations.section.reference": "TP reference cases",
    "motion-graphs.equations.note.reference":
      "Case 1: a = 0/+1/0 m/s², x at breakpoints = 400, 1400, 3200 m. Case 2: a = +5/0/−10/0, x = 1000, 2000, 2500 m. Case 3: a = 0/−10/3/0, x = 400, max 640 at t = 22 s, 100, −1100 m. Case 4: a = −5/0/+5/0, x = max 250 at t = 10 s, −500, min −750 at t = 40 s, 0.",
    "motion-graphs.equations.section.plots": "a(t) and x(t)",
    "motion-graphs.plot.vt.title": "v(t) — editable polyline",
    "motion-graphs.plot.at.title": "a(t) — piecewise constant",
    "motion-graphs.plot.xt.title": "x(t) — exact integration",
  },
  es: {
    "motion-graphs.page.canvas_aria":
      "Constructor de gráficos de movimiento — arrastrá los vértices de v(t) para ver a(t) y x(t) recalculados en vivo",

    "motion-graphs.controls.section.presets": "Casos del TP",
    "motion-graphs.controls.section.editing": "Edición",
    "motion-graphs.controls.section.visibility": "Visibilidad",
    "motion-graphs.controls.preset.case1": "Caso 1",
    "motion-graphs.controls.preset.case2": "Caso 2",
    "motion-graphs.controls.preset.case3": "Caso 3",
    "motion-graphs.controls.preset.case4": "Caso 4",
    "motion-graphs.controls.btn.add_segment": "Agregar tramo",
    "motion-graphs.controls.btn.remove_segment": "Quitar tramo",
    "motion-graphs.controls.toggle.snap": "Ajustar a grilla",
    "motion-graphs.controls.toggle.acceleration": "Panel a(t)",
    "motion-graphs.controls.toggle.position": "Panel x(t)",
    "motion-graphs.controls.toggle.markers": "Marcadores de extremos",
    "motion-graphs.controls.slider.scrub": "Tiempo de exploración",
    "motion-graphs.controls.btn.reset": "Reiniciar",
    "motion-graphs.controls.hint.drag":
      "Arrastrá un vértice para editar v(t). Los vértices interiores se mueven libremente; el primero y el último solo verticalmente.",

    "motion-graphs.metrics.heading": "Métricas en vivo",
    "motion-graphs.metrics.t": "t  (tiempo explorado)",
    "motion-graphs.metrics.v": "v(t)",
    "motion-graphs.metrics.a": "a(t)",
    "motion-graphs.metrics.x": "x(t)",
    "motion-graphs.metrics.xfinal": "x  (final)",

    "motion-graphs.legend.heading": "Leyenda",
    "motion-graphs.legend.velocity": "v(t)  (poligonal editable)",
    "motion-graphs.legend.acceleration": "a(t)  (constante a tramos)",
    "motion-graphs.legend.position": "x(t)  (integración exacta)",
    "motion-graphs.legend.marker": "Extremo de x  (v = 0)",

    "motion-graphs.equations.heading": "Ecuaciones",
    "motion-graphs.equations.section.statement": "Enunciado",
    "motion-graphs.equations.statement.text":
      "Dado un v(t) lineal a tramos con x₀ = 0, construir a(t) y x(t).",
    "motion-graphs.equations.section.formulas": "Fórmulas por tramo",
    "motion-graphs.equations.section.reference": "Casos de referencia del TP",
    "motion-graphs.equations.note.reference":
      "Caso 1: a = 0/+1/0 m/s², x en los quiebres = 400, 1400, 3200 m. Caso 2: a = +5/0/−10/0, x = 1000, 2000, 2500 m. Caso 3: a = 0/−10/3/0, x = 400, máx 640 en t = 22 s, 100, −1100 m. Caso 4: a = −5/0/+5/0, x = máx 250 en t = 10 s, −500, mín −750 en t = 40 s, 0.",
    "motion-graphs.equations.section.plots": "a(t) y x(t)",
    "motion-graphs.plot.vt.title": "v(t) — poligonal editable",
    "motion-graphs.plot.at.title": "a(t) — constante a tramos",
    "motion-graphs.plot.xt.title": "x(t) — integración exacta",
  },
};
