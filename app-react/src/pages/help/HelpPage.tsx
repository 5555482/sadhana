import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LuCircleHelp, LuChevronDown, LuChevronUp, LuMessageSquare, LuX } from 'react-icons/lu'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

// FAQ items stay in English — they are help content, not UI chrome
const FAQS = [
  { q: 'How do I log a practice?', a: 'Go to the Home tab and find your practice card. Each card shows the input for that day. Changes save automatically.' },
  { q: 'What is a Yatra?', a: 'A Yatra is a group practice circle. Members track practices together and hold each other accountable.' },
  { q: 'How do I share a chart?', a: 'Go to Charts and tap the Share button in the page header. A public link is copied to your clipboard.' },
  { q: 'Can I use the app offline?', a: 'Yes. The app loads cached data when offline. Changes queue automatically and sync when connectivity returns.' },
  { q: 'How do I import data?', a: 'Go to Settings → Import data. Upload a CSV file, map the columns to your practices, then confirm.' },
  { q: 'How do I change my language?', a: 'Go to Settings → Language and select English, Русский, or Українська.' },
  { q: 'How do I add a new practice?', a: 'Go to Settings → My practices and tap the + button, or tap the + FAB on the Home tab.' },
  { q: 'How do I reorder my practices?', a: 'Go to Settings → My practices and drag the handle on the left of each row.' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl overflow-hidden" style={glass}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-4 flex items-center gap-3 text-left"
        style={{ background: 'transparent', border: 'none' }}
      >
        <span className="flex-1 text-sm font-semibold text-gray-800">{q}</span>
        {open
          ? <LuChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: '#01a386' }} />
          : <LuChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />
        }
      </button>
      {open && (
        <div
          className="px-4 pb-4 text-sm leading-relaxed"
          style={{ color: '#4b5563', borderTop: '1px solid rgba(0,0,0,0.05)' }}
        >
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  )
}

export function HelpPage() {
  const { t } = useTranslation()

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
          <LuCircleHelp className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-bold text-gray-800">{t('help.title')}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{t('help.subtitle')}</p>
        </div>
        <Link
          to="/settings"
          aria-label="Close"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.40)' }}
        >
          <LuX className="w-4 h-4" />
        </Link>
      </div>

      {FAQS.map(faq => <FaqItem key={faq.q} {...faq} />)}

      {/* Contact support */}
      <Link
        to="/help/support-form"
        className="rounded-2xl px-4 py-4 flex items-center gap-3 no-underline mt-2"
        style={glass}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(99,102,241,0.10)' }}
        >
          <LuMessageSquare className="w-4 h-4" style={{ color: '#6366f1' }} />
        </div>
        <span className="flex-1 text-sm font-semibold text-gray-800">{t('help.contactSupport')}</span>
      </Link>
    </div>
  )
}
