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
		<div className="container max-w-4xl mx-auto px-4 py-12 md:py-24">
			<div className="space-y-8">
				<div className="space-y-4">
					<div>
						<h1 className="text-4xl font-bold tracking-tight">
							Yam Borodetsky
						</h1>
						<HoverCard>
							<HoverCardTrigger asChild>
								<Button
									variant="link"
									className="p-0 hover:decoration-dotted hover:cursor-help"
								>
									@yamcodes
								</Button>
							</HoverCardTrigger>
							<HoverCardContent className="w-80">
								<div className="flex justify-between space-x-4">
									<Avatar>
										<AvatarImage src="https://github.com/yamcodes.png" />
										<AvatarFallback>YB</AvatarFallback>
									</Avatar>
									<div className="space-y-1">
										<h4 className="text-sm font-semibold mb-0">
											Yam Borodetsky
										</h4>
										<h4 className="text-sm text-muted-foreground">@yamcodes</h4>
										<p className="text-sm">
											Full-time Software Engineer · Part-time Open Sourcerer
										</p>
										<div className="flex items-center pt-2">
											<BriefcaseBusiness className="mr-2 h-4 w-4 opacity-70" />{" "}
											<span className="text-xs text-muted-foreground">
												Full-Stack Developer at Zynga
											</span>
										</div>
									</div>
								</div>
							</HoverCardContent>
						</HoverCard>
					</div>
					<p className="text-l text-muted-foreground">
						Full-time Software Engineer · Part-time Open Sourcerer
					</p>
				</div>

				<div className="space-y-6 text-lg">
					<p>
						I'm a passionate full-stack developer with over 4 years of
						professional experience. My expertise spans across the entire
						development stack, from crafting intuitive user interfaces to
						designing robust cloud systems.
					</p>

					<p>
						Currently, I'm working as a full-stack developer at Zynga, where I
						lead the engineering of scalable platform solutions. Every day I
						tackle challenges using TypeScript, React, Node.js, NestJS, Firebase
						and Google Cloud.
					</p>

					<p>
						After I'm done coding for a living, I still code. I contribute to
						open-source projects, learn new technologies and build tools that
						solve real-world problems. I believe in clean, maintainable code and
						user-centered design principles.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 pt-4">
					<Button
						asChild
						size="xl"
						className="rounded-sm bg-gradient-to-br from-primary-lighter to-primary hover:scale-98 active:scale-95 transition-transform"
					>
						<Link href="/projects">View my projects --&gt;</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
