import { Directive } from '@angular/core';
import { BrnLabel } from '@spartan-ng/brain/label';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmLabel]',
	hostDirectives: [
		{
			directive: BrnLabel,
			inputs: ['id'],
		},
	],
})
export class HlmLabel {
	constructor() {
		classes(
			() =>
				'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-50 has-[[disabled]]:cursor-not-allowed has-[[disabled]]:opacity-50',
		);
	}
}
