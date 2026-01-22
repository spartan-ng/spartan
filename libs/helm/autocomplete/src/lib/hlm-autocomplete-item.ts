import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { BrnAutocompleteItem } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-autocomplete-item',
	imports: [NgIcon],
	providers: [provideIcons({ lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnAutocompleteItem, inputs: ['id', 'disabled', 'value'] }],
	host: {
		'data-slot': 'autocomplete-item',
	},
	template: `
		<ng-content />
		@if (_active()) {
			<ng-icon
				name="lucideCheck"
				class="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
				aria-hidden="true"
			/>
		}
	`,
})
export class HlmAutocompleteItem {
	private readonly _brnAutocompleteItem = inject(BrnAutocompleteItem);

	protected readonly _active = this._brnAutocompleteItem.active;

	constructor() {
		classes(
			() =>
				`data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-hidden:hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0 [&_ng-icon:not([class*='text-'])]:text-base`,
		);
	}
}
