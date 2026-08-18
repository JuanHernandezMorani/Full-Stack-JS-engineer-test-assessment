"use client";

export default function ErrorPage({ reset }) {
  return (
    <main className="site-shell centered-state">
      <div className="centered-state__icon" aria-hidden="true">
        ⚠
      </div>
      <span className="section-heading__eyebrow">Data unavailable</span>
      <h1>We could not load the country data.</h1>
      <p>
        A public data provider may be temporarily unavailable. Please try the
        request again in a moment.
      </p>
      <button className="primary-button" type="button" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}
