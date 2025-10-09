// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,

	replaysOnErrorSampleRate: 1.0,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

	// You can remove this option if you're not planning to use the Sentry Session Replay feature:
	integrations: [
		Sentry.replayIntegration({
			// Additional Replay configuration goes in here, for example:
			maskAllText: true,
			blockAllMedia: true,
		}),
	],

	// Define the environment
	environment: process.env.NODE_ENV,

	// Ignore specific errors
	ignoreErrors: [
		// Browser extensions
		"top.GLOBALS",
		// Random network errors
		"Network request failed",
		"NetworkError",
		"Failed to fetch",
		// Resize observer errors that are benign
		"ResizeObserver loop limit exceeded",
		"ResizeObserver loop completed with undelivered notifications.",
	],

	beforeSend(event, hint) {
		// Filter out errors from browser extensions
		if (event.request?.url?.includes("chrome-extension://")) {
			return null;
		}

		// Don't send events in development unless explicitly enabled
		if (
			process.env.NODE_ENV === "development" &&
			!process.env.NEXT_PUBLIC_SENTRY_ENABLE_DEV
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
