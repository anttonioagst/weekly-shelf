import type { ListingType } from "@/lib/types";

export function TypeGlyph({ type }: { type: ListingType }) {
  const label = type === "ios" ? "iOS" : type === "android" ? "Android" : "Site";
  return (
    <svg
      className="type-glyph"
      viewBox="0 0 16 16"
      width="12"
      height="12"
      aria-hidden="true"
      focusable="false"
    >
      <title>{label}</title>
      {type === "ios" ? (
        <rect x="3" y="1.5" width="10" height="13" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      ) : type === "android" ? (
        <>
          <rect x="3.5" y="5" width="9" height="8.5" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M6 5V3.2M10 5V3.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 2.8v10.4M3.2 8h9.6M4.4 5.2c2.2 1 5 1 7.2 0M4.4 10.8c2.2-1 5-1 7.2 0" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </>
      )}
    </svg>
  );
}
