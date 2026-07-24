import { glob } from 'tinyglobby';

interface PrerenderStaticRoute {
	route: string;
	staticData: boolean;
}
type PrerenderRoute = string | PrerenderStaticRoute;

const PAGES_ROOT = 'apps/app/src/app/pages';
const REMOVE_PARENTHESES_PATH_PATTERN = /\([^()]*\)\//g;
const PAGE_EXTENSION = '.page.ts';

async function getComponentRoutes(): Promise<PrerenderRoute[]> {
	const componentRoutes = await glob('apps/app/src/app/pages/[(]components[)]/**/*.page.ts');

	const routes = componentRoutes.map((route) => ({
		route: stripTrailingIndex(removePatterns(route, [PAGES_ROOT, PAGE_EXTENSION, REMOVE_PARENTHESES_PATH_PATTERN])),
		staticData: true,
	}));
	return routes;
}

export async function getPrerenderedRoutes(staticRoutes: PrerenderRoute[] = []): Promise<PrerenderRoute[]> {
	try {
		const componentRoutes = await getComponentRoutes();

		// Combine static routes with dynamically discovered component routes
		const allRoutes = [...staticRoutes, ...componentRoutes];

		// De-duplicate by route: e.g. the components layout and its index page both resolve to `/components`.
		const seen = new Set<string>();
		const deduped: PrerenderRoute[] = [];
		for (const entry of allRoutes) {
			const route = typeof entry === 'string' ? entry : entry.route;
			if (seen.has(route)) continue;
			seen.add(route);
			deduped.push(entry);
		}
		return deduped;
	} catch (error) {
		console.error('Error discovering routes:', error);
		// Return static routes only if there's an error
		return staticRoutes;
	}
}

/**
 * Analog treats `index.page.ts` as its parent path, so a derived `/foo/index` route is really `/foo`.
 * Strip a trailing `/index` segment (falling back to the root) to avoid prerendering a bogus URL.
 */
function stripTrailingIndex(route: string): string {
	return route.replace(/\/index$/, '') || '/';
}

/**
 * Removes all occurrences of the given patterns from the input string.
 * - String patterns are treated literally (auto-escaped) and removed globally.
 * - RegExp patterns are applied globally (adds the 'g' flag if missing).
 */
export function removePatterns(input: string, patterns: Array<string | RegExp>): string {
	let result = input;

	for (const pat of patterns) {
		const rx =
			typeof pat === 'string' ? new RegExp(escapeRegExp(pat), 'g') : new RegExp(pat.source, addGlobal(pat.flags));

		result = result.replace(rx, '');
	}

	return result;
}

function escapeRegExp(literal: string): string {
	// Escapes: . * + ? ^ $ { } ( ) | [ ] \ /
	return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addGlobal(flags: string): string {
	// ensure exactly one 'g' in the flags
	return flags.includes('g') ? flags : flags + 'g';
}
