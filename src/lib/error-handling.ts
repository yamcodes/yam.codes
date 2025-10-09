import * as Sentry from "@sentry/nextjs";

export class AppError extends Error {
	constructor(
		message: string,
		public code: string,
		public statusCode = 500,
		public metadata?: Record<string, unknown>,
	) {
		super(message);
		this.name = "AppError";
	}
}

export class GitHubAPIError extends AppError {
	constructor(message: string, metadata?: Record<string, unknown>) {
		super(message, "GITHUB_API_ERROR", 500, metadata);
		this.name = "GitHubAPIError";
	}
}

export class RateLimitError extends GitHubAPIError {
	constructor(message = "GitHub API rate limit exceeded") {
		super(message, { retryAfter: 60 }); // Default retry after 60 seconds
		this.name = "RateLimitError";
		this.statusCode = 429;
	}
}

export class NotFoundError extends GitHubAPIError {
	constructor(message = "Resource not found") {
		super(message);
		this.name = "NotFoundError";
		this.statusCode = 404;
	}
}

// Centralized error logging function
export const logError = (
	error: Error,
	context: Record<string, unknown> = {},
) => {
	// Add context to Sentry
	Sentry.withScope((scope) => {
		// Set the error level based on error type
		if (error instanceof RateLimitError) {
			scope.setLevel("warning");
		} else if (error instanceof NotFoundError) {
			scope.setLevel("info");
		} else {
			scope.setLevel("error");
		}

		// Add context as extra data
		for (const [key, value] of Object.entries(context)) {
			scope.setExtra(key, value);
		}

		// Add custom tags for better filtering in Sentry
		if (error instanceof AppError) {
			scope.setTag("error.code", error.code);
			scope.setTag("error.statusCode", error.statusCode);
			scope.setTag("error.type", error.name);
		}

		// Capture the error
		Sentry.captureException(error);
	});

	// Also log to console in development
	if (process.env.NODE_ENV === "development") {
		console.error("[Error]", {
			name: error.name,
			message: error.message,
			stack: error.stack,
			...context,
			timestamp: new Date().toISOString(),
		});
	}
};
// Helper to handle GitHub API errors
export const handleGitHubError = (
	error: unknown,
	context: Record<string, unknown> = {},
) => {
	if (error instanceof AppError) {
		logError(error, context);
		return error;
	}

	if (error instanceof Error) {
		// Handle specific GitHub API error cases
		if (error.message.includes("rate limit")) {
			const rateLimitError = new RateLimitError();
			logError(rateLimitError, { ...context, originalError: error });
			return rateLimitError;
		}

		if (error.message.includes("Not Found")) {
			const notFoundError = new NotFoundError();
			logError(notFoundError, { ...context, originalError: error });
			return notFoundError;
		}

		// Generic GitHub API error
		const githubError = new GitHubAPIError(error.message, {
			...context,
			originalError: error,
		});
		logError(githubError, context);
		return githubError;
	}

	// Unknown error type
	const unknownError = new AppError(
		"An unknown error occurred",
		"UNKNOWN_ERROR",
		500,
		{ originalError: error },
	);
	logError(unknownError, context);
	return unknownError;
};
