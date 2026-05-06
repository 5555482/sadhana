import { PracticeDataType } from "./diary";
import { apiFetch } from "./client";

export type UserPractice = {
  id: string;
  practice: string;
  data_type: PracticeDataType;
  is_active: boolean;
  is_required: boolean | null;
  dropdown_variants: string | null;
};

export type NewUserPractice = {
  practice: string;
  data_type: PracticeDataType;
  is_active: boolean;
  is_required: boolean | null;
  dropdown_variants: string | null;
};

export type UserPracticesResponse = {
  user_practices: UserPractice[];
};

export type UserPracticeResponse = {
  practice: UserPractice;
};

export function getUserPractices() {
  return apiFetch<UserPracticesResponse>("/user/practices");
}

export function getUserPractice(id: string) {
  return apiFetch<UserPracticeResponse>(`/user/practice/${id}`);
}

export function createUserPractice(userPractice: NewUserPractice) {
  return apiFetch<void>("/user/practices", {
    method: "POST",
    body: JSON.stringify({ user_practice: userPractice })
  });
}

export function updateUserPractice(userPractice: UserPractice) {
  return apiFetch<void>(`/user/practice/${userPractice.id}`, {
    method: "PUT",
    body: JSON.stringify({ user_practice: userPractice })
  });
}

export function deleteUserPractice(id: string) {
  return apiFetch<void>(`/user/practice/${id}`, {
    method: "DELETE"
  });
}

export function reorderUserPractices(practices: string[]) {
  return apiFetch<void>("/user/practices/reorder", {
    method: "PUT",
    body: JSON.stringify({ practices })
  });
}
