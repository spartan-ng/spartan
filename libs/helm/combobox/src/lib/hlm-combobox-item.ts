import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { BrnComboboxItem } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-combobox-item',
	imports: [NgIcon],
	providers: [provideIcons({ lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnComboboxItem, inputs: ['id', 'disabled', 'value'] }],
	host: {
		'data-slot': 'combobox-item',
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
export class HlmComboboxItem {
	private readonly _brnComboboxItem = inject(BrnComboboxItem);

	protected readonly _active = this._brnComboboxItem.active;

	constructor() {
		classes(
			() =>
				`data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-hidden:hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0 [&_ng-icon:not([class*='text-'])]:text-base`,
		);
	}
}
