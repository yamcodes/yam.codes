import { fetchProjects } from "~/app/actions/github";
import { ProjectCard } from "~/components/project-card";

const idify = (text: string) => {
	return text
		.toLowerCase() // lowercase
		.replace(/ /g, "-") // replace spaces with dashes
		.replace(/[^\w-]+/g, "") // remove non-word characters
		.replace(/^-+|-+$/g, ""); // trailing and leading dashes
};

export default async function ProjectsPage() {
	const projects = await fetchProjects();

	if (!projects.length) {
		return (
			<div className="prose prose-lg dark:prose-invert prose-zinc max-w-none">
				<div className="space-y-4">
					<h2 className="mt-0">Projects</h2>
					<p className="lead">
						A selection of my recent work and open-source contributions
					</p>
				</div>
				<div className="not-prose mt-6 p-6 rounded-lg border border-destructive/50 bg-destructive/10 text-center">
					<p className="text-muted-foreground">
						Unable to load projects at this time. Please try again later.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="prose prose-lg dark:prose-invert prose-zinc max-w-none">
			<div className="space-y-4">
				<h2 className="mt-0">Projects</h2>
				<p className="lead">
					A selection of my recent work and open-source contributions
				</p>
			</div>

			<div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
				{projects.map((project) => (
					<ProjectCard key={idify(project.title)} project={project} />
				))}
			</div>
		</div>
	);
}
