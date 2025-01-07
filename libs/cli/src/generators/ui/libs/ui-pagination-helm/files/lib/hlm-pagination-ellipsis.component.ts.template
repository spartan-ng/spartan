import { Component, computed, input } from '@angular/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-pagination-ellipsis',
	standalone: true,
	imports: [HlmIconComponent],
	providers: [provideIcons({ lucideEllipsis })],
	template: `
		<span [class]="_computedClass()">
			<hlm-icon size="sm" name="lucideEllipsis" />
			<span class="sr-only">More pages</span>
		</span>
	`,
})
export class HlmPaginationEllipsisComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('flex h-9 w-9 items-center justify-center', this.userClass()));
}
