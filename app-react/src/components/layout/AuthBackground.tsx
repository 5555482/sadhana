export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10" style={{ background: '#0b0b0d' }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "image-set(url('/bg.webp') type('image/webp'), url('/bg.jpg') type('image/jpeg'))",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.28,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(11,11,13,0.55) 0%, rgba(11,11,13,0.88) 100%)' }}
      />
    </div>
  )
}
