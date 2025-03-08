export default function Footer() {
	return (
		<footer className="border-t py-6 md:py-8">
			<div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
				<div className="text-sm text-muted-foreground">
					© {new Date().getFullYear()} Yam Borodetsky. All rights reserved.
				</div>
				<div className="text-sm text-muted-foreground mt-2 md:mt-0">
					Handmade with Next.js
				</div>
			</div>
		</footer>
	);
}
