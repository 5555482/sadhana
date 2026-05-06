import { useParams } from "react-router-dom";

import { ReportChart } from "./ReportChart";
import { Report, ReportDataEntry } from "../../api/reports";

const sharedReport: Report = {
  id: "shared-week",
  name: "Shared weekly practice",
  definition: {
    Graph: {
      bar_layout: "Grouped",
      traces: [
        {
          label: "Japa",
          type_: "Bar",
          practice: "japa",
          y_axis: null,
          show_average: true
        }
      ]
    }
  }
};

const sharedData: ReportDataEntry[] = [
  { cob_date: "2026-05-03", practice: "Japa", value: { Int: 16 } },
  { cob_date: "2026-05-04", practice: "Japa", value: { Int: 10 } },
  { cob_date: "2026-05-05", practice: "Japa", value: { Int: 18 } },
  { cob_date: "2026-05-06", practice: "Japa", value: { Int: 14 } }
];

export function SharedChartsPage() {
  const { id } = useParams();

  return (
    <main className="app-main">
      <section className="reports-page" aria-labelledby="shared-reports-heading">
        <header className="reports-header">
          <div>
            <p className="section-kicker">Shared</p>
            <h1 id="shared-reports-heading">Shared reports</h1>
          </div>
          <p className="practice-note">{id ? `Share ${id}` : "Public link"}</p>
        </header>

        <div className="report-controls">
          <label>
            <span>Report</span>
            <select defaultValue={sharedReport.id}>
              <option value={sharedReport.id}>{sharedReport.name}</option>
            </select>
          </label>
          <label>
            <span>Duration</span>
            <select defaultValue="Month">
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
          </label>
        </div>

        <ReportChart report={sharedReport} data={sharedData} />
      </section>
    </main>
  );
}
