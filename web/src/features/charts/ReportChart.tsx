import { PracticeValue } from "../../api/diary";
import { Report, ReportDataEntry } from "../../api/reports";

type ReportChartProps = {
  report: Report;
  data: ReportDataEntry[];
};

function isGraph(report: Report) {
  return "Graph" in report.definition;
}

function formatValue(value: PracticeValue | null) {
  if (!value) {
    return "";
  }

  if ("Int" in value) {
    return String(value.Int);
  }

  if ("Bool" in value) {
    return value.Bool ? "yes" : "no";
  }

  if ("Time" in value) {
    return `${value.Time.h}:${String(value.Time.m).padStart(2, "0")}`;
  }

  if ("Duration" in value) {
    const hours = Math.floor(value.Duration / 60);
    const minutes = value.Duration % 60;
    return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  return value.Text;
}

function numericValue(value: PracticeValue | null) {
  if (!value) {
    return 0;
  }

  if ("Int" in value) {
    return value.Int;
  }

  if ("Duration" in value) {
    return value.Duration;
  }

  if ("Bool" in value) {
    return value.Bool ? 1 : 0;
  }

  return 0;
}

export function ReportChart({ report, data }: ReportChartProps) {
  if (!isGraph(report)) {
    return (
      <div className="report-chart" aria-label={`${report.name} grid`}>
        <table className="report-grid">
          <thead>
            <tr>
              <th>Date</th>
              <th>Practice</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={`${entry.cob_date}-${entry.practice}`}>
                <td>{entry.cob_date}</td>
                <td>{entry.practice}</td>
                <td>{formatValue(entry.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const max = Math.max(...data.map((entry) => numericValue(entry.value)), 1);

  return (
    <div className="report-chart" aria-label={`${report.name} chart`}>
      <div className="chart-bars" role="img" aria-label={`Graph report ${report.name}`}>
        {data.map((entry) => {
          const value = numericValue(entry.value);
          return (
            <div className="chart-bar-row" key={`${entry.cob_date}-${entry.practice}`}>
              <span className="chart-bar-label">{entry.cob_date.slice(5)}</span>
              <span className="chart-bar-track">
                <span className="chart-bar-fill" style={{ width: `${Math.max((value / max) * 100, 5)}%` }} />
              </span>
              <span className="chart-bar-value">{formatValue(entry.value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
