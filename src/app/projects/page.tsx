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

	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">Projects</h1>
				<p className="text-xl text-muted-foreground">
					A selection of my recent work and open-source contributions
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
				{projects.map((project) => (
					<ProjectCard key={idify(project.title)} project={project} />
				))}
			</div>
		</div>
	);
}
