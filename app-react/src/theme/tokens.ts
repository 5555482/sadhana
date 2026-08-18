// Shared dark/amber palette for inline styles (mirrors the DaisyUI dark theme in
// index.css). Prefer DaisyUI classes (bg-base-100, text-primary, …) where a
// className is used; use these constants where a raw inline-style value is
// required.
export const ACCENT = '#2dd4bf'            // primary interactive teal (fills, active)
export const ACCENT_LIGHT = '#5eead4'      // luminous teal for lines / highlights / glow
export const ACCENT_GRADIENT = 'linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)'
export const ACCENT_SHADOW = 'rgba(45,212,191,0.40)'
export const ACCENT_SOFT = 'rgba(94,234,212,0.12)'
export const ACCENT_RING = 'rgba(94,234,212,0.30)'

export const SURFACE_1 = '#0e141b'
export const SURFACE_2 = '#151d27'
export const SURFACE_3 = '#1b2531'
export const SURFACE_GLASS = 'rgba(20,28,38,0.72)'
export const SURFACE_PANEL = 'rgba(20,28,38,0.72)'     // cards / chart panels
export const SURFACE_ELEVATED = 'rgba(26,35,47,0.80)'  // practice rows

export const TEXT = '#eef3f8'
export const TEXT_MUTED = 'rgba(238,243,248,0.58)'
export const TEXT_FAINT = 'rgba(238,243,248,0.42)'
export const BORDER = 'rgba(255,255,255,0.08)'

// Deep Ink + Glow backdrop for the authenticated shell.
export const APP_BACKDROP =
  'radial-gradient(70% 55% at 84% -5%, rgba(45,212,191,0.16), transparent 50%),' +
  'radial-gradient(60% 45% at 8% 108%, rgba(56,189,248,0.09), transparent 55%),' +
  'linear-gradient(160deg, #0b0f14 0%, #070a0e 100%)'

// Deep Ink scrim + teal glow laid over the bg3 (green hills) photo on the
// authenticated shell — hills stay faintly visible while text stays legible.
export const APP_SCRIM =
  'radial-gradient(70% 55% at 84% -5%, rgba(45,212,191,0.18), transparent 50%),' +
  'radial-gradient(60% 45% at 8% 108%, rgba(56,189,248,0.10), transparent 55%),' +
  'linear-gradient(160deg, rgba(7,10,14,0.55) 0%, rgba(7,10,14,0.80) 100%)'
