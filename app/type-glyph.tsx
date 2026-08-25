import type { ListingType } from "@/lib/types";
import { BrandMark } from "./brand-mark";

export function TypeGlyph({ type }: { type: ListingType }) {
  return <BrandMark type={type} size={13} tone="mono" />;
}
