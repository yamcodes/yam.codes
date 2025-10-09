"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Send error to Sentry for monitoring
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<div className="flex min-h-screen flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
					<h2 className="text-2xl font-bold text-destructive">
						Something went wrong
					</h2>
					<p className="text-muted-foreground">
						{error instanceof Error
							? error.message
							: "An unexpected error occurred"}
					</p>
					<Button variant="outline" onClick={reset} className="mt-4">
						Try again
					</Button>
				</div>
			</body>
		</html>
	);
}
