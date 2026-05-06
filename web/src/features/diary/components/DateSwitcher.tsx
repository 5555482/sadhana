type DateSwitcherProps = {
  value: string;
  onChange: (value: string) => void;
  incompleteDates?: string[];
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

function shiftDate(value: string, days: number) {
  const date = parseIsoDate(value);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  return result;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatAccessibleDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function weekdayInitial(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date).charAt(0);
}

export function DateSwitcher({ value, onChange, incompleteDates = [] }: DateSwitcherProps) {
  const selectedDate = parseIsoDate(value);
  const weekStart = startOfWeek(selectedDate);
  const visibleDays = Array.from({ length: 9 }, (_, index) => addDays(weekStart, index - 1));
  const selectedLabel = formatAccessibleDate(selectedDate);

  return (
    <div className="date-switcher" aria-label="Diary date strip">
      <div className="week-strip">
        {visibleDays.map((date, index) => {
          const iso = toIsoDate(date);
          const isSelected = iso === value;
          const isToday = iso === toIsoDate(new Date());
          const isOutsideWeek = index === 0 || index === 8;
          const isIncomplete = incompleteDates.includes(iso);

          return (
            <div className="week-day" key={iso}>
              <span className={isSelected ? "weekday-label is-selected" : "weekday-label"}>
                {weekdayInitial(date)}
              </span>
              <button
                type="button"
                className={[
                  "date-pill",
                  isSelected ? "is-selected" : "",
                  isToday ? "is-today" : "",
                  isOutsideWeek ? "is-outside-week" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={`Select ${formatAccessibleDate(date)}`}
                onClick={() =>
                  onChange(
                    isOutsideWeek && index === 0
                      ? shiftDate(value, -7)
                      : isOutsideWeek && index === 8
                        ? shiftDate(value, 7)
                        : iso
                  )
                }
              >
                <span>{date.getDate()}</span>
                {isIncomplete ? <span className="incomplete-dot" aria-hidden="true" /> : null}
              </button>
            </div>
          );
        })}
      </div>
      <p className="selected-date-label">{selectedLabel}</p>
    </div>
  );
}
