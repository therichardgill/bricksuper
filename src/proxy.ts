import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Test: does clerkMiddleware itself crash, even with an empty handler?
export default clerkMiddleware(async () => {
  // Do nothing — just let Clerk process the request
  console.log("[proxy] clerkMiddleware handler reached");
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin(.*)"],
};
