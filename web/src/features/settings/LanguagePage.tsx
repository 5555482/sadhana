import { useState } from "react";

import { getStoredLanguage, languages, setStoredLanguage } from "../../i18n";

export function LanguagePage() {
  const [language, setLanguage] = useState(() => getStoredLanguage());

  function updateLanguage(nextLanguage: string) {
    setLanguage(nextLanguage);
    setStoredLanguage(nextLanguage);
  }

  return (
    <section className="settings-page" aria-labelledby="language-heading">
      <header className="practice-page-header">
        <div>
          <p className="section-kicker">Settings</p>
          <h1 id="language-heading">Language</h1>
        </div>
      </header>

      <form className="settings-panel">
        <fieldset className="language-options">
          <legend>Choose language</legend>
          {languages.map((item) => (
            <label key={item.code}>
              <input
                checked={language === item.code}
                name="language"
                onChange={() => updateLanguage(item.code)}
                type="radio"
                value={item.code}
              />
              {item.label}
            </label>
          ))}
        </fieldset>
      </form>
    </section>
  );
}
