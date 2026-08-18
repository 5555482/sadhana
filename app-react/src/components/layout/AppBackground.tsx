import { APP_SCRIM } from '../../theme/tokens'

/** Fixed full-bleed backdrop for the authenticated shell: the bg3 (green
 *  hills) photo under a Deep Ink scrim + teal glow — the hills read faintly
 *  while panels and text stay legible. */
export function AppBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/bg3.jpg')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0" style={{ background: APP_SCRIM }} />
    </div>
  )
}
