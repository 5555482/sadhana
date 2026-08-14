import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

interface CurtainRevealProps {
  /** Pinned one-screen base panel; recedes (scales + dims) as the curtain rises. */
  base: ReactNode
  /** Panel that rises up and covers the base like a curtain. */
  overlay: ReactNode
  /** Optional fixed-position controls (e.g. FABs) that fade out as the curtain covers the base. */
  fab?: ReactNode
  className?: string
}

export function CurtainReveal({ base, overlay, fab, className }: CurtainRevealProps) {
  const reduce = useReducedMotion()
  const overlayRef = useRef<HTMLDivElement>(null)

  // Progress 0 → 1 as the overlay rises across exactly one viewport:
  //   0 = overlay top at viewport bottom (curtain about to rise)
  //   1 = overlay top at viewport top   (base fully covered)
  const { scrollYProgress } = useScroll({
    target: overlayRef,
    offset: ['start end', 'start start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const filter = useTransform(scrollYProgress, [0, 1], ['brightness(1)', 'brightness(0.55)'])
  const fabOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0])

  return (
    <div className={'relative' + (className ? ' ' + className : '')}>
      {/* Base — pinned one-screen panel */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className="h-full"
          style={reduce ? undefined : { scale, filter, transformOrigin: 'center 40%' }}
        >
          <div className="h-full overflow-y-auto overscroll-contain">{base}</div>
        </motion.div>
      </div>

      {/* Overlay — the rising curtain, with its own opaque surface so it truly covers the base */}
      <div ref={overlayRef} className="relative z-10">
        <div
          className="rounded-t-3xl px-4 pb-14 pt-8 lg:pt-16 lg:px-6"
          style={{
            background: 'rgba(20,28,45,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 -24px 60px rgba(0,0,0,0.45)',
          }}
        >
          <div className="max-w-lg lg:max-w-[1400px] mx-auto w-full">{overlay}</div>
        </div>
      </div>

      {/* FABs — fade out as the curtain covers the base (they act on the now-hidden dashboard) */}
      {fab && (
        <motion.div style={reduce ? undefined : { opacity: fabOpacity }}>{fab}</motion.div>
      )}
    </div>
  )
}
