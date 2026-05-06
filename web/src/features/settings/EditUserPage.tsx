export function EditUserPage() {
  return (
    <section className="settings-page" aria-labelledby="user-details-heading">
      <header className="practice-page-header">
        <div>
          <p className="section-kicker">Settings</p>
          <h1 id="user-details-heading">User details</h1>
        </div>
      </header>

      <form className="practice-form">
        <label>
          Email address
          <input disabled type="email" value="user@example.com" />
        </label>
        <label>
          Name
          <input defaultValue="Sadhaka" minLength={3} />
        </label>
        <button className="floating-save" type="submit">
          <i className="icon-tick" aria-hidden="true" /> Save
        </button>
      </form>
    </section>
  );
}
