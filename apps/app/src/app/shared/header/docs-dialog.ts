import { searchClient, SearchHits } from '@algolia/client-search';
import { Component, computed, resource, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCornerDownLeft, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnDialogImports, BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';
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
	imports: [
		HlmButtonImports,
		HlmKbdImports,
		HlmDialogImports,
		BrnDialogImports,
		HlmIconImports,
		HlmCommandImports,
		NgIcon,
		BrnCommandImports,
		FormsModule,
	],
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
		<hlm-dialog>
			<button
				hlmDialogTrigger
				hlmBtn
				variant="secondary"
				class="bg-surface text-foreground dark:bg-card relative h-8 w-full justify-start pl-3 font-medium shadow-none sm:pr-12 md:w-48 lg:w-60 xl:w-64"
			>
				<span class="hidden lg:inline-flex">Search documentation...</span>
				<span class="inline-flex lg:hidden">Search...</span>
				<div class="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
					<kbd hlmKbdGroup>
						<kbd hlmKbd class="hidden border [html[style*='--is-mac']_&]:inline">⌘</kbd>
						<kbd hlmKbd class="border [html[style*='--is-mac']_&]:hidden">Ctrl</kbd>
						<kbd hlmKbd class="border">K</kbd>
					</kbd>
				</div>
			</button>

			<hlm-dialog-content class="border-ring/50 rounded-xl! border-4 p-2 [&>button]:hidden" *brnDialogContent="let ctx">
				<hlm-command class="min-h-[400px] md:min-w-[450px]">
					<hlm-command-search>
						<ng-icon hlm name="lucideSearch" class="shrink-0 opacity-50" />
						<input
							type="text"
							hlm-command-search-input
							placeholder="Type a command or search..."
							[(ngModel)]="_searchVal"
						/>
					</hlm-command-search>

					<hlm-command-list>
						@for (item of _values(); track item.objectID) {
							<hlm-command-group>
								@if (item.url) {
									<!-- lvl1 -->
									@if (item.type === 'lvl1' && item.hierarchy[item.type]) {
										<button hlm-command-item (selected)="onSelect(item.url)" [value]="item.hierarchy['lvl1']">
											<a [href]="item.url" class="flex w-full items-center gap-2">
												<ng-icon hlm name="lucideArrowRight" size="sm" class="shrink-0" />
												<div class="flex flex-col items-start gap-0.5 text-left">
													<span class="font-semibold">{{ item.hierarchy['lvl1'] }}</span>
													@if (item.content) {
														<span class="text-sm">{{ item['content'] }}</span>
													}
												</div>
											</a>
										</button>
									}

									<!-- askAI -->
									@if (item.type === 'askAI') {
										<button hlm-command-item (selected)="onSelect(item.url)" [value]="item.hierarchy['lvl1']">
											<a [href]="item.url" class="flex w-full items-center gap-2">
												{{ item.hierarchy['lvl1'] }}
											</a>
										</button>
									}

									@if (['lvl2', 'lvl3', 'lvl4', 'lvl5', 'lvl6'].includes(item.type) && item.hierarchy[item.type]) {
										<button hlm-command-item (selected)="onSelect(item.url)" [value]="item.hierarchy['lvl1']">
											<a [href]="item.url" class="flex w-full items-center gap-2">
												<ng-icon hlm name="lucideArrowRight" size="sm" class="shrink-0" />
												<div class="flex flex-col items-start gap-0.5 text-left">
													<span class="font-semibold">{{ item.hierarchy[item.type] }}</span>
													<span class="text-sm">{{ item.hierarchy['lvl1'] }}</span>
												</div>
											</a>
										</button>
									}

									<!-- content -->
									@if (item.type === 'content') {
										<button
											hlm-command-item
											(selected)="onSelect(item.url)"
											[value]="item.content ?? item.hierarchy['lvl1']"
										>
											<a [href]="item.url" class="flex w-full items-center gap-2">
												<ng-icon hlm name="lucideArrowRight" size="sm" class="shrink-0" />
												<div class="flex flex-col items-start gap-0.5 text-left">
													<span class="font-semibold">{{ item.content }}</span>
													<span class="text-sm">{{ item.hierarchy['lvl1'] }}</span>
												</div>
											</a>
										</button>
									}
								}
							</hlm-command-group>
						}
					</hlm-command-list>
					<!-- Empty state -->
					<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
				</hlm-command>

				<div
					class="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800"
				>
					<div class="flex items-center gap-2">
						<kbd hlmKbd>
							<ng-icon name="lucideCornerDownLeft" />
						</kbd>
						<span>Go to Page</span>
					</div>
				</div>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class DocsDialog {
	private readonly _client = searchClient('JJRQPPSU45', '0fe1bcb9dbe76b2a149f00bc0709c5fd');
	private readonly _brnDialogTrigger = viewChild.required(BrnDialogTrigger);

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
				return url.hash !== '#spartan-main' && url.pathname !== '/' && !isPageNotFound;
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
			this._brnDialogTrigger().open();
		}
	}

	protected onSelect(url: string): void {
		window.location.href = url;
	}
}
