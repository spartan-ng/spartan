import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnSelectScrollDown } from '@spartan-ng/brain/select';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-select-scroll-down',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnSelectScrollDown],
	template: `
		<ng-icon name="lucideChevronDown" />
	`,
})
export class HlmSelectScrollDown {
	constructor() {
		classes(
			() =>
				"bg-popover sticky bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1 data-hidden:hidden [&_ng-icon:not([class*='text-'])]:text-base",
		);
	}
}
