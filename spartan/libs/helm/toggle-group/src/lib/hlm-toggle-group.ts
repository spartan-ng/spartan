import { NumberInput } from '@angular/cdk/coercion';
import { Directive, computed, input, numberAttribute } from '@angular/core';
import { BrnToggleGroup } from '@spartan-ng/brain/toggle-group';
import { ToggleVariants } from '@spartan-ng/helm/toggle';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { provideHlmToggleGroup } from './hlm-toggle-group.token';

@Directive({
	selector: '[hlmToggleGroup],hlm-toggle-group',
	providers: [provideHlmToggleGroup(HlmToggleGroup)],
	hostDirectives: [
		{
			directive: BrnToggleGroup,
			inputs: ['type', 'value', 'nullable', 'disabled'],
			outputs: ['valueChange'],
		},
	],
	host: {
		'data-slot': 'toggle-group',
		'[class]': '_computedClass()',
		'[attr.data-variant]': 'variant()',
		'[attr.data-size]': 'size()',
		'[attr.data-spacing]': 'spacing()',
		'[style.--gap]': 'spacing()',
	},
})
export class HlmToggleGroup {
	public readonly variant = input<ToggleVariants['variant']>('default');
	public readonly size = input<ToggleVariants['size']>('default');
	public readonly spacing = input<number, NumberInput>(0, { transform: numberAttribute });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs',
			this.userClass(),
		),
	);
}
