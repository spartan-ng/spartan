import { Component, computed, input } from '@angular/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-breadcrumb-ellipsis',
	standalone: true,
	imports: [HlmIconComponent],
	providers: [provideIcons({ lucideEllipsis })],
	template: `
		<span role="presentation" aria-hidden="true" [class]="_computedClass()">
			<hlm-icon name="lucideEllipsis" class="h-4 w-4" />
			<span class="sr-only">More</span>
		</span>
	`,
})
export class HlmBreadcrumbEllipsisComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('flex h-9 w-9 items-center justify-center', this.userClass()));
}
