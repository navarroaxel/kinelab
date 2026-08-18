export const vibrationsQuiz = {
  en: {
    "vq.title": "Mechanical Vibrations Quiz",
    "vq.instructions":
      "State whether the following statements are true or false.",
    "vq.true": "True",
    "vq.false": "False",
    "vq.submit": "Grade",
    "vq.retry": "Try again",
    "vq.score_label": "Score",
    "vq.correct": "Correct",
    "vq.incorrect": "Incorrect",

    "vq.q.a":
      "A system is only considered damped if it loses energy through a damper during vibration.",
    "vq.j.a":
      "False. Damping is any energy-dissipating mechanism — dry friction, air resistance, material hysteresis, or a viscous damper — not exclusively a mechanical damper device. A system is damped whenever it loses energy, regardless of the mechanism.",

    "vq.q.b":
      "The frequency at which a system vibrates when initially disturbed by itself is known as the natural frequency.",
    "vq.j.b":
      "True. The frequency of free vibration — a system disturbed and then left to move with no continuing external force — is called the natural frequency (ωₙ); for the undamped case it depends only on the system's mass and stiffness.",

    "vq.q.c": "Harmonic motion is a periodic motion.",
    "vq.j.c":
      "True. Simple harmonic motion is sinusoidal (x = A·sin(ωt + φ)), repeating identically every period T = 2π/ω — by definition it is periodic.",

    "vq.q.d": "Every periodic motion is harmonic.",
    "vq.j.d":
      "False. Periodicity only requires the motion to repeat at equal time intervals — it doesn't require a sinusoidal shape. Square waves, sawtooth waves, or any sum of several harmonics are periodic without being simple harmonic.",

    "vq.q.e":
      "Undamped vibration is characterized by having no energy loss.",
    "vq.j.e":
      "True. In undamped free vibration there is no energy dissipation: the total mechanical energy (kinetic + potential) stays constant and the amplitude never decays.",

    "vq.q.f":
      "The time required to complete one cycle of motion is called the vibration frequency.",
    "vq.j.f":
      "False. That describes the period of vibration (T), not the frequency. Frequency f = 1/T is the number of cycles per unit time (ω = 2π/T is the angular frequency).",

    "vq.q.g":
      "In an underdamped mechanical system, the angular frequency of the motion is √(k/m).",
    "vq.j.g":
      "False. √(k/m) is the undamped natural frequency ωₙ. An underdamped system oscillates at the damped frequency ω_d = ωₙ·√(1 − ζ²), which is always lower; it only tends to √(k/m) as ζ → 0.",

    "vq.q.h":
      "The critically damped response is obtained as the combination of two exponential functions with real, distinct and negative exponents.",
    "vq.j.h":
      "False. That is the overdamped case (ζ > 1), with two distinct real roots. At critical damping (ζ = 1) the characteristic equation has a double root s = −ωₙ, so the response is x(t) = (A + B·t)·e^(−ωₙt) — an exponential multiplied by a linear term, not two distinct exponentials.",

    "vq.q.i":
      "In simple harmonic oscillatory motion, the mechanical energy is constant.",
    "vq.j.i":
      "True. Harmonic motion is the undamped case: with no dissipation, kinetic and potential energy trade back and forth while their sum E = ½·k·A² stays constant, which is why the amplitude never decays.",

    "vq.q.j":
      "The period of oscillation of a physical pendulum resembles that of an ideal pendulum the farther the centre of mass is from the axis of rotation.",
    "vq.j.j":
      "True. For a physical pendulum T = 2π·√((k_G² + d²)/(g·d)), where d is the distance from the axis to the centre of mass and k_G the radius of gyration about it. As d grows, k_G² becomes negligible against d² and T → 2π·√(d/g), the ideal (point-mass) pendulum.",

    "vq.q.k":
      "For a base-excited mechanical system, transmissibility to the main mass can be reduced by increasing the damping when ω_f/ωₙ > √2.",
    "vq.j.k":
      "False. r = √2 is the crossover point: all transmissibility curves pass through TR = 1 there. Below it damping helps, but above it more damping raises TR — in the isolation region (r > √2) increasing damping worsens transmissibility.",

    "vq.q.l":
      "In a self-excited mechanical system, the eccentricity of the rotating mass directly affects the amplitude of the forced vibration.",
    "vq.j.l":
      "True. Rotating unbalance produces F₀ = m_r·e·ω², so the excitation — and with it the steady-state amplitude X = (m_r·e/m)·r²/√((1 − r²)² + (2ζr)²) — is directly proportional to the eccentricity e.",
  },
  es: {
    "vq.title": "Vibraciones Mecánicas — Quiz",
    "vq.instructions":
      "Indique si las siguientes afirmaciones son verdaderas o falsas.",
    "vq.true": "Verdadero",
    "vq.false": "Falso",
    "vq.submit": "Corregir",
    "vq.retry": "Reintentar",
    "vq.score_label": "Puntaje",
    "vq.correct": "Correcto",
    "vq.incorrect": "Incorrecto",

    "vq.q.a":
      "Solo si se pierde energía mediante un amortiguador durante la vibración, se considera que el sistema es amortiguado.",
    "vq.j.a":
      "Falso. El amortiguamiento es la pérdida de energía por cualquier mecanismo disipativo — fricción seca, resistencia del aire, histéresis del material o un amortiguador viscoso — no exclusivamente por un dispositivo amortiguador. Un sistema es amortiguado siempre que pierda energía, sin importar el mecanismo.",

    "vq.q.b":
      "La frecuencia con la cual vibra un sistema inicialmente perturbado por sí mismo se la conoce como frecuencia natural.",
    "vq.j.b":
      "Verdadero. La frecuencia de la vibración libre — un sistema perturbado y luego dejado en movimiento sin fuerza externa continua — se llama frecuencia natural (ωₙ); para el caso no amortiguado depende solo de la masa y la rigidez del sistema.",

    "vq.q.c": "Un movimiento armónico es un movimiento periódico.",
    "vq.j.c":
      "Verdadero. El movimiento armónico simple es sinusoidal (x = A·sen(ωt + φ)), y se repite idénticamente cada período T = 2π/ω — por definición es periódico.",

    "vq.q.d": "Todo movimiento periódico es armónico.",
    "vq.j.d":
      "Falso. La periodicidad solo exige que el movimiento se repita en intervalos iguales de tiempo, no que tenga forma sinusoidal. Una onda cuadrada, un diente de sierra o cualquier suma de varios armónicos son periódicos sin ser armónicos simples.",

    "vq.q.e":
      "La vibración no amortiguada se caracteriza por no tener pérdida de energía.",
    "vq.j.e":
      "Verdadero. En la vibración libre no amortiguada no hay disipación de energía: la energía mecánica total (cinética + potencial) permanece constante y la amplitud no decae con el tiempo.",

    "vq.q.f":
      "El tiempo requerido para completar un ciclo de movimiento se llama frecuencia de vibración.",
    "vq.j.f":
      "Falso. Eso describe el período de vibración (T), no la frecuencia. La frecuencia f = 1/T es el número de ciclos por unidad de tiempo (ω = 2π/T es la frecuencia angular).",

    "vq.q.g":
      "En un sistema mecánico subamortiguado, la pulsación del movimiento se obtiene como √(k/m).",
    "vq.j.g":
      "Falso. √(k/m) es la pulsación natural no amortiguada ωₙ. Un sistema subamortiguado oscila con la pulsación amortiguada ω_d = ωₙ·√(1 − ζ²), siempre menor; solo tiende a √(k/m) cuando ζ → 0.",

    "vq.q.h":
      "La respuesta crítica se obtiene como la combinación de dos funciones exponenciales con exponentes reales, distintos y negativos.",
    "vq.j.h":
      "Falso. Ese es el caso sobreamortiguado (ζ > 1), con dos raíces reales distintas. En el amortiguamiento crítico (ζ = 1) la ecuación característica tiene una raíz doble s = −ωₙ, por lo que la respuesta es x(t) = (A + B·t)·e^(−ωₙt) — una exponencial multiplicada por un término lineal, no dos exponenciales distintas.",

    "vq.q.i":
      "En un movimiento oscilatorio armónico, la energía mecánica es constante.",
    "vq.j.i":
      "Verdadero. El movimiento armónico es el caso no amortiguado: sin disipación, la energía cinética y la potencial se intercambian mientras su suma E = ½·k·A² permanece constante, y por eso la amplitud no decae.",

    "vq.q.j":
      "El período de oscilación de un péndulo físico se asemeja más al de un péndulo ideal cuanto más lejos esté el centro de masas respecto al eje de rotación.",
    "vq.j.j":
      "Verdadero. Para un péndulo físico T = 2π·√((k_G² + d²)/(g·d)), donde d es la distancia del eje al centro de masas y k_G el radio de giro respecto de éste. Al crecer d, k_G² se vuelve despreciable frente a d² y T → 2π·√(d/g), el péndulo ideal (masa puntual).",

    "vq.q.k":
      "Sea un sistema mecánico excitado por base, se puede reducir la transmisibilidad a la masa principal aumentando el amortiguamiento cuando la relación ω_f/ωₙ > √2.",
    "vq.j.k":
      "Falso. r = √2 es el punto de cruce: todas las curvas de transmisibilidad pasan por TR = 1 allí. Por debajo el amortiguamiento ayuda, pero por encima más amortiguamiento aumenta TR — en la zona de aislamiento (r > √2) aumentar el amortiguamiento empeora la transmisibilidad.",

    "vq.q.l":
      "En un sistema mecánico autoexcitado, la excentricidad de la masa rotante afecta directamente a la amplitud de la vibración forzada.",
    "vq.j.l":
      "Verdadero. El desbalance rotante genera F₀ = m_r·e·ω², de modo que la excitación — y con ella la amplitud de régimen X = (m_r·e/m)·r²/√((1 − r²)² + (2ζr)²) — es directamente proporcional a la excentricidad e.",
  },
};
