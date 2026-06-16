import { Directive } from '@angular/core';
import { BrnProgress } from '@spartan-ng/brain/progress';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'hlm-progress,[hlmProgress]',
	hostDirectives: [{ directive: BrnProgress, inputs: ['value', 'max', 'getValueLabel'] }],
	host: { 'data-slot': 'progress' },
})
export class HlmProgress {
	constructor() {
		classes(() => 'spartan-progress relative inline-flex w-full overflow-hidden');
	}
}
