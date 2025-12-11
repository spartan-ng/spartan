import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-dropdown-menu-checkbox-indicator',
	imports: [NgIcon],
	providers: [provideIcons({ lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-icon class="text-base" name="lucideCheck" />
	`,
})
export class HlmDropdownMenuCheckboxIndicator {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'pointer-events-none absolute left-2 flex size-3.5 items-center justify-center opacity-0 group-data-[checked]:opacity-100',
			this.userClass(),
		),
	);
}
