"use client";

import { ChevronsUpDown } from "lucide-react";
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

type PathSwitcherProps = {
	title?: string;
};

export function PathSwitcher({ title }: PathSwitcherProps = {}) {
	const pathname = usePathname();

	const paths: PathItem[] = [
		{ name: "/", path: "/", description: "Home" },
		{ name: "/projects", path: "/projects", description: "Projects" },
	];

	const currentPath = paths.find((p) => p.path === pathname) || paths[0];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="py-2 pl-3 flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary hover:bg-accent hover:cursor-pointer rounded-sm">
				<span
					className={cn(
						pathname === currentPath.path
							? "text-primary"
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
					<DropdownMenuItem key={path.path} asChild className="gap-2 p-2">
						<Link href={path.path}>
							<div className="flex flex-col">
								<span className="font-medium">{path.name}</span>
								{path.description && (
									<span className="text-xs text-muted-foreground">
										{path.description}
									</span>
								)}
							</div>
						</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
