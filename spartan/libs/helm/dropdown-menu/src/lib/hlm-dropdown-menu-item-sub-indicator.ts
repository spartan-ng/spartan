import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-dropdown-menu-item-sub-indicator',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-icon name="lucideChevronRight" class="text-base" />
	`,
})
export class HlmDropdownMenuItemSubIndicator {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('ml-auto size-4', this.userClass()));
}
