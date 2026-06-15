import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'optgroup[hlmNativeSelectOptGroup]',
	host: { 'data-slot': 'native-select-optgroup' },
})
export class HlmNativeSelectOptGroup {
	constructor() {
		classes(() => 'bg-[Canvas] text-[CanvasText]');
	}
}
