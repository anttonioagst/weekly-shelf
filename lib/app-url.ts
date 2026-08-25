function firstHeader(request: Request, name: string): string | null {
  const value = request.headers.get(name);
  if (!value) return null;
  const first = value.split(",")[0]?.trim();
  return first || null;
}

/** Host the visitor opened — never a stale APP_URL from an old Vercel deploy. */
export function publicAppUrl(request: Request): string {
  const host = firstHeader(request, "x-forwarded-host") ?? firstHeader(request, "host");
  const protoHeader = firstHeader(request, "x-forwarded-proto");
  if (host) {
    const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
    const proto = local || protoHeader === "http" ? "http" : "https";
    return `${proto}://${host}`.replace(/\/$/, "");
  }
  const origin = firstHeader(request, "origin");
  if (origin) return origin.replace(/\/$/, "");
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
