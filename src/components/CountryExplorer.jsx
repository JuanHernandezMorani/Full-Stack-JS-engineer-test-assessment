"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CountryFlag from "@/components/CountryFlag";

const PAGE_SIZES = [24, 48, 96];

function normalizeSearch(value) {
  return value.trim().toLocaleLowerCase("en");
}

export default function CountryExplorer({ initialCountries }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [sort, setSort] = useState("name-asc");
  const [pageSize, setPageSize] = useState(24);
  const [page, setPage] = useState(1);

  const regions = useMemo(
    () =>
      [...new Set(initialCountries.map((country) => country.region).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "en")),
    [initialCountries],
  );

  const filteredCountries = useMemo(() => {
    const needle = normalizeSearch(query);

    const results = initialCountries.filter((country) => {
      const matchesRegion = region === "All" || country.region === region;
      if (!matchesRegion) return false;
      if (!needle) return true;

      return [country.name, country.code, country.iso3, country.capital, country.region]
        .filter(Boolean)
        .some((value) => normalizeSearch(String(value)).includes(needle));
    });

    return results.sort((a, b) => {
      if (sort === "name-desc") return b.name.localeCompare(a.name, "en");
      if (sort === "region") {
        return (
          a.region.localeCompare(b.region, "en") ||
          a.name.localeCompare(b.name, "en")
        );
      }
      return a.name.localeCompare(b.name, "en");
    });
  }, [initialCountries, query, region, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredCountries.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * pageSize;
  const visibleCountries = filteredCountries.slice(pageStart, pageStart + pageSize);

  function resetPage(callback) {
    callback();
    setPage(1);
  }

  return (
    <section className="catalog" aria-labelledby="catalog-title">
      <div className="section-heading">
        <div>
          <span className="section-heading__eyebrow">Country catalog</span>
          <h2 id="catalog-title">Find a destination</h2>
        </div>
        <p aria-live="polite">
          <strong>{filteredCountries.length}</strong> matching entries
        </p>
      </div>

      <div className="filters" role="search" aria-label="Filter countries">
        <label className="field field--search">
          <span>Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => resetPage(() => setQuery(event.target.value))}
            placeholder="Country, code, capital or region"
            autoComplete="off"
          />
        </label>

        <label className="field">
          <span>Region</span>
          <select
            value={region}
            onChange={(event) => resetPage(() => setRegion(event.target.value))}
          >
            <option value="All">All regions</option>
            {regions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Sort</span>
          <select
            value={sort}
            onChange={(event) => resetPage(() => setSort(event.target.value))}
          >
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="region">Region</option>
          </select>
        </label>

        <label className="field">
          <span>Per page</span>
          <select
            value={pageSize}
            onChange={(event) =>
              resetPage(() => setPageSize(Number(event.target.value)))
            }
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visibleCountries.length > 0 ? (
        <div className="country-grid">
          {visibleCountries.map((country) => (
            <Link
              className="country-card"
              href={`/detail/${country.code}`}
              key={country.code}
              aria-label={`View details for ${country.name}`}
            >
              <div className="country-card__flag">
                <CountryFlag
                  countryCode={country.code}
                  countryName={country.name}
                />
              </div>
              <div className="country-card__body">
                <div className="country-card__topline">
                  <span className="country-card__code">{country.code}</span>
                  <span className="country-card__arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <h3>{country.name}</h3>
                <p>
                  {country.capital
                    ? `${country.capital} · ${country.region}`
                    : country.region}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">⌕</span>
          <h3>No countries match those filters.</h3>
          <p>Try a broader search term or switch back to all regions.</p>
        </div>
      )}

      {pageCount > 1 && (
        <nav className="pagination" aria-label="Country pages">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage === 1}
          >
            ← Previous
          </button>
          <span>
            Page <strong>{safePage}</strong> of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={safePage === pageCount}
          >
            Next →
          </button>
        </nav>
      )}
    </section>
  );
}
