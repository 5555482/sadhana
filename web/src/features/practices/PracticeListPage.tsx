import { useState } from "react";
import { Link } from "react-router-dom";

import { UserPractice } from "../../api/practices";
import { PracticeSortList } from "./PracticeSortList";

type PracticeListPageProps = {
  initialPractices?: UserPractice[];
};

const samplePractices: UserPractice[] = [
  {
    id: "japa",
    practice: "Japa",
    data_type: "Int",
    is_active: true,
    is_required: true,
    dropdown_variants: null
  },
  {
    id: "reading",
    practice: "Reading",
    data_type: "Duration",
    is_active: true,
    is_required: false,
    dropdown_variants: null
  }
];

export function PracticeListPage({ initialPractices = samplePractices }: PracticeListPageProps) {
  const [practices, setPractices] = useState(initialPractices);

  function toggleActive(id: string) {
    setPractices((current) =>
      current.map((practice) =>
        practice.id === id ? { ...practice, is_active: !practice.is_active } : practice
      )
    );
  }

  function movePractice(id: string, direction: -1 | 1) {
    setPractices((current) => {
      const index = current.findIndex((practice) => practice.id === id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  }

  return (
    <section className="practice-page" aria-labelledby="practices-heading">
      <header className="practice-page-header">
        <div>
          <p className="section-kicker">Daily setup</p>
          <h1 id="practices-heading">Practices</h1>
        </div>
        <Link className="primary-action as-link" to="/user/practice/new">
          <i className="icon-plus" aria-hidden="true" />
          Add practice
        </Link>
      </header>

      <PracticeSortList
        practices={practices}
        onToggleActive={toggleActive}
        onMovePractice={movePractice}
      />

      <p className="practice-note">Required practices are marked with a star.</p>
    </section>
  );
}
