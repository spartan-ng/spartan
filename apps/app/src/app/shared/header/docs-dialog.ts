import { Component, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCornerDownLeft, lucideSearch } from '@ng-icons/lucide';
import { pageNavs, sidenavItems } from '@spartan-ng/app/app/shared/components/navigation-items';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnDialogImports, BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

@Component({
	selector: 'spartan-docs-dialog',
	providers: [
		provideIcons({
			lucideSearch,
			lucideCornerDownLeft,
		}),
	],
	imports: [
		HlmButtonImports,
		HlmKbdImports,
		HlmDialogImports,
		BrnDialogImports,
		HlmIconImports,
		HlmCommandImports,
		NgIcon,
		BrnCommandImports,
		HlmBadge,
	],
	template: `
		<hlm-dialog>
			<button
				brnDialogTrigger
				hlmBtn
				variant="secondary"
				class="bg-surface text-foreground dark:bg-card relative h-8 w-full justify-start pl-3 font-medium shadow-none sm:pr-12 md:w-48 lg:w-56 xl:w-64"
			>
				<span class="hidden lg:inline-flex">Search documentation...</span>
				<span class="inline-flex lg:hidden">Search...</span>
				<div class="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
					<kbd hlmKbdGroup>
						<kbd hlmKbd class="border">{{ _isMac ? '⌘' : 'Ctrl' }}</kbd>
						<kbd hlmKbd class="border">K</kbd>
					</kbd>
				</div>
			</button>

			<hlm-dialog-content class="border-ring/50 rounded-xl! border-4 p-2 [&>button]:hidden" *brnDialogContent="let ctx">
				<hlm-command class="min-h-[400px] md:min-w-[450px]">
					<hlm-command-search>
						<ng-icon hlm name="lucideSearch" class="shrink-0 opacity-50" />

						<input type="text" hlm-command-search-input placeholder="Type a command or search..." />
					</hlm-command-search>

					<hlm-command-list>
						<hlm-command-group>
							<hlm-command-group-label>Pages</hlm-command-group-label>
							@for (pageNav of _pageNavs; track pageNav.url) {
								<button hlm-command-item [value]="pageNav.url">{{ pageNav.label }}</button>
							}
						</hlm-command-group>

						<hlm-command-separator />
						@for (item of _navItems; track item.label; let last = $last) {
							<hlm-command-group>
								<hlm-command-group-label>{{ item.label }}</hlm-command-group-label>
								@for (link of item.links; track link.url) {
									<button hlm-command-item [value]="item.url + link.url">
										{{ link.label }}
									</button>
								}
							</hlm-command-group>
							@if (!last) {
								<hlm-command-separator />
							}
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
	host: {
		'(window:keydown)': 'onKeyDown($event)',
	},
})
export class DocsDialog {
	protected readonly _isMac = navigator.platform.toUpperCase().includes('MAC');
	private readonly _brnDialogTrigger = viewChild.required(BrnDialogTrigger);

	protected readonly _pageNavs = pageNavs;

	onKeyDown(e: KeyboardEvent) {
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

	protected readonly _navItems = sidenavItems;
}
