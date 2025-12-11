import { computed, Directive, input } from '@angular/core';
import { BrnSeparator, provideBrnSeparatorConfig } from '@spartan-ng/brain/separator';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmButtonGroupSeparator],hlm-button-group-separator',
	providers: [provideBrnSeparatorConfig({ orientation: 'vertical' })],
	hostDirectives: [{ directive: BrnSeparator, inputs: ['orientation', 'decorative'] }],
	host: {
		'data-slot': 'button-group-separator',
		'[class]': '_computedClass()',
	},
})
export class HlmButtonGroupSeparator {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-input relative inline-flex shrink-0 self-stretch data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-px',
			this.userClass(),
		),
	);
}
