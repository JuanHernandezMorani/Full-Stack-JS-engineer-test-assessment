# Technical audit summary

This audit was performed before the modernization work.

## Original architecture

- Next.js 14 frontend.
- Separate Express backend.
- Sequelize + PostgreSQL.
- Nager.Date and CountriesNow upstream APIs.
- Chart.js population chart.

## Correctness defects found

### Backend

1. `GET /countries` called `createCountries()` without awaiting it.
   - The first request could return an empty list while seeding was still running.
   - Multiple concurrent requests could start multiple seed operations.

2. Country creation was not idempotent during that race.
   - `Country.create()` could insert duplicate logical countries because the model did not enforce a unique country code.

3. The `GET /countries` catch block logged errors but did not always send an HTTP response.
   - Requests could remain pending indefinitely.

4. The global Express error middleware attempted to send two responses.
   - It called `res.json(err)` before `res.status(status).send(message)`.

5. Credentialed CORS was combined with `Access-Control-Allow-Origin: *`.
   - That combination is invalid for browser credentialed requests.

6. GET-only routes accepted 50 MB URL-encoded/JSON request bodies.
   - This was unnecessary memory exposure.

7. Country-border seeding performed one remote request at a time across the full catalog.
   - Startup depended on a long serial chain of upstream requests.

8. Records from different providers were matched by human-readable country names.
   - Naming differences between providers could silently drop flags or population data.

9. The database stored a read-only copy of public provider data with no user-owned writes.
   - PostgreSQL and Sequelize were operational overhead rather than a product requirement.

### Frontend

1. The home page was a long, unstructured list without search, filters or pagination.
2. Most layout styling was inline.
3. The detail page depended entirely on the separate API deployment.
4. The population chart forced `width=1600` and `height=1100`.
   - This was not practical on phones or ordinary laptop widths.
5. There were no explicit loading, route-level error or not-found experiences.
6. The fallback flag was a hard-coded Bing image URL.
7. The client used Axios for server-component requests where native server-side `fetch` was enough.
8. `page.module.css` was mostly untouched starter-template CSS and was not used by the actual page.
9. The README documented technologies/configuration that did not exactly match runtime behavior.

## Repository / dependency hygiene

- `server/node_modules` was committed to Git.
- `client/.env` and `server/.env` were committed.
- The server test script referenced a tests directory that was not present in the archive.
- The included server `node_modules` was incomplete/out of sync with `package.json`.
- The project used Next.js 14, which is outside the currently supported Next.js release lines.

## Architecture decision

A separate Express/PostgreSQL backend is not required for this product.

The replacement keeps a real server layer by using Next.js Server Components and server-side `fetch`, while:

- removing the database,
- removing CORS concerns,
- removing first-request seeding,
- removing a second deployment,
- caching public provider responses in the Next.js data layer,
- preserving a single Vercel deployment.

## Modernized result

- Next.js 16.2.11.
- React 19.2.4.
- JavaScript + CSS.
- Nager.Date for country identity/borders.
- World Bank API for demographic metadata and historical population.
- Responsive SVG chart with no charting dependency.
- Client-side search/filter/sort/pagination over server-loaded data.
- Explicit loading, error and 404 states.
- Provider fallback behavior.
- Pure-function tests for normalization and calculations.
- No runtime secrets, database or separate API service.
