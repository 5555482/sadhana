import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' },
]

export function LanguagePage() {
  const { i18n } = useTranslation()
  const current = i18n.resolvedLanguage?.slice(0, 2) ?? 'en'

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`card bg-base-100 shadow-sm text-left p-4 border-2 transition-colors ${
            current === code ? 'border-primary' : 'border-transparent'
          }`}
        >
          <span className="font-semibold">{label}</span>
          {current === code && <span className="badge badge-primary badge-sm ml-2">Active</span>}
        </button>
      ))}
    </div>
  )
}
