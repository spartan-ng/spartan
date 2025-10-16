import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-item-check',
	providers: [provideIcons({ lucideCheck })],
	imports: [NgIcon, HlmIcon],
	template: `
		<!-- Using 1rem for size to mimick h-4 w-4 -->
		<ng-icon hlm size="1rem" name="lucideCheck" />
	`,
	host: {
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmMenuItemCheck {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'absolute left-2 flex h-3.5 w-3.5 items-center justify-center opacity-0 group-[.checked]:opacity-100',
			this.userClass(),
		),
	);
}
