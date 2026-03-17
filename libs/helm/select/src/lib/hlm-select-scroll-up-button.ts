import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronUp } from '@ng-icons/lucide';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-select-scroll-up-button',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronUp })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-icon name="lucideChevronUp" />
	`,
})
export class HlmSelectScrollUpButton {
	constructor() {
		classes(() => 'top-0 w-full');
	}
}
