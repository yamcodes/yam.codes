import { ProjectCard } from "~/components/project-card";

import projects from "~/data/projects.json";

export default function ProjectsPage() {
	return (
		<div className="container max-w-6xl mx-auto px-4 py-12 md:py-24">
			<div className="space-y-8">
				<div className="space-y-4">
					<h1 className="text-4xl font-bold tracking-tight">Projects</h1>
					<p className="text-xl text-muted-foreground">
						A selection of my recent work and open-source contributions
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
					{projects.map((project, index) => (
						<ProjectCard key={project.title} project={project} />
					))}
				</div>
			</div>
		</div>
	);
}
