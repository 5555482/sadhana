import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ReportChart } from "./ReportChart";
import { Report, ReportDataEntry, ReportDuration } from "../../api/reports";

const durationOptions: Array<{ value: ReportDuration; label: string }> = [
  { value: "Week", label: "Week" },
  { value: "Month", label: "Month" },
  { value: "Quarter", label: "Quarter" },
  { value: "HalfYear", label: "Half year" },
  { value: "Year", label: "Year" },
  { value: "AllData", label: "All data" }
];

const sampleReports: Report[] = [
  {
    id: "weekly-practice",
    name: "Weekly practice",
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
  },
  {
    id: "daily-grid",
    name: "Daily grid",
    definition: {
      Grid: {
        practices: ["japa", "reading"]
      }
    }
  }
];

const sampleReportData: ReportDataEntry[] = [
  { cob_date: "2026-05-02", practice: "Japa", value: { Int: 12 } },
  { cob_date: "2026-05-03", practice: "Japa", value: { Int: 16 } },
  { cob_date: "2026-05-04", practice: "Japa", value: { Int: 10 } },
  { cob_date: "2026-05-05", practice: "Japa", value: { Int: 18 } },
  { cob_date: "2026-05-06", practice: "Japa", value: { Int: 14 } }
];

type ChartsPageProps = {
  initialReports?: Report[];
  initialReportData?: ReportDataEntry[];
};

export function ChartsPage({
  initialReports = sampleReports,
  initialReportData = sampleReportData
}: ChartsPageProps) {
  const [selectedReportId, setSelectedReportId] = useState(initialReports[0]?.id ?? "");
  const [duration, setDuration] = useState<ReportDuration>("Week");

  const selectedReport = useMemo(
    () => initialReports.find((report) => report.id === selectedReportId) ?? initialReports[0],
    [initialReports, selectedReportId]
  );

  return (
    <section className="reports-page" aria-labelledby="reports-heading">
      <header className="reports-header">
        <div>
          <p className="section-kicker">Charts</p>
          <h1 id="reports-heading">Reports</h1>
        </div>
        <div className="reports-actions" aria-label="Report actions">
          <Link className="quiet-link icon-action" to="/charts/new">
            <i className="icon-plus" aria-hidden="true" />
            New report
          </Link>
          <button className="quiet-link icon-action" type="button">
            <i className="icon-download" aria-hidden="true" />
            Download CSV
          </button>
          <button className="quiet-link icon-action" type="button">
            <i className="icon-share" aria-hidden="true" />
            Share reports link
          </button>
        </div>
      </header>

      <div className="report-controls">
        <label>
          <span>Report</span>
          <select
            value={selectedReport?.id ?? ""}
            onChange={(event) => setSelectedReportId(event.target.value)}
          >
            {initialReports.map((report) => (
              <option key={report.id} value={report.id}>
                {report.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Duration</span>
          <select
            value={duration}
            onChange={(event) => setDuration(event.target.value as ReportDuration)}
          >
            {durationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedReport ? (
        <ReportChart report={selectedReport} data={initialReportData} />
      ) : (
        <div className="empty-state">
          <h2>No reports yet</h2>
          <p>Create a report to see trends from your diary entries.</p>
        </div>
      )}
    </section>
  );
}
