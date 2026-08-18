import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CountryFlag from "@/components/CountryFlag";
import PopulationChart from "@/components/PopulationChart";
import {
  getCountryBorders,
  getCountrySummary,
  getPopulationHistory,
} from "@/lib/countries.mjs";
import {
  calculateGrowthRate,
  formatPopulation,
} from "@/lib/country-utils.mjs";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const country = await getCountrySummary(id);

  if (!country) {
    return {
      title: "Country not found",
    };
  }

  return {
    title: country.name,
    description: `Country profile for ${country.name}: region, borders and historical population data.`,
  };
}

function MetricFallback({ label }) {
  return (
    <article className="metric-card metric-card--loading" aria-label={`${label} loading`}>
      <span>{label}</span>
      <div className="metric-skeleton" />
      <div className="metric-skeleton metric-skeleton--small" />
    </article>
  );
}

async function PopulationMetric({ code }) {
  const populationData = await getPopulationHistory(code);
  const latestPopulation =
    populationData.length > 0 ? populationData[populationData.length - 1] : null;
  const growthRate = calculateGrowthRate(populationData, 10);

  return (
    <article className="metric-card">
      <span>Latest population</span>
      <strong>
        {latestPopulation ? formatPopulation(latestPopulation.value) : "Unavailable"}
      </strong>
      <small>
        {latestPopulation
          ? `${latestPopulation.year}${growthRate == null ? "" : ` · ${growthRate >= 0 ? "+" : ""}${growthRate.toFixed(1)}% over ~10 years`}`
          : "No historical series returned"}
      </small>
    </article>
  );
}

async function BorderMetric({ code }) {
  const { borders } = await getCountryBorders(code);

  return (
    <article className="metric-card">
      <span>Land borders</span>
      <strong>{borders.length}</strong>
      <small>{borders.length === 1 ? "neighboring country" : "neighboring countries"}</small>
    </article>
  );
}

async function BordersPanel({ code }) {
  const { borders } = await getCountryBorders(code);

  return (
    <article className="detail-panel">
      <div className="section-heading section-heading--compact">
        <div>
          <span className="section-heading__eyebrow">Neighbors</span>
          <h2>Border countries</h2>
        </div>
      </div>

      {borders.length > 0 ? (
        <div className="border-list">
          {borders.map((border) => (
            <Link href={`/detail/${border.code}`} key={border.code}>
              <CountryFlag countryCode={border.code} countryName={border.name} />
              <span>{border.name}</span>
              <small>{border.code}</small>
            </Link>
          ))}
        </div>
      ) : (
        <div className="panel-empty">
          No land-border data is available for this country.
        </div>
      )}
    </article>
  );
}

async function PopulationSection({ code }) {
  const populationData = await getPopulationHistory(code);
  return <PopulationChart populationData={populationData} />;
}

export default async function CountryDetailPage({ params }) {
  const { id } = await params;
  const code = String(id || "").toUpperCase();
  const country = await getCountrySummary(code);

  if (!country) {
    notFound();
  }

  return (
    <main className="site-shell site-shell--detail">
      <Link className="back-link" href="/">
        <span aria-hidden="true">←</span>
        Back to all countries
      </Link>

      <section className="country-hero">
        <div className="country-hero__flag">
          <CountryFlag countryCode={country.code} countryName={country.name} large />
        </div>
        <div className="country-hero__content">
          <div className="country-hero__codes">
            <span>{country.code}</span>
            {country.iso3 && <span>{country.iso3}</span>}
          </div>
          <h1>{country.name}</h1>
          <p className="country-hero__summary">
            {country.capital ? `${country.capital}, ` : ""}
            {country.region}
          </p>
        </div>
      </section>

      <section className="metric-grid" aria-label={`${country.name} summary`}>
        <article className="metric-card">
          <span>Region</span>
          <strong>{country.region || "Other"}</strong>
          <small>{country.incomeLevel || "Income group unavailable"}</small>
        </article>

        <article className="metric-card">
          <span>Capital</span>
          <strong>{country.capital || "Unavailable"}</strong>
          <small>{country.iso3 || country.code}</small>
        </article>

        <Suspense fallback={<MetricFallback label="Latest population" />}>
          <PopulationMetric code={country.code} />
        </Suspense>

        <Suspense fallback={<MetricFallback label="Land borders" />}>
          <BorderMetric code={country.code} />
        </Suspense>
      </section>

      <section className="detail-layout">
        <article className="detail-panel">
          <div className="section-heading section-heading--compact">
            <div>
              <span className="section-heading__eyebrow">Geography</span>
              <h2>Country details</h2>
            </div>
          </div>

          <dl className="detail-list">
            <div>
              <dt>Capital</dt>
              <dd>{country.capital || "Unavailable"}</dd>
            </div>
            <div>
              <dt>Region</dt>
              <dd>{country.region || "Unavailable"}</dd>
            </div>
            <div>
              <dt>Income group</dt>
              <dd>{country.incomeLevel || "Unavailable"}</dd>
            </div>
            <div>
              <dt>Coordinates</dt>
              <dd>
                {country.latitude && country.longitude
                  ? `${country.latitude}, ${country.longitude}`
                  : "Unavailable"}
              </dd>
            </div>
          </dl>
        </article>

        <Suspense
          fallback={
            <article className="detail-panel detail-panel--loading" aria-label="Border countries loading">
              <div className="skeleton skeleton--eyebrow" />
              <div className="detail-skeleton" />
              <div className="detail-skeleton" />
              <div className="detail-skeleton" />
            </article>
          }
        >
          <BordersPanel code={country.code} />
        </Suspense>
      </section>

      <Suspense
        fallback={
          <div className="chart-card chart-card--loading" aria-label="Population history loading">
            <div className="skeleton skeleton--eyebrow" />
            <div className="chart-skeleton" />
          </div>
        }
      >
        <PopulationSection code={country.code} />
      </Suspense>

      <footer className="site-footer site-footer--detail">
        <p>
          Country data: Nager.Date and World Bank. Flags provided by FlagCDN / Flagpedia.
        </p>
        <p>© 2026 Juan Braian Hernández Morani. All rights reserved.</p>
      </footer>
    </main>
  );
}
