import { Link } from "react-router-dom";

export function PasswordResetRequestPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-kicker">Reset</div>
        <h1>Password reset</h1>
        <p className="auth-copy">Request a secure reset link for your email.</p>
        <Link className="primary-action as-link" to="/login">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
