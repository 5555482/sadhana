export function AuthBackground() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: "image-set(url('/bg.webp') type('image/webp'), url('/bg.jpg') type('image/jpeg'))",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  )
}
