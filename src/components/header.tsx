"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "~/components/mode-toggle";
import { cn } from "~/lib/utils";

export default function Header() {
	const pathname = usePathname();

	const navItems = [
		{ name: "Home", path: "/" },
		{ name: "Projects", path: "/projects" },
	];

	return (
		<header className="border-b">
			<div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
				<nav className="flex items-center space-x-6">
					{navItems.map((item) => (
						<Link
							key={item.path}
							href={item.path}
							className={cn(
								"text-sm font-medium transition-colors hover:text-primary",
								pathname === item.path
									? "text-primary"
									: "text-muted-foreground",
							)}
						>
							{item.name}
						</Link>
					))}
				</nav>

				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-3">
						<a
							href="https://github.com/alexmorgan"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Github size={20} />
							<span className="sr-only">GitHub</span>
						</a>
						<a
							href="https://twitter.com/alexmorgan"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Twitter size={20} />
							<span className="sr-only">Twitter</span>
						</a>
						<a
							href="https://linkedin.com/in/alexmorgan"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Linkedin size={20} />
							<span className="sr-only">LinkedIn</span>
						</a>
					</div>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
