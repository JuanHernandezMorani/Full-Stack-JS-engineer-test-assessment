# Migration notes

## Removed

- Separate Express application.
- Sequelize models and associations.
- PostgreSQL runtime requirement.
- First-request data seeding.
- Axios on both frontend and backend.
- Chart.js / react-chartjs-2.
- Cookie/body-parser/morgan/CORS middleware.
- Tracked `server/node_modules`.
- Tracked `.env` files.
- Fixed-size 1600×1100 chart canvas.

## Replaced with

- One Next.js full-stack application.
- Server-side native `fetch`.
- Daily provider revalidation.
- Pure SVG population chart rendered without a charting runtime.
- Responsive country catalog with search/filter/sort/pagination.
- Explicit loading/error/not-found UI.
- Pure-function tests for provider normalization and population calculations.

## Original defects addressed

- `/countries` could return before `createCountries()` finished.
- Concurrent first requests could start duplicate seed operations.
- `Country.create()` had no idempotency guarantee in that race.
- `/countries` logged an exception without always sending a response.
- The global Express error handler attempted to send two responses.
- `Access-Control-Allow-Credentials: true` was combined with a wildcard origin.
- GET-only endpoints accepted unnecessary 50 MB request bodies.
- Border seeding made one external request at a time for the entire catalog.
- Population/flag records were joined to countries by provider-specific names.
- The chart used fixed 1600×1100 dimensions and was not mobile-friendly.
- The home page rendered one long, largely unstyled country list.
- `node_modules` and `.env` files were committed to the repository.
- The old Next.js 14 branch is no longer a supported Next.js release line.
