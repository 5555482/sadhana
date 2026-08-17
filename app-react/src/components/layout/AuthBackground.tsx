export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10" style={{ background: '#1a1f27' }}>
      {/* The Krishna painting, full-bleed. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/bg.webp')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
        }}
      />
      {/* Dark filter (static-site style: darker top/bottom, lighter middle) —
          moody, but the painting still reads clearly. Tune these alphas to taste. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  )
}
