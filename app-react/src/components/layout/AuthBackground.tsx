export function AuthBackground() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: 'url(/login-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  )
}
