import Link from "next/link";
import Image from "next/image";

export default function Home() {
	return (
		<main className="container mx-auto p-8">
			<h1 className="text-4xl font-bold mb-6">Yam Borodetsky</h1>{" "}
			<div className="rounded-full overflow-hidden w-16 h-16 border-2 border-gray-300 shadow-sm">
				<Image
					src="/pfp.jpg"
					alt="Spider-Man Avatar"
					width={64}
					height={64}
					className="object-cover"
					priority
				/>
			</div>
			<p className="mb-4">
				Hi, I'm Yam! I'm a full time Full Stack Engineer and a part-time Open
				Sourcerer.
			</p>
			<Link href="/about" className="text-blue-600 hover:underline">
				Go to About
			</Link>
		</main>
	);
}
