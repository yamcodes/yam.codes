"use client";

import { Linkedin } from "lucide-react";
import { SiGithub as GitHub, SiMastodon as Mastodon } from "@icons-pack/react-simple-icons"
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
							href="https://github.com/yamcodes"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<GitHub size={20} />
							<span className="sr-only">GitHub</span>
						</a>
						<a
							href="https://mastodon.social/@yamcodes"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Mastodon size={20} />
							<span className="sr-only">Mastodon</span>
						</a>
						<a
							href="https://linkedin.com/in/yamyam263"
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
