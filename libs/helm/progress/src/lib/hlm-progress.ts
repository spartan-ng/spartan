import { Directive } from '@angular/core';
import { BrnProgress } from '@spartan-ng/brain/progress';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'hlm-progress,[hlmProgress]',
	hostDirectives: [{ directive: BrnProgress, inputs: ['value', 'max', 'getValueLabel'] }],
})
export class HlmProgress {
	constructor() {
		classes(() => 'bg-primary/20 relative inline-flex h-2 w-full overflow-hidden rounded-full');
	}
}
