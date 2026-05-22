# Kinelab — Simulador de coordenadas polares

Un simulador interactivo en el navegador que muestra, en tiempo real, la relación entre las coordenadas cartesianas y polares de un punto que describe un movimiento circular uniforme.

La idea clave que hace visible: mueve el polo (origen del sistema polar) lejos del centro del círculo y observa cómo la velocidad radial ṙ y la velocidad transversal rθ̇ dejan de ser cero — aunque la trayectoria siga siendo un círculo perfecto.

## Características

- **Canvas animado** — el punto se mueve a una velocidad angular configurable
- **Polo movible libremente** — arrastra mediante sliders; los vectores polares se actualizan al instante
- **Vectores de velocidad polar** — ṙ·eᵣ (radial) y rθ̇·eₒ (transversal) dibujados desde el punto
- **Vectores de aceleración polar** — aᵣ y aₒ (activable)
- **Visualización de coordenadas cartesianas** — líneas de proyección punteadas y etiquetas x/y en vivo
- **Vector r + arco θ** — vector polo-a-punto con indicador de ángulo
- **Trayectoria** — estela del punto que se desvanece a través del sistema polar
- **Panel de métricas en vivo** — r, θ, ṙ, rθ̇ actualizando a ~15 fps
- **Panel de ecuaciones** — colapsable, muestra solo las fórmulas relevantes para las capas activas
- **Modo oscuro** — automático mediante `prefers-color-scheme`
- **Nítido en pantallas retina** — escalado del canvas según DPR + ResizeObserver

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

No se requieren variables de entorno — la aplicación es enteramente del lado del cliente.

## Física

Un punto P se mueve sobre un círculo de radio R centrado en el origen:

```
x(t) = R·cos(φ(t))
y(t) = R·sin(φ(t))     φ̇ = ω (constante)
```

Dado un polo O′ en (x₀, y₀), el vector polar r va desde O′ hasta P:

```
r = √[(x−x₀)² + (y−y₀)²]
θ = atan2(y−y₀, x−x₀)
```

Proyectando la velocidad cartesiana sobre los vectores unitarios polares eᵣ y eₒ:

```
ṙ    = R·ω·sin(θ − φ)
rθ̇   = R·ω·cos(φ − θ)
```

Cuando el polo coincide con el centro del círculo: θ = φ, por lo que ṙ = 0 y rθ̇ = R·ω = constante. Mueve el polo fuera del centro y ambas componentes pasan a variar con el tiempo, ilustrando que "velocidad constante sobre un círculo" no significa "componentes de velocidad polar constantes".

## Stack tecnológico

| Capa | Elección |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 (strict) |
| Estilos | Tailwind CSS v4 |
| Animación | `requestAnimationFrame` nativo |
| Estado | `useState` + reducer estilo `useReducer` |
| Runtime | Node ≥ 20 |
