import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import { DiaryEntry } from "../../api/diary";
import { DateSwitcher } from "./components/DateSwitcher";
import { PracticeField } from "./components/PracticeField";
import { SaveStatus } from "./components/SaveStatus";

type TodayPageProps = {
  initialEntries?: DiaryEntry[];
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

export function TodayPage({ initialEntries = [] }: TodayPageProps) {
  const outletContext = useOutletContext<TodayOutletContext | null>();
  const [localSelectedDate, setLocalSelectedDate] = useState(todayIso);
  const selectedDate = outletContext?.selectedDate ?? localSelectedDate;
  const setSelectedDate = outletContext?.setSelectedDate ?? setLocalSelectedDate;
  const [entries, setEntries] = useState(initialEntries);

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

      <div className="today-top-actions">
        <span aria-hidden="true" />
        <Link
          aria-label="Manage practices"
          className="today-icon-action"
          title="Manage practices"
          to="/user/practices"
        >
          <i className="icon-bars" aria-hidden="true" />
        </Link>
      </div>

      <DateSwitcher value={selectedDate} onChange={setSelectedDate} />

      <SaveStatus dirty={false} completed={completedCount} total={entries.length} />

      {entries.length > 0 ? (
        <div className="today-entry-grid">
          {entries.map((entry) => (
            <PracticeField key={entry.practice} entry={entry} onChange={updateEntry} />
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
