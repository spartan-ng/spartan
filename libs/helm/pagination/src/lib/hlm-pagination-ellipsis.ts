import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-pagination-ellipsis',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideEllipsis })],
	template: `
		<span [class]="_computedClass()">
			<ng-icon hlm size="sm" name="lucideEllipsis" />
			<span class="sr-only">{{ srOnlyText() }}</span>
		</span>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmPaginationEllipsis {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	/** Screen reader only text for the ellipsis */
	public readonly srOnlyText = input<string>('More pages');

	protected readonly _computedClass = computed(() => hlm('flex size-9 items-center justify-center', this.userClass()));
}
