export const vehicleSuspension = {
  en: {
    "vs.title": "Vehicle Suspension — Base Excitation",
    "vs.canvas_aria": "Vehicle body oscillating above a shaking test platform",

    "vs.controls.section.vehicle": "Vehicle & suspension",
    "vs.controls.slider.mass": "Vehicle mass",
    "vs.controls.slider.static_deflection": "Static deflection per spring",
    "vs.controls.slider.damping": "Damping per damper",
    "vs.controls.section.excitation": "Test platform",
    "vs.controls.slider.amplitude": "Platform amplitude Y₀",
    "vs.controls.slider.frequency_ratio": "Frequency ratio r = ω/ωₙ",
    "vs.controls.btn.reset": "Reset",
    "vs.controls.btn.pause": "Pause",
    "vs.controls.btn.resume": "Resume",

    "vs.metrics.heading": "Live readouts",
    "vs.metrics.kEq": "k_eq",
    "vs.metrics.cEq": "c_eq",
    "vs.metrics.omegaN": "ω_n",
    "vs.metrics.zeta": "ζ",
    "vs.metrics.TR": "TR = X₀/Y₀",
    "vs.metrics.X0": "X_0",

    "vs.legend.heading": "Legend",
    "vs.legend.platform": "Test platform y(t) — base excitation",
    "vs.legend.spring": "Equivalent spring (4 springs combined)",
    "vs.legend.damper": "Equivalent damper (4 dampers combined)",
    "vs.legend.body": "Vehicle body x(t) — CG response",

    "vs.equations.heading": "Theory & formulas",
    "vs.equations.section.statement": "Problem",
    "vs.equations.statement.text":
      "A 1000 kg car body (wheels excluded) rests on 4 identical springs, each compressed 9 cm by its share of the weight, plus 4 identical dampers with c = 68.6 N·s/cm. The 4 wheels are clamped to a test platform that oscillates harmonically at the system's own natural frequency, with amplitude 3 cm. Find the amplitude of the CG's motion — the CG sits at the centroid of the 4 wheels.",
    "vs.equations.section.theory": "Why one spring and one damper",
    "vs.equations.theory.equivalent_system":
      "Because the CG lies at the centroid of the 4 wheels, symmetric base motion produces pure vertical translation — no rocking — so the 4 springs act as one equivalent spring k_eq = 4k, and the 4 dampers as one equivalent damper c_eq = 4c. The problem collapses to an ordinary damped single-degree-of-freedom base-excitation system.",
    "vs.equations.theory.transmissibility":
      "The steady-state response to a harmonically moving base y(t) = Y_0 · sin(ωt) is x(t) = X_0 · sin(ωt − δ), where the displacement transmissibility TR = X_0 / Y_0 depends only on the damping ratio ζ and the frequency ratio r = ω/ω_n — it applies regardless of whether the system is under-, critically, or overdamped.",
    "vs.equations.section.formulas": "Formulas",
    "vs.equations.formulas.legend":
      "n_s = number of springs, n_d = number of dampers, δ_st = static deflection per spring, c = damping coefficient per damper, m = vehicle mass.",
  },
  es: {
    "vs.title": "Suspensión de un vehículo — excitación en la base",
    "vs.canvas_aria": "Carrocería del vehículo oscilando sobre una plataforma de ensayo vibrante",

    "vs.controls.section.vehicle": "Vehículo y suspensión",
    "vs.controls.slider.mass": "Masa del vehículo",
    "vs.controls.slider.static_deflection": "Deformación estática por resorte",
    "vs.controls.slider.damping": "Amortiguamiento por amortiguador",
    "vs.controls.section.excitation": "Plataforma de ensayo",
    "vs.controls.slider.amplitude": "Amplitud de la plataforma Y₀",
    "vs.controls.slider.frequency_ratio": "Relación de frecuencias r = ω/ωₙ",
    "vs.controls.btn.reset": "Reiniciar",
    "vs.controls.btn.pause": "Pausar",
    "vs.controls.btn.resume": "Reanudar",

    "vs.metrics.heading": "Lecturas en vivo",
    "vs.metrics.kEq": "k_eq",
    "vs.metrics.cEq": "c_eq",
    "vs.metrics.omegaN": "ω_n",
    "vs.metrics.zeta": "ζ",
    "vs.metrics.TR": "TR = X₀/Y₀",
    "vs.metrics.X0": "X_0",

    "vs.legend.heading": "Referencias",
    "vs.legend.platform": "Plataforma de ensayo y(t) — excitación en la base",
    "vs.legend.spring": "Resorte equivalente (4 resortes combinados)",
    "vs.legend.damper": "Amortiguador equivalente (4 amortiguadores combinados)",
    "vs.legend.body": "Carrocería x(t) — respuesta del CG",

    "vs.equations.heading": "Teoría y fórmulas",
    "vs.equations.section.statement": "Enunciado",
    "vs.equations.statement.text":
      "Un automóvil cuya masa es 1000 kg (sin incluir las ruedas) está suspendido sobre 4 resortes iguales que se deforman 9 cm cada uno debido al peso del mismo. Además posee 4 amortiguadores con coeficiente de amortiguamiento c = 68,6 N·s/cm. El vehículo se ha colocado con sus 4 ruedas sujetadas a una plataforma de prueba que se mueve armónicamente, cuya pulsación es igual a la del sistema y cuya amplitud es de 3 cm. Encontrar la amplitud del movimiento del centro de gravedad del vehículo, conociendo que está ubicado en el centro de la base formada por las 4 ruedas.",
    "vs.equations.section.theory": "Por qué un solo resorte y un solo amortiguador",
    "vs.equations.theory.equivalent_system":
      "Como el CG está en el centroide de las 4 ruedas, un movimiento de base simétrico produce traslación vertical pura — sin cabeceo — por lo que los 4 resortes equivalen a un único resorte k_eq = 4k, y los 4 amortiguadores a un único amortiguador c_eq = 4c. El problema se reduce a un sistema amortiguado de un grado de libertad con excitación en la base.",
    "vs.equations.theory.transmissibility":
      "La respuesta en régimen permanente ante una base que se mueve armónicamente y(t) = Y_0 · sen(ωt) es x(t) = X_0 · sen(ωt − δ), donde la transmisibilidad de desplazamiento TR = X_0 / Y_0 depende solo de la razón de amortiguamiento ζ y de la relación de frecuencias r = ω/ω_n — vale sin importar si el sistema está sub, críticamente o sobreamortiguado.",
    "vs.equations.section.formulas": "Fórmulas",
    "vs.equations.formulas.legend":
      "n_s = cantidad de resortes, n_d = cantidad de amortiguadores, δ_st = deformación estática por resorte, c = coeficiente de amortiguamiento por amortiguador, m = masa del vehículo.",
  },
};
