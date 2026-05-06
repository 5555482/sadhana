import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../api/auth";
import { ApiError } from "../../api/errors";
import { useAuth } from "./AuthProvider";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({ email, password });
      signIn(response.user);
      navigate("/");
    } catch (err) {
      if (err instanceof ApiError && err.kind === "not-found") {
        setError("No account was found for that email.");
      } else {
        setError("Sign in failed. Please check your details.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-heading">
        <div className="auth-kicker">Sadhana Pro</div>
        <h1 id="login-heading">Welcome back</h1>
        <p className="auth-copy">Your daily practice is ready.</p>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <form className="auth-form" aria-label="Login form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button className="primary-action" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in" : "Sign in"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/reset">Forgot password?</Link>
          <Link to="/register">Need an account?</Link>
        </div>
      </section>
    </main>
  );
}
