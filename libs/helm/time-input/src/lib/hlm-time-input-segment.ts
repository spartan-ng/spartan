import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import type { BrnTimeSegment } from '@spartan-ng/brain/time-input';

@Directive({
	selector: 'brn-time-input-segment[hlm], [hlmTimeInputSegment]',
	host: {
		'data-slot': 'time-input-segment',
	},
})
export class HlmTimeInputSegment {
	readonly segment = input<BrnTimeSegment>();

	constructor() {
		classes(
			() =>
				'rounded-sm px-1 py-0.5 tabular-nums caret-transparent outline-none ' +
				'focus-within:bg-accent focus-within:text-accent-foreground ' +
				'data-[disabled]:cursor-not-allowed select-none',
		);
	}
}
