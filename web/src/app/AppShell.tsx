import { useState } from "react";
import { Outlet } from "react-router-dom";

import { MonthCalendarOverlay } from "../components/ui/MonthCalendarOverlay";
import { SidebarNav } from "../components/ui/SidebarNav";
import { DateSwitcher } from "../features/diary/components/DateSwitcher";

function todayIso() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AppShell() {
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="app-shell">
      <SidebarNav onCalendarOpen={() => setCalendarOpen(true)} />
      <main className="app-main">
        <DateSwitcher value={selectedDate} onChange={setSelectedDate} />
        <Outlet context={{ selectedDate, setSelectedDate }} />
      </main>
      {calendarOpen ? (
        <MonthCalendarOverlay
          selectedDate={selectedDate}
          onClose={() => setCalendarOpen(false)}
          onSelectDate={setSelectedDate}
        />
      ) : null}
    </div>
  );
}
