import { Outlet } from "react-router-dom";

import { BottomNav } from "../components/ui/BottomNav";
import { PageHeader } from "../components/ui/PageHeader";

export function AppShell() {
  return (
    <div className="app-shell">
      <PageHeader title="Sadhana Pro" />
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
