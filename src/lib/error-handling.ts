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
	// In development, log to console with full details
	if (process.env.NODE_ENV === "development") {
		console.error("[Error]", {
			name: error.name,
			message: error.message,
			stack: error.stack,
			...context,
			timestamp: new Date().toISOString(),
		});
	}

	// In production, we'll integrate with Sentry later
	// For now, we'll just log to the server logs
	if (process.env.NODE_ENV === "production") {
		// TODO: Integrate with Sentry
		// For now, we'll use structured logging that can be easily parsed
		const logEntry = {
			level: "error",
			name: error.name,
			message: error.message,
			...context,
			timestamp: new Date().toISOString(),
		};

		// Log in a format that can be easily parsed by log aggregation tools
		process.stdout.write(`${JSON.stringify(logEntry)}\n`);
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
