import { Component, computed, input } from '@angular/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: '[hlmBreadcrumbSeparator]',
	standalone: true,
	imports: [HlmIconComponent],
	providers: [provideIcons({ lucideChevronRight })],
	host: {
		role: 'presentation',
		'[class]': '_computedClass()',
		'[attr.aria-hidden]': 'true',
	},
	template: `
		<ng-content>
			<hlm-icon name="lucideChevronRight" />
		</ng-content>
	`,
})
export class HlmBreadcrumbSeparatorComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('[&>hlm-icon]:w-3.5 [&>hlm-icon]:h-3.5 [&>hlm-icon]:flex', this.userClass()),
	);
}
