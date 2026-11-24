import supportedUiLibraries from '../../../../../../libs/cli/src/generators/ui/supported-ui-libraries.json';
import {
	type AlgoliaDocsRecord,
	buildPageGroups,
	cleanLabel,
	type DocsSearchPage,
	findComponentPage,
	groupHits,
	scorePage,
	searchPages,
} from './docs-search';

const page = (label: string, group = 'Components', keywords: string[] = []): DocsSearchPage => ({
	key: `page:${label}`,
	label,
	url: `/${label.toLowerCase()}`,
	group,
	kind: 'page',
	keywords,
});

const record = (
	objectID: string,
	type: string,
	hierarchy: Record<string, string | null>,
	url: string,
	extra: Partial<AlgoliaDocsRecord> = {},
): AlgoliaDocsRecord => ({ objectID, type, hierarchy, url: `https://spartan.ng${url}`, ...extra });

describe('docs search', () => {
	describe('cleanLabel', () => {
		it('strips the spartan title prefix', () => {
			expect(cleanLabel('spartan/ui - Switch')).toBe('Switch');
			expect(cleanLabel('spartan/blocks - Sidebar')).toBe('Sidebar');
			expect(cleanLabel('spartan - Introduction')).toBe('Introduction');
			expect(cleanLabel(undefined)).toBe('');
		});
	});

	describe('buildPageGroups', () => {
		const groups = buildPageGroups();
		const pages = groups.flatMap((group) => group.pages);

		it('contains the components with their full url and CLI primitive', () => {
			const alertDialog = pages.find((p) => p.label === 'Alert Dialog');
			expect(alertDialog).toMatchObject({
				url: '/components/alert-dialog',
				kind: 'component',
				primitive: 'alert-dialog',
			});
		});

		it('only offers install commands the CLI supports', () => {
			const components = pages.filter((p) => p.kind === 'component');
			expect(components.length).toBeGreaterThan(0);
			for (const component of components.filter((p) => p.primitive)) {
				expect(Object.keys(supportedUiLibraries)).toContain(component.primitive);
			}
			expect(pages.find((p) => p.label === 'Data Table')?.primitive).toBeUndefined();
		});

		it('does not contain duplicate urls', () => {
			const urls = pages.map((p) => p.url);
			expect(new Set(urls).size).toBe(urls.length);
		});

		it('resolves index links to the section url', () => {
			expect(pages.find((p) => p.label === 'Forms')?.url).toBe('/forms');
		});
	});

	describe('findComponentPage', () => {
		const groups = buildPageGroups();

		it('finds the component of a page url, ignoring anchors and trailing slashes', () => {
			expect(findComponentPage(groups, '/components/switch')?.primitive).toBe('switch');
			expect(findComponentPage(groups, '/components/switch/#usage')?.primitive).toBe('switch');
		});

		it('ignores pages without a CLI primitive', () => {
			expect(findComponentPage(groups, '/components/data-table')).toBeUndefined();
			expect(findComponentPage(groups, '/documentation/installation')).toBeUndefined();
			expect(findComponentPage(groups, undefined)).toBeUndefined();
		});
	});

	describe('scorePage / searchPages', () => {
		it('ranks an exact label match above partial matches', () => {
			const pages = [page('Field'), page('Toggle Switch'), page('Switch'), page('Switcher')];
			expect(searchPages([{ label: 'Components', pages }], 'switch').map((p) => p.label)).toEqual([
				'Switch',
				'Switcher',
				'Toggle Switch',
			]);
		});

		it('matches every token across label, group and keywords', () => {
			expect(scorePage(page('Dialog'), 'components dialog')).toBeGreaterThan(0);
			expect(scorePage(page('Dialog'), 'components popover')).toBe(0);
			expect(scorePage(page('Sonner', 'Components', ['toast']), 'toast')).toBeGreaterThan(0);
		});

		it('is case and accent insensitive', () => {
			expect(scorePage(page('Switch'), 'SWITCH')).toBe(100);
			expect(scorePage(page('Résumé'), 'resume')).toBe(100);
			expect(scorePage(page('Switch'), '  Switch ')).toBe(100);
		});

		it('returns nothing for an empty query', () => {
			expect(searchPages([{ label: 'Components', pages: [page('Switch')] }], '  ')).toEqual([]);
		});
	});

	describe('groupHits', () => {
		const records: AlgoliaDocsRecord[] = [
			record('1', 'lvl2', { lvl0: 'Docs', lvl1: 'spartan/ui - Switch', lvl2: 'Usage' }, '/components/switch#usage', {
				_highlightResult: { hierarchy: { lvl2: { value: '<mark>Usage</mark>' } } },
			}),
			record('2', 'lvl1', { lvl0: 'Docs', lvl1: 'spartan/ui - Field' }, '/components/field'),
			record('3', 'content', { lvl1: 'spartan/ui - Switch', lvl2: 'Usage' }, '/components/switch#usage', {
				content: 'A <switch> control',
			}),
			record('4', 'lvl2', { lvl1: 'spartan/ui - Switch', lvl2: 'Usage' }, '/components/switch#usage'),
			record('5', 'lvl1', { lvl1: 'Page not found' }, '/nope'),
			record('6', 'lvl1', { lvl1: 'spartan/ui - Sidebar' }, '/sidebar-preview/dashboard'),
		];

		it('groups by page in relevance order and drops duplicates and ignored pages', () => {
			const groups = groupHits(records);
			expect(groups.map((g) => g.page)).toEqual(['Switch', 'Field']);
			expect(groups.map((g) => g.key)).toEqual(['/components/switch', '/components/field']);
			expect(groups[0].hits.map((h) => h.key)).toEqual(['hit:1', 'hit:3']);
		});

		it('builds relative urls, highlighted titles and breadcrumbs', () => {
			const [switchGroup] = groupHits(records);
			expect(switchGroup.hits[0]).toMatchObject({
				url: '/components/switch#usage',
				kind: 'section',
				title: '<mark>Usage</mark>',
				text: 'Usage',
				breadcrumb: 'Switch',
			});
		});

		it('escapes content that has no snippet', () => {
			const [switchGroup] = groupHits(records);
			expect(switchGroup.hits[1].title).toBe('A &#60;switch&#62; control');
			expect(switchGroup.hits[1].text).toBe('A <switch> control');
		});

		it('lists a page once, even when it is recorded under several urls', () => {
			const groups = groupHits([
				record('1', 'lvl1', { lvl0: 'Documentation', lvl1: 'spartan/blocks - Sidebar' }, '/blocks/sidebar', {
					_highlightResult: { hierarchy: { lvl1: { value: 'spartan/blocks - <mark>Side</mark>bar' } } },
				}),
				record('2', 'lvl1', { lvl0: 'Documentation', lvl1: 'spartan/blocks - Sidebar' }, '/blocks/sidebar/#sidebar-01'),
			]);
			expect(groups).toHaveLength(1);
			expect(groups[0].page).toBe('Sidebar');
			expect(groups[0].hits).toHaveLength(1);
			expect(groups[0].hits[0]).toMatchObject({
				url: '/blocks/sidebar',
				title: '<mark>Side</mark>bar',
				breadcrumb: 'Blocks',
			});
		});

		it('lists a parent route that renders its default child once', () => {
			const groups = groupHits([
				record('1', 'lvl1', { lvl1: 'spartan/blocks - Sidebar' }, '/blocks/sidebar'),
				record('2', 'lvl1', { lvl1: 'spartan/blocks - Sidebar' }, '/blocks'),
				record('3', 'lvl1', { lvl1: 'spartan/ui - Sidebar' }, '/components/sidebar'),
			]);
			expect(groups.map((g) => [g.key, g.page, g.section])).toEqual([
				['/blocks/sidebar', 'Sidebar', 'Blocks'],
				['/components/sidebar', 'Sidebar', 'Components'],
			]);
		});

		it('keeps page hits of unrelated pages that share a title', () => {
			const groups = groupHits([
				record('1', 'lvl1', { lvl1: 'spartan - Installation' }, '/documentation/installation'),
				record('2', 'lvl1', { lvl1: 'spartan - Installation' }, '/stack/installation'),
				record('3', 'lvl1', { lvl1: 'spartan - Installation' }, '/documentation/installation#cli'),
			]);
			expect(groups.map((g) => [g.key, g.hits.map((h) => h.url)])).toEqual([
				['/documentation/installation', ['/documentation/installation']],
				['/stack/installation', ['/stack/installation']],
			]);
		});

		it('strips the title prefix when it is highlighted', () => {
			const [group] = groupHits([
				record('1', 'lvl1', { lvl1: 'spartan/ui - Switch' }, '/components/switch', {
					_highlightResult: { hierarchy: { lvl1: { value: '<mark>spartan</mark>/ui - Switch' } } },
				}),
			]);
			expect(group.hits[0].title).toBe('Switch');
		});

		it('keeps pages with the same title apart and caps the hits per page', () => {
			const installation = (id: number, path: string) =>
				record(`${path}-${id}`, 'lvl2', { lvl1: 'spartan - Installation', lvl2: `Step ${id}` }, `${path}#step-${id}`);
			const groups = groupHits([
				...[1, 2, 3, 4, 5, 6].map((id) => installation(id, '/documentation/installation')),
				installation(1, '/stack/installation'),
			]);
			expect(groups.map((g) => [g.key, g.page, g.hits.length])).toEqual([
				['/documentation/installation', 'Installation', 5],
				['/stack/installation', 'Installation', 1],
			]);
			expect(groups.map((g) => g.section)).toEqual(['Documentation', 'Stack']);
		});

		it('drops page hits for pages that are already shown locally', () => {
			const groups = groupHits(records, new Set(['/components/field']));
			expect(groups.map((g) => g.page)).toEqual(['Switch']);
		});
	});
});
