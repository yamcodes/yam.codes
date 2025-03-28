"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

export function ToggleTheme() {
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
