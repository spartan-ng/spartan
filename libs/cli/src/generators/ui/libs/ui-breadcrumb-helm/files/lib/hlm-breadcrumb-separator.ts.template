import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: '[hlmBreadcrumbSeparator]',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronRight })],
	host: {
		role: 'presentation',
		'aria-hidden': 'true',
		'[class]': '_computedClass()',
	},
	template: `
		<ng-content>
			<ng-icon name="lucideChevronRight" />
		</ng-content>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmBreadcrumbSeparator {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('[&_ng-icon]:size-3.5 [&_ng-icon]:block', this.userClass()));
}
