import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Today" },
  { to: "/charts", label: "Charts" },
  { to: "/yatras", label: "Yatras" },
  { to: "/settings", label: "Settings" }
];

export function BottomNav() {
  return (
    <nav aria-label="Primary" className="bottom-nav">
      <ul>
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to}>{item.label}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
