export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10" style={{ background: '#1e2b45' }}>
      {/* Giga-style cinematic backdrop: the misty lake-temple photo reads
          clearly across the top of the viewport and fades into the solid navy
          base by mid-screen. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          opacity: 1,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(30,43,69,0.12) 0%, rgba(30,43,69,0.27) 40%, rgba(30,43,69,0.55) 72%, #1e2b45 96%)',
        }}
      />
    </div>
  )
}
