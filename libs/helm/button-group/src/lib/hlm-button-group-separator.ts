import { Directive } from '@angular/core';
import { BrnSeparator, provideBrnSeparatorConfig } from '@spartan-ng/brain/separator';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmButtonGroupSeparator],hlm-button-group-separator',
	providers: [provideBrnSeparatorConfig({ orientation: 'vertical' })],
	hostDirectives: [{ directive: BrnSeparator, inputs: ['orientation', 'decorative'] }],
	host: {
		'data-slot': 'button-group-separator',
	},
})
export class HlmButtonGroupSeparator {
	constructor() {
		classes(
			() =>
				'spartan-button-group-separator relative self-stretch data-[orientation=horizontal]:mx-px data-[orientation=horizontal]:w-auto data-[orientation=vertical]:my-px data-[orientation=vertical]:h-auto',
		);
	}
}
