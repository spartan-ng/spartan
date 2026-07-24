import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'option[hlmNativeSelectOption]',
	host: { 'data-slot': 'native-select-option' },
})
export class HlmNativeSelectOption {
	constructor() {
		classes(() => 'bg-[Canvas] text-[CanvasText]');
	}
}
