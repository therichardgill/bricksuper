import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request) => {
  try {
    await auth.protect();
  } catch (error) {
    console.error("[proxy] auth.protect() failed:", error);
    // Re-throw redirects (Clerk uses these for sign-in flow)
    if (error instanceof Response) throw error;
    return NextResponse.json(
      { error: "Auth error", message: String(error) },
      { status: 500 }
    );
  }
});

export const config = {
  matcher: ["/admin(.*)"],
};
