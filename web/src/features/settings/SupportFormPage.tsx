export function SupportFormPage() {
  return (
    <section className="settings-page" aria-labelledby="support-heading">
      <header className="practice-page-header">
        <div>
          <p className="section-kicker">Support</p>
          <h1 id="support-heading">Send us a message</h1>
        </div>
      </header>

      <form className="practice-form">
        <label>
          Subject
          <input maxLength={128} required />
        </label>
        <label>
          Message
          <textarea maxLength={4000} required rows={8} />
        </label>
        <button className="floating-save" type="submit">
          <i className="icon-send" aria-hidden="true" /> Send
        </button>
      </form>
    </section>
  );
}
