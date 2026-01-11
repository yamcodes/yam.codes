import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";

export default function Home() {
	return (
		<div className="prose prose-lg dark:prose-invert prose-zinc max-w-none">
			<div className="space-y-4">
				<div>
					<h1 className="mb-2">Yam Borodetsky</h1>
					<HoverCard>
						<HoverCardTrigger asChild>
							<Button
								variant="link"
								className="p-0 underline decoration-dotted hover:no-underline hover:cursor-help"
							>
								@yamcodes
							</Button>
						</HoverCardTrigger>
						<HoverCardContent className="w-80 not-prose">
							<div className="flex justify-between space-x-4">
								<Avatar>
									<AvatarImage src="https://github.com/yamcodes.png" />
									<AvatarFallback>YB</AvatarFallback>
								</Avatar>
								<div className="space-y-1">
									<h4 className="text-sm font-semibold mb-0">Yam Borodetsky</h4>
									<h4 className="text-sm text-muted-foreground">@yamcodes</h4>
									<p className="text-sm">
										Full-time Software Engineer · Part-time Open Sourcerer
									</p>
									<div className="flex items-center pt-2">
										<BriefcaseBusiness className="mr-2 h-4 w-4 opacity-70" />{" "}
										<span className="text-xs text-muted-foreground">
											Tech Lead at Zynga
										</span>
									</div>
								</div>
							</div>
						</HoverCardContent>
					</HoverCard>
				</div>
			</div>

			<div>
				<p>
					I'm a passionate Software Engineer specializing in full-stack web
					development. With over 4 years of professional experience, I've built
					core libraries, designed cloud systems, and developed a proven track
					record of solving tough problems with clean, maintainable code.
				</p>
				<p>
					Right now, I'm a Tech Lead at Zynga, leading the{" "}
					<a href="https://themavens.com/">mavens</a> platform engineering team.
					I focus on designing scalable internal systems and guiding our
					architecture across tools, services, and infrastructure built with
					TypeScript, React, Node.js, NestJS, Firebase, and Google Cloud.
				</p>
				<p>
					Outside of work, I stay just as curious. I contribute to open source,
					experiment with new tech, and build tools that make life easier for
					developers. I care deeply about developer experience, user-first
					design, and writing code I won't have to rewrite - or at least code that
					the Yam of six months from now won't curse me for.
				</p>
			</div>

			<div className="flex flex-col sm:flex-row gap-4 pt-4 not-prose">
				<Button
					asChild
					size="xl"
					className="rounded-sm bg-gradient-to-br from-primary-lighter to-primary hover:scale-98 active:scale-95 transition-transform"
				>
					<Link href="/projects">View my projects --&gt;</Link>
				</Button>
			</div>
		</div>
	);
}
