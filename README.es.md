# Kinelab — Simuladores interactivos de física

Un conjunto de pequeños simuladores de física en el navegador construidos con Next.js + Canvas. Cada uno aísla un concepto y lo muestra en tiempo real.

## Simuladores

| Ruta | Título | Concepto |
|---|---|---|
| [`/`](http://localhost:3000/) | **Inicio** | Página de bienvenida — un índice de tarjetas que enlaza a cada simulador |
| [`/polar`](http://localhost:3000/polar) | **Coordenadas polares** | Descomposición cartesiana ↔ polar del movimiento circular con un polo libremente desplazable |
| [`/quick-return`](http://localhost:3000/quick-return) | **Mecanismo de retorno rápido** | La manivela AB mueve la barra oscilante OQ y el carro herramienta P — el avance y el retorno duran tiempos distintos |
| [`/particle-kinematics`](http://localhost:3000/particle-kinematics) | **Cinemática del Punto Material (TP N°1)** | Diez ejercicios de Mecánica Técnica — UTN FRBA (ver tabla abajo) |
| [`/particle-dynamics`](http://localhost:3000/particle-dynamics) | **Dinámica del Punto Material (TP N°2)** | Catorce ejercicios de Mecánica Técnica — UTN FRBA (ver tabla abajo) |

Cambia entre ellos usando las pestañas en la esquina superior derecha de cada página; en pantallas angostas se colapsa en un botón de menú.

### Sección de Cinemática del Punto Material (`/particle-kinematics`)

Un conjunto navegable de los diez ejercicios del TP N°1, con navegación anterior/siguiente, un desplegable para saltar a cualquier ejercicio, y un índice de sección con una tarjeta por ejercicio.

| Ejercicio | Ruta |
|---|---|
| PK 1 — Ciclista con resistencia del aire | `/particle-kinematics/drag-descent` |
| PK 2 — Distancia de frenado | `/particle-kinematics/stopping-distance` |
| PK 3 — Patinador sobre perfil parabólico | `/particle-kinematics/parabolic-track` |
| PK 4 — Pasador en ranura, caso degenerado (d = r) | `/particle-kinematics/pin-slot?preset=pk4` |
| PK 5 — Constructor de gráficos de movimiento | `/particle-kinematics/motion-graphs` |
| PK 6 — Pasador en ranura circular | `/particle-kinematics/pin-slot` |
| PK 7 — Cable, poleas y bloques | `/particle-kinematics/cable-blocks` |
| PK 8 — Aeronave rastreada por radar | `/particle-kinematics/radar-tracking` |
| PK 9 — Satélite en órbita circular | `/particle-kinematics/circular-orbit` |
| PK 10 — Ascensor y polea | `/particle-kinematics/elevator-cable` |

Los diez ejercicios están implementados — ver `src/lib/simulators.ts` para el registro que genera esta tabla.

### Sección de Dinámica del Punto Material (`/particle-dynamics`)

Un conjunto navegable de los catorce ejercicios del TP N°2, con el mismo patrón de navegación que la sección de cinemática. Los catorce ejercicios tienen simuladores funcionando.

| Ejercicio | Ruta |
|---|---|
| PD 1 — Bala a través de una placa viscosa | `/particle-dynamics/viscous-impact` |
| PD 2 — Paracaidista con resistencia lineal | `/particle-dynamics/parachutist` |
| PD 3 — Partícula en un anillo vertical | `/particle-dynamics/ring` |
| PD 4 — Máquina de Atwood | `/particle-dynamics/atwood` |
| PD 5 — Esfera sobre una pista parabólica | `/particle-dynamics/parabolic-bowl` |
| PD 6 — Factores de empuje en la transferencia orbital | `/particle-dynamics/kepler` |
| PD 7 — Potencia del ascensor y contrapeso | `/particle-dynamics/elevator-counterweight` |
| PD 8 — Paquete detenido por un resorte en una rampa | `/particle-dynamics/spring-stop` |
| PD 9 — Poleas y bloques con fricción | `/particle-dynamics/pulley-friction` |
| PD 10 — Resistencia y potencia de un vehículo | `/particle-dynamics/vehicle-power` |
| PD 11 — Eficiencia del motor de un montacargas | `/particle-dynamics/hoist` |
| PD 12 — Eficiencia del motor de una escalera mecánica | `/particle-dynamics/escalator` |
| PD 13 — Acople de vagones de tren | `/particle-dynamics/rail-car-coupling` |
| PD 14 — Lanzamiento de un cohete por etapas | `/particle-dynamics/staged-rocket` |

Ver `src/lib/simulators.ts` para el registro que genera esta tabla.

### `/polar` Coordenadas polares

La idea clave que hace visible: mueve el polo (origen del sistema polar) lejos del centro del círculo y observa cómo la velocidad radial ṙ y la velocidad transversal rθ̇ dejan de ser cero — aunque la trayectoria siga siendo un círculo perfecto.

- Canvas animado con velocidad angular ω y aceleración angular α configurables
- Polo movible libremente mediante sliders; los vectores polares se actualizan al instante
- Vectores de velocidad polar `ṙ·eᵣ` (radial) y `rθ̇·eₒ` (transversal)
- Vectores de aceleración polar / tangencial / normal (activables)
- Líneas de proyección cartesianas + etiquetas x / y en vivo
- Gráficos de tira: velocidad polar vs. tiempo, aceleración tangencial vs. tiempo
- Métricas en vivo: r, θ, ṙ, rθ̇, ω, aₜ

### `/particle-dynamics/ring` Anillo vertical (PD 3)

Una partícula obligada a deslizarse por el interior de un anillo liso de radio R en un campo gravitacional uniforme. La simulación integra `θ̈ = −(g/R)·sin θ` con Runge–Kutta de 4.º orden y expone la dinámica en tiempo real:

- Sliders para R, g y la rapidez inicial en el fondo v₀
- Vectores de fuerza: peso mg, fuerza normal N (a trazos cuando se pierde el contacto), velocidad tangente v
- Barra apilada EC / EP — conservación de la energía visible de un vistazo, con aviso de deriva cuando el error de RK4 supera el 1%
- Métricas en vivo: θ, v, N, h, EC, EP; la tarjeta de N se pone roja al perder el contacto
- Indicador de v_min: el slider muestra `v₀ / v_min` y dónde está el umbral
- Panel de ecuaciones con la ecuación de movimiento, la fuerza normal, la derivación de v_min y la conservación de la energía

## Características compartidas

- **Conmutador EN / ES** — persistido en localStorage, sincronizado entre pestañas
- **Modo oscuro** — conmutador auto/claro/oscuro; `auto` sigue `prefers-color-scheme`, `claro`/`oscuro` fijan y persisten la elección
- **Nítido en pantallas retina** — escalado del canvas según DPR + `ResizeObserver`
- **Física pura** — la física de cada simulador vive en su propio módulo `lib/<nombre>Kinematics.ts` sin dependencias de React ni del DOM; la mayoría tiene tests unitarios con Vitest (`npm test`)

## Primeros pasos

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build   # verificación de tipos + salida optimizada
npm run start   # sirve la build de producción localmente
npm test        # corre la suite de Vitest sobre los módulos de física pura
```

## Despliegue

Despliegue sin configuración en Vercel:

```bash
npx vercel
```

No se requieren variables de entorno — todas las páginas son enteramente del lado del cliente.

## Resumen físico

### Simulador polar

Un punto P se mueve sobre un círculo de radio R centrado en el origen:

```
x(t) = R·cos(φ(t))
y(t) = R·sin(φ(t))     φ̇ = ω
```

Dado un polo O′ en (x₀, y₀), el vector polar r va desde O′ hasta P:

```
r = √[(x−x₀)² + (y−y₀)²]
θ = atan2(y−y₀, x−x₀)
```

Proyectando la velocidad cartesiana sobre los vectores unitarios polares:

```
ṙ    = R·ω·sin(θ − φ)
rθ̇   = R·ω·cos(φ − θ)
```

Cuando el polo coincide con el centro del círculo: θ = φ, por lo que ṙ = 0 y rθ̇ = R·ω = constante. Mueve el polo fuera del centro y ambas componentes pasan a variar con el tiempo.

### Simulador del anillo (PD 3)

θ se mide desde el fondo del anillo, positivo en sentido antihorario. Con la masa normalizada a 1:

```
θ̈ = −(g/R) · sin θ                  ecuación de movimiento (forma de péndulo)
N  = g · cos θ + R · θ̇²              fuerza normal
h  = R · (1 − cos θ)                  altura sobre el fondo
E  = ½·v² + g·h         = const       conservación de la energía (anillo liso)
v_min = √(5·g·R)                       rapidez mínima en el fondo para una vuelta completa
```

`v_min` se obtiene imponiendo `N ≥ 0` en la parte superior (`v_top ≥ √(g·R)`) y la conservación de la energía a lo largo de `Δh = 2R`.

## Stack tecnológico

| Capa | Elección |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje  | TypeScript 5 (strict) |
| Estilos   | Tailwind CSS v4 |
| Animación | `requestAnimationFrame` nativo |
| Integrador (anillo) | Runge–Kutta de 4.º orden sobre `[θ, θ̇]` |
| Tests     | Vitest (módulos de física pura) |
| Runtime   | Node ≥ 24.15 |

## Licencia

[MIT](LICENSE) © Axel Navarro
