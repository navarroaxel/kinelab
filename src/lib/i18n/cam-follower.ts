export const camFollower = {
  en: {
    "cf.title": "Cam and Roller Follower (3D)",
    "cf.page.canvas_aria":
      "Cam and follower simulator — a rod riding on a rotating contoured cam, drawn in an orbitable 3D view",

    "cf.controls.section.cam": "Cam",
    "cf.controls.section.rod": "Rod AB",
    "cf.controls.section.jump": "Jump to",
    "cf.controls.section.visibility": "Visibility",
    "cf.controls.slider.theta_dot": "θ̇ — cam angular velocity",
    "cf.controls.slider.amplitude": "A — profile amplitude",
    "cf.controls.slider.radius": "r — contact radius",
    "cf.controls.slider.mass": "m — mass of the rod",
    "cf.controls.btn.max": "Max force",
    "cf.controls.btn.min": "Min force",
    "cf.controls.toggle.forces": "Force arrows",
    "cf.controls.toggle.slope": "Surface tangent and true normal",
    "cf.controls.toggle.profile": "Cam profile edge",
    "cf.controls.toggle.frame": "Bearing C and end B",
    "cf.controls.toggle.axes": "Axis of rotation and θ̇ arc",
    "cf.controls.btn.reset_camera": "Reset camera",
    "cf.controls.btn.reset": "Reset",
    "cf.controls.btn.pause": "Pause",
    "cf.controls.btn.resume": "Resume",
    "cf.controls.hint.drag": "Drag the canvas to orbit the camera.",

    "cf.canvas.point_a": "A",
    "cf.canvas.point_b": "B",
    "cf.canvas.bearing": "C",
    "cf.canvas.normal": "N_z",
    "cf.canvas.normal_true": "N",
    "cf.canvas.weight": "W",
    "cf.canvas.theta_dot": "θ̇",
    "cf.canvas.contact_lost": "Contact lost — the cam cannot pull",

    "cf.metrics.heading": "Live Metrics",
    "cf.metrics.theta": "θ  (cam angle)",
    "cf.metrics.z": "z  (follower height)",
    "cf.metrics.z_dot": "ż",
    "cf.metrics.z_ddot": "z̈",
    "cf.metrics.normal": "N_z  (cam force, vertical)",
    "cf.metrics.slope": "φ  (surface slope)",
    "cf.metrics.answer_heading": "Answer",
    "cf.metrics.max": "N_z maximum",
    "cf.metrics.min": "N_z minimum",
    "cf.metrics.contact_lost":
      "A·θ̇² now exceeds g, so the required force turns negative — the roller leaves the cam and this model no longer describes the motion.",

    "cf.legend.heading": "Legend",
    "cf.legend.normal": "N_z — cam force on the roller, vertical component",
    "cf.legend.normal_true": "N — the same force, normal to the cam surface",
    "cf.legend.weight": "W = m·g — weight of the rod",
    "cf.legend.tangent": "Local tangent to the cam surface",
    "cf.legend.profile": "Cam profile z = A·sin θ",
    "cf.legend.rod": "Rod AB and its roller at A",

    "cf.equations.heading": "Equations",
    "cf.equations.section.statement": "Statement",
    "cf.equations.statement.text":
      "Hibbeler, Engineering Mechanics: Dynamics — problem 13-91. The 2 kg rod AB rises and falls as its end slides on the smooth contoured surface of the cam, where r = 0.1 m and z = (0.02 sin θ) m. If the cam rotates at a constant angular velocity of 5 rad/s, determine the maximum and minimum force the cam exerts on the roller at A. Neglect friction at the bearing C and the mass of the roller.",
    "cf.equations.section.theory": "Theory",
    "cf.equations.theory.kinematics":
      "The bearing C keeps the rod vertical, so the whole problem is one coordinate: the height z of the contact point. The cam hands you z as a function of its own angle, not of time, so the chain rule does the work — ż = (dz/dθ)·θ̇ and z̈ = (d²z/dθ²)·θ̇² + (dz/dθ)·θ̈. Here θ̇ is constant, so the last term vanishes and z̈ = −A·θ̇²·sin θ.",
    "cf.equations.theory.newton":
      "With the kinematics known, Newton's second law along the vertical is read backwards: instead of solving for the motion, the motion is given and the force is the unknown. N_z − m·g = m·z̈, so N_z = m·(g + z̈). The force is largest at the trough of the profile, where the rod is being accelerated upward, and smallest at the crest, where gravity is doing part of the job of pushing it back down.",
    "cf.equations.theory.slope":
      "Strictly, a smooth surface pushes along its own normal, not straight up. The profile's local slope is tan φ = dz/(r·dθ) = (A/r)·cos θ, so the true contact force is N = N_z / cos φ and the leftover horizontal component is what the bearing C carries. With the statement's numbers this only matters between the extremes: at sin θ = ±1 the surface is flat, φ = 0, and the two agree exactly — which is why the textbook answer quotes the vertical component. Raise the amplitude and the two curves separate, and the true maximum drifts away from the trough.",
    "cf.equations.theory.liftoff":
      "The cam can only push. If A·θ̇² ever exceeds g, N_z would have to go negative to hold the rod down, which a smooth contact cannot do — the roller leaves the surface and the rod goes ballistic. Spin the cam fast enough here and the simulator says so.",
    "cf.equations.section.formulas": "Formulas",
    "cf.equations.section.reference": "Reference (default values)",
    "cf.equations.note.reference":
      "z̈ = −0.02 × 5² × sin θ = −0.5 sin θ  m/s².\n" +
      "N_z = 2 × (9.81 − 0.5 sin θ) = 19.62 − sin θ  N.\n" +
      "N_z,max = 19.62 + 1 = 20.62 N ≈ 20.6 N  at θ = 270°.\n" +
      "N_z,min = 19.62 − 1 = 18.62 N ≈ 18.6 N  at θ = 90°.",
    "cf.equations.section.plot": "Cam force over one revolution",
    "cf.equations.plot.note":
      "N_z is the vertical component the textbook asks for; N is the force normal to the surface. They touch at the extremes, where the profile is flat. The vertical dashed line is the cam's current angle.",
    "cf.plot.force.title":
      "N_z(θ) and N(θ) — cam force on the roller over one revolution",
  },
  es: {
    "cf.title": "Leva y Seguidor de Rodillo (3D)",
    "cf.page.canvas_aria":
      "Simulador de leva y seguidor — una barra que se apoya sobre una leva contorneada giratoria, dibujada en una vista 3D orbitable",

    "cf.controls.section.cam": "Leva",
    "cf.controls.section.rod": "Barra AB",
    "cf.controls.section.jump": "Ir a",
    "cf.controls.section.visibility": "Visibilidad",
    "cf.controls.slider.theta_dot": "θ̇ — velocidad angular de la leva",
    "cf.controls.slider.amplitude": "A — amplitud del perfil",
    "cf.controls.slider.radius": "r — radio de contacto",
    "cf.controls.slider.mass": "m — masa de la barra",
    "cf.controls.btn.max": "Fuerza máxima",
    "cf.controls.btn.min": "Fuerza mínima",
    "cf.controls.toggle.forces": "Flechas de fuerza",
    "cf.controls.toggle.slope": "Tangente a la superficie y normal real",
    "cf.controls.toggle.profile": "Borde del perfil de la leva",
    "cf.controls.toggle.frame": "Cojinete C y extremo B",
    "cf.controls.toggle.axes": "Eje de rotación y arco de θ̇",
    "cf.controls.btn.reset_camera": "Reiniciar cámara",
    "cf.controls.btn.reset": "Reiniciar",
    "cf.controls.btn.pause": "Pausar",
    "cf.controls.btn.resume": "Reanudar",
    "cf.controls.hint.drag": "Arrastrá el lienzo para orbitar la cámara.",

    "cf.canvas.point_a": "A",
    "cf.canvas.point_b": "B",
    "cf.canvas.bearing": "C",
    "cf.canvas.normal": "N_z",
    "cf.canvas.normal_true": "N",
    "cf.canvas.weight": "P",
    "cf.canvas.theta_dot": "θ̇",
    "cf.canvas.contact_lost": "Se pierde el contacto — la leva no puede tirar",

    "cf.metrics.heading": "Métricas en vivo",
    "cf.metrics.theta": "θ  (ángulo de la leva)",
    "cf.metrics.z": "z  (altura del seguidor)",
    "cf.metrics.z_dot": "ż",
    "cf.metrics.z_ddot": "z̈",
    "cf.metrics.normal": "N_z  (fuerza de la leva, vertical)",
    "cf.metrics.slope": "φ  (pendiente de la superficie)",
    "cf.metrics.answer_heading": "Respuesta",
    "cf.metrics.max": "N_z máxima",
    "cf.metrics.min": "N_z mínima",
    "cf.metrics.contact_lost":
      "A·θ̇² ahora supera a g, así que la fuerza necesaria se vuelve negativa — el rodillo se despega de la leva y este modelo deja de describir el movimiento.",

    "cf.legend.heading": "Leyenda",
    "cf.legend.normal":
      "N_z — fuerza de la leva sobre el rodillo, componente vertical",
    "cf.legend.normal_true":
      "N — la misma fuerza, normal a la superficie de la leva",
    "cf.legend.weight": "P = m·g — peso de la barra",
    "cf.legend.tangent": "Tangente local a la superficie de la leva",
    "cf.legend.profile": "Perfil de la leva z = A·sen θ",
    "cf.legend.rod": "Barra AB y su rodillo en A",

    "cf.equations.heading": "Ecuaciones",
    "cf.equations.section.statement": "Enunciado",
    "cf.equations.statement.text":
      "Hibbeler, Ingeniería Mecánica: Dinámica — problema 13-91. La barra AB de 2 kg sube y baja a medida que su extremo se desliza sobre la superficie contorneada lisa de la leva, donde r = 0,1 m y z = (0,02 sen θ) m. Si la leva gira a una velocidad angular constante de 5 rad/s, determine la fuerza máxima y mínima que la leva ejerce en el rodillo en A. Ignore la fricción en el cojinete C y la masa del rodillo.",
    "cf.equations.section.theory": "Teoría",
    "cf.equations.theory.kinematics":
      "El cojinete C mantiene vertical a la barra, así que todo el problema es una sola coordenada: la altura z del punto de contacto. La leva da z en función de su propio ángulo, no del tiempo, así que el trabajo lo hace la regla de la cadena — ż = (dz/dθ)·θ̇ y z̈ = (d²z/dθ²)·θ̇² + (dz/dθ)·θ̈. Acá θ̇ es constante, el último término se anula y queda z̈ = −A·θ̇²·sen θ.",
    "cf.equations.theory.newton":
      "Con la cinemática ya conocida, la segunda ley de Newton en la vertical se lee al revés: en vez de resolver el movimiento, el movimiento es dato y la incógnita es la fuerza. N_z − m·g = m·z̈, de donde N_z = m·(g + z̈). La fuerza es máxima en el valle del perfil, donde la barra está siendo acelerada hacia arriba, y mínima en la cresta, donde la gravedad hace parte del trabajo de empujarla de vuelta hacia abajo.",
    "cf.equations.theory.slope":
      "En rigor, una superficie lisa empuja según su propia normal, no verticalmente. La pendiente local del perfil es tan φ = dz/(r·dθ) = (A/r)·cos θ, así que la fuerza de contacto real es N = N_z / cos φ y la componente horizontal sobrante se la lleva el cojinete C. Con los números del enunciado esto solo importa entre los extremos: en sen θ = ±1 la superficie es plana, φ = 0, y ambas coinciden exactamente — por eso la respuesta del libro es la componente vertical. Al subir la amplitud las dos curvas se separan, y el máximo real se corre del valle.",
    "cf.equations.theory.liftoff":
      "La leva solo puede empujar. Si A·θ̇² llega a superar a g, N_z tendría que hacerse negativa para retener la barra, cosa que un contacto liso no puede hacer — el rodillo se despega y la barra queda en vuelo libre. Hacé girar la leva lo bastante rápido acá y el simulador lo avisa.",
    "cf.equations.section.formulas": "Fórmulas",
    "cf.equations.section.reference": "Referencia (valores por defecto)",
    "cf.equations.note.reference":
      "z̈ = −0,02 × 5² × sen θ = −0,5 sen θ  m/s².\n" +
      "N_z = 2 × (9,81 − 0,5 sen θ) = 19,62 − sen θ  N.\n" +
      "N_z,máx = 19,62 + 1 = 20,62 N ≈ 20,6 N  en θ = 270°.\n" +
      "N_z,mín = 19,62 − 1 = 18,62 N ≈ 18,6 N  en θ = 90°.",
    "cf.equations.section.plot": "Fuerza de la leva en una vuelta",
    "cf.equations.plot.note":
      "N_z es la componente vertical que pide el enunciado; N es la fuerza normal a la superficie. Se tocan en los extremos, donde el perfil es plano. La línea vertical de trazos marca el ángulo actual de la leva.",
    "cf.plot.force.title":
      "N_z(θ) y N(θ) — fuerza de la leva sobre el rodillo en una vuelta",
  },
};
