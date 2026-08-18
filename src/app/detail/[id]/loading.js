export default function CountryDetailLoading() {
  return (
    <main className="site-shell site-shell--detail" aria-label="Loading country details">
      <div className="skeleton skeleton--eyebrow" />
      <section className="country-hero country-hero--loading" aria-hidden="true">
        <div className="skeleton detail-flag-skeleton" />
        <div className="detail-loading-copy">
          <div className="skeleton skeleton--eyebrow" />
          <div className="skeleton detail-title-skeleton" />
          <div className="skeleton detail-copy-skeleton" />
        </div>
      </section>
      <div className="metric-grid" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="skeleton-card" key={index} />
        ))}
      </div>
    </main>
  );
}
