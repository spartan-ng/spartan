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
				'bg-input relative inline-flex shrink-0 self-stretch data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-px',
		);
	}
}
