"use client";

import { ChevronsUpDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

interface PathItem {
	name: string;
	path: string;
	description?: string;
}

function PathSwitcherItem({
	path,
	currentPath,
}: {
	path: PathItem;
	currentPath: string;
}) {
	const isExternalLink = path.path.startsWith("http");

	return (
		<DropdownMenuItem
			asChild
			className={cn("gap-2 p-2", currentPath === path.path && "bg-accent/60")}
		>
			<Link href={path.path}>
				<div className="flex flex-col">
					<div className="flex items-center gap-1">
						<span
							className={cn(
								"font-semibold",
								currentPath === path.path && "text-accent-foreground",
							)}
						>
							{path.name}
						</span>
						{isExternalLink && (
							<ExternalLink className="h-3 w-3 text-muted-foreground" />
						)}
					</div>
					{path.description && (
						<span
							className={cn(
								"text-xs text-muted-foreground",
								currentPath === path.path && "text-accent-foreground/80",
							)}
						>
							{path.description}
						</span>
					)}
				</div>
			</Link>
		</DropdownMenuItem>
	);
}

type PathSwitcherProps = {
	title?: string;
};

export function PathSwitcher({ title }: PathSwitcherProps) {
	const pathname = usePathname();

	const paths: PathItem[] = [
		{ name: "/", path: "/", description: "Home" },
		{
			name: "/projects",
			path: "/projects",
			description: "My open-source projects",
		},
	];

	const currentPath = paths.find((p) => p.path === pathname) || paths[0];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="py-2 pl-2 flex items-center gap-1 text-sm font-semibold hover:bg-accent hover:cursor-pointer rounded-sm">
				<span
					className={cn(
						pathname === currentPath.path
							? "text-foreground"
							: "text-muted-foreground",
					)}
				>
					{currentPath.name}
				</span>
				<ChevronsUpDown className="h-4 w-8 text-muted-foreground" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[200px]">
				{title && (
					<>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							{title}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
					</>
				)}
				{paths.map((path) => (
					<PathSwitcherItem
						key={path.path}
						path={path}
						currentPath={pathname}
					/>
				))}
				<PathSwitcherItem
					key="my-key"
					path={{
						name: "/ark.env",
						path: "https://yam.codes/ark.env",
						description: "⛵ Typesafe environment variables powered by ArkType",
					}}
					currentPath={pathname}
				/>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
