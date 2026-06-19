import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnAccordionContent } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-accordion-content',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnAccordionContent],
	host: {
		'data-slot': 'accordion-content',
	},
	template: `
		<div
			class="spartan-accordion-content-inner [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4"
		>
			<ng-content />
		</div>
	`,
})
export class HlmAccordionContent {
	constructor() {
		classes(() => 'spartan-accordion-content overflow-hidden data-[state=closed]:h-0 data-[state=open]:h-auto');
	}
}
