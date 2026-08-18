export default function LoadingPage() {
  return (
    <main className="site-shell">
      <section className="hero hero--loading" aria-label="Loading country data">
        <div className="skeleton skeleton--eyebrow" />
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--copy" />
      </section>
      <div className="loading-grid" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <div className="skeleton-card" key={index} />
        ))}
      </div>
    </main>
  );
}
