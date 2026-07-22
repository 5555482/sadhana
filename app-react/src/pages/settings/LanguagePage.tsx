import { useTranslation } from 'react-i18next'
import { LuGlobe, LuCheck } from 'react-icons/lu'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

const LANGS = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ru', label: 'Russian', native: 'Русский' },
  { code: 'uk', label: 'Ukrainian', native: 'Українська' },
]

export function LanguagePage() {
  const { i18n } = useTranslation()
  const current = i18n.resolvedLanguage?.slice(0, 2) ?? 'en'

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-3 pb-24">
      {/* Header */}
      <div className="rounded-2xl px-5 py-5 flex items-center gap-4" style={glass}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            boxShadow: '0 4px 16px rgba(1,163,134,0.30)',
          }}
        >
          <LuGlobe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-800">Language</h1>
          <p className="text-xs text-gray-400 mt-0.5">Choose your preferred language</p>
        </div>
      </div>

      {/* Language options */}
      <div className="rounded-2xl overflow-hidden" style={glass}>
        {LANGS.map(({ code, label, native }, i) => {
          const active = current === code
          return (
            <button
              key={code}
              onClick={() => i18n.changeLanguage(code)}
              className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors"
              style={{
                background: active ? 'rgba(1,163,134,0.06)' : 'transparent',
                border: 'none',
                borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: active ? '#01a386' : '#1f2937' }}>{native}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{label}</p>
              </div>
              {active && <LuCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#01a386' }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
