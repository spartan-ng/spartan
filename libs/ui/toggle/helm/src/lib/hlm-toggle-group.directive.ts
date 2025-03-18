import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { provideHlmToggleGroup } from './hlm-toggle-group.token';
import { toggleVariants } from './hlm-toggle.directive';

type ToggleGroupItemVariants = VariantProps<typeof toggleVariants>;
@Directive({
	selector: 'brn-toggle-group[hlm],[hlmToggleGroup]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	providers: [provideHlmToggleGroup(HlmToggleGroupDirective)],
})
export class HlmToggleGroupDirective {
	public readonly variant = input<ToggleGroupItemVariants['variant']>('default');
	public readonly size = input<ToggleGroupItemVariants['size']>('default');
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('inline-flex items-center gap-x-2 focus:[&>[hlm][brnToggle]]:z-10', this.userClass()),
	);
}
