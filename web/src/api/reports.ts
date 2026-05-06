import { PracticeValue } from "./diary";
import { apiFetch } from "./client";

export type ReportDuration = "Week" | "Month" | "Quarter" | "HalfYear" | "Year" | "AllData";

export type BarGraphLayout = "Grouped" | "Overlaid" | "Stacked";
export type LineStyle = "Regular" | "Square";
export type YAxis = "Y" | "Y2" | "Y3" | "Y4" | "Y5" | "Y6" | "Y7" | "Y8";
export type TraceType = "Bar" | "Dot" | { Line: { style: LineStyle } };

export type PracticeTrace = {
  label: string | null;
  type_: TraceType;
  practice: string;
  y_axis: YAxis | null;
  show_average: boolean;
};

export type GraphReport = {
  bar_layout: BarGraphLayout;
  traces: PracticeTrace[];
};

export type GridReport = {
  practices: string[];
};

export type ReportDefinition = { Graph: GraphReport } | { Grid: GridReport };

export type Report = {
  id: string;
  name: string;
  definition: ReportDefinition;
};

export type NewReport = {
  name: string;
  definition: ReportDefinition;
};

export type ReportsResponse = {
  reports: Report[];
};

export type CreateReportResponse = {
  report_id: string;
};

export type ReportDataEntry = {
  cob_date: string;
  practice: string;
  value: PracticeValue | null;
};

export type ReportDataResponse = {
  values: ReportDataEntry[];
};

export function getReports() {
  return apiFetch<ReportsResponse>("/reports");
}

export function createReport(report: NewReport) {
  return apiFetch<CreateReportResponse>("/reports", {
    method: "POST",
    body: JSON.stringify({ report })
  });
}

export function updateReport(reportId: string, report: NewReport) {
  return apiFetch<void>(`/report/${reportId}`, {
    method: "PUT",
    body: JSON.stringify({ report })
  });
}

export function deleteReport(reportId: string) {
  return apiFetch<void>(`/report/${reportId}`, {
    method: "DELETE"
  });
}

export function getReportData(cob: string, duration: ReportDuration) {
  return apiFetch<ReportDataResponse>(`/diary/${cob}/report?duration=${duration}`);
}

export function getSharedReports(userId: string) {
  return apiFetch<ReportsResponse>(`/share/${userId}/reports`);
}

export function getSharedReportData(userId: string, endDate: string, duration: ReportDuration) {
  return apiFetch<ReportDataResponse>(`/share/${userId}?end_date=${endDate}&duration=${duration}`);
}
