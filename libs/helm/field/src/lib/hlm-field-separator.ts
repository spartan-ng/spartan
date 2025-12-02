import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-field-separator',
	imports: [HlmSeparator],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'field-separator',
		'[class]': '_computedClass()',
	},
	template: `
		<hlm-separator class="absolute inset-0 top-1/2" />
		<span
			data-slot="field-separator-content"
			class="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
		>
			<ng-content />
		</span>
	`,
})
export class HlmFieldSeparator {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2', this.userClass()),
	);
}
