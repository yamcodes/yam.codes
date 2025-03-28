"use server";

import { GraphQLClient } from "graphql-request";
import {
	GitHubAPIError,
	RateLimitError,
	handleGitHubError,
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

	try {
		const res = await fetch(url, options);

		if (res.status === 403) {
			// rate limit reached, retry without token
			if (useToken) {
				return makeRequest(url, false, body);
			}

			throw new RateLimitError();
		}

		if (!res.ok) {
			const errorText = await res.text();
			throw new GitHubAPIError(
				`GitHub API failed: ${res.status} ${res.statusText}`,
				{ response: errorText },
			);
		}

		return res;
	} catch (error) {
		throw handleGitHubError(error, { url, method: body ? "POST" : "GET" });
	}
};

const fetchPinnedRepos = async (): Promise<
	{ name: string; owner: string }[]
> => {
	try {
		const client = new GraphQLClient("https://api.github.com/graphql", {
			headers: {
				Authorization: process.env.GITHUB_SCOPELESS_TOKEN
					? `Bearer ${process.env.GITHUB_SCOPELESS_TOKEN}`
					: "",
				"X-GitHub-Api-Version": "2022-11-28",
				"User-Agent": "yam.codes",
			},
		});

		const query = `
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

		const response = await client.request<PinnedReposResponse>(query);

		if (!response?.user?.pinnedItems?.nodes) {
			throw new GitHubAPIError(
				"Invalid response format from GitHub GraphQL API",
				{
					response,
				},
			);
		}

		return response.user.pinnedItems.nodes.map((node) => ({
			name: node.name,
			owner: node.owner.login,
		}));
	} catch (error) {
		throw handleGitHubError(error, { operation: "fetchPinnedRepos" });
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
					const response = await makeRequest(
						`https://api.github.com/repos/${owner}/${name}`,
					);
					return response.json();
				} catch (error) {
					throw handleGitHubError(error, {
						operation: "fetchRepository",
						repository: `${owner}/${name}`,
					});
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
		throw handleGitHubError(error, { operation: "fetchProjects" });
	}
};
