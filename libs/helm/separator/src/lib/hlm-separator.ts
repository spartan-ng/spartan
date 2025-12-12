import { Directive } from '@angular/core';
import { BrnSeparator } from '@spartan-ng/brain/separator';
import { classes } from '@spartan-ng/helm/utils';

export const hlmSeparatorClass =
	'bg-border inline-flex shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px';

@Directive({
	selector: '[hlmSeparator],hlm-separator',
	hostDirectives: [{ directive: BrnSeparator, inputs: ['orientation', 'decorative'] }],
})
export class HlmSeparator {
	constructor() {
		classes(() => hlmSeparatorClass);
	}
}
