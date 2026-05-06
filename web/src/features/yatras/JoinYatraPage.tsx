import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { sampleYatras } from "./sampleData";

export function JoinYatraPage() {
  const { id } = useParams();
  const [joined, setJoined] = useState(false);
  const yatra = sampleYatras.find((item) => item.id === id) ?? sampleYatras[0];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJoined(true);
  }

  return (
    <main className="app-main">
      <section className="practice-page" aria-labelledby="join-yatra-heading">
        <header className="practice-page-header">
          <div>
            <p className="section-kicker">Yatra</p>
            <h1 id="join-yatra-heading">Join {yatra.name}</h1>
          </div>
          <Link className="quiet-link" to="/yatras">
            Cancel
          </Link>
        </header>

        <form className="practice-form" onSubmit={submit}>
          <button className="floating-save" type="submit">
            <i className="icon-tick" aria-hidden="true" /> Join Yatra
          </button>
          {joined ? <p className="practice-note">Joined locally; backend join is next wiring step.</p> : null}
        </form>
      </section>
    </main>
  );
}
