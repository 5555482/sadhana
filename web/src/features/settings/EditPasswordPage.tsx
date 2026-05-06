export function EditPasswordPage() {
  return (
    <section className="settings-page" aria-labelledby="password-heading">
      <header className="practice-page-header">
        <div>
          <p className="section-kicker">Settings</p>
          <h1 id="password-heading">Change password</h1>
        </div>
      </header>

      <form className="practice-form">
        <label>
          Current password
          <input autoComplete="current-password" type="password" />
        </label>
        <label>
          New password
          <input autoComplete="new-password" minLength={8} type="password" />
        </label>
        <button className="floating-save" type="submit">
          <i className="icon-tick" aria-hidden="true" /> Save password
        </button>
      </form>
    </section>
  );
}
