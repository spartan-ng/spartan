import { Directive } from '@angular/core';
import { provideHlmIconConfig } from '@spartan-ng/ui-icon-helm';

@Directive({
	standalone: true,
	selector: '[hlmCommandIcon]',
	host: {
		class: 'inline-flex mr-2 w-4 h-4',
	},
	providers: [provideHlmIconConfig({ size: 'sm' })],
})
export class HlmCommandIconDirective {}
