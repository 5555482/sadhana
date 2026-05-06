import { PracticeDataType } from "./diary";
import { apiFetch } from "./client";

export type Yatra = {
  id: string;
  name: string;
  statistics: unknown | null;
  show_stability_metrics: boolean;
};

export type YatraPractice = {
  id: string;
  practice: string;
  data_type: PracticeDataType;
  colour_zones: unknown | null;
  daily_score: unknown | null;
};

export type NewYatraPractice = {
  yatra_id: string;
  practice: string;
  data_type: PracticeDataType;
};

export type YatraUser = {
  user_id: string;
  user_name: string;
  is_admin: boolean;
};

export type YatraUserPractice = {
  yatra_practice: YatraPractice;
  user_practice: string | null;
};

export type UserYatraData = {
  user_id: string;
  user_name: string;
  row: Array<unknown | null>;
  trend_arrow: string | null;
  stability_heatmap: number[];
};

export type YatraStatisticResult = {
  label: string;
  value: unknown | null;
};

export type YatraDataResponse = {
  practices: YatraPractice[];
  data: UserYatraData[];
  statistics: YatraStatisticResult[];
  stability_heatmap_days: number[];
};

export type YatrasResponse = {
  yatras: Yatra[];
};

export type YatraResponse = {
  yatra: Yatra;
};

export type YatraPracticesResponse = {
  practices: YatraPractice[];
};

export type YatraUsersResponse = {
  users: YatraUser[];
};

export type YatraUserPracticesResponse = {
  practices: YatraUserPractice[];
};

export type IsYatraAdminResponse = {
  is_admin: boolean;
};

export function getYatraData(yatraId: string, cobDate: string) {
  return apiFetch<YatraDataResponse>(`/yatra/${yatraId}/data?cob_date=${cobDate}`);
}

export function getUserYatras() {
  return apiFetch<YatrasResponse>("/yatras");
}

export function createYatra(name: string) {
  return apiFetch<YatraResponse>("/yatras", {
    method: "POST",
    body: JSON.stringify({ name })
  });
}

export function getYatra(yatraId: string) {
  return apiFetch<YatraResponse>(`/yatra/${yatraId}`);
}

export function updateYatra(yatra: Yatra) {
  return apiFetch<void>(`/yatra/${yatra.id}`, {
    method: "PUT",
    body: JSON.stringify({ yatra })
  });
}

export function deleteYatra(yatraId: string) {
  return apiFetch<void>(`/yatra/${yatraId}`, {
    method: "DELETE"
  });
}

export function joinYatra(yatraId: string) {
  return apiFetch<void>(`/yatra/${yatraId}/join`, {
    method: "PUT"
  });
}

export function leaveYatra(yatraId: string) {
  return apiFetch<void>(`/yatra/${yatraId}/leave`, {
    method: "PUT"
  });
}

export function isYatraAdmin(yatraId: string) {
  return apiFetch<IsYatraAdminResponse>(`/yatra/${yatraId}/is_admin`);
}

export function getYatraPractices(yatraId: string) {
  return apiFetch<YatraPracticesResponse>(`/yatra/${yatraId}/practices`);
}

export function getYatraUsers(yatraId: string) {
  return apiFetch<YatraUsersResponse>(`/yatra/${yatraId}/users`);
}

export function deleteYatraUser(yatraId: string, userId: string) {
  return apiFetch<void>(`/yatra/${yatraId}/users/${userId}`, {
    method: "DELETE"
  });
}

export function toggleYatraUserAdmin(yatraId: string, userId: string) {
  return apiFetch<void>(`/yatra/${yatraId}/users/${userId}/is_admin`, {
    method: "PUT"
  });
}

export function reorderYatraPractices(yatraId: string, practices: string[]) {
  return apiFetch<void>(`/yatra/${yatraId}/practices/reorder`, {
    method: "PUT",
    body: JSON.stringify({ practices })
  });
}

export function createYatraPractice(yatraId: string, practice: NewYatraPractice) {
  return apiFetch<void>(`/yatra/${yatraId}/practices`, {
    method: "POST",
    body: JSON.stringify({ practice })
  });
}

export function updateYatraPractice(yatraId: string, practice: YatraPractice) {
  return apiFetch<void>(`/yatra/${yatraId}/practice/${practice.id}`, {
    method: "PUT",
    body: JSON.stringify({ practice })
  });
}

export function deleteYatraPractice(yatraId: string, practiceId: string) {
  return apiFetch<void>(`/yatra/${yatraId}/practice/${practiceId}`, {
    method: "DELETE"
  });
}

export function getYatraUserPractices(yatraId: string) {
  return apiFetch<YatraUserPracticesResponse>(`/yatra/${yatraId}/user-practices`);
}

export function updateYatraUserPractices(yatraId: string, practices: YatraUserPractice[]) {
  return apiFetch<void>(`/yatra/${yatraId}/user-practices`, {
    method: "PUT",
    body: JSON.stringify({ practices })
  });
}
