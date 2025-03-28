"use server";

import { GraphQLClient, gql } from "graphql-request";
import {
	GitHubAPIError,
	NotFoundError,
	RateLimitError,
	logError,
} from "~/lib/error-handling";

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

interface PinnedReposResponse {
	user: {
		pinnedItems: {
			nodes: Array<{
				name: string;
				owner: {
					login: string;
				};
			}>;
		};
	};
}

interface RepositoryResponse {
	repository: {
		name: string;
		description: string | null;
		url: string;
		homepageUrl: string | null;
		topics: {
			nodes: Array<{
				topic: {
					name: string;
				};
			}>;
		};
	};
}

const createGitHubClient = (useToken = true) => {
	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
		"User-Agent": "yam.codes",
	};

	if (useToken && process.env.GITHUB_SCOPELESS_TOKEN) {
		headers.Authorization = `Bearer ${process.env.GITHUB_SCOPELESS_TOKEN}`;
	}

	return new GraphQLClient("https://api.github.com/graphql", { headers });
};

const PINNED_REPOS_QUERY = gql`
	query PinnedRepos {
		user(login: "yamcodes") {
			pinnedItems(first: 6, types: [REPOSITORY]) {
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

const REPO_QUERY = gql`
	query GetRepo($owner: String!, $name: String!) {
		repository(owner: $owner, name: $name) {
			name
			description
			url
			homepageUrl
			topics: repositoryTopics(first: 10) {
				nodes {
					topic {
						name
					}
				}
			}
		}
	}
`;

const fetchPinnedRepos = async (): Promise<
	{ name: string; owner: string }[]
> => {
	try {
		const client = createGitHubClient();
		const response =
			await client.request<PinnedReposResponse>(PINNED_REPOS_QUERY);

		if (!response?.user?.pinnedItems?.nodes) {
			const error = new GitHubAPIError(
				"Invalid response format from GitHub GraphQL API",
				{ response },
			);
			logError(error, { operation: "fetchPinnedRepos" });
			throw error;
		}

		return response.user.pinnedItems.nodes.map((node) => ({
			name: node.name,
			owner: node.owner.login,
		}));
	} catch (error) {
		if (error instanceof Error) {
			logError(error, { operation: "fetchPinnedRepos" });
		}
		throw error;
	}
};

export const fetchProjects = async (): Promise<Project[]> => {
	try {
		// First get the list of pinned repositories
		const pinnedRepos = await fetchPinnedRepos();

		// Then fetch full repository data for each pinned repo
		const repos = await Promise.all(
			pinnedRepos.map(async ({ name, owner }) => {
				try {
					const client = createGitHubClient();
					const response = await client.request<RepositoryResponse>(
						REPO_QUERY,
						{
							owner,
							name,
						},
					);

					if (!response?.repository) {
						const error = new NotFoundError(
							`Repository not found: ${owner}/${name}`,
						);
						logError(error, {
							operation: "fetchRepository",
							repository: `${owner}/${name}`,
						});
						throw error;
					}

					return {
						name: response.repository.name,
						description: response.repository.description,
						html_url: response.repository.url,
						topics: response.repository.topics.nodes.map(
							(node) => node.topic.name,
						),
						homepage: response.repository.homepageUrl,
						fork: false, // We don't need this for pinned repos
					};
				} catch (error) {
					if (error instanceof Error) {
						logError(error, {
							operation: "fetchRepository",
							repository: `${owner}/${name}`,
						});
					}
					throw error;
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
		if (error instanceof Error) {
			logError(error, { operation: "fetchProjects" });
		}
		throw error;
	}
};
