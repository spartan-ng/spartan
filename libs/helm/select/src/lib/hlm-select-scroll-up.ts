import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronUp } from '@ng-icons/lucide';
import { BrnComboboxScrollUp } from '@spartan-ng/brain/combobox';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-select-scroll-up',
	imports: [NgIcon, HlmIcon],
	hostDirectives: [BrnComboboxScrollUp],
	providers: [provideIcons({ lucideChevronUp })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-icon hlm size="sm" class="ml-2" name="lucideChevronUp" />
	`,
})
export class HlmSelectScrollUp {
	constructor() {
		classes(() => 'sticky top-0 z-10 bg-popover flex w-full cursor-default items-center justify-center py-1');
	}
}
