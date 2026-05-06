import { Link } from "react-router-dom";

export function RegisterRequestPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-kicker">Start</div>
        <h1>Create account</h1>
        <p className="auth-copy">Request a registration link for your email.</p>
        <Link className="primary-action as-link" to="/login">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
