import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
	return (
		<div className="container max-w-4xl mx-auto px-4 py-12 md:py-24">
			<div className="space-y-8">
				<div className="space-y-4">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
						Yam Borodetsky
					</h1>
					<p className="text-xl text-muted-foreground">
						{"Full-time Software Engineer // Part-time Open Sourcerer"}
					</p>
				</div>

				<div className="space-y-6 text-lg">
					<p>
						I'm a passionate full-stack developer with over 4 years of
						professional experience. My expertise spans across the entire
						development stack, from crafting intuitive user interfaces to
						designing robust cloud systems.
					</p>

					<p>
						Currently, I'm working as a senior full stack developer at Zynga,
						where I lead the engineering of scalable platform solutions. Every
						day I tackle challenges using TypeScript, React, Node.js, NestJS,
						Firebase and Google Cloud.
					</p>

					<p>
						After I'm done coding for a living, I still code. I contribute to
						open-source projects, learn new technologies and build tools that
						solve real-world problems. I believe in clean, maintainable code and
						user-centered design principles.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 pt-4">
					<Button
						asChild
						size="lg"
						className="bg-gradient-to-br from-primary-lighter to-primary hover:scale-95 transition-transform duration-200"
					>
						<Link href="/projects">View my projects --&gt;</Link>
					</Button>
					<Button variant="outline" asChild size="lg">
						<a href="mailto:hi@yam.codes">Let's connect</a>
					</Button>
				</div>
			</div>
		</div>
	);
}
