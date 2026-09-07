export const vibrationIsolation = {
  en: {
    "vib3.plot.title": "Transmissibility vs. frequency ratio, with the target and solution",

    "vib3.controls.section.system": "Machine + base",
    "vib3.controls.slider.mass": "Mass M",
    "vib3.controls.slider.damping_ratio": "Damping ratio ζ",
    "vib3.controls.section.target": "Isolation target",
    "vib3.controls.slider.target": "Target transmissibility T",
    "vib3.controls.btn.reset": "Reset",

    "vib3.metrics.heading": "Live readouts",
    "vib3.metrics.reachable_everywhere":
      "This target is at or above the curve's own peak — every frequency already satisfies it, so there is no single critical ω.",
    "vib3.metrics.unattainable":
      "No frequency ratio reaches this target with this damping.",

    "vib3.legend.heading": "Legend",
    "vib3.legend.damped": "T(r) at the current ζ",
    "vib3.legend.undamped": "T(r) at ζ = 0 (comparison)",
    "vib3.legend.target": "Target transmissibility (dashed) and solution r (solid)",
    "vib3.legend.admissible": "Admissible region r ≥ r_solution",

    "vib3.equations.heading": "Theory & formulas",
    "vib3.equations.section.statement": "Problem",
    "vib3.equations.statement.text":
      "A 230 kg machine + base assembly sits on springs of total stiffness 5194 N/cm, with ζ = 0.20. Find the operating frequency ω at which only 20 % of the exciting force is transmitted.",
    "vib3.equations.section.theory": "Solving backwards",
    "vib3.equations.theory.backwards":
      "Every other exercise in this section computes T from r. Here the target T is given and r is the unknown — squaring T = √[1+(2ζr)²]/D and substituting u = r² turns the condition T(r) = target into an ordinary quadratic in u.",
    "vib3.equations.theory.damping_cost":
      "The ζ = 0 comparison curve shows the damping's real cost: reaching the same 20 % transmissibility target takes r = 2.937 with ζ = 0.20 but only r = √6 ≈ 2.449 undamped — damping this isolation mount costs about 20 % more operating speed.",
    "vib3.equations.section.formulas": "Formulas",
  },
  es: {
    "vib3.plot.title":
      "Transmisibilidad vs. relación de frecuencias, con el objetivo y la solución",

    "vib3.controls.section.system": "Máquina + base",
    "vib3.controls.slider.mass": "Masa M",
    "vib3.controls.slider.damping_ratio": "Razón de amortiguamiento ζ",
    "vib3.controls.section.target": "Objetivo de aislamiento",
    "vib3.controls.slider.target": "Transmisibilidad objetivo T",
    "vib3.controls.btn.reset": "Reiniciar",

    "vib3.metrics.heading": "Lecturas en vivo",
    "vib3.metrics.reachable_everywhere":
      "Este objetivo está en o por encima del propio pico de la curva — toda frecuencia ya lo cumple, así que no hay un ω crítico único.",
    "vib3.metrics.unattainable":
      "Ninguna relación de frecuencias alcanza este objetivo con este amortiguamiento.",

    "vib3.legend.heading": "Referencias",
    "vib3.legend.damped": "T(r) con el ζ actual",
    "vib3.legend.undamped": "T(r) con ζ = 0 (comparación)",
    "vib3.legend.target": "Transmisibilidad objetivo (punteada) y solución r (sólida)",
    "vib3.legend.admissible": "Región admisible r ≥ r_solución",

    "vib3.equations.heading": "Teoría y fórmulas",
    "vib3.equations.section.statement": "Enunciado",
    "vib3.equations.statement.text":
      "Un conjunto máquina + base de 230 kg está apoyado sobre resortes de rigidez total 5194 N/cm, con ζ = 0,20. Hallar la frecuencia de trabajo ω a la que solo se transmite el 20 % de la fuerza excitadora.",
    "vib3.equations.section.theory": "Resolviendo al revés",
    "vib3.equations.theory.backwards":
      "Todos los demás ejercicios de esta sección calculan T a partir de r. Acá se da el objetivo T y r es la incógnita — elevando al cuadrado T = √[1+(2ζr)²]/D y sustituyendo u = r² la condición T(r) = objetivo se vuelve una cuadrática común en u.",
    "vib3.equations.theory.damping_cost":
      "La curva de comparación con ζ = 0 muestra el costo real del amortiguamiento: alcanzar el mismo objetivo de transmisibilidad del 20 % exige r = 2,937 con ζ = 0,20 pero solo r = √6 ≈ 2,449 sin amortiguar — amortiguar este montaje de aislamiento cuesta un 20 % más de velocidad de operación.",
    "vib3.equations.section.formulas": "Fórmulas",
  },
};
