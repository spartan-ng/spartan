import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'legend[hlmFieldLegend]',
	host: {
		'data-slot': 'field-legend',
		'[attr.data-variant]': 'variant()',
	},
})
export class HlmFieldLegend {
	constructor() {
		classes(() => 'mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base');
	}

	public readonly variant = input<'label' | 'legend'>('legend');
}
