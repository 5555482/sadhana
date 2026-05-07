import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { DiaryEntry } from "../../api/diary";
import { DateSwitcher } from "./components/DateSwitcher";
import { PracticeField } from "./components/PracticeField";
import { SaveStatus } from "./components/SaveStatus";

type TodayPageProps = {
  initialEntries?: DiaryEntry[];
  initialSelectedDate?: string;
};

type TodayOutletContext = {
  selectedDate: string;
  setSelectedDate: (value: string) => void;
};

function todayIso() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isPastDate(value: string) {
  return value < todayIso();
}

function isMissingRequired(entry: DiaryEntry, selectedDate: string) {
  return Boolean(entry.is_required && entry.value === null && isPastDate(selectedDate));
}

export function TodayPage({ initialEntries = [], initialSelectedDate }: TodayPageProps) {
  const outletContext = useOutletContext<TodayOutletContext | null>();
  const [localSelectedDate, setLocalSelectedDate] = useState(initialSelectedDate ?? todayIso);
  const selectedDate = outletContext?.selectedDate ?? localSelectedDate;
  const setSelectedDate = outletContext?.setSelectedDate ?? setLocalSelectedDate;
  const [entries, setEntries] = useState(initialEntries);
  const selectedDateIncomplete = entries.some((entry) => isMissingRequired(entry, selectedDate));

  const completedCount = useMemo(
    () => entries.filter((entry) => entry.value !== null).length,
    [entries]
  );

  function updateEntry(nextEntry: DiaryEntry) {
    setEntries((current) =>
      current.map((entry) => (entry.practice === nextEntry.practice ? nextEntry : entry))
    );
  }

  return (
    <section className="today-page rust-today-page" aria-labelledby="today-heading">
      <h1 className="sr-only" id="today-heading">
        Today
      </h1>

      <DateSwitcher
        value={selectedDate}
        onChange={setSelectedDate}
        incompleteDates={selectedDateIncomplete ? [selectedDate] : []}
      />

      <SaveStatus dirty={false} completed={completedCount} total={entries.length} />

      {entries.length > 0 ? (
        <div className="today-entry-grid">
          {entries.map((entry) => (
            <PracticeField
              key={entry.practice}
              entry={entry}
              isIncomplete={isMissingRequired(entry, selectedDate)}
              onChange={updateEntry}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No practices yet</h2>
          <p>Add practices to make today's entry useful.</p>
        </div>
      )}
    </section>
  );
}
