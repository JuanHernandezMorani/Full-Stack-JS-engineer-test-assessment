import "server-only";
import {
  isValidCountryCode,
  mergeCountryCatalog,
  normalizeNagerCountries,
  normalizePopulationSeries,
  normalizeWorldBankCountries,
  toCountryCode,
} from "./country-utils.mjs";

const NAGER_BASE_URL = "https://date.nager.at/api/v3";
const WORLD_BANK_BASE_URL = "https://api.worldbank.org/v2";
const REVALIDATE_SECONDS = 60 * 60 * 24;

async function fetchJson(url, label) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "force-cache",
    next: {
      revalidate: REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`${label} request failed with HTTP ${response.status}`);
  }

  return response.json();
}

export async function getCountries() {
  const [nagerResult, worldBankResult] = await Promise.allSettled([
    fetchJson(`${NAGER_BASE_URL}/AvailableCountries`, "Nager.Date countries"),
    fetchJson(
      `${WORLD_BANK_BASE_URL}/country?format=json&per_page=400`,
      "World Bank countries",
    ),
  ]);

  const nagerCountries =
    nagerResult.status === "fulfilled"
      ? normalizeNagerCountries(nagerResult.value)
      : [];
  const worldBankCountries =
    worldBankResult.status === "fulfilled"
      ? normalizeWorldBankCountries(worldBankResult.value)
      : [];

  const countries = mergeCountryCatalog(nagerCountries, worldBankCountries);

  if (countries.length === 0) {
    const causes = [
      nagerResult.status === "rejected" ? nagerResult.reason?.message : null,
      worldBankResult.status === "rejected" ? worldBankResult.reason?.message : null,
    ].filter(Boolean);

    throw new Error(
      `Country providers are currently unavailable${causes.length ? `: ${causes.join("; ")}` : ""}`,
    );
  }

  return countries;
}

export async function getCountrySummary(countryCode) {
  const code = toCountryCode(countryCode);
  if (!isValidCountryCode(code)) return null;

  const catalog = await getCountries().catch(() => []);
  const country = catalog.find((entry) => entry.code === code) || null;

  return country
    ? {
        ...country,
        officialName: country.name,
      }
    : null;
}

export async function getCountryBorders(countryCode) {
  const code = toCountryCode(countryCode);
  if (!isValidCountryCode(code)) {
    return { officialName: "", borders: [] };
  }

  const nager = await fetchJson(
    `${NAGER_BASE_URL}/CountryInfo/${encodeURIComponent(code)}`,
    `Nager.Date country ${code}`,
  ).catch(() => null);

  const borders = Array.isArray(nager?.borders)
    ? nager.borders
        .map((border) => ({
          code: toCountryCode(border?.countryCode),
          name:
            border?.commonName ||
            border?.officialName ||
            border?.countryCode ||
            "Unknown",
        }))
        .filter((border) => isValidCountryCode(border.code))
    : [];

  return {
    officialName: nager?.officialName || nager?.commonName || "",
    borders,
  };
}

export async function getCountryInfo(countryCode) {
  const code = toCountryCode(countryCode);
  if (!isValidCountryCode(code)) return null;

  const [summary, borderData] = await Promise.all([
    getCountrySummary(code),
    getCountryBorders(code),
  ]);

  if (!summary) return null;

  return {
    ...summary,
    officialName: borderData.officialName || summary.name,
    borders: borderData.borders,
  };
}

export async function getPopulationHistory(countryCode) {
  const code = toCountryCode(countryCode);
  if (!isValidCountryCode(code)) return [];

  const currentYear = new Date().getUTCFullYear();

  try {
    const payload = await fetchJson(
      `${WORLD_BANK_BASE_URL}/country/${encodeURIComponent(
        code,
      )}/indicator/SP.POP.TOTL?format=json&per_page=100&date=1960:${currentYear}`,
      `World Bank population ${code}`,
    );

    return normalizePopulationSeries(payload);
  } catch {
    return [];
  }
}
