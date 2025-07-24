import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { provideHlmToggleGroup } from './hlm-toggle-group.token';
import { toggleGroupItemVariants } from './hlm-toggle-item';

type ToggleGroupItemVariants = VariantProps<typeof toggleGroupItemVariants>;

@Directive({
	selector: 'brn-toggle-group[hlm],[hlmToggleGroup]',
	host: {
		'[class]': '_computedClass()',
		'[attr.data-variant]': 'variant()',
	},
	providers: [provideHlmToggleGroup(HlmToggleGroup)],
})
export class HlmToggleGroup {
	public readonly variant = input<ToggleGroupItemVariants['variant']>('outline');
	public readonly size = input<ToggleGroupItemVariants['size']>('sm');
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs focus:[&>[hlm][brnToggle]]:z-10',
			this.userClass(),
		),
	);
}
