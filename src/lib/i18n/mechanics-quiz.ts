export const mechanicsQuiz = {
  en: {
    "mq.title": "Mecánica Técnica Quiz",
    "mq.instructions":
      "State whether the following statements about particle kinematics, particle dynamics, and vibrations are true or false.",
    "mq.true": "True",
    "mq.false": "False",
    "mq.submit": "Grade",
    "mq.retry": "Try again",
    "mq.score_label": "Score",
    "mq.correct": "Correct",
    "mq.incorrect": "Incorrect",

    "mq.q.01":
      "In rectilinear motion, acceleration can be written as a = v·(dv/dx).",
    "mq.j.01":
      "True. By the chain rule, a = dv/dt = (dv/dx)(dx/dt) = v·(dv/dx) — the standard trick for turning a(t) problems into a(x) ones.",

    "mq.q.02":
      "The instantaneous velocity at every point of an interval always equals the average velocity over that interval, no matter how the speed changes.",
    "mq.j.02":
      "False. Average velocity is displacement divided by elapsed time; it equals the instantaneous velocity everywhere only when the velocity is constant over the interval.",

    "mq.q.03":
      "In projectile motion with no air resistance, the horizontal component of velocity stays constant throughout the flight.",
    "mq.j.03":
      "True. With no horizontal force, a_x = 0, so v_x never changes — only the vertical component varies under gravity.",

    "mq.q.04":
      "A particle moving on a circle at constant speed has zero tangential acceleration but a nonzero normal (centripetal) acceleration.",
    "mq.j.04":
      "True. a_t = v̇ = 0 since speed is constant, but a_n = v²/ρ ≠ 0 because the direction of velocity is still changing.",

    "mq.q.05":
      "In polar coordinates, the radial and transverse velocity components are ṙ and r·θ̇ respectively.",
    "mq.j.05":
      "True. Differentiating the position vector r = r·û_r gives v = ṙ·û_r + r·θ̇·û_θ — exactly the radial/transverse split used to decompose circular motion.",

    "mq.q.06":
      "If the pole of a polar description sits at the center of the circle a particle traces at constant angular speed, then ṙ is different from zero.",
    "mq.j.06":
      "False. With the pole at the center, r is constant (pure rotation), so ṙ = 0 and the transverse component rθ̇ carries the entire velocity.",

    "mq.q.07":
      "The radial component of acceleration in polar coordinates is a_r = r̈ − r·θ̇².",
    "mq.j.07":
      "True. This is the standard result from differentiating v twice in polar form; the −r·θ̇² term is the centripetal contribution.",

    "mq.q.08":
      "The transverse component of acceleration in polar coordinates is a_θ = r·θ̈ + 2·ṙ·θ̇.",
    "mq.j.08":
      "True. The 2·ṙ·θ̇ term is exactly the Coriolis-type contribution that appears whenever a particle moves radially while the radial line itself is rotating.",

    "mq.q.09":
      "A Coriolis acceleration term only appears when there is simultaneous relative motion along a rotating direction and rotation of that direction itself.",
    "mq.j.09":
      "True. If either the relative sliding velocity or the angular velocity of the rotating frame is zero, the Coriolis term 2·ω×v_rel vanishes — both ingredients are needed at once.",

    "mq.q.10":
      "The Coriolis acceleration 2·ω×v_rel is always directed opposite to the relative velocity.",
    "mq.j.10":
      "False. A cross product is perpendicular to both vectors involved, so the Coriolis term is perpendicular to v_rel (and to ω), never simply opposite to it.",

    "mq.q.11":
      "Normal–tangential coordinates split acceleration into a_t = v̇ along the path and a_n = v²/ρ perpendicular to it.",
    "mq.j.11":
      "True. This is the path-intrinsic decomposition: a_t changes the speed, a_n changes the direction, and ρ is the local radius of curvature.",

    "mq.q.12":
      "On a smooth (frictionless) curved path, the normal force does no work on the particle.",
    "mq.j.12":
      "True. The normal force is always perpendicular to the velocity, so its power N·v = 0 at every instant — it can redirect the motion but never speed it up or slow it down.",

    "mq.q.13":
      "For a car rounding a banked curve with friction, at the maximum safe speed just before sliding, friction acts down the incline to help supply the centripetal force.",
    "mq.j.13":
      "True. At v_max the car tends to slide up and outward, so friction points down the slope, adding to the horizontal component of N to balance the larger required centripetal force.",

    "mq.q.14":
      "On a banked curve, if the friction coefficient μ is at least cot θ, there is no upper limit on the safe speed.",
    "mq.j.14":
      "True. Once μ ≥ cot θ the friction available can always balance whatever centripetal force is needed, however large the speed — the v_max case becomes unbounded.",

    "mq.q.15":
      "In a smooth vertical circular ring, a particle needs a bottom speed of at least √(5·g·R) to complete a full loop.",
    "mq.j.15":
      "True. This is the classic loop condition: it comes from requiring N ≥ 0 at the top (v_top² ≥ g·R) combined with energy conservation between bottom and top.",

    "mq.q.16":
      "In that same vertical ring problem, the normal force is smallest at the bottom of the loop.",
    "mq.j.16":
      "False. N = g·cos θ + R·θ̇² (θ measured from the bottom) is largest at the bottom and smallest at the top, where gravity and the reduced speed both work against maintaining contact.",

    "mq.q.17":
      "The work–energy principle states that the work done by the resultant force on a particle equals the change in its kinetic energy.",
    "mq.j.17":
      "True. ΣF·dr integrated along the path gives exactly ΔT = T₂ − T₁; it's Newton's second law already integrated once.",

    "mq.q.18":
      "The work done by a spring force between two elongations depends only on those elongations, not on the path taken between them.",
    "mq.j.18":
      "True. The spring force is conservative, so its work is −ΔV = −(½k·x₂² − ½k·x₁²), a function of the endpoints alone.",

    "mq.q.19":
      "The impulse–momentum principle states that the net impulse applied to a particle equals the change in its linear momentum.",
    "mq.j.19":
      "True. ∫ΣF·dt = m·v₂ − m·v₁ is Newton's second law integrated over time rather than over distance.",

    "mq.q.20":
      "In a perfectly plastic (inelastic) collision between two rail cars, kinetic energy is conserved even though momentum is conserved.",
    "mq.j.20":
      "False. Momentum is always conserved in a collision with no external impulse, but a plastic collision (e = 0) dissipates the maximum possible kinetic energy into deformation and heat.",

    "mq.q.21":
      "A coefficient of restitution e = 1 corresponds to a perfectly elastic impact.",
    "mq.j.21":
      "True. e = 1 means the relative separation speed equals the relative approach speed, which is exactly the condition for no kinetic energy loss in a direct central impact.",

    "mq.q.22":
      "Kepler's second law — equal areas swept in equal times — is a direct consequence of angular momentum conservation under a central force.",
    "mq.j.22":
      "True. A central force produces no moment about the force center, so angular momentum (and with it the areal velocity ½·r²·θ̇) stays constant along the orbit.",

    "mq.q.23":
      "Kepler's third law states that the square of the orbital period is proportional to the square of the semi-major axis.",
    "mq.j.23":
      "False. Kepler's third law relates the period squared to the semi-major axis cubed, T² ∝ a³, not to a².",

    "mq.q.24":
      "In an Atwood machine with a massless, frictionless pulley, the cable tension is the same on both sides.",
    "mq.j.24":
      "True. A massless pulley has zero net moment requirement, so the two tensions must be equal regardless of the angular acceleration.",

    "mq.q.25":
      "If the pulley of an Atwood machine has a nonzero moment of inertia, the tension is generally different on its two sides.",
    "mq.j.25":
      "True. The pulley itself needs a net torque (T₁ − T₂)·r = I·α to spin up, so the two tensions split unevenly, generalizing a = (m₂−m₁)g/(m₁+m₂+I/r²).",

    "mq.q.26":
      "The minimum force needed to drag a crate at constant velocity across a horizontal floor, applied at an angle θ above horizontal, is smallest when tan θ equals the friction coefficient μ.",
    "mq.j.26":
      "True. Minimizing F(θ) = μ·W/(cos θ + μ·sin θ) with respect to θ gives the classic result θ = arctan(μ).",

    "mq.q.27":
      "When a package slides into a spring at the bottom of an incline, all of its kinetic energy converts into spring potential energy alone during the additional compression.",
    "mq.j.27":
      "False. The energy balance during that extra deformation must also include the change in gravitational potential energy and the work done against friction, not kinetic energy alone.",

    "mq.q.28":
      "A rocket's thrust comes from the exhaust's relative velocity and the rate at which mass is ejected, T = ṁ·v_rel.",
    "mq.j.28":
      "True. This steady-flow form of Newton's second law is the same principle behind jet thrust and a hovering helicopter's rotor thrust.",

    "mq.q.29":
      "In the rocket equation with gravity, the vehicle's speed gain depends logarithmically on the ratio of initial to current mass.",
    "mq.j.29":
      "True. v = v₀ + v_rel·ln(m₀/m) − g·t — the mass ratio enters through a natural logarithm, the hallmark of the Tsiolkovsky rocket equation.",

    "mq.q.30":
      "The instant a climbing jet levels off into horizontal flight, drag drops to zero because the flight-path angle becomes zero.",
    "mq.j.30":
      "False. Drag depends on speed through D = k·v², not on the flight-path angle — it's gravity's along-path component that vanishes at that instant, not the drag.",

    "mq.q.31":
      "A helicopter hovering in place generates lift equal to the thrust produced by the momentum change of the air passing through its rotor.",
    "mq.j.31":
      "True. Treating the rotor's downwash as a steady-flow control volume, T = ṁ·(v_out − v_in), with air drawn in at rest and expelled downward at speed v.",

    "mq.q.32":
      "A cam-and-follower mechanism with a sinusoidal profile z = A·sin θ always keeps the roller in contact with the cam, no matter the angular speed.",
    "mq.j.32":
      "False. The needed acceleration grows with θ̇², so once A·θ̇² exceeds g the cam can no longer push the follower down fast enough and the roller lifts off.",

    "mq.q.33":
      "For a mass–spring–damper system under harmonic forcing, the amplitude at resonance (frequency ratio r = 1) is larger for smaller damping ratios ζ.",
    "mq.j.33":
      "True. At r = 1 the magnification factor reduces to X/δst = 1/(2ζ), which grows without bound as ζ → 0.",

    "mq.q.34":
      "In a base-excited system like a vehicle suspension, the displacement transmissibility always decreases as the excitation frequency increases, for any damping ratio.",
    "mq.j.34":
      "False. Transmissibility first rises toward a peak near resonance and only decreases monotonically once the frequency ratio exceeds √2, where genuine vibration isolation begins.",

    "mq.q.35":
      "The critical damping coefficient c_c = 2·√(k·m) marks the boundary between the oscillatory (underdamped) and non-oscillatory (overdamped) free-vibration responses.",
    "mq.j.35":
      "True. Below c_c the system oscillates with decaying amplitude; above c_c it returns to equilibrium without oscillating at all.",

    "mq.q.36":
      "In a hoist that uses a movable pulley with a counterweight, the size of the counterweight has no effect on the power the motor must supply.",
    "mq.j.36":
      "False. The counterweight directly reduces the tension the motor side must pull (T₁ = T₂ − counterweight·g), so a larger counterweight lowers the motor's mechanical power for the same load.",
  },
  es: {
    "mq.title": "Mecánica Técnica — Quiz",
    "mq.instructions":
      "Indique si las siguientes afirmaciones sobre cinemática y dinámica del punto material, y vibraciones, son verdaderas o falsas.",
    "mq.true": "Verdadero",
    "mq.false": "Falso",
    "mq.submit": "Corregir",
    "mq.retry": "Reintentar",
    "mq.score_label": "Puntaje",
    "mq.correct": "Correcto",
    "mq.incorrect": "Incorrecto",

    "mq.q.01":
      "En el movimiento rectilíneo, la aceleración puede escribirse como a = v·(dv/dx).",
    "mq.j.01":
      "Verdadero. Por regla de la cadena, a = dv/dt = (dv/dx)(dx/dt) = v·(dv/dx) — el recurso habitual para convertir problemas a(t) en problemas a(x).",

    "mq.q.02":
      "La velocidad instantánea en cada punto de un intervalo siempre es igual a la velocidad media de ese intervalo, sin importar cómo varíe la rapidez.",
    "mq.j.02":
      "Falso. La velocidad media es el desplazamiento dividido el tiempo transcurrido; solo coincide con la velocidad instantánea en todo punto cuando la velocidad es constante en ese intervalo.",

    "mq.q.03":
      "En el movimiento de un proyectil sin resistencia del aire, la componente horizontal de la velocidad permanece constante durante todo el vuelo.",
    "mq.j.03":
      "Verdadero. Al no haber fuerza horizontal, a_x = 0, por lo que v_x nunca cambia — solo la componente vertical varía por acción de la gravedad.",

    "mq.q.04":
      "Una partícula que se mueve en un círculo a rapidez constante tiene aceleración tangencial nula pero aceleración normal (centrípeta) distinta de cero.",
    "mq.j.04":
      "Verdadero. a_t = v̇ = 0 porque la rapidez es constante, pero a_n = v²/ρ ≠ 0 porque la dirección de la velocidad sigue cambiando.",

    "mq.q.05":
      "En coordenadas polares, las componentes radial y transversal de la velocidad son ṙ y r·θ̇ respectivamente.",
    "mq.j.05":
      "Verdadero. Al derivar el vector posición r = r·û_r se obtiene v = ṙ·û_r + r·θ̇·û_θ — exactamente la descomposición radial/transversal usada para el movimiento circular.",

    "mq.q.06":
      "Si el polo de una descripción polar coincide con el centro del círculo que traza una partícula con velocidad angular constante, entonces ṙ es distinto de cero.",
    "mq.j.06":
      "Falso. Con el polo en el centro, r es constante (rotación pura), por lo que ṙ = 0 y toda la velocidad queda en la componente transversal rθ̇.",

    "mq.q.07":
      "La componente radial de la aceleración en coordenadas polares es a_r = r̈ − r·θ̇².",
    "mq.j.07":
      "Verdadero. Es el resultado estándar de derivar dos veces la posición en forma polar; el término −r·θ̇² es la contribución centrípeta.",

    "mq.q.08":
      "La componente transversal de la aceleración en coordenadas polares es a_θ = r·θ̈ + 2·ṙ·θ̇.",
    "mq.j.08":
      "Verdadero. El término 2·ṙ·θ̇ es justamente el aporte tipo Coriolis que aparece cuando una partícula se mueve radialmente mientras esa misma dirección radial está rotando.",

    "mq.q.09":
      "Un término de aceleración de Coriolis solo aparece cuando hay simultáneamente movimiento relativo a lo largo de una dirección que rota y rotación de esa dirección.",
    "mq.j.09":
      "Verdadero. Si la velocidad relativa de deslizamiento o la velocidad angular del sistema que rota son nulas, el término de Coriolis 2·ω×v_rel se anula — hacen falta ambos ingredientes a la vez.",

    "mq.q.10":
      "La aceleración de Coriolis 2·ω×v_rel siempre está dirigida en sentido opuesto a la velocidad relativa.",
    "mq.j.10":
      "Falso. Un producto vectorial es perpendicular a ambos vectores, así que el término de Coriolis es perpendicular a v_rel (y a ω), nunca simplemente opuesto a ella.",

    "mq.q.11":
      "Las coordenadas normal y tangencial descomponen la aceleración en a_t = v̇ a lo largo de la trayectoria y a_n = v²/ρ perpendicular a ella.",
    "mq.j.11":
      "Verdadero. Es la descomposición intrínseca a la trayectoria: a_t cambia la rapidez, a_n cambia la dirección, y ρ es el radio de curvatura local.",

    "mq.q.12":
      "En una trayectoria curva lisa (sin fricción), la fuerza normal no realiza trabajo sobre la partícula.",
    "mq.j.12":
      "Verdadero. La fuerza normal siempre es perpendicular a la velocidad, así que su potencia N·v = 0 en todo instante — puede redirigir el movimiento pero nunca acelerarlo ni frenarlo.",

    "mq.q.13":
      "En un automóvil que toma una curva peraltada con fricción, a la velocidad máxima segura justo antes de deslizar, la fricción actúa hacia abajo del peralte para ayudar a suministrar la fuerza centrípeta.",
    "mq.j.13":
      "Verdadero. A v_max el auto tiende a deslizar hacia arriba y hacia afuera, por lo que la fricción apunta pendiente abajo, sumándose a la componente horizontal de N para equilibrar la mayor fuerza centrípeta requerida.",

    "mq.q.14":
      "En una curva peraltada, si el coeficiente de fricción μ es al menos cot θ, no existe límite superior para la velocidad segura.",
    "mq.j.14":
      "Verdadero. Una vez que μ ≥ cot θ, la fricción disponible siempre puede equilibrar la fuerza centrípeta requerida, sin importar cuán grande sea la velocidad — el caso de v_max se vuelve no acotado.",

    "mq.q.15":
      "En un aro circular vertical liso, una partícula necesita en el punto más bajo una rapidez de al menos √(5·g·R) para completar la vuelta.",
    "mq.j.15":
      "Verdadero. Es la condición clásica de la vuelta completa: surge de exigir N ≥ 0 en el punto más alto (v_top² ≥ g·R) combinado con la conservación de energía entre abajo y arriba.",

    "mq.q.16":
      "En ese mismo problema del aro vertical, la fuerza normal es mínima en el punto más bajo de la vuelta.",
    "mq.j.16":
      "Falso. N = g·cos θ + R·θ̇² (θ medido desde abajo) es máxima abajo y mínima arriba, donde la gravedad y la menor rapidez actúan juntas en contra de mantener el contacto.",

    "mq.q.17":
      "El principio de trabajo y energía establece que el trabajo realizado por la fuerza resultante sobre una partícula es igual al cambio de su energía cinética.",
    "mq.j.17":
      "Verdadero. ΣF·dr integrado a lo largo de la trayectoria da exactamente ΔT = T₂ − T₁; es la segunda ley de Newton ya integrada una vez.",

    "mq.q.18":
      "El trabajo realizado por la fuerza de un resorte entre dos elongaciones depende solo de esas elongaciones, no del camino recorrido entre ellas.",
    "mq.j.18":
      "Verdadero. La fuerza del resorte es conservativa, así que su trabajo es −ΔV = −(½k·x₂² − ½k·x₁²), función únicamente de los extremos.",

    "mq.q.19":
      "El principio de impulso y cantidad de movimiento establece que el impulso neto aplicado a una partícula es igual al cambio de su cantidad de movimiento lineal.",
    "mq.j.19":
      "Verdadero. ∫ΣF·dt = m·v₂ − m·v₁ es la segunda ley de Newton integrada en el tiempo en lugar de en la distancia.",

    "mq.q.20":
      "En un choque perfectamente plástico (inelástico) entre dos vagones, la energía cinética se conserva aunque la cantidad de movimiento también se conserve.",
    "mq.j.20":
      "Falso. La cantidad de movimiento siempre se conserva en un choque sin impulso externo, pero un choque plástico (e = 0) disipa la máxima energía cinética posible en deformación y calor.",

    "mq.q.21":
      "Un coeficiente de restitución e = 1 corresponde a un choque perfectamente elástico.",
    "mq.j.21":
      "Verdadero. e = 1 significa que la velocidad relativa de separación iguala a la de acercamiento, exactamente la condición para que no haya pérdida de energía cinética en un choque central directo.",

    "mq.q.22":
      "La segunda ley de Kepler — áreas iguales barridas en tiempos iguales — es consecuencia directa de la conservación del momento angular bajo una fuerza central.",
    "mq.j.22":
      "Verdadero. Una fuerza central no produce momento respecto del centro de fuerzas, así que el momento angular (y con él la velocidad areal ½·r²·θ̇) permanece constante a lo largo de la órbita.",

    "mq.q.23":
      "La tercera ley de Kepler establece que el cuadrado del período orbital es proporcional al cuadrado del semieje mayor.",
    "mq.j.23":
      "Falso. La tercera ley de Kepler relaciona el cuadrado del período con el cubo del semieje mayor, T² ∝ a³, no con a².",

    "mq.q.24":
      "En una máquina de Atwood con polea sin masa y sin fricción, la tensión del cable es la misma a ambos lados.",
    "mq.j.24":
      "Verdadero. Una polea sin masa no requiere momento neto para girar, así que las dos tensiones deben ser iguales sin importar la aceleración angular.",

    "mq.q.25":
      "Si la polea de una máquina de Atwood tiene un momento de inercia distinto de cero, la tensión suele ser diferente a cada lado.",
    "mq.j.25":
      "Verdadero. La propia polea necesita un momento neto (T₁ − T₂)·r = I·α para acelerar angularmente, así que las tensiones se reparten de forma desigual, generalizando a = (m₂−m₁)g/(m₁+m₂+I/r²).",

    "mq.q.26":
      "La fuerza mínima necesaria para arrastrar un cajón a velocidad constante sobre un piso horizontal, aplicada a un ángulo θ sobre la horizontal, es mínima cuando tan θ es igual al coeficiente de fricción μ.",
    "mq.j.26":
      "Verdadero. Minimizar F(θ) = μ·W/(cos θ + μ·sin θ) respecto de θ da el resultado clásico θ = arctan(μ).",

    "mq.q.27":
      "Cuando un paquete desliza hacia un resorte al pie de un plano inclinado, toda su energía cinética se convierte únicamente en energía potencial del resorte durante la compresión adicional.",
    "mq.j.27":
      "Falso. El balance de energía durante esa deformación adicional también debe incluir el cambio de energía potencial gravitatoria y el trabajo realizado contra la fricción, no solo la energía cinética.",

    "mq.q.28":
      "El empuje de un cohete proviene de la velocidad relativa de los gases de escape y de la rapidez con que se expulsa masa, T = ṁ·v_rel.",
    "mq.j.28":
      "Verdadero. Esta forma de flujo estacionario de la segunda ley de Newton es el mismo principio detrás del empuje de un motor a reacción y del empuje del rotor de un helicóptero en vuelo estacionario.",

    "mq.q.29":
      "En la ecuación del cohete con gravedad, la ganancia de velocidad del vehículo depende logarítmicamente de la relación entre la masa inicial y la masa actual.",
    "mq.j.29":
      "Verdadero. v = v₀ + v_rel·ln(m₀/m) − g·t — la relación de masas entra a través de un logaritmo natural, el sello distintivo de la ecuación del cohete de Tsiolkovski.",

    "mq.q.30":
      "En el instante en que un avión que asciende se nivela a vuelo horizontal, la resistencia del aire cae a cero porque el ángulo de la trayectoria se vuelve nulo.",
    "mq.j.30":
      "Falso. La resistencia depende de la velocidad mediante D = k·v², no del ángulo de la trayectoria — lo que se anula en ese instante es la componente de la gravedad a lo largo de la trayectoria, no la resistencia.",

    "mq.q.31":
      "Un helicóptero en vuelo estacionario genera una sustentación igual al empuje producido por el cambio de cantidad de movimiento del aire que pasa por su rotor.",
    "mq.j.31":
      "Verdadero. Tratando la corriente descendente del rotor como un volumen de control de flujo estacionario, T = ṁ·(v_sal − v_ent), con aire tomado en reposo y expulsado hacia abajo a velocidad v.",

    "mq.q.32":
      "Un mecanismo de leva y seguidor con perfil sinusoidal z = A·sen θ siempre mantiene el rodillo en contacto con la leva, sin importar la velocidad angular.",
    "mq.j.32":
      "Falso. La aceleración requerida crece con θ̇², así que una vez que A·θ̇² supera a g la leva ya no puede empujar al seguidor hacia abajo lo bastante rápido y el rodillo se despega.",

    "mq.q.33":
      "En un sistema masa–resorte–amortiguador bajo excitación armónica, la amplitud en resonancia (relación de frecuencias r = 1) es mayor cuanto menor es la relación de amortiguamiento ζ.",
    "mq.j.33":
      "Verdadero. En r = 1 el factor de magnificación se reduce a X/δst = 1/(2ζ), que crece sin límite a medida que ζ → 0.",

    "mq.q.34":
      "En un sistema excitado por la base, como la suspensión de un vehículo, la transmisibilidad de desplazamiento siempre disminuye al aumentar la frecuencia de excitación, para cualquier relación de amortiguamiento.",
    "mq.j.34":
      "Falso. La transmisibilidad primero crece hasta un pico cerca de la resonancia y solo disminuye monótonamente una vez que la relación de frecuencias supera √2, donde recién comienza el aislamiento real de la vibración.",

    "mq.q.35":
      "El coeficiente de amortiguamiento crítico c_c = 2·√(k·m) marca el límite entre la respuesta oscilatoria (subamortiguada) y la no oscilatoria (sobreamortiguada) en vibración libre.",
    "mq.j.35":
      "Verdadero. Por debajo de c_c el sistema oscila con amplitud decreciente; por encima de c_c vuelve al equilibrio sin oscilar en absoluto.",

    "mq.q.36":
      "En un aparejo que usa una polea móvil con contrapeso, el tamaño del contrapeso no afecta la potencia que debe entregar el motor.",
    "mq.j.36":
      "Falso. El contrapeso reduce directamente la tensión que debe tirar el lado del motor (T₁ = T₂ − contrapeso·g), así que un contrapeso mayor reduce la potencia mecánica del motor para la misma carga.",
  },
};
