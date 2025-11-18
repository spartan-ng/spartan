import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-item-radio',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideCircle })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<!-- Using 0.5rem for size to mimick h-2 w-2 -->
		<ng-icon hlm size="0.5rem" class="*:*:fill-current" name="lucideCircle" />
	`,
})
export class HlmMenuItemRadioIndicator {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'absolute left-2 flex h-3.5 w-3.5 items-center justify-center opacity-0 group-[.checked]:opacity-100',
			this.userClass(),
		),
	);
}
