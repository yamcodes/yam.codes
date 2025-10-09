"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";

export function ToggleTheme({
	forDropdown = false,
}: {
	forDropdown?: boolean;
}) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" className="text-muted-foreground">
				<Sun size={20} />
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	const isDark = theme === "dark";

	if (forDropdown) {
		return (
			<DropdownMenuItem onClick={() => setTheme(isDark ? "light" : "dark")}>
				{isDark ? <Moon size={16} /> : <Sun size={16} />}
				Toggle theme
			</DropdownMenuItem>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setTheme(isDark ? "light" : "dark")}
					className="text-black hover:text-black/80 dark:text-white dark:hover:text-white/80"
				>
					{isDark ? <Moon size={20} /> : <Sun size={20} />}
					<span className="sr-only">Toggle theme</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				<p>Toggle theme</p>
			</TooltipContent>
		</Tooltip>
	);
}
