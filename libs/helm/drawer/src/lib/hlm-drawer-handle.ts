import { Directive } from '@angular/core';
import { BrnDrawerHandle } from '@spartan-ng/brain/drawer';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDrawerHandle]',
	hostDirectives: [{ directive: BrnDrawerHandle, inputs: ['closeThreshold'] }],
})
export class HlmDrawerHandle {
	constructor() {
		classes(() => 'spartan-drawer-handle');
	}
}
