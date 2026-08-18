import {
  formatCompactPopulation,
  formatPopulation,
} from "@/lib/country-utils.mjs";

const WIDTH = 920;
const HEIGHT = 360;
const PADDING = {
  top: 28,
  right: 28,
  bottom: 52,
  left: 78,
};

function createTicks(length, count) {
  if (length <= 0) return [];
  if (length <= count) return Array.from({ length }, (_, index) => index);

  const last = length - 1;
  return Array.from(
    new Set(
      Array.from({ length: count }, (_, index) =>
        Math.round((index * last) / (count - 1)),
      ),
    ),
  );
}

export default function PopulationChart({ populationData }) {
  if (!Array.isArray(populationData) || populationData.length === 0) {
    return (
      <div className="chart-empty">
        <span aria-hidden="true">◌</span>
        <p>No historical population series is currently available.</p>
      </div>
    );
  }

  const values = populationData.map((entry) => entry.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = Math.max(1, maxValue - minValue);
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const pointFor = (entry, index) => {
    const x =
      PADDING.left +
      (populationData.length === 1
        ? plotWidth / 2
        : (index / (populationData.length - 1)) * plotWidth);
    const y =
      PADDING.top + ((maxValue - entry.value) / range) * plotHeight;
    return { x, y };
  };

  const points = populationData.map(pointFor);
  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${
    HEIGHT - PADDING.bottom
  } L${points[0].x},${HEIGHT - PADDING.bottom} Z`;

  const xTickIndexes = createTicks(populationData.length, 6);
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    return maxValue - range * ratio;
  });

  const latest = populationData[populationData.length - 1];

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <div>
          <span className="section-heading__eyebrow">Historical series</span>
          <h2>Population over time</h2>
        </div>
        <div className="chart-card__latest">
          <span>{latest.year}</span>
          <strong>{formatPopulation(latest.value)}</strong>
        </div>
      </div>

      <div className="chart-scroll">
        <svg
          className="population-chart"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby="population-chart-title population-chart-desc"
        >
          <title id="population-chart-title">Population history</title>
          <desc id="population-chart-desc">
            Line chart showing population values from {populationData[0].year} to{" "}
            {latest.year}.
          </desc>
          <defs>
            <linearGradient id="population-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.24" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yTicks.map((tick, index) => {
            const y = PADDING.top + (index / 4) * plotHeight;
            return (
              <g key={`${tick}-${index}`}>
                <line
                  className="chart-grid-line"
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                />
                <text
                  className="chart-axis-label"
                  x={PADDING.left - 14}
                  y={y + 4}
                  textAnchor="end"
                >
                  {formatCompactPopulation(tick)}
                </text>
              </g>
            );
          })}

          <path className="chart-area" d={areaPath} />
          <path className="chart-line" d={linePath} />

          {xTickIndexes.map((index) => {
            const point = points[index];
            const entry = populationData[index];
            return (
              <g key={entry.year}>
                <circle className="chart-point" cx={point.x} cy={point.y} r="4" />
                <text
                  className="chart-axis-label"
                  x={point.x}
                  y={HEIGHT - 22}
                  textAnchor="middle"
                >
                  {entry.year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
