import { useState } from "react";

type MonthCalendarOverlayProps = {
  selectedDate: string;
  onClose: () => void;
  onSelectDate: (value: string) => void;
};

function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function monthDays(viewDate: Date) {
  const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const blanks = (start.getDay() || 7) - 1;

  return {
    blanks,
    label: new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(start),
    days: Array.from({ length: end.getDate() }, (_, index) => {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), index + 1);
      return toIsoDate(date);
    })
  };
}

export function MonthCalendarOverlay({
  selectedDate,
  onClose,
  onSelectDate
}: MonthCalendarOverlayProps) {
  const today = toIsoDate(new Date());
  const [viewDate, setViewDate] = useState(() => {
    const selected = parseIsoDate(selectedDate);
    return new Date(selected.getFullYear(), selected.getMonth(), 1);
  });
  const month = monthDays(viewDate);

  function selectDate(value: string) {
    onSelectDate(value);
    onClose();
  }

  return (
    <div className="month-calendar-shell" role="dialog" aria-modal="true" aria-label="Calendar">
      <button className="month-calendar-backdrop" type="button" aria-label="Close calendar" onClick={onClose} />
      <div className="month-calendar-panel">
        <header className="month-calendar-header">
          <h2>{month.label}</h2>
          <div className="month-calendar-nav">
            <button
              type="button"
              className="month-calendar-control"
              aria-label="Previous month"
              onClick={() => setViewDate((current) => addMonths(current, -1))}
            >
              <i className="icon-chevron-left" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="month-calendar-control"
              aria-label="Next month"
              onClick={() => setViewDate((current) => addMonths(current, 1))}
            >
              <i className="icon-chevron-right" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="month-weekdays" aria-hidden="true">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>

        <div className="month-grid">
          {Array.from({ length: month.blanks }, (_, index) => (
            <span className="month-empty-day" key={index} />
          ))}
          {month.days.map((date) => {
            const day = parseIsoDate(date).getDate();
            const isSelected = date === selectedDate;
            const isToday = date === today;

            return (
              <button
                aria-label={`Select ${date}`}
                className={[
                  "month-day",
                  isSelected ? "is-selected" : "",
                  isToday ? "is-today" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={date}
                onClick={() => selectDate(date)}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>

        <button type="button" className="month-today" onClick={() => selectDate(today)}>
          Today
        </button>
      </div>
    </div>
  );
}
