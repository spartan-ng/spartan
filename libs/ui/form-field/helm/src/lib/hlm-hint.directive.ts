import { Directive } from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'hlm-hint',
	host: {
		class: 'block text-sm text-muted-foreground',
	},
})
export class HlmHintDirective {}
