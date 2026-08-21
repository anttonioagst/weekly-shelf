import { InputError } from "@/lib/identity";
import { previewListing } from "@/lib/preview";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { url?: string } | null;
  const url = body?.url ?? "";
  try {
    const preview = await previewListing(url);
    return NextResponse.json(preview);
  } catch (error) {
    const message =
      error instanceof InputError
        ? error.message
        : "Need a live App Store, Play Store, or website URL.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
