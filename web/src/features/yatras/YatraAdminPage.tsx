import { Link, useParams } from "react-router-dom";

import { sampleYatraPractices, sampleYatraUsers, sampleYatras } from "./sampleData";

export function YatraAdminPage() {
  const { id } = useParams();
  const yatra = sampleYatras.find((item) => item.id === id) ?? sampleYatras[0];

  return (
    <section className="practice-page" aria-labelledby="yatra-admin-heading">
      <header className="practice-page-header">
        <div>
          <p className="section-kicker">Admin</p>
          <h1 id="yatra-admin-heading">{yatra.name}</h1>
        </div>
        <Link className="quiet-link" to={`/yatra/${yatra.id}/settings`}>
          Done
        </Link>
      </header>

      <form className="practice-form">
        <label>
          Name
          <input defaultValue={yatra.name} />
        </label>
        <label className="switch-row">
          Show stability metrics
          <input defaultChecked={yatra.show_stability_metrics} type="checkbox" />
        </label>
      </form>

      <section className="yatra-admin-section" aria-labelledby="admin-practices-heading">
        <h2 id="admin-practices-heading">Practices</h2>
        <ul className="practice-sort-list">
          {sampleYatraPractices.map((practice, index) => (
            <li className="practice-card" key={practice.id}>
              <div className="practice-card-main">
                <span className="practice-rank">{index + 1}</span>
                <div>
                  <h3>{practice.practice}</h3>
                  <p>{practice.data_type}</p>
                </div>
              </div>
              <div className="practice-card-actions">
                <button type="button" aria-label={`Move ${practice.practice} up`}>
                  <i className="icon-chevron-right rotate-up" aria-hidden="true" />
                </button>
                <button type="button" aria-label={`Move ${practice.practice} down`}>
                  <i className="icon-chevron-right rotate-down" aria-hidden="true" />
                </button>
                <button type="button" aria-label={`Edit ${practice.practice}`}>
                  <i className="icon-edit" aria-hidden="true" />
                </button>
                <button type="button" aria-label={`Delete ${practice.practice}`}>
                  <i className="icon-bin" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="yatra-admin-section" aria-labelledby="admin-members-heading">
        <h2 id="admin-members-heading">Members</h2>
        <ul className="practice-sort-list">
          {sampleYatraUsers.map((user) => (
            <li className="practice-card" key={user.user_id}>
              <div className="practice-card-main">
                <span className="practice-rank">
                  <i className="icon-user-group" aria-hidden="true" />
                </span>
                <div>
                  <h3>{user.user_name}</h3>
                  <p>{user.is_admin ? "Admin" : "Member"}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
