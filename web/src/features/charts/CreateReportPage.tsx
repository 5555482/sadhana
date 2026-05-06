import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

type ReportKind = "Graph" | "Grid";

export function CreateReportPage() {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<ReportKind>("Graph");
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <section className="practice-page" aria-labelledby="new-report-heading">
      <header className="practice-page-header">
        <div>
          <p className="section-kicker">Reports</p>
          <h1 id="new-report-heading">New report</h1>
        </div>
        <Link className="quiet-link" to="/charts">
          Cancel
        </Link>
      </header>

      <form className="practice-form" onSubmit={submit}>
        <label>
          Report name
          <input
            autoComplete="off"
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Weekly practice"
            required
            value={name}
          />
        </label>

        <label>
          Type
          <select value={kind} onChange={(event) => setKind(event.target.value as ReportKind)}>
            <option value="Graph">Graph</option>
            <option value="Grid">Grid</option>
          </select>
        </label>

        <button className="floating-save" type="submit">
          <i className="icon-tick" aria-hidden="true" /> Save report
        </button>

        {saved ? <p className="practice-note">Report draft ready for backend wiring.</p> : null}
      </form>
    </section>
  );
}
