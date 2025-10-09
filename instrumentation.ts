import * as Sentry from "@sentry/nextjs";

export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		// Server-side configuration
		Sentry.init({
			dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for performance monitoring.
			// We recommend adjusting this value in production
			tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

			// Setting this option to true will print useful information to the console while you're setting up Sentry.
			debug: false,

			// Define the environment
			environment: process.env.NODE_ENV,

			// Ignore specific errors
			ignoreErrors: [
				// Ignore common non-critical errors
				"ECONNRESET",
				"EPIPE",
				"ETIMEDOUT",
			],

			beforeSend(event, hint) {
				// Don't send events in development unless explicitly enabled
				if (
					process.env.NODE_ENV === "development" &&
					!process.env.SENTRY_ENABLE_DEV
				) {
					console.error(
						"[Sentry] Development error captured:",
						hint.originalException,
					);
					return null;
				}

				return event;
			},

			// Capture unhandled promise rejections
			integrations: [
				Sentry.captureConsoleIntegration({
					levels: ["error", "warn"],
				}),
			],
		});
	}

	if (process.env.NEXT_RUNTIME === "edge") {
		// Edge runtime configuration
		Sentry.init({
			dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for performance monitoring.
			// We recommend adjusting this value in production
			tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

			// Setting this option to true will print useful information to the console while you're setting up Sentry.
			debug: false,

			// Define the environment
			environment: process.env.NODE_ENV,

			beforeSend(event, hint) {
				// Don't send events in development unless explicitly enabled
				if (
					process.env.NODE_ENV === "development" &&
					!process.env.SENTRY_ENABLE_DEV
				) {
					console.error(
						"[Sentry] Development error captured:",
						hint.originalException,
					);
					return null;
				}

				return event;
			},
		});
	}
}
