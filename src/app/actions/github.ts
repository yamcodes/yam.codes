"use server";

import { GraphQLClient, gql } from "graphql-request";
import {
	GitHubAPIError,
	NotFoundError,
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

// Cache for repository data
const REPO_CACHE = new Map<string, RepositoryResponse["repository"]>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limit tracking
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // Minimum 100ms between requests

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

// Helper to handle rate limiting
const waitForRateLimit = async () => {
	const now = Date.now();
	const timeSinceLastRequest = now - lastRequestTime;
	if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
		await new Promise((resolve) =>
			setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest),
		);
	}
	lastRequestTime = Date.now();
};

// Helper to handle retries with exponential backoff
const withRetry = async <T>(
	operation: () => Promise<T>,
	maxRetries = 3,
	initialDelay = 1000,
): Promise<T> => {
	let lastError: Error | null = null;

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error as Error;
			if (error instanceof RateLimitError) {
				const retryAfter =
					((error as RateLimitError).metadata?.retryAfter as number) ||
					initialDelay * 2 ** attempt;
				await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
			} else if (attempt < maxRetries - 1) {
				await new Promise((resolve) =>
					setTimeout(resolve, initialDelay * 2 ** attempt),
				);
			}
		}
	}

	throw lastError;
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
		await waitForRateLimit();
		const client = createGitHubClient();
		const response = await withRetry(() =>
			client.request<PinnedReposResponse>(PINNED_REPOS_QUERY),
		);

		if (!response?.user?.pinnedItems?.nodes) {
			throw new GitHubAPIError(
				"Invalid response format from GitHub GraphQL API",
				{ response },
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

const fetchRepository = async (
	owner: string,
	name: string,
): Promise<GitHubRepo> => {
	const cacheKey = `${owner}/${name}`;
	const cached = REPO_CACHE.get(cacheKey);

	if (cached) {
		return {
			name: cached.name,
			description: cached.description,
			html_url: cached.url,
			topics: cached.topics.nodes.map((node) => node.topic.name),
			homepage: cached.homepageUrl,
			fork: false,
		};
	}

	try {
		await waitForRateLimit();
		const client = createGitHubClient();
		const response = await withRetry(() =>
			client.request<RepositoryResponse>(REPO_QUERY, { owner, name }),
		);

		if (!response?.repository) {
			throw new NotFoundError(`Repository not found: ${owner}/${name}`);
		}

		// Cache the response
		REPO_CACHE.set(cacheKey, response.repository);
		setTimeout(() => REPO_CACHE.delete(cacheKey), CACHE_TTL);

		return {
			name: response.repository.name,
			description: response.repository.description,
			html_url: response.repository.url,
			topics: response.repository.topics.nodes.map((node) => node.topic.name),
			homepage: response.repository.homepageUrl,
			fork: false,
		};
	} catch (error) {
		throw handleGitHubError(error, {
			operation: "fetchRepository",
			repository: cacheKey,
		});
	}
};

export const fetchProjects = async (): Promise<Project[]> => {
	try {
		const pinnedRepos = await fetchPinnedRepos();

		// Fetch repositories sequentially to respect rate limits
		const repos = [];
		for (const { name, owner } of pinnedRepos) {
			try {
				const repo = await fetchRepository(owner, name);
				repos.push(repo);
			} catch (error) {
				console.error(`Failed to fetch repository ${owner}/${name}:`, error);
				// Skip failed repositories
			}
		}

		return repos.map((repo) => ({
			title: repo.name,
			description: repo.description || "No description available",
			tags: repo.topics || [],
			links: {
				github: repo.html_url,
				live: repo.homepage || undefined,
			},
		}));
	} catch (error) {
		throw handleGitHubError(error, { operation: "fetchProjects" });
	}
};
