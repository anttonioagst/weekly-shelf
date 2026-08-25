import { AppWindowIcon } from "@phosphor-icons/react/ssr";

export function ListingIcon({
  src,
  size,
  className,
}: {
  src?: string | null;
  size: number;
  className?: string;
}) {
  if (src) {
    return <img className={className} src={src} alt="" width={size} height={size} />;
  }

  return (
    <span className={[className, "icon-well"].filter(Boolean).join(" ")} aria-hidden>
      <AppWindowIcon size={Math.round(size * 0.48)} weight="duotone" />
    </span>
  );
}
