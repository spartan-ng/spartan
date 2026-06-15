import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmNativeSelectOptGroup]',
	host: { 'data-slot': 'native-select-optgroup' },
})
export class HlmNativeSelectOptGroup {
	constructor() {
		classes(() => 'bg-[Canvas] text-[CanvasText]');
	}
}
