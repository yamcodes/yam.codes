import { Skeleton } from "~/components/ui/skeleton";

const SKELETON_IDS = [
	"skeleton-1",
	"skeleton-2",
	"skeleton-3",
	"skeleton-4",
] as const;

export default function ProjectsLoading() {
	return (
		<div className="space-y-20">
			<div className="space-y-9">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-6 w-96" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
				{SKELETON_IDS.map((id) => (
					<div key={id} className="space-y-4">
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="h-4 w-full" />
						<div className="flex gap-2">
							<Skeleton className="h-6 w-16" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
