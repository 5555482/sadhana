import { Link, useParams } from "react-router-dom";

import { sampleYatraPractices, sampleYatras } from "./sampleData";

export function YatraSettingsPage() {
  const { id } = useParams();
  const yatra = sampleYatras.find((item) => item.id === id) ?? sampleYatras[0];

  return (
    <section className="practice-page" aria-labelledby="yatra-settings-heading">
      <header className="practice-page-header">
        <div>
          <p className="section-kicker">Yatra settings</p>
          <h1 id="yatra-settings-heading">{yatra.name}</h1>
        </div>
        <Link className="quiet-link" to={`/yatra/${yatra.id}/admin/settings`}>
          Admin
        </Link>
      </header>

      <div className="practice-form">
        <p className="practice-note">Map each yatra practice to one of your own practices.</p>
        {sampleYatraPractices.map((practice) => (
          <label key={practice.id}>
            <span>
              <i className="icon-graph" aria-hidden="true" /> {practice.practice}
            </span>
            <select defaultValue="">
              <option value="">Not mapped</option>
              <option value={practice.practice}>{practice.practice}</option>
            </select>
          </label>
        ))}
        <button className="quiet-link icon-action" type="button">
          <i className="icon-chevron-right" aria-hidden="true" />
          Leave yatra
        </button>
      </div>
    </section>
  );
}
