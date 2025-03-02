import { Directive } from '@angular/core';
import { BrnErrorDirective } from '@spartan-ng/brain/form-field';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'hlm-error',
	standalone: true,
	hostDirectives: [BrnErrorDirective],
	host: {
		class: 'block text-destructive text-sm font-medium',
	},
})
export class HlmErrorDirective {}
