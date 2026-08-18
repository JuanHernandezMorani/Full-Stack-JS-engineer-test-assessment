import CountryExplorer from "@/components/CountryExplorer";
import { getCountries } from "@/lib/countries.mjs";

export default async function HomePage() {
  const countries = await getCountries();
  const regionCount = new Set(countries.map((country) => country.region).filter(Boolean)).size;

  return (
    <main className="site-shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="hero__eyebrow">
          <span className="hero__dot" aria-hidden="true" />
          Global country data
        </div>
        <h1 id="page-title">Explore the world, one country at a time.</h1>
        <p>
          Search countries, compare regions, follow land borders and inspect
          historical population trends in one focused global reference.
        </p>
        <div className="hero__stats" aria-label="Catalog summary">
          <div>
            <strong>{countries.length}</strong>
            <span>countries &amp; economies</span>
          </div>
          <div>
            <strong>{regionCount}</strong>
            <span>regions represented</span>
          </div>
          <div>
            <strong>1960</strong>
            <span>population history begins</span>
          </div>
        </div>
      </section>

      <CountryExplorer initialCountries={countries} />

      <footer className="site-footer">
        <p>
          Country data: Nager.Date and World Bank. Flags provided by FlagCDN / Flagpedia.
        </p>
        <p>© 2026 Juan Braian Hernández Morani. All rights reserved.</p>
      </footer>
    </main>
  );
}
