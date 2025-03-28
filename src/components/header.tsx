"use client";

import {
	SiGithub as GitHub,
	SiMastodon as Mastodon,
} from "@icons-pack/react-simple-icons";
import clsx from "clsx";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactElement, cloneElement } from "react";
import { ModeToggle } from "~/components/mode-toggle";
import { PathSwitcher } from "~/components/path-switcher";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "./ui/button";

type SocialLinkProps = {
	href: string;
	icon: React.ReactNode;
	label: string;
};

function SocialLink({ href, icon, label }: SocialLinkProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={label}
					className="text-muted-foreground hover:text-foreground transition-colors"
				>
					{cloneElement(icon as ReactElement<{ title?: string }>, {
						title: "",
					})}
					<span className="sr-only">{label}</span>
				</a>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	);
}

export default function Header() {
	const isHome = usePathname() === "/";
	return (
		<header className="border-b">
			<div className="container max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						className={clsx("px-2", isHome ? " font-semibold" : "font-normal")}
						asChild
					>
						<Link href="/">yam.codes</Link>
					</Button>
					<PathSwitcher />
				</div>
				<a rel="me" href="https://mastodon.social/@yamcodes" className="hidden">
					Mastodon
				</a>
				<div className="flex items-center space-x-6">
					<TooltipProvider>
						<SocialLink
							href="https://github.com/yamcodes"
							icon={<GitHub size={20} />}
							label="GitHub"
						/>
						<SocialLink
							href="https://mastodon.social/@yamcodes"
							icon={<Mastodon size={20} />}
							label="Mastodon"
						/>
						<SocialLink
							href="https://linkedin.com/in/yamyam263"
							icon={<Linkedin size={20} />}
							label="LinkedIn"
						/>
						<ModeToggle />
					</TooltipProvider>
				</div>
			</div>
		</header>
	);
}
