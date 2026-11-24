import { searchClient } from '@algolia/client-search';
import { Clipboard } from '@angular/cdk/clipboard';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	afterNextRender,
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	Injector,
	linkedSignal,
	PLATFORM_ID,
	resource,
	signal,
	untracked,
	viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideArrowDown,
	lucideArrowRight,
	lucideArrowUp,
	lucideCheck,
	lucideCircleDashed,
	lucideCornerDownLeft,
	lucideFileText,
	lucideFileWarning,
	lucideHash,
	lucideHistory,
	lucideSearch,
	lucideText,
} from '@ng-icons/lucide';
import { BrnCommand } from '@spartan-ng/brain/command';
import type { BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports, HlmCommandInput } from '@spartan-ng/helm/command';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { CLIModeService } from '../cli-mode.service';
import {
	type AlgoliaDocsRecord,
	buildPageGroups,
	type DocsSearchHit,
	type DocsSearchPage,
	findComponentPage,
	groupHits,
	searchPages,
} from './docs-search';

type RecentEntry = { url: string; label: string; group: string };

type SearchEntry =
	| { type: 'page'; key: string; page: DocsSearchPage }
	| { type: 'hit'; key: string; hit: DocsSearchHit }
	| { type: 'recent'; key: string; recent: RecentEntry };

type SearchGroup = {
	/** Unique key - several pages can share a title. */
	key: string;
	label: string;
	entries: SearchEntry[];
	/** Show the navigation group (e.g. "Components") next to page entries. */
	showPageGroup?: boolean;
};

const RECENT_STORAGE_KEY = 'spartan-docs-search-recent';
const MAX_RECENT = 5;
const SEARCH_DEBOUNCE_MS = 200;
const COPY_FEEDBACK_MS = 1500;
/** Fallback in case the dialog never releases the scroll lock (e.g. another overlay keeps it). */
const SCROLL_UNLOCK_TIMEOUT_MS = 1000;
/** The class the CDK block scroll strategy puts on `<html>` while a dialog is open. */
const SCROLL_BLOCK_CLASS = 'cdk-global-scrollblock';

@Component({
	selector: 'spartan-docs-dialog',
	imports: [HlmButtonImports, HlmKbdImports, HlmCommandImports, HlmSeparatorImports, NgIcon],
	providers: [
		provideIcons({
			lucideSearch,
			lucideCornerDownLeft,
			lucideArrowRight,
			lucideArrowUp,
			lucideArrowDown,
			lucideCircleDashed,
			lucideHash,
			lucideText,
			lucideFileText,
			lucideFileWarning,
			lucideHistory,
			lucideCheck,
		}),
	],
	host: {
		'(window:keydown)': '_onWindowKeyDown($event)',
	},
	template: `
		<button
			hlmBtn
			variant="outline"
			class="bg-input/30 border-input/30 text-muted-foreground hover:bg-input/50 hover:text-muted-foreground relative h-8 w-full justify-start gap-2 pl-2.5 font-normal shadow-none active:translate-y-px sm:pr-12 md:w-48 lg:w-60 xl:w-64"
			(click)="_open()"
		>
			<ng-icon name="lucideSearch" class="shrink-0 opacity-50" />
			<span class="hidden lg:inline-flex">Search documentation...</span>
			<span class="inline-flex lg:hidden">Search...</span>
			<div class="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
				<kbd hlmKbdGroup>
					<kbd hlmKbd class="hidden [html[style*='--is-mac']_&]:inline-flex">⌘</kbd>
					<kbd hlmKbd class="[html[style*='--is-mac']_&]:hidden">Ctrl</kbd>
					<kbd hlmKbd>K</kbd>
				</kbd>
			</div>
		</button>

		<hlm-command-dialog
			title="Search documentation"
			description="Search for a page, component or section of the documentation"
			[state]="_state()"
			(stateChange)="_state.set($event)"
			dialogContentClass="border-ring/50 w-[calc(100vw-2rem)] rounded-xl! border-4 p-1 pb-11 sm:max-w-lg"
		>
			<hlm-command
				class="min-h-[400px] w-full"
				[filter]="_noopFilter"
				[(search)]="_search"
				(keydown)="_onCommandKeyDown($event)"
			>
				<hlm-command-input placeholder="Search documentation..." />

				<hlm-command-list class="max-h-[min(60vh,420px)] min-h-80">
					<!-- every item is rendered inline (no ngTemplateOutlet) so the command's keyboard order matches the visual order -->
					@for (group of _groups(); track group.key) {
						<hlm-command-group>
							<hlm-command-group-label>{{ group.label }}</hlm-command-group-label>
							@for (entry of group.entries; track entry.key) {
								@switch (entry.type) {
									@case ('page') {
										<button hlm-command-item [value]="entry.key" (selected)="_select(entry)">
											<ng-icon
												[name]="entry.page.kind === 'component' ? 'lucideCircleDashed' : 'lucideArrowRight'"
												class="text-muted-foreground"
											/>
											<span class="truncate">{{ entry.page.label }}</span>
											@if (group.showPageGroup) {
												<span class="text-muted-foreground ms-auto shrink-0 text-xs">{{ entry.page.group }}</span>
											}
										</button>
									}
									@case ('recent') {
										<button hlm-command-item [value]="entry.key" (selected)="_select(entry)">
											<ng-icon name="lucideHistory" class="text-muted-foreground" />
											<span class="truncate">{{ entry.recent.label }}</span>
											<span class="text-muted-foreground ms-auto shrink-0 text-xs">{{ entry.recent.group }}</span>
										</button>
									}
									@case ('hit') {
										<button hlm-command-item [value]="entry.key" (selected)="_select(entry)">
											<ng-icon [name]="_hitIcon[entry.hit.kind]" class="text-muted-foreground" />
											<span class="flex min-w-0 flex-col gap-0.5 text-left">
												<span
													class="[&_mark]:text-primary truncate [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:underline [&_mark]:underline-offset-2"
													[innerHTML]="entry.hit.title"
												></span>
												@if (entry.hit.breadcrumb) {
													<span class="text-muted-foreground truncate text-xs">{{ entry.hit.breadcrumb }}</span>
												}
											</span>
										</button>
									}
								}
							}
						</hlm-command-group>
					}

					@if (_searchFailed()) {
						<!-- local page results stay usable, only the full-text search failed -->
						<div
							role="alert"
							class="text-muted-foreground flex items-center justify-center gap-2 px-2 text-sm"
							[class.py-3]="_groups().length > 0"
							[class.py-12]="_groups().length === 0"
						>
							<ng-icon name="lucideFileWarning" class="shrink-0" />
							<span>Full-text search is unavailable.</span>
							<!-- Enter must not reach the command, which would select the highlighted result -->
							<button
								type="button"
								class="text-foreground underline underline-offset-4"
								(keydown.enter)="$event.stopPropagation()"
								(click)="_retrySearch()"
							>
								Retry
							</button>
						</div>
					} @else if (_query() && _groups().length === 0) {
						<div hlmCommandEmpty class="py-12">
							@if (_isSearching()) {
								Searching...
							} @else {
								No results found for "{{ _query() }}".
							}
						</div>
					}
				</hlm-command-list>
			</hlm-command>

			<div
				class="text-muted-foreground [&_.spartan-kbd]:bg-background absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-3 rounded-b-lg border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800 [&_.spartan-kbd]:border"
			>
				<div class="flex items-center gap-2">
					<kbd hlmKbd><ng-icon name="lucideCornerDownLeft" /></kbd>
					<span class="text-nowrap">Go to Page</span>
				</div>

				@if (_copyCommand(); as command) {
					<hlm-separator orientation="vertical" class="h-4! self-center!" />
					<button
						type="button"
						class="hover:text-foreground flex min-w-0 items-center gap-1 transition-colors"
						title="Copy install command"
						(click)="_copy(command)"
					>
						<kbd hlmKbdGroup>
							<kbd hlmKbd class="hidden [html[style*='--is-mac']_&]:inline-flex">⌘</kbd>
							<kbd hlmKbd class="[html[style*='--is-mac']_&]:hidden">Ctrl</kbd>
							<kbd hlmKbd>C</kbd>
						</kbd>
						@switch (_copyStatus()) {
							@case ('copied') {
								<ng-icon name="lucideCheck" class="text-foreground shrink-0" />
								<span class="text-foreground" aria-live="polite">Copied</span>
							}
							@case ('failed') {
								<span class="text-destructive" aria-live="polite">Copy failed - try again</span>
							}
							@default {
								<span class="truncate font-mono">{{ command }}</span>
							}
						}
					</button>
				} @else {
					<div class="hidden items-center gap-2 sm:flex">
						<kbd hlmKbdGroup>
							<kbd hlmKbd><ng-icon name="lucideArrowUp" /></kbd>
							<kbd hlmKbd><ng-icon name="lucideArrowDown" /></kbd>
						</kbd>
						<span>Navigate</span>
					</div>

					<!-- the copy command needs the room, so the attribution only shows without it -->
					<a
						href="https://www.algolia.com/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Search by Algolia"
						class="ms-auto hidden shrink-0 items-center gap-1.5 opacity-80 transition-opacity hover:opacity-100 sm:inline-flex"
					>
						<span>Search by</span>
						<img src="/assets/algolia-logo.svg" alt="Algolia" class="h-3.5 w-auto" />
					</a>
				}
			</div>
		</hlm-command-dialog>
	`,
})
export class DocsDialog {
	private readonly _client = searchClient('JJRQPPSU45', '0fe1bcb9dbe76b2a149f00bc0709c5fd');
	private readonly _router = inject(Router);
	private readonly _clipboard = inject(Clipboard);
	private readonly _cliMode = inject(CLIModeService).cliMode;
	private readonly _injector = inject(Injector);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _document = inject(DOCUMENT);
	private readonly _command = viewChild(BrnCommand);
	private readonly _commandInput = viewChild(HlmCommandInput, { read: ElementRef<HTMLElement> });

	protected readonly _state = signal<BrnDialogState>('closed');
	protected readonly _search = signal('');
	protected readonly _query = computed(() => this._search().trim());
	/** The last copy attempt - only shown while that command is still the highlighted one. */
	private readonly _copyAttempt = signal<{ command: string; ok: boolean } | null>(null);
	private _copyAttemptTimeout?: ReturnType<typeof setTimeout>;
	/** Incremented per selection and per open, so only the latest selection navigates. */
	private _pendingNavigation = 0;
	protected readonly _recent = signal<RecentEntry[]>([]);

	/** Results are filtered (locally and by Algolia) before they are rendered, so the command must not filter again. */
	protected readonly _noopFilter = () => true;

	protected readonly _hitIcon: Record<DocsSearchHit['kind'], string> = {
		page: 'lucideFileText',
		section: 'lucideHash',
		content: 'lucideText',
	};

	/** All docs pages from the navigation - searchable instantly, without a network request. */
	protected readonly _pageGroups = buildPageGroups();

	protected readonly _pageResults = computed(() => searchPages(this._pageGroups, this._query()));

	private readonly _algoliaResource = resource<AlgoliaDocsRecord[], string>({
		params: () => this._query(),
		loader: async ({ params: query, abortSignal }) => {
			if (!query) return [];

			// debounce: a newer query aborts this loader while it waits
			// TODO(angular-22): replace with the `debounced()` signal utility once the docs are on Angular 22
			// (e.g. `params: debounced(this._query, SEARCH_DEBOUNCE_MS)`) and drop this wait + abort check.
			await new Promise((resolve) => setTimeout(resolve, SEARCH_DEBOUNCE_MS));
			if (abortSignal.aborted) return [];

			const result = await this._client.searchSingleIndex<AlgoliaDocsRecord>({
				indexName: 'spartan-ng',
				searchParams: {
					query,
					hitsPerPage: 50,
					highlightPreTag: '<mark>',
					highlightPostTag: '</mark>',
					attributesToRetrieve: [
						'hierarchy.lvl0',
						'hierarchy.lvl1',
						'hierarchy.lvl2',
						'hierarchy.lvl3',
						'hierarchy.lvl4',
						'hierarchy.lvl5',
						'hierarchy.lvl6',
						'content',
						'type',
						'url',
					],
					attributesToHighlight: [
						'hierarchy.lvl1',
						'hierarchy.lvl2',
						'hierarchy.lvl3',
						'hierarchy.lvl4',
						'hierarchy.lvl5',
						'hierarchy.lvl6',
					],
					attributesToSnippet: ['content:12'],
					snippetEllipsisText: '…',
					clickAnalytics: false,
				},
			});
			return result.hits;
		},
		defaultValue: [],
	});

	protected readonly _isSearching = computed(() => !!this._query() && this._algoliaResource.isLoading());

	/** Algolia failed - an empty list would wrongly claim that nothing matches. */
	protected readonly _searchFailed = computed(() => !!this._query() && this._algoliaResource.status() === 'error');

	/** The latest Algolia records - the previous results stay visible while the next query is loading. */
	private readonly _records = linkedSignal<{ loading: boolean; records: AlgoliaDocsRecord[] }, AlgoliaDocsRecord[]>({
		source: () => ({
			loading: this._algoliaResource.isLoading(),
			records: this._algoliaResource.hasValue() ? this._algoliaResource.value() : [],
		}),
		computation: (source, previous) => (source.loading && previous ? previous.value : source.records),
	});

	protected readonly _hitGroups = computed(() => {
		if (!this._query()) return [];
		const localUrls = new Set(this._pageResults().map((page) => page.url));
		return groupHits(this._records(), localUrls);
	});

	/** The groups rendered in the list - the navigation when the query is empty, the search results otherwise. */
	protected readonly _groups = computed<SearchGroup[]>(() => {
		const pageEntry = (page: DocsSearchPage): SearchEntry => ({ type: 'page', key: page.key, page });

		if (!this._query()) {
			const recent: SearchEntry[] = this._recent().map((entry) => ({
				type: 'recent',
				key: `recent:${entry.url}`,
				recent: entry,
			}));
			return [
				{ key: 'recent', label: 'Recent', entries: recent },
				...this._pageGroups.map((group) => ({
					key: `nav:${group.label}`,
					label: group.label,
					entries: group.pages.map(pageEntry),
				})),
			].filter((group) => group.entries.length > 0);
		}

		return [
			{ key: 'pages', label: 'Pages', entries: this._pageResults().map(pageEntry), showPageGroup: true },
			...this._hitGroups().map((group) => ({
				key: `hits:${group.key}`,
				label: group.section ? `${group.page} · ${group.section}` : group.page,
				entries: group.hits.map((hit): SearchEntry => ({ type: 'hit', key: hit.key, hit })),
			})),
		].filter((group) => group.entries.length > 0);
	});

	/** Lookup from the command item value to the entry it represents. */
	private readonly _entries = computed(
		() => new Map(this._groups().flatMap((group) => group.entries.map((entry) => [entry.key, entry] as const))),
	);

	/** The value of the highlighted item - read from the key manager's signal, so it can never go stale. */
	private readonly _activeKey = computed(() => this._command()?.keyManager.activeItem?.value());

	/** The install command for the highlighted component, like shadcn's "Copy Command". */
	protected readonly _copyCommand = computed(() => {
		const key = this._activeKey();
		const entry = key ? this._entries().get(key) : undefined;
		const primitive = entry ? findComponentPage(this._pageGroups, this._entryUrl(entry))?.primitive : undefined;
		if (!primitive) return undefined;
		const cli = this._cliMode() === 'nx' ? 'nx' : 'ng';
		return `${cli} g @spartan-ng/cli:ui ${primitive}`;
	});

	protected readonly _copyStatus = computed<'copied' | 'failed' | null>(() => {
		const attempt = this._copyAttempt();
		if (!attempt || attempt.command !== this._copyCommand()) return null;
		return attempt.ok ? 'copied' : 'failed';
	});

	constructor() {
		// The previous results only bridge consecutive queries - a cleared input starts a fresh search.
		effect(() => {
			if (!this._query()) this._records.set([]);
		});

		// Highlight the first result whenever the query changes or the dialog opens.
		effect(() => {
			this._query();
			this._state();
			untracked(() => this._afterRender((command) => this._highlightFirst(command)));
		});

		// When the results change (e.g. the Algolia results arrive), keep the highlighted item if it is still listed.
		effect(() => {
			this._groups();
			untracked(() =>
				this._afterRender((command) => {
					const active = command.keyManager.activeItem;
					if (!active || !command.items().includes(active)) {
						this._highlightFirst(command);
					}
				}),
			);
		});
	}

	/** Highlights the first item, or clears the highlight so `aria-activedescendant` never points to a removed item. */
	private _highlightFirst(command: BrnCommand): void {
		if (command.items().length > 0) {
			command.keyManager.setFirstItemActive();
		} else {
			command.keyManager.setActiveItem(-1);
		}
	}

	private _afterRender(fn: (command: BrnCommand) => void): void {
		afterNextRender(
			() => {
				const command = this._command();
				if (command) fn(command);
			},
			{ injector: this._injector },
		);
	}

	protected _open(): void {
		// a selection still waiting for the previous close must not navigate while the palette is in use again
		this._pendingNavigation++;
		this._search.set('');
		this._copyAttempt.set(null);
		this._recent.set(this._readRecent());
		this._state.set('open');
	}

	protected _onWindowKeyDown(event: KeyboardEvent): void {
		const isShortcut = event.key === 'k' && (event.metaKey || event.ctrlKey);
		if (!isShortcut && event.key !== '/') return;

		if (this._state() === 'open') {
			if (isShortcut) {
				event.preventDefault();
				this._state.set('closed');
			}
			return;
		}

		const target = event.target;
		if (
			(target instanceof HTMLElement && target.isContentEditable) ||
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target instanceof HTMLSelectElement
		) {
			return;
		}

		event.preventDefault();
		this._open();
	}

	protected _onCommandKeyDown(event: KeyboardEvent): void {
		if (event.key !== 'c' || !(event.metaKey || event.ctrlKey)) return;

		// let the browser copy text the user selected in the input
		const input = event.target;
		if (input instanceof HTMLInputElement && input.selectionStart !== input.selectionEnd) return;

		const command = this._copyCommand();
		if (!command) return;

		event.preventDefault();
		this._copy(command);
	}

	protected _copy(command: string): void {
		const ok = this._clipboard.copy(command);
		this._copyAttempt.set({ command, ok });
		clearTimeout(this._copyAttemptTimeout);
		this._copyAttemptTimeout = setTimeout(() => this._copyAttempt.set(null), COPY_FEEDBACK_MS);
	}

	protected _retrySearch(): void {
		this._algoliaResource.reload();
		// keep typing and keyboard navigation working after a click on Retry
		this._commandInput()?.nativeElement.querySelector('input')?.focus();
	}

	protected _select(entry: SearchEntry): void {
		const target = this._toRecent(entry);
		this._saveRecent(target);
		this._state.set('closed');
		// The dialog's scroll lock restores the old scroll position once the close animation ends,
		// which would undo the router's scroll to the top / to the anchor - so navigate after it.
		const navigation = ++this._pendingNavigation;
		void this._whenScrollUnlocked().then(() => {
			if (navigation !== this._pendingNavigation || this._state() === 'open') return;
			void this._router.navigateByUrl(target.url);
		});
	}

	private _whenScrollUnlocked(): Promise<void> {
		const html = this._document.documentElement;
		if (!this._isBrowser || !html.classList.contains(SCROLL_BLOCK_CLASS)) return Promise.resolve();

		return new Promise((resolve) => {
			const done = () => {
				observer.disconnect();
				clearTimeout(timeout);
				resolve();
			};
			const observer = new MutationObserver(() => {
				if (!html.classList.contains(SCROLL_BLOCK_CLASS)) done();
			});
			const timeout = setTimeout(done, SCROLL_UNLOCK_TIMEOUT_MS);
			observer.observe(html, { attributes: true, attributeFilter: ['class'] });
		});
	}

	/** The url an entry opens - the copy command is offered for page-level entries of a component. */
	private _entryUrl(entry: SearchEntry): string | undefined {
		switch (entry.type) {
			case 'page':
				return entry.page.url;
			case 'recent':
				return entry.recent.url;
			case 'hit':
				return entry.hit.kind === 'page' ? entry.hit.url : undefined;
		}
	}

	private _toRecent(entry: SearchEntry): RecentEntry {
		switch (entry.type) {
			case 'recent':
				return entry.recent;
			case 'page':
				return { url: entry.page.url, label: entry.page.label, group: entry.page.group };
			case 'hit':
				return {
					url: entry.hit.url,
					label: entry.hit.kind === 'content' ? entry.hit.breadcrumb || entry.hit.page : entry.hit.text,
					group: entry.hit.kind === 'page' ? entry.hit.breadcrumb : entry.hit.page,
				};
		}
	}

	private _readRecent(): RecentEntry[] {
		if (!this._isBrowser) return [];
		try {
			const value: unknown = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) ?? '[]');
			if (!Array.isArray(value)) return [];
			return value
				.filter(
					(entry): entry is RecentEntry =>
						typeof entry?.url === 'string' && typeof entry?.label === 'string' && typeof entry?.group === 'string',
				)
				.slice(0, MAX_RECENT);
		} catch {
			return [];
		}
	}

	private _saveRecent(entry: RecentEntry): void {
		if (!this._isBrowser) return;
		const recent = [entry, ...this._readRecent().filter((r) => r.url !== entry.url)].slice(0, MAX_RECENT);
		try {
			localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recent));
		} catch {
			// storage can be unavailable (private mode, blocked site data) - recent searches are optional
		}
	}
}
