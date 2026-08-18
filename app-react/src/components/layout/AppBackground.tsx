import { APP_BACKDROP } from '../../theme/tokens'

/** Fixed full-bleed Deep Ink + Glow backdrop for the authenticated shell. */
export function AppBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: APP_BACKDROP }}
    />
  )
}
