import { flagEmoji } from "@/lib/country-utils.mjs";

function normalizedCode(countryCode) {
  return typeof countryCode === "string" ? countryCode.trim().toLowerCase() : "";
}

export default function CountryFlag({ countryCode, countryName, large = false }) {
  const code = normalizedCode(countryCode);
  const fallback = flagEmoji(countryCode);

  if (!/^[a-z]{2}$/.test(code)) {
    return <span className="flag-fallback">{fallback}</span>;
  }

  const width = large ? 320 : 80;
  const retinaWidth = large ? 640 : 160;

  return (
    <span className={`flag-frame${large ? " flag-frame--large" : ""}`}>
      <span className="flag-fallback" aria-hidden="true">
        {fallback}
      </span>
      <img
        src={`https://flagcdn.com/w${width}/${code}.png`}
        srcSet={`https://flagcdn.com/w${width}/${code}.png 1x, https://flagcdn.com/w${retinaWidth}/${code}.png 2x`}
        width={width}
        alt={`${countryName || countryCode} flag`}
        loading={large ? "eager" : "lazy"}
        fetchPriority={large ? "high" : "auto"}
        decoding="async"
      />
    </span>
  );
}
