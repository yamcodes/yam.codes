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

export function ModeToggle() {
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
				<button
					type="button"
					onClick={() => setTheme(isDark ? "light" : "dark")}
					className="text-muted-foreground hover:text-foreground hover:cursor-pointer transition-colors"
				>
					{isDark ? <Moon size={20} /> : <Sun size={20} />}
					<span className="sr-only">Toggle theme</span>
				</button>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				<p>Toggle light/dark mode</p>
			</TooltipContent>
		</Tooltip>
	);
}
