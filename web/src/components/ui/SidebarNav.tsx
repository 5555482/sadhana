import { NavLink } from "react-router-dom";

import { DateSwitcher } from "../../features/diary/components/DateSwitcher";

const mainNavItems = [
  { to: "/", label: "Today", icon: "icon-home", activeIcon: "icon-home-solid" },
  { to: "/charts", label: "Charts", icon: "icon-graph", activeIcon: "icon-graph-solid" },
  { to: "/yatras", label: "Yatras", icon: "icon-user-group", activeIcon: "icon-user-group-solid" }
];

const settingsItem = {
  to: "/settings",
  label: "Settings",
  icon: "icon-adjust",
  activeIcon: "icon-adjust-solid"
};

type SidebarNavProps = {
  selectedDate: string;
  onDateChange: (value: string) => void;
};

function SidebarLink({ item }: { item: typeof settingsItem }) {
  return (
    <NavLink className="sidebar-link" to={item.to} aria-label={item.label}>
      {({ isActive }) => (
        <>
          <i aria-hidden="true" className={isActive ? item.activeIcon : item.icon} />
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export function SidebarNav({ selectedDate, onDateChange }: SidebarNavProps) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <img className="sidebar-logo" src="/images/logo.png" alt="Sadhana Pro" />
      </div>

      <div className="sidebar-calendar">
        <DateSwitcher value={selectedDate} onChange={onDateChange} />
      </div>

      <nav aria-label="Primary" className="sidebar-nav">
        {mainNavItems.map((item) => (
          <SidebarLink item={item} key={item.to} />
        ))}
      </nav>

      <div className="sidebar-footer" aria-label="Sidebar footer">
        <SidebarLink item={settingsItem} />
      </div>
    </aside>
  );
}
