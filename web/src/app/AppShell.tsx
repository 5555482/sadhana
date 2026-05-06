import { useState } from "react";
import { Outlet } from "react-router-dom";

import { SidebarNav } from "../components/ui/SidebarNav";

function todayIso() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AppShell() {
  const [selectedDate, setSelectedDate] = useState(todayIso);

  return (
    <div className="app-shell">
      <SidebarNav selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
