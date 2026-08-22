import { typeLabel } from "@/lib/identity";
import type { ListingType } from "@/lib/types";
import { TypeGlyph } from "./type-glyph";

export function TypeTag({ type }: { type: ListingType }) {
  return (
    <span className="type-tag">
      <TypeGlyph type={type} />
      {typeLabel(type)}
    </span>
  );
}
