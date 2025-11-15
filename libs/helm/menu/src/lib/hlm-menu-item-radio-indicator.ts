import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-item-radio',
	imports: [NgIcon],
	providers: [provideIcons({ lucideCircle })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-icon name="lucideCircle" class="text-[0.5rem] *:[svg]:fill-current" />
	`,
})
export class HlmMenuItemRadioIndicator {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'pointer-events-none absolute left-2 flex size-3.5 items-center justify-center opacity-0 group-data-[checked]:opacity-100',
			this.userClass(),
		),
	);
}
