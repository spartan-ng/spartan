import { Directive } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'ng-icon[hlmAccordionIcon], ng-icon[hlmAccIcon]',
	providers: [provideIcons({ lucideChevronDown }), provideHlmIconConfig({ size: 'sm' })],
})
export class HlmAccordionIcon {
	constructor() {
		classes(
			() =>
				'text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200 group-data-[state=open]:rotate-180',
		);
	}
}
