// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserRequest {
  name: string;
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

// Practice Types
export enum PracticeDataType {
  Int = "int",
  Bool = "bool",
  Time = "time",
  Text = "text",
  Duration = "duration",
}

export interface PracticeValue {
  Int: number;
  Bool: boolean;
  Time: { h: number; m: number };
  Text: string;
  Duration: number;
}

export interface UserPractice {
  id: string;
  user_id: string;
  practice: string;
  data_type: PracticeDataType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  order_key: number;
  is_required?: boolean;
  formula?: string;
  dropdown_variants?: string;
}

export interface CreatePracticeRequest {
  practice: string;
  data_type: PracticeDataType;
  is_required?: boolean;
  formula?: string;
  dropdown_variants?: string;
}

export interface UpdatePracticeRequest {
  practice?: string;
  data_type?: PracticeDataType;
  is_active?: boolean;
  is_required?: boolean;
  formula?: string;
  dropdown_variants?: string;
}

// Diary/Practice Entry Types
export interface DiaryEntry {
  cob_date: string; // YYYY-MM-DD format
  user_id: string;
  practice_id: string;
  value?: PracticeValue;
  created_at: string;
  updated_at: string;
}

export interface CreateDiaryEntryRequest {
  cob_date: string;
  practice_id: string;
  value?: PracticeValue;
}

// Report Types
export enum ReportType {
  Graph = "graph",
  Grid = "grid",
}

export enum TraceType {
  Bar = "bar",
  Line = "line",
  Dot = "dot",
}

export enum LineStyle {
  Regular = "regular",
  Square = "square",
}

export enum BarLayout {
  Grouped = "grouped",
  Overlaid = "overlaid",
  Stacked = "stacked",
}

export interface Report {
  id: string;
  user_id: string;
  report_type: ReportType;
  name: string;
  bar_layout?: BarLayout;
  created_at: string;
  updated_at: string;
}

export interface ReportTrace {
  id: string;
  report_id: string;
  practice_id: string;
  trace_type?: TraceType;
  label?: string;
  y_axis?: string;
  show_average?: boolean;
  line_style?: LineStyle;
}

export interface CreateReportRequest {
  report_type: ReportType;
  name: string;
  bar_layout?: BarLayout;
}

export interface CreateReportTraceRequest {
  practice_id: string;
  trace_type?: TraceType;
  label?: string;
  y_axis?: string;
  show_average?: boolean;
  line_style?: LineStyle;
}

// Yatra (Group Practice) Types
export interface Yatra {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  statistics?: any; // JSON
  show_stability_metrics: boolean;
}

export interface YatraPractice {
  id: string;
  yatra_id: string;
  practice: string;
  data_type: PracticeDataType;
  order_key: number;
  colour_zones?: any; // JSON
  daily_score?: any; // JSON
}

export interface YatraUser {
  yatra_id: string;
  user_id: string;
  is_admin: boolean;
}

export interface CreateYatraRequest {
  name: string;
  show_stability_metrics?: boolean;
}

export interface JoinYatraRequest {
  yatra_id: string;
}

// Confirmation Types
export interface Confirmation {
  id: string;
  email: string;
  expires_at: string;
}

// Default Practices Types
export interface DefaultUserPractice {
  practice: string;
  data_type: PracticeDataType;
  order_key?: number;
  lang: string;
}

// API Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "select" | "textarea" | "checkbox";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

// Navigation Types
export interface NavItem {
  path: string;
  label: string;
  icon?: React.ComponentType<any>;
  badge?: number;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
}
