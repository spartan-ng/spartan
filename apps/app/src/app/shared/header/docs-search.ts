import { pageNavs, sidenavItems } from '@spartan-ng/app/app/shared/components/navigation-items';

/** A page of the docs that is known locally (from the navigation), so it can be searched without a network request. */
export type DocsSearchPage = {
	/** Unique key, also used as the command item value. */
	key: string;
	label: string;
	url: string;
	group: string;
	kind: 'page' | 'component';
	/** The CLI primitive name for components, e.g. `alert-dialog`. */
	primitive?: string;
	keywords: string[];
};

export type DocsSearchPageGroup = {
	label: string;
	pages: DocsSearchPage[];
};

/** A full-text search hit, normalized from the Algolia (DocSearch) record. */
export type DocsSearchHit = {
	key: string;
	url: string;
	kind: 'page' | 'section' | 'content';
	/** The page the hit belongs to, e.g. `Switch`. */
	page: string;
	/** Highlighted HTML title (`<mark>` tags) - a heading or a content snippet. */
	title: string;
	/** The title as plain text. */
	text: string;
	/** Plain text breadcrumb, e.g. `Switch › Usage`. */
	breadcrumb: string;
};

export type DocsSearchHitGroup = {
	/** The page pathname - pages can share a title (e.g. the Installation docs and stack pages). */
	key: string;
	page: string;
	/** The docs section (e.g. `Blocks`), set when another group has the same page title. */
	section?: string;
	hits: DocsSearchHit[];
};

/** The subset of a DocSearch record that the search dialog reads. */
export type AlgoliaDocsRecord = {
	objectID: string;
	url: string;
	type: string;
	content?: string | null;
	hierarchy: Record<string, string | null | undefined>;
	_highlightResult?: {
		hierarchy?: Record<string, { value: string } | undefined>;
	};
	_snippetResult?: {
		content?: { value: string };
	};
};

const LEVELS = ['lvl1', 'lvl2', 'lvl3', 'lvl4', 'lvl5', 'lvl6'] as const;
const IGNORED_PATH_PREFIXES = ['/sidebar-preview', '/blocks-preview'];
const MAX_HITS_PER_PAGE = 5;
/** Component pages that document a pattern instead of a CLI primitive, so there is no install command to copy. */
export const COMPONENTS_WITHOUT_CLI_PRIMITIVE: ReadonlySet<string> = new Set(['data-table']);

/** Escapes text so it can be rendered next to Algolia's (already escaped) highlight HTML. */
export function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function stripTags(value: string): string {
	return value
		.replace(/<[^>]*>/g, '')
		.replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&');
}

/** Strip the "spartan -" / "spartan/ui -" / "spartan/blocks -" title prefix so results read cleanly in the search palette. */
export function cleanLabel(value: string | null | undefined): string {
	return (value ?? '').replace(/^spartan(\/[\w-]+)?\s*-\s*/i, '').trim();
}

/** Like `cleanLabel`, for highlighted HTML where the prefix itself can be wrapped in `<mark>` tags. */
function cleanHighlightedLabel(value: string): string {
	const tag = '(?:</?mark>)*';
	const prefix = new RegExp(`^${tag}spartan${tag}(?:/${tag}[\\w-]+${tag})?\\s*-\\s*`, 'i');
	return value.replace(prefix, '').trim();
}

function joinUrl(base: string, path: string): string {
	if (path === '/') return base;
	return `${base}${path}`.replace(/\/{2,}/g, '/');
}

/** All locally known docs pages, grouped like the side navigation. */
export function buildPageGroups(): DocsSearchPageGroup[] {
	const seen = new Set<string>();
	const toPage = (label: string, url: string, group: string, kind: DocsSearchPage['kind']): DocsSearchPage | null => {
		if (seen.has(url)) return null;
		seen.add(url);
		const slug = url.split('/').pop();
		const primitive = kind === 'component' && slug && !COMPONENTS_WITHOUT_CLI_PRIMITIVE.has(slug) ? slug : undefined;
		return {
			key: `page:${url}`,
			label,
			url,
			group,
			kind,
			primitive,
			keywords: kind === 'component' ? ['component', slug ?? ''] : [],
		};
	};

	const groups: DocsSearchPageGroup[] = [
		{
			label: 'Pages',
			pages: pageNavs
				.filter((link) => link.url !== '/')
				.map((link) => toPage(link.label, link.url, 'Pages', 'page'))
				.filter((page) => page !== null),
		},
	];

	for (const item of sidenavItems) {
		const kind = item.label === 'Components' ? 'component' : 'page';
		groups.push({
			label: item.label,
			pages: item.links
				.filter((link) => !link.wip)
				.map((link) => toPage(link.label, joinUrl(item.url, link.url), item.label, kind))
				.filter((page) => page !== null),
		});
	}

	return groups.filter((group) => group.pages.length > 0);
}

/** The component page a url points to (anchors and trailing slashes ignored), if it has a CLI primitive. */
export function findComponentPage(groups: DocsSearchPageGroup[], url: string | undefined): DocsSearchPage | undefined {
	if (!url) return undefined;
	const pathname = url.split(/[?#]/)[0].replace(/\/+$/, '');
	return groups
		.flatMap((group) => group.pages)
		.find((page) => page.kind === 'component' && page.primitive && page.url === pathname);
}

function normalize(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim();
}

/**
 * Scores how well a page matches the query. 0 means no match.
 * Every query token has to match; matches in the label rank above matches in the group or keywords.
 */
export function scorePage(page: DocsSearchPage, query: string): number {
	const tokens = normalize(query).split(/\s+/).filter(Boolean);
	if (tokens.length === 0) return 0;

	const label = normalize(page.label);
	const haystack = normalize([page.label, page.group, ...page.keywords].join(' '));
	const fullQuery = tokens.join(' ');

	if (!tokens.every((token) => haystack.includes(token))) return 0;

	if (label === fullQuery) return 100;
	if (label.startsWith(fullQuery)) return 80;
	if (label.split(/[\s-]+/).some((word) => word.startsWith(fullQuery))) return 60;
	if (label.includes(fullQuery)) return 40;
	if (tokens.every((token) => label.includes(token))) return 30;
	return 10;
}

/** The locally known pages matching the query, best match first. */
export function searchPages(groups: DocsSearchPageGroup[], query: string, limit = 8): DocsSearchPage[] {
	return groups
		.flatMap((group) => group.pages)
		.map((page, index) => ({ page, index, score: scorePage(page, query) }))
		.filter((result) => result.score > 0)
		.sort((a, b) => b.score - a.score || a.index - b.index)
		.slice(0, limit)
		.map((result) => result.page);
}

/** The docs section of a path, e.g. `Blocks` for `/blocks/sidebar`. */
function sectionOf(pathname: string): string {
	const [segment = ''] = pathname.split('/').filter(Boolean);
	return segment
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

function toRelativeUrl(url: string): URL | null {
	try {
		const parsed = new URL(url, 'https://spartan.ng');
		// `/components/card/` and `/components/card` are the same page
		if (parsed.pathname.length > 1) parsed.pathname = parsed.pathname.replace(/\/+$/, '');
		return parsed;
	} catch {
		return null;
	}
}

function isSearchable(record: AlgoliaDocsRecord, url: URL): boolean {
	const isPageNotFound = Object.values(record.hierarchy).some((value) =>
		value?.toLowerCase().includes('page not found'),
	);
	return (
		url.hash !== '#spartan-main' &&
		url.pathname !== '/' &&
		!isPageNotFound &&
		// iframe-only preview routes are indexed by the crawler but should not surface in search
		!IGNORED_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))
	);
}

function toHit(record: AlgoliaDocsRecord, url: URL): DocsSearchHit | null {
	const page = cleanLabel(record.hierarchy['lvl1']);
	if (!page) return null;

	const headings = LEVELS.map((lvl) => record.hierarchy[lvl])
		.filter((value): value is string => !!value)
		.map(cleanLabel);
	const highlight = (lvl: string) => record._highlightResult?.hierarchy?.[lvl]?.value;
	const base = { key: `hit:${record.objectID}`, url: url.pathname + url.hash, page };

	if (record.type === 'content') {
		const snippet = record._snippetResult?.content?.value ?? escapeHtml(record.content ?? '');
		const text = stripTags(snippet).trim();
		if (!text) return null;
		return { ...base, kind: 'content', title: snippet, text, breadcrumb: headings.join(' › ') };
	}

	// DocSearch sets `type` to the record's heading level (`lvl1` - `lvl6`) for heading records
	const level = record.type;
	if (level === 'lvl1') {
		return {
			...base,
			// a page hit opens the page itself, not an anchor the crawler happened to record
			url: url.pathname,
			kind: 'page',
			title: cleanHighlightedLabel(highlight('lvl1') ?? escapeHtml(page)),
			text: page,
			// the crawler's lvl0 is the same ("Documentation") for every page, the section tells them apart
			breadcrumb: sectionOf(url.pathname) || cleanLabel(record.hierarchy['lvl0']),
		};
	}

	const heading = record.hierarchy[level];
	if (!heading) return null;
	return {
		...base,
		kind: 'section',
		title: highlight(level) ?? escapeHtml(heading),
		text: heading,
		breadcrumb: headings.slice(0, -1).join(' › '),
	};
}

/** Whether two paths show the same page - the same path, or a parent route and its default child. */
function isSamePage(a: string, b: string): boolean {
	return a === b || b.startsWith(`${a}/`) || a.startsWith(`${b}/`);
}

/**
 * Normalizes the Algolia records and groups them by page.
 * Keeps Algolia's relevance order (a page is ranked by its best hit), drops duplicates and
 * page hits for pages already shown in the local results.
 */
export function groupHits(
	records: AlgoliaDocsRecord[],
	excludePageUrls: ReadonlySet<string> = new Set(),
): DocsSearchHitGroup[] {
	const groups: { group: DocsSearchHitGroup; seen: Set<string> }[] = [];

	for (const record of records) {
		const url = toRelativeUrl(record.url);
		if (!url || !isSearchable(record, url)) continue;

		const hit = toHit(record, url);
		if (!hit) continue;
		if (hit.kind === 'page' && excludePageUrls.has(url.pathname)) continue;

		// A page can be recorded under several urls: different anchors, or a parent route that renders its
		// default child (`/stack` shows "Overview"). Merge those, but keep unrelated pages that share a title.
		let entry = groups.find(({ group }) => group.page === hit.page && isSamePage(group.key, url.pathname));
		if (!entry) {
			entry = { group: { key: url.pathname, page: hit.page, hits: [] }, seen: new Set() };
			groups.push(entry);
		}

		const dedupeKey = hit.kind === 'page' ? 'page' : `${url.hash}|${hit.text}`;
		if (entry.seen.has(dedupeKey)) continue;
		entry.seen.add(dedupeKey);
		if (entry.group.hits.length < MAX_HITS_PER_PAGE) entry.group.hits.push(hit);
	}

	const titleCounts = new Map<string, number>();
	for (const { group } of groups) titleCounts.set(group.page, (titleCounts.get(group.page) ?? 0) + 1);
	return groups.map(({ group }) =>
		(titleCounts.get(group.page) ?? 0) > 1 ? { ...group, section: sectionOf(group.key) } : group,
	);
}
