import Link from "next/link";

export default function About() {
	return (
		<main className="container mx-auto p-8">
			<h1 className="text-4xl font-bold mb-6">About Page</h1>
			<p className="mb-4">This is the about page of my website.</p>
			<Link href="/" className="text-blue-600 hover:underline">
				Back to Home
			</Link>
		</main>
	);
}
