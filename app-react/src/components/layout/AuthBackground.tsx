export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10" style={{ background: '#f4f5f7' }}>
      {/* The Krishna painting as a soft, light-washed backdrop. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/bg.webp')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      {/* Even cream scrim so the busy painting reads as a gentle backdrop. */}
      <div className="absolute inset-0" style={{ background: 'rgba(244,245,247,0.72)' }} />
      {/* Fade to the base colour toward the bottom, where content sits. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(244,245,247,0.30) 0%, rgba(244,245,247,0.55) 45%, rgba(244,245,247,0.85) 78%, #f4f5f7 100%)',
        }}
      />
    </div>
  )
}
