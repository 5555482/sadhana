import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const mainNavItems = [
  { to: "/", label: "Today", icon: "icon-calendar", activeIcon: "icon-calendar-solid" },
  { to: "/charts", label: "Charts", icon: "icon-graph", activeIcon: "icon-graph-solid" },
  { to: "/yatras", label: "Yatras", icon: "icon-user-group", activeIcon: "icon-user-group-solid" }
];

const settingsItem = {
  to: "/settings",
  label: "Settings",
  icon: "icon-adjust",
  activeIcon: "icon-adjust-solid"
};

const settingsMenuItems = [
  { to: "/settings/edit-user", icon: "icon-user", label: "User details" },
  { to: "/settings/edit-password", icon: "icon-edit", label: "Change password" },
  { to: "/settings/language", icon: "icon-lang", label: "Language" },
  { to: "/settings/import", icon: "icon-import", label: "Import CSV" },
  { to: "/help/support-form", icon: "icon-help", label: "Help and support" },
  { to: "https://sadhanapro.com", icon: "icon-info", label: "About", external: true }
];

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

function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="settings-menu-wrap" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={isOpen ? "sidebar-link active" : "sidebar-link"}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <i aria-hidden="true" className={isOpen ? settingsItem.activeIcon : settingsItem.icon} />
        <span>{settingsItem.label}</span>
      </button>

      {isOpen ? (
        <div aria-label="Settings" className="settings-popover" role="menu">
          {settingsMenuItems.map((item) =>
            item.external ? (
              <a
                className="settings-menu-item"
                href={item.to}
                key={item.to}
                onClick={() => setIsOpen(false)}
                rel="noreferrer"
                role="menuitem"
                target="_blank"
              >
                <i aria-hidden="true" className={item.icon} />
                <span>{item.label}</span>
              </a>
            ) : (
              <Link
                className="settings-menu-item"
                key={item.to}
                onClick={() => setIsOpen(false)}
                role="menuitem"
                to={item.to}
              >
                <i aria-hidden="true" className={item.icon} />
                <span>{item.label}</span>
              </Link>
            )
          )}

          <button
            aria-checked={isDarkMode}
            className="settings-menu-item"
            onClick={() => setIsDarkMode((current) => !current)}
            role="menuitemcheckbox"
            type="button"
          >
            <i aria-hidden="true" className="icon-moon" />
            <span>Dark mode</span>
            <span aria-hidden="true" className={isDarkMode ? "menu-check is-on" : "menu-check"} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function SidebarNav() {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <img className="sidebar-logo" src="/images/logo.png" alt="Sadhana Pro" />
      </div>

      <nav aria-label="Primary" className="sidebar-nav">
        {mainNavItems.map((item) => (
          <SidebarLink item={item} key={item.to} />
        ))}
      </nav>

      <div className="sidebar-footer" aria-label="Sidebar footer">
        <SettingsMenu />
      </div>
    </aside>
  );
}
