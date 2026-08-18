function normalizeCode(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function isIso2(value) {
  return /^[A-Z]{2}$/.test(normalizeCode(value));
}

export function flagEmoji(countryCode) {
  const code = normalizeCode(countryCode);
  if (!isIso2(code)) return "🌐";

  return String.fromCodePoint(
    ...[...code].map((character) => 127397 + character.charCodeAt(0)),
  );
}

export function normalizeWorldBankCountries(payload) {
  const rows = Array.isArray(payload) && Array.isArray(payload[1]) ? payload[1] : [];

  return rows
    .filter((row) => {
      const code = normalizeCode(row?.iso2Code);
      const regionId = row?.region?.id;
      return isIso2(code) && regionId && regionId !== "NA";
    })
    .map((row) => ({
      code: normalizeCode(row.iso2Code),
      iso3: normalizeCode(row.id),
      name: typeof row.name === "string" ? row.name.trim() : "",
      region: row?.region?.value || "Other",
      capital: row?.capitalCity || "",
      incomeLevel: row?.incomeLevel?.value || "",
      longitude: row?.longitude || "",
      latitude: row?.latitude || "",
    }))
    .filter((country) => country.name);
}

export function normalizeNagerCountries(payload) {
  if (!Array.isArray(payload)) return [];

  return payload
    .map((row) => ({
      code: normalizeCode(row?.countryCode),
      name: typeof row?.name === "string" ? row.name.trim() : "",
    }))
    .filter((country) => isIso2(country.code) && country.name);
}

export function mergeCountryCatalog(nagerCountries, worldBankCountries) {
  const merged = new Map();

  for (const country of worldBankCountries) {
    merged.set(country.code, {
      code: country.code,
      iso3: country.iso3 || "",
      name: country.name,
      region: country.region || "Other",
      capital: country.capital || "",
      incomeLevel: country.incomeLevel || "",
      longitude: country.longitude || "",
      latitude: country.latitude || "",
    });
  }

  for (const country of nagerCountries) {
    const current = merged.get(country.code);
    merged.set(country.code, {
      code: country.code,
      iso3: current?.iso3 || "",
      name: country.name || current?.name || country.code,
      region: current?.region || "Other",
      capital: current?.capital || "",
      incomeLevel: current?.incomeLevel || "",
      longitude: current?.longitude || "",
      latitude: current?.latitude || "",
    });
  }

  return [...merged.values()].sort((a, b) => a.name.localeCompare(b.name, "en"));
}

export function normalizePopulationSeries(payload) {
  const rows = Array.isArray(payload) && Array.isArray(payload[1]) ? payload[1] : [];

  return rows
    .map((row) => ({
      year: Number.parseInt(row?.date, 10),
      value:
        row?.value == null
          ? Number.NaN
          : typeof row.value === "number"
            ? row.value
            : Number(row.value),
    }))
    .filter(
      (entry) =>
        Number.isInteger(entry.year) &&
        Number.isFinite(entry.value) &&
        entry.value >= 0,
    )
    .sort((a, b) => a.year - b.year);
}

export function calculateGrowthRate(series, yearsBack = 10) {
  if (!Array.isArray(series) || series.length < 2) return null;

  const latest = series[series.length - 1];
  const targetYear = latest.year - yearsBack;
  const earlier =
    [...series].reverse().find((entry) => entry.year <= targetYear) || series[0];

  if (!earlier || earlier.value <= 0 || earlier.year === latest.year) return null;

  return ((latest.value - earlier.value) / earlier.value) * 100;
}

export function formatPopulation(value) {
  if (!Number.isFinite(value)) return "Unavailable";
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function formatCompactPopulation(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function isValidCountryCode(value) {
  return isIso2(value);
}

export function toCountryCode(value) {
  return normalizeCode(value);
}
