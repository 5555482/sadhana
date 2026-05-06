import { Link } from "react-router-dom";

import { UserPractice } from "../../api/practices";

type PracticeSortListProps = {
  practices: UserPractice[];
  onToggleActive: (id: string) => void;
  onMovePractice: (id: string, direction: -1 | 1) => void;
};

function dataTypeLabel(dataType: UserPractice["data_type"]) {
  if (dataType === "Int") return "Number";
  if (dataType === "Bool") return "Yes/no";
  if (dataType === "Time") return "Time";
  if (dataType === "Duration") return "Duration";
  return "Text";
}

export function PracticeSortList({
  practices,
  onToggleActive,
  onMovePractice
}: PracticeSortListProps) {
  if (practices.length === 0) {
    return (
      <div className="empty-state">
        <h2>No practices yet</h2>
        <p>Add the first one to start shaping the daily entry screen.</p>
      </div>
    );
  }

  return (
    <ol className="practice-sort-list" aria-label="User practices">
      {practices.map((practice, index) => (
        <li className={practice.is_active ? "practice-card" : "practice-card is-muted"} key={practice.id}>
          <div className="practice-card-main">
            <span className="practice-rank">{index + 1}</span>
            <div>
              <h2>
                {practice.practice}
                {practice.is_required ? <span aria-label="required"> *</span> : null}
              </h2>
              <p>{dataTypeLabel(practice.data_type)}</p>
            </div>
          </div>

          <div className="practice-card-actions">
            <button
              type="button"
              aria-label={`Move ${practice.practice} up`}
              onClick={() => onMovePractice(practice.id, -1)}
            >
              <i className="icon-chevron-left rotate-up" aria-hidden="true" />
              Up
            </button>
            <button
              type="button"
              aria-label={`Move ${practice.practice} down`}
              onClick={() => onMovePractice(practice.id, 1)}
            >
              <i className="icon-chevron-left rotate-down" aria-hidden="true" />
              Down
            </button>
            <button
              type="button"
              aria-label={practice.is_active ? `Hide ${practice.practice}` : `Show ${practice.practice}`}
              onClick={() => onToggleActive(practice.id)}
            >
              <i className={practice.is_active ? "icon-eye" : "icon-eye-cross"} aria-hidden="true" />
              {practice.is_active ? "Hide" : "Show"}
            </button>
            <Link to={`/user/practice/${practice.id}/edit`}>
              <i className="icon-edit" aria-hidden="true" />
              Edit
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
