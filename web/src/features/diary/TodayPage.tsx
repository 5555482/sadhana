import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import { DiaryEntry } from "../../api/diary";
import { DateSwitcher } from "./components/DateSwitcher";
import { IncompleteDaysBadge } from "./components/IncompleteDaysBadge";
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
  const [dirty, setDirty] = useState(false);

  const completedCount = useMemo(
    () => entries.filter((entry) => entry.value !== null).length,
    [entries]
  );

  function updateEntry(nextEntry: DiaryEntry) {
    setEntries((current) =>
      current.map((entry) => (entry.practice === nextEntry.practice ? nextEntry : entry))
    );
    setDirty(true);
  }

  function saveChanges() {
    setDirty(false);
  }

  return (
    <section className="today-page" aria-labelledby="today-heading">
      <DateSwitcher value={selectedDate} onChange={setSelectedDate} />

      <header className="today-header">
        <div>
          <p className="section-kicker">Daily entry</p>
          <h1 id="today-heading">Today</h1>
        </div>
        <div className="today-header-actions">
          <Link className="quiet-link" to="/user/practices">
            <i className="icon-bars" aria-hidden="true" />
            Manage practices
          </Link>
          <IncompleteDaysBadge count={0} />
        </div>
      </header>

      <SaveStatus dirty={dirty} completed={completedCount} total={entries.length} />

      {entries.length > 0 ? (
        <div className="practice-list">
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

      <button className="floating-save" type="button" onClick={saveChanges}>
        Save changes
      </button>
    </section>
  );
}
