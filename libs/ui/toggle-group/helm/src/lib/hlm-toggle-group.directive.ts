import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { provideHlmToggleGroup } from './hlm-toggle-group.token';
import { toggleGroupItemVariants } from './hlm-toggle-item.directive';

type ToggleGroupItemVariants = VariantProps<typeof toggleGroupItemVariants>;
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
		hlm('inline-flex items-center gap-x-2 focus:[&>[hlm][brnToggle]]:z-10', {
			'gap-x-0 rounded-md first-of-type:[&>[hlmToggleGroupItem]]:rounded-l-md last-of-type:[&>[hlmToggleGroupItem]]:rounded-r-md [&>[hlmToggleGroupItem][variant="outline"]]:-mx-[0.5px] [&>[hlmToggleGroupItem]]:rounded-none':
				this.variant() === 'merged',
			[String(this.userClass())]: !!this.userClass(),
		}),
	);
}
