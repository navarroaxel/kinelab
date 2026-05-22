# Kinelab — Simuladores interactivos de física

Un conjunto de pequeños simuladores de física en el navegador construidos con Next.js + Canvas. Cada uno aísla un concepto y lo muestra en tiempo real.

## Simuladores

| Ruta | Título | Concepto |
|---|---|---|
| [`/`](http://localhost:3000/)        | **Coordenadas polares** | Descomposición cartesiana ↔ polar del movimiento circular con un polo libremente desplazable |
| [`/ring`](http://localhost:3000/ring) | **Anillo vertical**     | Partícula dentro de un anillo liso vertical — integración RK4 de `θ̈ = −(g/R)·sin θ`, fuerza normal y umbral de vuelta `v_min = √(5gR)` |

Cambia entre ellos usando las pestañas en la esquina superior derecha de cada página.

### `/` Coordenadas polares

La idea clave que hace visible: mueve el polo (origen del sistema polar) lejos del centro del círculo y observa cómo la velocidad radial ṙ y la velocidad transversal rθ̇ dejan de ser cero — aunque la trayectoria siga siendo un círculo perfecto.

- Canvas animado con velocidad angular ω y aceleración angular α configurables
- Polo movible libremente mediante sliders; los vectores polares se actualizan al instante
- Vectores de velocidad polar `ṙ·eᵣ` (radial) y `rθ̇·eₒ` (transversal)
- Vectores de aceleración polar / tangencial / normal (activables)
- Líneas de proyección cartesianas + etiquetas x / y en vivo
- Gráficos de tira: velocidad polar vs. tiempo, aceleración tangencial vs. tiempo
- Métricas en vivo: r, θ, ṙ, rθ̇, ω, aₜ

### `/ring` Anillo vertical

Una partícula obligada a deslizarse por el interior de un anillo liso de radio R en un campo gravitacional uniforme. La simulación integra `θ̈ = −(g/R)·sin θ` con Runge–Kutta de 4.º orden y expone la dinámica en tiempo real:

- Sliders para R, g y la rapidez inicial en el fondo v₀
- Vectores de fuerza: peso mg, fuerza normal N (a trazos cuando se pierde el contacto), velocidad tangente v
- Barra apilada EC / EP — conservación de la energía visible de un vistazo, con aviso de deriva cuando el error de RK4 supera el 1%
- Métricas en vivo: θ, v, N, h, EC, EP; la tarjeta de N se pone roja al perder el contacto
- Indicador de v_min: el slider muestra `v₀ / v_min` y dónde está el umbral
- Panel de ecuaciones con la ecuación de movimiento, la fuerza normal, la derivación de v_min y la conservación de la energía

## Características compartidas

- **Conmutador EN / ES** — persistido en localStorage, sincronizado entre pestañas
- **Modo oscuro automático** mediante `prefers-color-scheme`
- **Nítido en pantallas retina** — escalado del canvas según DPR + `ResizeObserver`
- **Física pura** — `lib/kinematics.ts` (polar) y `lib/ringKinematics.ts` (anillo) no dependen de React ni del DOM

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
```

## Despliegue

Despliegue sin configuración en Vercel:

```bash
npx vercel
```

No se requieren variables de entorno — ambas páginas son enteramente del lado del cliente.

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

### Simulador del anillo

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
| Runtime   | Node ≥ 20 |
