import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-text-secondary">
      <p className="text-4xl font-serif text-gold">404</p>
      <p>Page not found</p>
      <Link to="/" className="text-teal underline">Go home</Link>
    </div>
  )
}
