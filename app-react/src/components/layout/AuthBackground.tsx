export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10" style={{ background: '#141c28' }}>
      {/* Giga-style cinematic backdrop: the misty lake-temple photo reads
          clearly across the top of the viewport and fades into the solid navy
          base by mid-screen. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%',
          opacity: 0.9,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,28,40,0.20) 0%, rgba(20,28,40,0.45) 30%, rgba(20,28,40,0.85) 55%, #141c28 78%)',
        }}
      />
    </div>
  )
}
