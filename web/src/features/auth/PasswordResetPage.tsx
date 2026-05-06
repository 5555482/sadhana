import { Link } from "react-router-dom";

export function PasswordResetPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-kicker">New password</div>
        <h1>Choose password</h1>
        <p className="auth-copy">Set a new password for your account.</p>
        <Link className="primary-action as-link" to="/login">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
