"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { GitHubAPIError, RateLimitError } from "~/lib/error-handling";

export default function ProjectsError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to your error reporting service
		console.error("Error in projects page:", error);
	}, [error]);

	// Handle expected errors (like API failures) with specific messages
	const errorMessage =
		error instanceof Error
			? error instanceof GitHubAPIError || error instanceof RateLimitError
				? "Failed to fetch projects from GitHub. Please try again later."
				: error.message
			: "An unexpected error occurred";

	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
			<h2 className="text-2xl font-bold text-destructive">
				Failed to load projects
			</h2>
			<p className="text-muted-foreground">{errorMessage}</p>
			<Button variant="outline" onClick={reset} className="mt-4">
				Try again
			</Button>
		</div>
	);
}
