import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-shell centered-state">
      <div className="centered-state__icon" aria-hidden="true">
        🌍
      </div>
      <span className="section-heading__eyebrow">404</span>
      <h1>That country could not be found.</h1>
      <p>
        The code may be invalid or the upstream country catalog may not contain
        that entry.
      </p>
      <Link className="primary-button" href="/">
        Return to Country Explorer
      </Link>
    </main>
  );
}
