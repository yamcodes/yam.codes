import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: ["opengraph.githubassets.com"],
	},
	experimental: {
		instrumentationHook: true,
	},
};

// Sentry configuration options
const sentryWebpackPluginOptions = {
	// Additional config options for the Sentry webpack plugin. Keep in mind that
	// the following options are set automatically, and overriding them is not
	// recommended:
	//   release, url, configFile, stripPrefix, urlPrefix, include, ignore

	silent: true, // Suppresses all logs
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,

	// An auth token is required for uploading source maps.
	authToken: process.env.SENTRY_AUTH_TOKEN,

	// Will disable the Sentry webpack plugin in development
	disableInDevelopment: true,
};

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
