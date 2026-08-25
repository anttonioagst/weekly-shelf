import { LinkSimpleIcon } from "@phosphor-icons/react/ssr";
import AppStore from "@thesvg/react/app-store";
import GooglePlay from "@thesvg/react/google-play";
import type { ListingType } from "@/lib/types";

export function BrandMark({
  type,
  size = 14,
  tone = "mono",
}: {
  type: ListingType;
  size?: number;
  tone?: "mono" | "color";
}) {
  const className = tone === "mono" ? "brand-mark brand-mark-mono" : "brand-mark";
  const variant = tone === "mono" ? "mono" : "default";

  if (type === "ios") {
    return (
      <AppStore
        variant={variant}
        width={size}
        height={size}
        className={className}
        aria-hidden
      />
    );
  }

  if (type === "android") {
    return (
      <GooglePlay
        variant={variant}
        width={size}
        height={size}
        className={className}
        aria-hidden
      />
    );
  }

  return <LinkSimpleIcon size={size} weight="bold" className={className} aria-hidden />;
}
