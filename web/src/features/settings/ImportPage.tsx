export function ImportPage() {
  return (
    <section className="settings-page" aria-labelledby="import-heading">
      <header className="practice-page-header">
        <div>
          <p className="section-kicker">Settings</p>
          <h1 id="import-heading">Import CSV</h1>
        </div>
      </header>

      <form className="practice-form">
        <label>
          CSV file
          <input accept=".csv,text/csv" type="file" />
        </label>
        <button className="floating-save" type="submit">
          <i className="icon-import" aria-hidden="true" /> Import
        </button>
      </form>
    </section>
  );
}
