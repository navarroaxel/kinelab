export type Language = 'en' | 'es'

export const LANGUAGES: Language[] = ['en', 'es']

export const translations = {
  en: {
    // GitHubLink
    'github.aria': 'View source on GitHub',

    // LanguageToggle (label is shown in the *current* language, describing what clicking will do)
    'language.switch_aria': 'Switch to Spanish',

    // ControlsPanel — sections
    'controls.section.geometry': 'Geometry',
    'controls.section.dynamics': 'Dynamics',
    'controls.section.visibility': 'Visibility',

    // ControlsPanel — sliders
    'controls.slider.pole_x': 'Pole X',
    'controls.slider.pole_y': 'Pole Y',
    'controls.slider.radius': 'Radius',

    // ControlsPanel — visibility toggles
    'controls.toggle.polar_velocity': 'Polar velocity (ṙ, rθ̇)',
    'controls.toggle.cartesian': 'Cartesian coords (x, y)',
    'controls.toggle.r_vector': 'Vector r',
    'controls.toggle.polar_accel': 'Polar acceleration (aᵣ, aₒ)',
    'controls.toggle.normal_accel': 'Normal acceleration (aₙ)',
    'controls.toggle.trace': 'Path trace',

    // ControlsPanel — buttons
    'controls.btn.pole_center': 'Pole to center',
    'controls.btn.reset_alpha': 'Reset α',
    'controls.btn.pause': 'Pause',
    'controls.btn.resume': 'Resume',

    // PolarMetrics
    'metrics.heading': 'Live Metrics',
    'metrics.r': 'r  (magnitude)',
    'metrics.theta': 'θ  (polar angle)',
    'metrics.r_dot': 'ṙ  (radial vel.)',
    'metrics.r_theta_dot': 'rθ̇  (transverse vel.)',
    'metrics.omega': 'ω  (current)',
    'metrics.at': 'aₜ  (tangential)',

    // VectorLegend
    'legend.heading': 'Legend',
    'legend.r': 'r  (pole → P)',
    'legend.r_dot': 'ṙ · eᵣ  (radial velocity)',
    'legend.r_theta_dot': 'rθ̇ · eₒ  (transverse velocity)',
    'legend.polar_accel': 'Polar acceleration (aᵣ, aₒ)',
    'legend.normal_accel': 'Normal acceleration aₙ',

    // EquationsPanel
    'equations.heading': 'Equations',
    'equations.section.position': 'Position & r vector',
    'equations.section.polar_velocity': 'Polar velocity',
    'equations.note.omega_dot': 'ω̇ = α  (non-uniform when α ≠ 0)',
    'equations.section.polar_accel': 'Polar acceleration',
    'equations.section.tangential': 'Tangential acceleration',
    'equations.section.normal': 'Normal acceleration',
    'equations.footer':
      'Pole at center → ṙ = 0, rθ̇ = R·ω = const. ' +
      'Move the pole off-center → both components become non-zero ' +
      'even though the path remains a perfect circle. ' +
      'Set α ≠ 0 → ω varies in time and the motion is non-uniform.',
  },
  es: {
    // GitHubLink
    'github.aria': 'Ver código en GitHub',

    // LanguageToggle
    'language.switch_aria': 'Cambiar a inglés',

    // ControlsPanel — sections
    'controls.section.geometry': 'Geometría',
    'controls.section.dynamics': 'Dinámica',
    'controls.section.visibility': 'Visibilidad',

    // ControlsPanel — sliders
    'controls.slider.pole_x': 'Polo X',
    'controls.slider.pole_y': 'Polo Y',
    'controls.slider.radius': 'Radio',

    // ControlsPanel — visibility toggles
    'controls.toggle.polar_velocity': 'Velocidad polar (ṙ, rθ̇)',
    'controls.toggle.cartesian': 'Coordenadas cartesianas (x, y)',
    'controls.toggle.r_vector': 'Vector r',
    'controls.toggle.polar_accel': 'Aceleración polar (aᵣ, aₒ)',
    'controls.toggle.normal_accel': 'Aceleración normal (aₙ)',
    'controls.toggle.trace': 'Trayectoria',

    // ControlsPanel — buttons
    'controls.btn.pole_center': 'Polo al centro',
    'controls.btn.reset_alpha': 'Reiniciar α',
    'controls.btn.pause': 'Pausar',
    'controls.btn.resume': 'Reanudar',

    // PolarMetrics
    'metrics.heading': 'Métricas en vivo',
    'metrics.r': 'r  (magnitud)',
    'metrics.theta': 'θ  (ángulo polar)',
    'metrics.r_dot': 'ṙ  (vel. radial)',
    'metrics.r_theta_dot': 'rθ̇  (vel. transversal)',
    'metrics.omega': 'ω  (actual)',
    'metrics.at': 'aₜ  (tangencial)',

    // VectorLegend
    'legend.heading': 'Leyenda',
    'legend.r': 'r  (polo → P)',
    'legend.r_dot': 'ṙ · eᵣ  (velocidad radial)',
    'legend.r_theta_dot': 'rθ̇ · eₒ  (velocidad transversal)',
    'legend.polar_accel': 'Aceleración polar (aᵣ, aₒ)',
    'legend.normal_accel': 'Aceleración normal aₙ',

    // EquationsPanel
    'equations.heading': 'Ecuaciones',
    'equations.section.position': 'Posición y vector r',
    'equations.section.polar_velocity': 'Velocidad polar',
    'equations.note.omega_dot': 'ω̇ = α  (no uniforme cuando α ≠ 0)',
    'equations.section.polar_accel': 'Aceleración polar',
    'equations.section.tangential': 'Aceleración tangencial',
    'equations.section.normal': 'Aceleración normal',
    'equations.footer':
      'Polo en el centro → ṙ = 0, rθ̇ = R·ω = const. ' +
      'Mueve el polo fuera del centro → ambas componentes se vuelven ' +
      'distintas de cero aunque la trayectoria sigue siendo un círculo perfecto. ' +
      'Si α ≠ 0 → ω varía en el tiempo y el movimiento no es uniforme.',
  },
} as const

export type TranslationKey = keyof (typeof translations)['en']

export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en'
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}
