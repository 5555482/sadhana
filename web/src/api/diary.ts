import { apiFetch } from "./client";

export type PracticeDataType = "Int" | "Bool" | "Time" | "Text" | "Duration";

export type PracticeValue =
  | { Int: number }
  | { Bool: boolean }
  | { Time: { h: number; m: number } }
  | { Text: string }
  | { Duration: number };

export type DiaryEntry = {
  practice: string;
  data_type: PracticeDataType;
  dropdown_variants: string | null;
  value: PracticeValue | null;
};

export type DiaryDayResponse = {
  diary_day: DiaryEntry[];
  cob_date: string;
};

export function getDiaryDay(cob: string) {
  return apiFetch<DiaryDayResponse>(`/diary/${cob}`);
}

export function saveDiaryEntry(cob: string, entry: DiaryEntry) {
  return apiFetch<void>(`/diary/${cob}/entry`, {
    method: "PUT",
    body: JSON.stringify({
      entry: {
        practice: entry.practice,
        value: entry.value
      }
    })
  });
}
