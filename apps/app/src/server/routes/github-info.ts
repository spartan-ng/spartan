import { defineEventHandler } from 'h3';

const githubCache = new Map<string, { data: any; timestamp: number }>();
const ONE_DAY = 1000 * 60 * 60 * 24;

async function fetchGithubRepo(owner: string, repo: string) {
	const cacheKey = `${owner}/${repo}`;
	const cached = githubCache.get(cacheKey);

	if (cached && Date.now() - cached.timestamp < ONE_DAY) {
		return cached.data;
	}

	const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.statusText}`);
	}
	const data = await response.json();

	githubCache.set(cacheKey, { data, timestamp: Date.now() });

	return data;
}

export default defineEventHandler(async () => {
	if (process.env['NODE_ENV'] === 'development') {
		return {
			name: 'spartan',
			full_name: 'spartan-ng/spartan',
			description: 'Cutting-edge tools powering Angular full-stack development.',
			stars: 1234,
			url: 'https://github.com/spartan-ng/spartan',
			lastFetched: new Date().toISOString(),
		};
	}
	const data = await fetchGithubRepo('spartan-ng', 'spartan');
	return {
		name: data.name,
		full_name: data.full_name,
		description: data.description,
		stars: data.stargazers_count,
		url: data.html_url,
		lastFetched: new Date().toISOString(),
	};
});
