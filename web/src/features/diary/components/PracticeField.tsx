import { DiaryEntry, PracticeValue } from "../../../api/diary";

type PracticeFieldProps = {
  entry: DiaryEntry;
  isIncomplete?: boolean;
  onChange: (entry: DiaryEntry) => void;
};

function valueToInput(value: PracticeValue | null) {
  if (!value) return "";
  if ("Int" in value) return String(value.Int);
  if ("Bool" in value) return value.Bool ? "true" : "";
  if ("Text" in value) return value.Text;
  if ("Duration" in value) return String(value.Duration);
  if ("Time" in value) {
    return `${String(value.Time.h).padStart(2, "0")}:${String(value.Time.m).padStart(2, "0")}`;
  }
  return "";
}

function inputToValue(entry: DiaryEntry, raw: string | boolean): PracticeValue | null {
  if (raw === "" || raw === false) return null;

  if (entry.data_type === "Bool") return { Bool: Boolean(raw) };
  if (entry.data_type === "Int") return { Int: Number(raw) };
  if (entry.data_type === "Text") return { Text: String(raw) };
  if (entry.data_type === "Duration") return { Duration: Number(raw) };
  if (entry.data_type === "Time") {
    const [h = "0", m = "0"] = String(raw).split(":");
    return { Time: { h: Number(h), m: Number(m) } };
  }

  return null;
}

function fieldClassName(value: string, isIncomplete: boolean) {
  return [
    "practice-field",
    value ? "has-value" : "",
    isIncomplete ? "is-incomplete" : ""
  ]
    .filter(Boolean)
    .join(" ");
}

export function PracticeField({ entry, isIncomplete = false, onChange }: PracticeFieldProps) {
  const id = `practice-${entry.practice.replaceAll(/\s+/g, "-").toLowerCase()}`;
  const value = valueToInput(entry.value);
  const icon =
    entry.data_type === "Bool"
      ? "icon-tick"
      : entry.data_type === "Duration"
        ? "icon-timer"
        : entry.data_type === "Time"
          ? "icon-clock"
          : entry.data_type === "Text"
            ? "icon-doc"
            : "icon-rounds";

  if (entry.data_type === "Bool") {
    return (
      <label className={fieldClassName(value, isIncomplete) + " bool-practice-field"} htmlFor={id}>
        <span>
          <i className={icon} aria-hidden="true" />
          {entry.practice}:
        </span>
        <input
          aria-invalid={isIncomplete || undefined}
          id={id}
          type="checkbox"
          checked={value === "true"}
          onChange={(event) =>
            onChange({ ...entry, value: inputToValue(entry, event.target.checked) })
          }
        />
      </label>
    );
  }

  if (entry.dropdown_variants) {
    const options = entry.dropdown_variants
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);

    return (
      <div className={fieldClassName(value, isIncomplete)}>
        <select
          aria-invalid={isIncomplete || undefined}
          aria-label={entry.practice}
          className="practice-control"
          id={id}
          value={value}
          onChange={(event) =>
            onChange({ ...entry, value: inputToValue(entry, event.target.value) })
          }
        >
          <option value="" />
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label className="practice-floating-label" htmlFor={id}>
          <i className={icon} aria-hidden="true" />
          {entry.practice}:
        </label>
      </div>
    );
  }

  if (entry.data_type === "Text") {
    return (
      <div className={fieldClassName(value, isIncomplete)}>
        <textarea
          aria-invalid={isIncomplete || undefined}
          aria-label={entry.practice}
          className="practice-control practice-textarea"
          id={id}
          maxLength={1024}
          rows={4}
          placeholder=" "
          value={value}
          onChange={(event) =>
            onChange({ ...entry, value: inputToValue(entry, event.target.value) })
          }
        />
        <label className="practice-floating-label" htmlFor={id}>
          <i className={icon} aria-hidden="true" />
          {entry.practice}:
        </label>
      </div>
    );
  }

  const inputType = entry.data_type === "Time" ? "time" : "number";

  return (
    <div className={fieldClassName(value, isIncomplete)}>
      <input
        aria-invalid={isIncomplete || undefined}
        aria-label={entry.practice}
        className="practice-control"
        id={id}
        type={inputType}
        inputMode="numeric"
        placeholder=" "
        value={value}
        onChange={(event) =>
          onChange({ ...entry, value: inputToValue(entry, event.target.value) })
        }
      />
      <label className="practice-floating-label" htmlFor={id}>
        <i className={icon} aria-hidden="true" />
        {entry.practice}:
      </label>
    </div>
  );
}
