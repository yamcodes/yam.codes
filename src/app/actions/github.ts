"use server";

interface GitHubRepo {
	name: string;
	description: string | null;
	html_url: string;
	topics: string[];
	homepage: string | null;
	fork: boolean;
}

interface Project {
	title: string;
	description: string;
	tags: string[];
	links: {
		github?: string;
		live?: string;
		docs?: string;
	};
}

const makeRequest = async (url: string, useToken = true, body?: unknown) => {
	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
		"User-Agent": "yam.codes",
	};

	if (useToken && process.env.GITHUB_SCOPELESS_TOKEN) {
		headers.Authorization = `Bearer ${process.env.GITHUB_SCOPELESS_TOKEN}`;
	}

	if (body) {
		headers["Content-Type"] = "application/json";
	}

	const options: RequestInit = {
		headers,
	};

	if (body) {
		options.method = "POST";
		options.body = JSON.stringify(body);
	}

	const res = await fetch(url, options);

	if (res.status === 403) {
		// rate limit reached, retry without token
		if (useToken) {
			return makeRequest(url, false, body);
		}

		throw new Error(
			"Rate limit reached for both authenticated and unauthenticated requests",
		);
	}

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(
			`GitHub API failed: ${res.status} ${res.statusText} - ${errorText}`,
		);
	}

	return res;
};

const fetchPinnedRepos = async (): Promise<
	{ name: string; owner: string }[]
> => {
	const query = `
		query {
			user(login: "yamcodes") {
				pinnedItems(first: 6, types: REPOSITORY) {
					nodes {
						... on Repository {
							name
							owner {
								login
							}
						}
					}
				}
			}
		}
	`;

	try {
		const response = await makeRequest("https://api.github.com/graphql", true, {
			query,
		}).then((res) => res.json());

		console.log(
			"[GitHub API] GraphQL Response:",
			JSON.stringify(response, null, 2),
		);

		if (!response?.data?.user?.pinnedItems?.nodes) {
			console.error("[GitHub API] Invalid response format:", response);
			throw new Error("Invalid response format from GitHub GraphQL API");
		}

		return response.data.user.pinnedItems.nodes.map(
			(node: { name: string; owner: { login: string } }) => ({
				name: node.name,
				owner: node.owner.login,
			}),
		);
	} catch (error) {
		console.error("[GitHub API Error] Failed to fetch pinned repositories:", {
			error: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
		});
		return [];
	}
};

export const fetchProjects = async (): Promise<Project[]> => {
	try {
		// First get the list of pinned repositories
		const pinnedRepos = await fetchPinnedRepos();
		console.log("[GitHub API] Pinned repositories:", pinnedRepos);

		// Then fetch full repository data for each pinned repo
		const repos = await Promise.all(
			pinnedRepos.map(async ({ name, owner }) => {
				try {
					const response = await makeRequest(
						`https://api.github.com/repos/${owner}/${name}`,
					);
					return response.json();
				} catch (error) {
					console.error(
						`[GitHub API Error] Failed to fetch repository ${owner}/${name}:`,
						{
							error: error instanceof Error ? error.message : "Unknown error",
							timestamp: new Date().toISOString(),
						},
					);
					return null;
				}
			}),
		);

		// Filter out any failed fetches and transform repositories into your project format
		const projects = repos
			.filter((repo): repo is NonNullable<typeof repo> => repo !== null)
			.map((repo) => ({
				title: repo.name,
				description: repo.description || "No description available",
				tags: repo.topics || [],
				links: {
					github: repo.html_url,
					live: repo.homepage || undefined,
				},
			}));

		return projects;
	} catch (error) {
		console.error("[GitHub API Error] Failed to fetch repositories:", {
			error: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
		});

		// Return empty array on error to prevent page from breaking
		return [];
	}
};
