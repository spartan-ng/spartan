import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { ClassValue } from 'clsx';

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
			<ng-icon class="flex" size="14px" name="lucideChevronRight" />
		</ng-content>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmBreadcrumbSeparatorComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('size-3.5', this.userClass()));
}
