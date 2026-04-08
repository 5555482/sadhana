import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  ApiResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  UpdatePasswordRequest,
  ResetPasswordRequest,
  UserPractice,
  CreatePracticeRequest,
  UpdatePracticeRequest,
  DiaryEntry,
  CreateDiaryEntryRequest,
  Report,
  CreateReportRequest,
  ReportTrace,
  CreateReportTraceRequest,
  Yatra,
  CreateYatraRequest,
  JoinYatraRequest,
} from "../types";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Add response interceptor to handle common errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  // Generic request wrapper
  private async request<T>(config: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.request(config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // Authentication endpoints
  auth = {
    login: async (credentials: LoginRequest): Promise<ApiResponse<AuthUser>> => {
      return this.request({
        method: "POST",
        url: "/auth/login",
        data: credentials,
      });
    },

    register: async (userData: RegisterRequest): Promise<ApiResponse<AuthUser>> => {
      return this.request({
        method: "POST",
        url: "/auth/register",
        data: userData,
      });
    },

    logout: async (): Promise<ApiResponse<void>> => {
      return this.request({
        method: "POST",
        url: "/auth/logout",
      });
    },

    getCurrentUser: async (): Promise<ApiResponse<AuthUser>> => {
      return this.request({
        method: "GET",
        url: "/auth/me",
      });
    },

    updateUser: async (userData: UpdateUserRequest): Promise<ApiResponse<AuthUser>> => {
      return this.request({
        method: "PUT",
        url: "/auth/user",
        data: userData,
      });
    },

    updatePassword: async (passwordData: UpdatePasswordRequest): Promise<ApiResponse<void>> => {
      return this.request({
        method: "PUT",
        url: "/auth/password",
        data: passwordData,
      });
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<void>> => {
      return this.request({
        method: "POST",
        url: "/auth/reset-password",
        data,
      });
    },
  };

  // Practice endpoints
  practices = {
    getAll: async (): Promise<ApiResponse<UserPractice[]>> => {
      return this.request({
        method: "GET",
        url: "/practices",
      });
    },

    create: async (practice: CreatePracticeRequest): Promise<ApiResponse<UserPractice>> => {
      return this.request({
        method: "POST",
        url: "/practices",
        data: practice,
      });
    },

    update: async (id: string, practice: UpdatePracticeRequest): Promise<ApiResponse<UserPractice>> => {
      return this.request({
        method: "PUT",
        url: `/practices/${id}`,
        data: practice,
      });
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request({
        method: "DELETE",
        url: `/practices/${id}`,
      });
    },
  };

  // Diary endpoints
  diary = {
    getEntries: async (date?: string): Promise<ApiResponse<DiaryEntry[]>> => {
      return this.request({
        method: "GET",
        url: "/diary",
        params: date ? { date } : undefined,
      });
    },

    createEntry: async (entry: CreateDiaryEntryRequest): Promise<ApiResponse<DiaryEntry>> => {
      return this.request({
        method: "POST",
        url: "/diary",
        data: entry,
      });
    },

    updateEntry: async (date: string, practiceId: string, value: any): Promise<ApiResponse<DiaryEntry>> => {
      return this.request({
        method: "PUT",
        url: `/diary/${date}/${practiceId}`,
        data: { value },
      });
    },

    deleteEntry: async (date: string, practiceId: string): Promise<ApiResponse<void>> => {
      return this.request({
        method: "DELETE",
        url: `/diary/${date}/${practiceId}`,
      });
    },
  };

  // Reports endpoints
  reports = {
    getAll: async (): Promise<ApiResponse<Report[]>> => {
      return this.request({
        method: "GET",
        url: "/reports",
      });
    },

    create: async (report: CreateReportRequest): Promise<ApiResponse<Report>> => {
      return this.request({
        method: "POST",
        url: "/reports",
        data: report,
      });
    },

    update: async (id: string, report: Partial<CreateReportRequest>): Promise<ApiResponse<Report>> => {
      return this.request({
        method: "PUT",
        url: `/reports/${id}`,
        data: report,
      });
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request({
        method: "DELETE",
        url: `/reports/${id}`,
      });
    },

    getTraces: async (reportId: string): Promise<ApiResponse<ReportTrace[]>> => {
      return this.request({
        method: "GET",
        url: `/reports/${reportId}/traces`,
      });
    },

    addTrace: async (reportId: string, trace: CreateReportTraceRequest): Promise<ApiResponse<ReportTrace>> => {
      return this.request({
        method: "POST",
        url: `/reports/${reportId}/traces`,
        data: trace,
      });
    },

    updateTrace: async (
      reportId: string,
      traceId: string,
      trace: Partial<CreateReportTraceRequest>,
    ): Promise<ApiResponse<ReportTrace>> => {
      return this.request({
        method: "PUT",
        url: `/reports/${reportId}/traces/${traceId}`,
        data: trace,
      });
    },

    deleteTrace: async (reportId: string, traceId: string): Promise<ApiResponse<void>> => {
      return this.request({
        method: "DELETE",
        url: `/reports/${reportId}/traces/${traceId}`,
      });
    },
  };

  // Yatra endpoints
  yatras = {
    getAll: async (): Promise<ApiResponse<Yatra[]>> => {
      return this.request({
        method: "GET",
        url: "/yatras",
      });
    },

    create: async (yatra: CreateYatraRequest): Promise<ApiResponse<Yatra>> => {
      return this.request({
        method: "POST",
        url: "/yatras",
        data: yatra,
      });
    },

    join: async (data: JoinYatraRequest): Promise<ApiResponse<void>> => {
      return this.request({
        method: "POST",
        url: "/yatras/join",
        data,
      });
    },

    getDetails: async (id: string): Promise<ApiResponse<Yatra>> => {
      return this.request({
        method: "GET",
        url: `/yatras/${id}`,
      });
    },

    update: async (id: string, yatra: Partial<CreateYatraRequest>): Promise<ApiResponse<Yatra>> => {
      return this.request({
        method: "PUT",
        url: `/yatras/${id}`,
        data: yatra,
      });
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request({
        method: "DELETE",
        url: `/yatras/${id}`,
      });
    },
  };

  // Utility methods
  setAuthToken(token: string) {
    localStorage.setItem("auth_token", token);
  }

  clearAuthToken() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }

  getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
