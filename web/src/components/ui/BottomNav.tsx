import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Today", icon: "icon-home", activeIcon: "icon-home-solid" },
  { to: "/charts", label: "Charts", icon: "icon-graph", activeIcon: "icon-graph-solid" },
  { to: "/yatras", label: "Yatras", icon: "icon-user-group", activeIcon: "icon-user-group-solid" },
  { to: "/settings", label: "Settings", icon: "icon-adjust", activeIcon: "icon-adjust-solid" }
];

export function BottomNav() {
  return (
    <nav aria-label="Primary" className="bottom-nav">
      <ul>
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} aria-label={item.label}>
              {({ isActive }) => (
                <i
                  aria-hidden="true"
                  className={isActive ? item.activeIcon : item.icon}
                />
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
