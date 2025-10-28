import { defineEventHandler } from 'h3';

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

	const response = await fetch(`https://api.github.com/repos/spartan-ng/spartan`);
	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.statusText}`);
	}
	const data = await response.json();

	return {
		name: data.name,
		full_name: data.full_name,
		description: data.description,
		stars: data.stargazers_count,
		url: data.html_url,
		lastFetched: new Date().toISOString(),
	};
});
