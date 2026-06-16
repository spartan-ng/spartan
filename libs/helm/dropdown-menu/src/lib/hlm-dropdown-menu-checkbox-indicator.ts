import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-dropdown-menu-checkbox-indicator',
	imports: [NgIcon],
	providers: [provideIcons({ lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { 'data-slot': 'dropdown-menu-checkbox-item-indicator' },
	template: `
		<ng-icon name="lucideCheck" />
	`,
})
export class HlmDropdownMenuCheckboxIndicator {
	constructor() {
		classes(
			() =>
				'spartan-dropdown-menu-item-indicator pointer-events-none opacity-0 group-data-checked/dropdown-menu-checkbox:opacity-100',
		);
	}
}
