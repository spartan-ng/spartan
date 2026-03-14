import { Directive, input } from '@angular/core';
import type { BrnTimeSegment } from '@spartan-ng/brain/time-input';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'brn-time-input-segment[hlm], [hlmTimeInputSegment]',
	host: {
		'data-slot': 'time-input-segment',
	},
})
export class HlmTimeInputSegment {
	public readonly segment = input<BrnTimeSegment>();

	constructor() {
		classes(
			() =>
				'rounded-sm px-1 py-0.5 tabular-nums caret-transparent outline-none ' +
				'focus-within:bg-accent focus-within:text-accent-foreground' +
				'select-none data-[disabled]:cursor-not-allowed',
		);
	}
}
