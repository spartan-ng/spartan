import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronUp } from '@ng-icons/lucide';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-select-scroll-up',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronUp })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-icon name="lucideChevronUp" />
	`,
})
export class HlmSelectScrollUp {
	constructor() {
		classes(
			() =>
				"bg-popover top-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_ng-icon:not([class*='text-'])]:text-base",
		);
	}
}
