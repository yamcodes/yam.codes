"use client";

import {
	SiGithub as GitHub,
	SiMastodon as Mastodon,
} from "@icons-pack/react-simple-icons";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "~/components/mode-toggle";
import { PathSwitcher } from "~/components/path-switcher";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

export default function Header() {
	return (
		<header className="border-b">
			<div className="container max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Link
						href="/"
						className="text-l font-bold tracking-tight transition-colors"
					>
						yam.codes
					</Link>
					<nav className="flex items-center space-x-6">
						<PathSwitcher />
					</nav>
				</div>

				<div className="flex items-center space-x-6">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<a
									href="https://github.com/yamcodes"
									target="_blank"
									rel="noopener noreferrer"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									<GitHub size={20} />
									<span className="sr-only">GitHub</span>
								</a>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>GitHub</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<a
									href="https://mastodon.social/@yamcodes"
									target="_blank"
									rel="noopener noreferrer"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									<Mastodon size={20} />
									<span className="sr-only">Mastodon</span>
								</a>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Mastodon</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<a
									href="https://linkedin.com/in/yamyam263"
									target="_blank"
									rel="noopener noreferrer"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									<Linkedin size={20} />
									<span className="sr-only">LinkedIn</span>
								</a>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>LinkedIn</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
