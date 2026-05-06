import { Link } from "react-router-dom";

export function RegisterPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-kicker">Invite accepted</div>
        <h1>Finish registration</h1>
        <p className="auth-copy">Set your name and password to continue.</p>
        <Link className="primary-action as-link" to="/login">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
