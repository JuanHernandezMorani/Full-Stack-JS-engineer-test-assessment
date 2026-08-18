import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateGrowthRate,
  flagEmoji,
  mergeCountryCatalog,
  normalizeNagerCountries,
  normalizePopulationSeries,
  normalizeWorldBankCountries,
} from "../src/lib/country-utils.mjs";

test("flagEmoji converts a valid ISO alpha-2 code", () => {
  assert.equal(flagEmoji("AR"), "🇦🇷");
  assert.equal(flagEmoji("us"), "🇺🇸");
  assert.equal(flagEmoji("not-a-code"), "🌐");
});

test("normalizes and filters World Bank country rows", () => {
  const payload = [
    { page: 1 },
    [
      {
        id: "ARG",
        iso2Code: "AR",
        name: "Argentina",
        region: { id: "LCN", value: "Latin America & Caribbean" },
        incomeLevel: { value: "Upper middle income" },
        capitalCity: "Buenos Aires",
        longitude: "-58.4173",
        latitude: "-34.6118",
      },
      {
        id: "WLD",
        iso2Code: "1W",
        name: "World",
        region: { id: "NA", value: "Aggregates" },
        incomeLevel: { value: "Aggregates" },
      },
    ],
  ];

  assert.deepEqual(normalizeWorldBankCountries(payload), [
    {
      code: "AR",
      iso3: "ARG",
      name: "Argentina",
      region: "Latin America & Caribbean",
      capital: "Buenos Aires",
      incomeLevel: "Upper middle income",
      longitude: "-58.4173",
      latitude: "-34.6118",
    },
  ]);
});

test("normalizes Nager countries and merges provider metadata by ISO code", () => {
  const nager = normalizeNagerCountries([
    { countryCode: "AR", name: "Argentina" },
    { countryCode: "", name: "Invalid" },
  ]);

  const merged = mergeCountryCatalog(nager, [
    {
      code: "AR",
      iso3: "ARG",
      name: "Argentine Republic",
      region: "Latin America & Caribbean",
      capital: "Buenos Aires",
      incomeLevel: "Upper middle income",
      longitude: "-58.4",
      latitude: "-34.6",
    },
  ]);

  assert.equal(merged.length, 1);
  assert.equal(merged[0].name, "Argentina");
  assert.equal(merged[0].capital, "Buenos Aires");
  assert.equal(merged[0].iso3, "ARG");
});

test("normalizes population history chronologically and drops null values", () => {
  const normalized = normalizePopulationSeries([
    { page: 1 },
    [
      { date: "2024", value: 47_000_000 },
      { date: "2023", value: null },
      { date: "2022", value: 46_000_000 },
    ],
  ]);

  assert.deepEqual(normalized, [
    { year: 2022, value: 46_000_000 },
    { year: 2024, value: 47_000_000 },
  ]);
});

test("calculates population growth from the closest record at least N years back", () => {
  const rate = calculateGrowthRate(
    [
      { year: 2014, value: 100 },
      { year: 2024, value: 125 },
    ],
    10,
  );

  assert.equal(rate, 25);
  assert.equal(calculateGrowthRate([{ year: 2024, value: 125 }], 10), null);
});
