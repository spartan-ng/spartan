import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-pagination-ellipsis',
	imports: [HlmIconImports],
	providers: [provideIcons({ lucideEllipsis })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'pagination-ellipsis',
	},
	template: `
		<span [class]="_computedClass()" aria-hidden="true">
			<ng-icon hlm size="sm" name="lucideEllipsis" />
			<span class="sr-only">{{ srOnlyText() }}</span>
		</span>
	`,
})
export class HlmPaginationEllipsis {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('flex size-9 items-center justify-center', this.userClass()));

	/** Screen reader only text for the ellipsis */
	public readonly srOnlyText = input<string>('More pages');
}
