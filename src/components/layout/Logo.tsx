import { MONOGRAM_PATH, MONOGRAM_VIEWBOX } from "./monogram-path";

/** IRA monogram + DESIGNS wordmark. Colour follows `currentColor`. */
export default function Logo({
  className = "",
  wordmark = true,
  title = "IRA Designs",
}: {
  className?: string;
  wordmark?: boolean;
  title?: string;
}) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`} role="img" aria-label={title}>
      <svg viewBox={MONOGRAM_VIEWBOX} className="block h-auto w-full" aria-hidden="true">
        <path fill="currentColor" fillRule="evenodd" d={MONOGRAM_PATH} />
      </svg>
      {wordmark && (
        <span
          aria-hidden="true"
          className="mt-[0.18em] block w-full text-center font-sans font-light uppercase"
          style={{ fontSize: "0.33em", letterSpacing: "0.42em", paddingLeft: "0.42em", opacity: 0.8 }}
        >
          Designs
        </span>
      )}
    </span>
  );
}
