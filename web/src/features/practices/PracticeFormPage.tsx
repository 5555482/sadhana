import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { PracticeDataType } from "../../api/diary";

type PracticeFormPageProps = {
  mode: "create" | "edit";
};

const dataTypes: Array<{ value: PracticeDataType; label: string }> = [
  { value: "Int", label: "Number" },
  { value: "Duration", label: "Duration" },
  { value: "Time", label: "Time" },
  { value: "Bool", label: "Yes/no" },
  { value: "Text", label: "Text" }
];

export function PracticeFormPage({ mode }: PracticeFormPageProps) {
  const { practice } = useParams();
  const [name, setName] = useState(practice ? decodeURIComponent(practice) : "");
  const [dataType, setDataType] = useState<PracticeDataType>("Int");
  const [isRequired, setIsRequired] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);
  const [dropdownVariants, setDropdownVariants] = useState("");
  const title = mode === "create" ? "Add practice" : "Edit practice";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section className="practice-page" aria-labelledby="practice-form-heading">
      <header className="practice-page-header">
        <div>
          <p className="section-kicker">Daily setup</p>
          <h1 id="practice-form-heading">{title}</h1>
        </div>
        <Link className="quiet-link" to="/user/practices">
          <i className="icon-chevron-left" aria-hidden="true" />
          Back
        </Link>
      </header>

      <form className="practice-form" onSubmit={handleSubmit}>
        <label>
          <span>
            <i className="icon-doc" aria-hidden="true" />
            Name
          </span>
          <input
            value={name}
            maxLength={64}
            required
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label>
          <span>
            <i className="icon-adjust" aria-hidden="true" />
            Data type
          </span>
          <select value={dataType} onChange={(event) => setDataType(event.target.value as PracticeDataType)}>
            {dataTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="switch-row">
          <span>Required</span>
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(event) => setIsRequired(event.target.checked)}
          />
        </label>

        {(dataType === "Int" || dataType === "Text") && (
          <label className="switch-row">
            <span>Dropdown</span>
            <input
              type="checkbox"
              checked={isDropdown}
              onChange={(event) => setIsDropdown(event.target.checked)}
            />
          </label>
        )}

        {isDropdown && (
          <label>
            <span>Dropdown variants</span>
            <input
              value={dropdownVariants}
              onChange={(event) => setDropdownVariants(event.target.value)}
              placeholder="Low, Medium, High"
            />
          </label>
        )}

        <button className="primary-action" type="submit">
          <i className="icon-tick" aria-hidden="true" />
          Save practice
        </button>
      </form>
    </section>
  );
}
