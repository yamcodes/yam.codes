"use client";

import { ErrorBoundary } from "react-error-boundary";
import { Button } from "~/components/ui/button";

function ErrorFallback({
	error,
	resetErrorBoundary,
}: {
	error: Error;
	resetErrorBoundary: () => void;
}) {
	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
			<h2 className="text-2xl font-bold text-destructive">
				Something went wrong
			</h2>
			<p className="text-muted-foreground">
				{error instanceof Error
					? error.message
					: "An unexpected error occurred"}
			</p>
			<Button variant="outline" onClick={resetErrorBoundary} className="mt-4">
				Try again
			</Button>
		</div>
	);
}

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onReset={reset}
			onError={(error) => {
				// Log the error to your error reporting service
				console.error("Error caught by error boundary:", error);
			}}
		>
			{null}
		</ErrorBoundary>
	);
}
