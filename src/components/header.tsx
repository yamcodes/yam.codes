"use client";

import {
	SiGithub as GitHub,
	SiMastodon as Mastodon,
} from "@icons-pack/react-simple-icons";
import clsx from "clsx";
import { Ellipsis, Linkedin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactElement, cloneElement } from "react";
import { PathSwitcher } from "~/components/path-switcher";
import { ToggleTheme } from "~/components/toggle-theme";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "./ui/button";

type SocialLinkProps = {
	href: string;
	icon: React.ReactNode;
	label: string;
	forDropdown?: boolean;
};

function SocialLink({
	href,
	icon,
	label,
	forDropdown = false,
}: SocialLinkProps) {
	if (forDropdown) {
		return (
			<DropdownMenuItem asChild>
				<a href={href} target="_blank" rel="noopener noreferrer">
					{cloneElement(icon as ReactElement<{ title?: string }>, {
						title: "",
					})}
					{label}
				</a>
			</DropdownMenuItem>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					asChild
					className="text-black hover:text-black/80 dark:text-white dark:hover:text-white/80"
				>
					<a
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={label}
					>
						{cloneElement(icon as ReactElement<{ title?: string }>, {
							title: "",
						})}
						<span className="sr-only">{label}</span>
					</a>
				</Button>
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
			<div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						className={clsx(
							"px-2 text-black hover:text-black/80 dark:text-white dark:hover:text-white/80",
							isHome ? "font-semibold" : "font-normal",
						)}
						asChild
					>
						<Link href="/">yam.codes</Link>
					</Button>
					<PathSwitcher />
				</div>
				<a rel="me" href="https://mastodon.social/@yamcodes" className="hidden">
					Mastodon
				</a>
				<div className="flex items-center space-x-1">
					{/* Desktop */}
					<div className="hidden md:flex">
						<div className="items-center space-x-1">
							<SocialLink
								href="https://github.com/yamcodes"
								icon={<GitHub size={24} />}
								label="GitHub"
							/>
							<SocialLink
								href="https://mastodon.social/@yamcodes"
								icon={<Mastodon size={24} />}
								label="Mastodon"
							/>
							<SocialLink
								href="https://linkedin.com/in/yamyam263"
								icon={<Linkedin size={24} />}
								label="LinkedIn"
							/>
						</div>
						<ToggleTheme />
					</div>

					{/* Mobile */}
					<div className="md:hidden">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-black hover:text-black/80 dark:text-white dark:hover:text-white/80"
								>
									<Ellipsis size={24} />
									<span className="sr-only">Social links</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<SocialLink
									href="https://github.com/yamcodes"
									icon={<GitHub size={16} />}
									label="GitHub"
									forDropdown
								/>
								<SocialLink
									href="https://mastodon.social/@yamcodes"
									icon={<Mastodon size={16} />}
									label="Mastodon"
									forDropdown
								/>
								<SocialLink
									href="https://linkedin.com/in/yamyam263"
									icon={<Linkedin size={16} />}
									label="LinkedIn"
									forDropdown
								/>
								<ToggleTheme forDropdown />
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
	);
}
