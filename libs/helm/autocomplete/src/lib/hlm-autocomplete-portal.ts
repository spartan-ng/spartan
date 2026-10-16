import { Directive } from '@angular/core';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';

@Directive({
	selector: '[hlmAutocompletePortal]',
	exportAs: 'hlmAutocompletePortal',
	hostDirectives: [{ directive: BrnPopoverContent, inputs: ['context', 'class'] }],
})
export class HlmAutocompletePortal {}
