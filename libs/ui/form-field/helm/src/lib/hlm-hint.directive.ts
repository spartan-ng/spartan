import { Directive } from '@angular/core';
import { BrnHintDirective } from '@spartan-ng/brain/form-field';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'hlm-hint',
	standalone: true,
	hostDirectives: [BrnHintDirective],
	host: {
		class: 'block text-sm text-muted-foreground',
	},
})
export class HlmHintDirective {}
