export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10" style={{ background: '#0b0b0d' }}>
      {/* Giga-style cinematic backdrop: the landscape reads clearly across the
          top of the viewport and fades into solid near-black by mid-screen. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "image-set(url('/bg.webp') type('image/webp'), url('/bg.jpg') type('image/jpeg'))",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: 0.85,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(11,11,13,0.20) 0%, rgba(11,11,13,0.45) 30%, rgba(11,11,13,0.85) 55%, #0b0b0d 78%)',
        }}
      />
    </div>
  )
}
