import { Link } from "react-router-dom";

const menuItems = [
  { to: "/settings/edit-user", icon: "icon-user", label: "User details" },
  { to: "/settings/edit-password", icon: "icon-edit", label: "Change password" },
  { to: "/settings/language", icon: "icon-lang", label: "Language" },
  { to: "/settings/import", icon: "icon-import", label: "Import CSV" },
  { to: "/help/support-form", icon: "icon-help", label: "Help and support" }
];

export function SettingsPage() {
  return (
    <section className="settings-page" aria-labelledby="settings-heading">
      <header className="practice-page-header">
        <div>
          <p className="section-kicker">Account</p>
          <h1 id="settings-heading">Settings</h1>
        </div>
      </header>

      <nav className="settings-list" aria-label="Settings">
        {menuItems.map((item) => (
          <Link className="settings-row" key={item.to} to={item.to}>
            <span>
              <i className={item.icon} aria-hidden="true" />
              {item.label}
            </span>
            <i className="icon-chevron-right" aria-hidden="true" />
          </Link>
        ))}

        <label className="settings-row" htmlFor="dark-mode">
          <span>
            <i className="icon-moon" aria-hidden="true" />
            Dark mode
          </span>
          <input id="dark-mode" type="checkbox" />
        </label>

        <a className="settings-row" href="https://sadhanapro.com" rel="noreferrer" target="_blank">
          <span>
            <i className="icon-info" aria-hidden="true" />
            About
          </span>
        </a>
      </nav>
    </section>
  );
}
