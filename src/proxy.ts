import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  // Minimal test proxy — does Vercel run this at all?
  console.log("[proxy] hit:", request.nextUrl.pathname);
  return NextResponse.json({ ok: true, path: request.nextUrl.pathname });
}

export const config = {
  matcher: ["/admin(.*)"],
};
