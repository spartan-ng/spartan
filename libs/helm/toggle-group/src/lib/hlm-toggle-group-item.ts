import { computed, Directive, input } from '@angular/core';
import { BrnToggleGroupItem } from '@spartan-ng/brain/toggle-group';
import { toggleVariants, ToggleVariants } from '@spartan-ng/helm/toggle';
import { classes } from '@spartan-ng/helm/utils';
import { injectHlmToggleGroup } from './hlm-toggle-group.token';

@Directive({
	selector: 'button[hlmToggleGroupItem]',
	hostDirectives: [
		{
			directive: BrnToggleGroupItem,
			inputs: ['id', 'value', 'disabled', 'state', 'aria-label', 'type'],
			outputs: ['stateChange'],
		},
	],
	host: {
		'data-slot': 'toggle-group-item',
		'[attr.data-variant]': '_variant()',
		'[attr.data-size]': '_size()',
		'[attr.data-spacing]': '_toggleGroup.spacing()',
	},
})
export class HlmToggleGroupItem {
	protected readonly _toggleGroup = injectHlmToggleGroup();

	public readonly variant = input<ToggleVariants['variant']>('default');
	public readonly size = input<ToggleVariants['size']>('default');

	protected readonly _variant = computed(() => this._toggleGroup.variant() || this.variant());
	protected readonly _size = computed(() => this._toggleGroup.size() || this.size());

	constructor() {
		classes(() => [
			toggleVariants({
				variant: this._variant(),
				size: this._size(),
			}),
			'w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
			'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l',
		]);
	}
}
