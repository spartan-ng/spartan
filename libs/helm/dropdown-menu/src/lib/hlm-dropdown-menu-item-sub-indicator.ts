import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-dropdown-menu-item-sub-indicator',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-icon name="lucideChevronRight" class="text-[length:--spacing(4)] rtl:rotate-180" />
	`,
})
export class HlmDropdownMenuItemSubIndicator {
	constructor() {
		classes(() => 'ms-auto flex items-center justify-center');
	}
}
