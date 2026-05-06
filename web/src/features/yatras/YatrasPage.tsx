import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { sampleYatraPractices, sampleYatraRows, sampleYatras } from "./sampleData";
import { UserYatraData, Yatra, YatraPractice } from "../../api/yatras";

type YatrasPageProps = {
  initialYatras?: Yatra[];
  practices?: YatraPractice[];
  rows?: UserYatraData[];
};

function formatCell(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export function YatrasPage({
  initialYatras = sampleYatras,
  practices = sampleYatraPractices,
  rows = sampleYatraRows
}: YatrasPageProps) {
  const [selectedId, setSelectedId] = useState(initialYatras[0]?.id ?? "");
  const selectedYatra = useMemo(
    () => initialYatras.find((yatra) => yatra.id === selectedId) ?? initialYatras[0],
    [initialYatras, selectedId]
  );

  if (!selectedYatra) {
    return (
      <section className="yatras-page" aria-labelledby="yatras-heading">
        <header className="yatras-header">
          <div>
            <p className="section-kicker">Shared practice</p>
            <h1 id="yatras-heading">Yatras</h1>
          </div>
          <button className="primary-action" type="button">
            <i className="icon-plus" aria-hidden="true" /> Create yatra
          </button>
        </header>
        <div className="empty-state">
          <h2>No yatras yet</h2>
          <p>Create or join a yatra to see shared practice progress here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="yatras-page" aria-labelledby="yatras-heading">
      <header className="yatras-header">
        <div>
          <p className="section-kicker">Shared practice</p>
          <h1 id="yatras-heading">Yatras</h1>
        </div>
        <div className="yatras-actions">
          <Link className="quiet-link icon-action" to={`/yatra/${selectedYatra.id}/settings`}>
            <i className="icon-adjust" aria-hidden="true" />
            Settings
          </Link>
          <button className="quiet-link icon-action" type="button">
            <i className="icon-plus" aria-hidden="true" />
            Create yatra
          </button>
        </div>
      </header>

      <div className="report-controls">
        <label>
          <span>
            <i className="icon-user-group" aria-hidden="true" /> Yatra
          </span>
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {initialYatras.map((yatra) => (
              <option key={yatra.id} value={yatra.id}>
                {yatra.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="yatra-table-wrap">
        <table className="yatra-table">
          <thead>
            <tr>
              <th>Sadhaka</th>
              {selectedYatra.show_stability_metrics ? <th>7d</th> : null}
              {practices.map((practice) => (
                <th key={practice.id}>{practice.practice}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.user_id}>
                <th scope="row">{row.user_name}</th>
                {selectedYatra.show_stability_metrics ? <td>{row.trend_arrow ?? ""}</td> : null}
                {row.row.map((value, index) => (
                  <td key={`${row.user_id}-${practices[index]?.id ?? index}`}>
                    {formatCell(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedYatra.show_stability_metrics ? (
        <details className="yatra-details" open>
          <summary>Stability heatmap</summary>
          <div className="heatmap-strip" aria-label="Stability heatmap">
            {rows.flatMap((row) =>
              row.stability_heatmap.map((score, index) => (
                <span
                  className="heatmap-cell"
                  data-score={score >= 95 ? "high" : score >= 80 ? "mid" : "low"}
                  key={`${row.user_id}-${index}`}
                >
                  {score}
                </span>
              ))
            )}
          </div>
        </details>
      ) : null}
    </section>
  );
}
