# Country Explorer

Country Explorer is a responsive Next.js application for browsing countries, regional metadata, land borders and historical population trends.

## Features

- Search by country name, ISO code, capital or region.
- Region filtering and alphabetical or regional sorting.
- Client-side pagination with 24, 48 or 96 entries per page.
- Real country flags with an emoji fallback.
- Detailed country profiles with capital, region, income group and coordinates.
- Land-border navigation between neighboring countries.
- Historical population data from 1960 onward when available.
- Latest population and approximate ten-year growth summary.
- Responsive SVG population chart.
- Streaming detail views so core country information appears before slower datasets finish loading.
- Loading, not-found and error states.
- Keyboard focus states and reduced-motion support.
- Responsive layouts for desktop, tablet and mobile.

## Data sources

- Nager.Date supplies country identity and land-border information.
- World Bank supplies country metadata and historical population values.
- FlagCDN / Flagpedia supplies flag artwork.

Provider responses are cached and revalidated daily to keep navigation fast while maintaining current public data.

## Stack

- Next.js 16.2.11
- React 19.2.4
- JavaScript
- CSS
- React Server Components
- Nager.Date
- World Bank Indicators
- FlagCDN

## Requirements

- Node.js 20.9+
- npm

## Install and run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Verify

```bash
npm test
npm run build
```

On Windows you can also use:

```text
VERIFY_WINDOWS.bat
BUILD_WINDOWS.bat
RUN_WINDOWS.bat
```

## Deployment

The project is ready for a standard Vercel deployment.

## Copyright

© 2026 Juan Braian Hernández Morani. All rights reserved.
