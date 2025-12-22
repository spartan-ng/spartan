import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'brn-switch-thumb[hlm],[hlmSwitchThumb]',
})
export class HlmSwitchThumb {
	constructor() {
		classes(
			() =>
				'bg-background dark:group-data-[state=unchecked]:bg-foreground dark:group-data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform group-data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
		);
	}
}
