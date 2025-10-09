import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
	// Add your middleware logic here
	// This middleware will run on all routes except the ones excluded by the matcher

	return NextResponse.next();
}

// Matcher with negative lookahead to exclude Sentry tunnel route
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - monitoring (Sentry tunnel route)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|monitoring).*)",
	],
};
