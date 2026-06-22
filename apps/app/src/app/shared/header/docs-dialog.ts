import { searchClient, SearchHits } from '@algolia/client-search';
import { Component, computed, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCornerDownLeft, lucideSearch } from '@ng-icons/lucide';
import type { BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

type AlgoliaHits = {
	url: string;
	content?: string;
	type: string;
	hierarchy: Record<string, string>;
	objectID: string;
	_snippetResult: {
		hierarchy: {
			lvl1: {
				value: string;
				matchLevel: string;
			};
			lvl2?: {
				value: string;
				matchLevel: string;
			};
			lvl3?: {
				value: string;
				matchLevel: string;
			};
			lvl4?: {
				value: string;
				matchLevel: string;
			};
		};
		content?: {
			value: string;
			matchLevel: string;
		};
	};
	_highlightResult: {
		hierarchy: {
			lvl0: {
				value: string;
				matchLevel: string;
				matchedWords: Array<any>;
			};
			lvl1: {
				value: string;
				matchLevel: string;
				fullyHighlighted?: boolean;
				matchedWords: Array<string>;
			};
			lvl2?: {
				value: string;
				matchLevel: string;
				matchedWords: Array<any>;
			};
			lvl3?: {
				value: string;
				matchLevel: string;
				matchedWords: Array<any>;
			};
			lvl4?: {
				value: string;
				matchLevel: string;
				fullyHighlighted: boolean;
				matchedWords: Array<string>;
			};
		};
		content?: {
			value: string;
			matchLevel: string;
			fullyHighlighted: boolean;
			matchedWords: Array<string>;
		};
	};
};

@Component({
	selector: 'spartan-docs-dialog',
	imports: [HlmButtonImports, HlmKbdImports, HlmCommandImports, NgIcon, FormsModule],
	providers: [
		provideIcons({
			lucideSearch,
			lucideCornerDownLeft,
			lucideArrowRight,
		}),
	],
	host: {
		'(window:keydown)': '_onKeyDown($event)',
	},
	template: `
		<button
			hlmBtn
			variant="outline"
			class="bg-input/30 border-input/30 text-muted-foreground hover:bg-input/50 hover:text-muted-foreground relative h-8 w-full justify-start gap-2 pl-2.5 font-normal shadow-none active:translate-y-px sm:pr-12 md:w-48 lg:w-60 xl:w-64"
			(click)="_state.set('open')"
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
			[state]="_state()"
			(stateChange)="_state.set($event)"
			dialogContentClass="border-ring/50 w-full rounded-xl! border-4 p-1 sm:max-w-lg"
		>
			<hlm-command class="min-h-[400px] w-full pb-10" [(search)]="_searchVal">
				<hlm-command-input placeholder="Type a command or search..." />
				<hlm-command-list class="max-h-[400px] pt-1">
					@for (item of _values(); track item.objectID) {
						<hlm-command-group>
							@if (item.url) {
								<!-- lvl1 -->
								@if (item.type === 'lvl1' && item.hierarchy[item.type]) {
									<button hlm-command-item (selected)="onSelect(item.url)" [value]="cleanLabel(item.hierarchy['lvl1'])">
										<a [href]="item.url" class="flex w-full min-w-0 items-center gap-2">
											<ng-icon name="lucideArrowRight" class="shrink-0" />
											<div class="flex min-w-0 flex-col items-start gap-0.5 text-left">
												<span class="w-full truncate font-semibold">{{ cleanLabel(item.hierarchy['lvl1']) }}</span>
												@if (item.content) {
													<span class="w-full truncate text-sm">{{ item['content'] }}</span>
												}
											</div>
										</a>
									</button>
								}

								<!-- askAI -->
								@if (item.type === 'askAI') {
									<button hlm-command-item (selected)="onSelect(item.url)" [value]="cleanLabel(item.hierarchy['lvl1'])">
										<a [href]="item.url" class="flex w-full min-w-0 items-center gap-2">
											{{ cleanLabel(item.hierarchy['lvl1']) }}
										</a>
									</button>
								}

								@if (['lvl2', 'lvl3', 'lvl4', 'lvl5', 'lvl6'].includes(item.type) && item.hierarchy[item.type]) {
									<button hlm-command-item (selected)="onSelect(item.url)" [value]="cleanLabel(item.hierarchy['lvl1'])">
										<a [href]="item.url" class="flex w-full min-w-0 items-center gap-2">
											<ng-icon name="lucideArrowRight" class="shrink-0" />
											<div class="flex min-w-0 flex-col items-start gap-0.5 text-left">
												<span class="w-full truncate font-semibold">{{ item.hierarchy[item.type] }}</span>
												<span class="w-full truncate text-sm">{{ cleanLabel(item.hierarchy['lvl1']) }}</span>
											</div>
										</a>
									</button>
								}

								<!-- content -->
								@if (item.type === 'content') {
									<button
										hlm-command-item
										(selected)="onSelect(item.url)"
										[value]="item.content ?? cleanLabel(item.hierarchy['lvl1'])"
									>
										<a [href]="item.url" class="flex w-full min-w-0 items-center gap-2">
											<ng-icon name="lucideArrowRight" class="shrink-0" />
											<div class="flex min-w-0 flex-col items-start gap-0.5 text-left">
												<span class="w-full truncate font-semibold">{{ item.content }}</span>
												<span class="w-full truncate text-sm">{{ cleanLabel(item.hierarchy['lvl1']) }}</span>
											</div>
										</a>
									</button>
								}
							}
						</hlm-command-group>
					}
				</hlm-command-list>
				<!-- Empty state -->
				<div *hlmCommandEmptyState hlmCommandEmpty>No results found.</div>
			</hlm-command>

			<div
				class="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-lg border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800"
			>
				<div class="flex items-center gap-2">
					<kbd hlmKbd>
						<ng-icon name="lucideCornerDownLeft" />
					</kbd>
					<span>Go to Page</span>
				</div>
				<a
					href="https://www.algolia.com/"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Search by Algolia"
					class="ms-auto inline-flex items-center gap-1.5 opacity-80 transition-opacity hover:opacity-100"
				>
					<span>Search by</span>
					<img src="/assets/algolia-logo.svg" alt="Algolia" class="h-3.5 w-auto" />
				</a>
			</div>
		</hlm-command-dialog>
	`,
})
export class DocsDialog {
	private readonly _client = searchClient('JJRQPPSU45', '0fe1bcb9dbe76b2a149f00bc0709c5fd');
	protected readonly _state = signal<BrnDialogState>('closed');

	protected readonly _values = computed(() => {
		const value = this._algoliaResource.value();
		if (!value) return [];
		return value.hits
			.filter((h) => {
				const url = new URL(h.url);
				let isPageNotFound = false;
				// eslint-disable-next-line @typescript-eslint/naming-convention
				for (const [_, value] of Object.entries(h.hierarchy)) {
					if (value) {
						isPageNotFound = value.toLowerCase().includes('page not found');
					}
				}
				return (
					url.hash !== '#spartan-main' &&
					url.pathname !== '/' &&
					!isPageNotFound &&
					// iframe-only preview routes are indexed by the crawler but should not surface in search
					!url.pathname.startsWith('/sidebar-preview') &&
					!url.pathname.startsWith('/blocks-preview')
				);
			})
			.map((h) => {
				const u = new URL(h.url);
				return { ...h, url: u.pathname + u.hash };
			});
	});

	protected readonly _searchVal = signal('');
	private readonly _cache = new Map<string, SearchHits<AlgoliaHits>>();

	private readonly _algoliaResource = resource<SearchHits<AlgoliaHits> | undefined, string>({
		params: () => this._searchVal(),
		loader: async ({ params }) => {
			const cache = this._cache.get(params);
			if (cache) return cache;
			const result = await this._client.searchSingleIndex<AlgoliaHits>({
				indexName: 'spartan-ng',
				searchParams: {
					highlightPreTag: '<span>',
					hitsPerPage: 100,
					highlightPostTag: '</span>',
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
					attributesToSnippet: [
						'hierarchy.lvl1:5',
						'hierarchy.lvl2:5',
						'hierarchy.lvl3:5',
						'hierarchy.lvl4:5',
						'hierarchy.lvl5:5',
						'hierarchy.lvl6:5',
						'content:5',
					],
					clickAnalytics: false,
					snippetEllipsisText: '...',
					query: params,
				},
			});

			if (result.hits) {
				result.hits.sort((a, b) => {
					const nameA = (a.hierarchy['lvl1'] || '').toLowerCase();
					const nameB = (b.hierarchy['lvl1'] || '').toLowerCase();
					return nameA.localeCompare(nameB);
				});
			}

			this._cache.set(params, result);
			return result;
		},
	});

	protected _onKeyDown(e: KeyboardEvent) {
		if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
			if (
				(e.target instanceof HTMLElement && e.target.isContentEditable) ||
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement ||
				e.target instanceof HTMLSelectElement
			) {
				return;
			}

			e.preventDefault();
			this._state.set('open');
		}
	}

	protected onSelect(url: string): void {
		window.location.href = url;
	}

	/** Strip the "spartan -" / "spartan/ui -" title prefix so results read cleanly in the search palette. */
	protected cleanLabel(value: string | undefined): string {
		return (value ?? '').replace(/^spartan(\/ui)?\s*-\s*/i, '');
	}
}
