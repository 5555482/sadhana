export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10" style={{ background: '#1e2b45' }}>
      {/* Cinematic backdrop: the photo fills the full width (cover) and fades
          into the solid navy base lower down. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
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
