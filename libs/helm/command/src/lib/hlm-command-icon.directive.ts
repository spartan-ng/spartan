import { Directive } from '@angular/core';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';

@Directive({
	standalone: true,
	selector: '[hlmCommandIcon]',
	host: {
		class: 'text-muted-foreground pointer-events-none shrink-0',
	},
	providers: [provideHlmIconConfig({ size: 'sm' })],
})
export class HlmCommandIconDirective {}
