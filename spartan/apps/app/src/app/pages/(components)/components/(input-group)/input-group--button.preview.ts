import { Component, computed, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

import { tablerCheck, tablerCopy, tablerInfoCircle, tablerStar } from '@ng-icons/tabler-icons';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-input-group-button-preview',
	imports: [HlmInputGroupImports, HlmIconImports, BrnPopoverImports, HlmPopoverImports],
	providers: [provideIcons({ tablerCheck, tablerCopy, tablerInfoCircle, tablerStar })],
	host: {
		class: 'grid w-full max-w-sm gap-6',
	},
	template: `
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="https://github.com/spartan-ng/spartan" readOnly />
			<div hlmInputGroupAddon align="inline-end">
				<button
					hlmInputGroupButton
					aria-label="Copy"
					title="Copy"
					size="icon-xs"
					(click)="_copy('https://github.com/spartan-ng/spartan')"
				>
					<ng-icon [name]="_isCopied() ? 'tablerCheck' : 'tablerCopy'" />
				</button>
			</div>
		</div>
		<div hlmInputGroup class="[--radius:9999px]">
			<div hlmInputGroupAddon>
				<button
					hlmInputGroupButton
					variant="secondary"
					size="icon-xs"
					hlmPopoverTrigger
					[hlmPopoverTriggerFor]="brnPopover"
				>
					<ng-icon name="tablerInfoCircle" />
				</button>
			</div>

			<div hlmInputGroupAddon class="text-muted-foreground pl-1.5">https://</div>
			<input hlmInputGroupInput id="input-secure-19" />
			<div hlmInputGroupAddon align="inline-end">
				<button hlmInputGroupButton size="icon-xs" (click)="_toggleFavorite()">
					<ng-icon name="tablerStar" [class]="_favoriteClass()" />
				</button>
			</div>
		</div>
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="Type to search..." />
			<div hlmInputGroupAddon align="inline-end">
				<button hlmInputGroupButton variant="secondary">Search</button>
			</div>
		</div>

		<hlm-popover sideOffset="10" align="start" #brnPopover="brnPopover">
			<div hlmPopoverContent class="flex flex-col gap-1 rounded-xl text-sm" *brnPopoverContent="let ctx">
				<p class="font-medium">Your connection is not secure.</p>
				<p>You should not enter any sensitive information on this site.</p>
			</div>
		</hlm-popover>
	`,
})
export class InputGroupButtonPreview {
	protected readonly _isCopied = signal(false);
	protected readonly _isFavorite = signal(false);
	protected readonly _favoriteClass = computed(() =>
		this._isFavorite() ? '[&>svg]:fill-blue-600 [&>svg]:stroke-blue-600' : '',
	);

	protected _copy(text: string) {
		void navigator.clipboard.writeText(text);
		this._isCopied.set(true);

		setTimeout(() => {
			this._isCopied.set(false);
		}, 3000);
	}

	protected _toggleFavorite(): void {
		this._isFavorite.update((f) => !f);
	}
}
