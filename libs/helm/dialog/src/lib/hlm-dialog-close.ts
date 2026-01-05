import { Directive } from '@angular/core';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmDialogClose]',
	hostDirectives: [{ directive: BrnDialogClose, inputs: ['delay'] }],
	host: {
		'data-slot': 'dialog-close',
	},
})
export class HlmDialogClose {
	constructor() {
		classes(
			() =>
				'ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute end-4 top-4 flex items-center justify-center rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none [&_ng-icon]:shrink-0',
		);
	}
}
