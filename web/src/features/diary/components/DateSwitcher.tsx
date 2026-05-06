type DateSwitcherProps = {
  value: string;
  onChange: (value: string) => void;
};

function shiftDate(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function DateSwitcher({ value, onChange }: DateSwitcherProps) {
  return (
    <div className="date-switcher" aria-label="Diary date">
      <button type="button" aria-label="Previous day" onClick={() => onChange(shiftDate(value, -1))}>
        Prev
      </button>
      <label>
        <span>Date</span>
        <input type="date" value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
      <button type="button" aria-label="Next day" onClick={() => onChange(shiftDate(value, 1))}>
        Next
      </button>
    </div>
  );
}
