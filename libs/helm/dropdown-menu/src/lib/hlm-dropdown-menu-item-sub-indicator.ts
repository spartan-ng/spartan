import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-dropdown-menu-item-sub-indicator',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-icon hlmIcon name="lucideChevronRight" class="text-base" />
	`,
})
export class HlmDropdownMenuItemSubIndicator {
	constructor() {
		classes(() => 'ms-auto size-4');
	}
}
