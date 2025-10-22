import { publicProcedure, router } from '../trpc';

const githubCache = new Map<string, { data: any; timestamp: number }>();
const ONE_DAY = 1000 * 60 * 60 * 24;

async function fetchGithubRepo(owner: string, repo: string) {
	const cacheKey = `${owner}/${repo}`;
	const cached = githubCache.get(cacheKey);

	// ✅ Return cached data if it's still valid (within a day)
	if (cached && Date.now() - cached.timestamp < ONE_DAY) {
		return cached.data;
	}

	// ⏳ Otherwise fetch fresh data
	const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.statusText}`);
	}
	const data = await response.json();

	// 🧩 Cache the response
	githubCache.set(cacheKey, { data, timestamp: Date.now() });

	return data;
}

export const githubRouter = router({
	fetchGithub: publicProcedure.query(async () => {
		const data = await fetchGithubRepo('spartan-ng', 'spartan');
		return {
			name: data.name,
			full_name: data.full_name,
			description: data.description,
			stars: data.stargazers_count,
			url: data.html_url,
			lastFetched: new Date().toISOString(),
		};
	}),
});
