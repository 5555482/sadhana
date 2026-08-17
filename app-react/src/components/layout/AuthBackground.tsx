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
      {/* Light cream scrim — kept subtle (~28%) so the painting stays clearly visible. */}
      <div className="absolute inset-0" style={{ background: 'rgba(244,245,247,0.28)' }} />
      {/* Fade to the base colour toward the bottom, where content sits. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(244,245,247,0) 0%, rgba(244,245,247,0.12) 50%, rgba(244,245,247,0.60) 84%, #f4f5f7 100%)',
        }}
      />
    </div>
  )
}
