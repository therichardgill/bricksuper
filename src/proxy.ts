import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const hasSecretKey = !!process.env.CLERK_SECRET_KEY;
  const keyPrefix = process.env.CLERK_SECRET_KEY?.substring(0, 10) || "MISSING";
  const hasPubKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const pubPrefix =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 15) || "MISSING";

  console.log("[proxy] env check:", {
    hasSecretKey,
    keyPrefix,
    hasPubKey,
    pubPrefix,
  });

  // If secret key is missing, that's the problem
  if (!hasSecretKey) {
    return NextResponse.json(
      { error: "CLERK_SECRET_KEY is not set in this environment" },
      { status: 500 }
    );
  }

  // Try importing and calling clerkMiddleware dynamically
  return NextResponse.json({
    ok: true,
    hasSecretKey,
    keyPrefix,
    hasPubKey,
    pubPrefix,
    path: request.nextUrl.pathname,
  });
}

export const config = {
  matcher: ["/admin(.*)"],
};
