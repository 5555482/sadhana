import { Link } from 'react-router-dom'

const FAQS = [
  {
    q: 'How do I log a practice?',
    a: 'Go to the Home tab and find your practice card. Each card shows the input for that day. Changes save automatically after a short delay.',
  },
  {
    q: 'What is a Yatra?',
    a: 'A Yatra is a group practice challenge. Members track their practices together and hold each other accountable.',
  },
  {
    q: 'How do I share a chart?',
    a: 'Go to Charts, then tap the share icon on any report. A public link is copied to your clipboard.',
  },
  {
    q: 'Can I use the app offline?',
    a: 'Yes. The app loads cached data when offline. Your changes queue automatically and sync when connectivity returns.',
  },
  {
    q: 'How do I import data?',
    a: 'Go to Settings → Import data. Upload a CSV file, map the columns to your practices, then confirm.',
  },
  {
    q: 'How do I change my language?',
    a: 'Go to Settings → Language and select English, Русский, or Українська.',
  },
  {
    q: 'How do I add a new practice?',
    a: 'Go to Settings → My practices and tap the + button, or tap the + button on the Home tab.',
  },
  {
    q: 'How do I reorder my practices?',
    a: 'Go to Settings → My practices and drag the handle icon on the left of each row to reorder.',
  },
]

export function HelpPage() {
  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      {FAQS.map(({ q, a }) => (
        <div key={q} className="collapse collapse-arrow bg-base-100 shadow-sm">
          <input type="checkbox" />
          <div className="collapse-title font-medium">{q}</div>
          <div className="collapse-content text-sm text-base-content/70">
            <p>{a}</p>
          </div>
        </div>
      ))}
      <Link to="/help/support-form" className="btn btn-outline w-full mt-4">
        Contact support
      </Link>
    </div>
  )
}
