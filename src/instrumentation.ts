import * as Sentry from "@sentry/nextjs";

export async function register() {
	// Resolve environment consistently
	const ENV =
		process.env.NEXT_PUBLIC_VERCEL_ENV ||
		process.env.VERCEL_ENV ||
		process.env.NODE_ENV; // fallback

	const isDev = ENV === "development";
	const isPreview = ENV === "preview";
	const isProd = ENV === "production";

	// Optional manual kill-switch
	const explicitEnabled =
		typeof process.env.NEXT_PUBLIC_SENTRY_ENABLED === "string"
			? process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true"
			: undefined;

	// Enable only in preview/prod unless explicitly overridden
	const enabled = explicitEnabled ?? (isPreview || isProd);

	// Only load Sentry configs when enabled
	if (!enabled) return;

	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("../sentry.server.config");
	}

	if (process.env.NEXT_RUNTIME === "edge") {
		await import("../sentry.edge.config");
	}
}

export const onRequestError = Sentry.captureRequestError;
