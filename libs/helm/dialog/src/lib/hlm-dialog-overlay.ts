import { Directive } from '@angular/core';
import { BrnDialogOverlay } from '@spartan-ng/brain/dialog';
import { classes } from '@spartan-ng/helm/utils';

export const hlmDialogOverlayClass =
	'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-black/50';

@Directive({
	selector: '[hlmDialogOverlay],hlm-dialog-overlay',
	hostDirectives: [BrnDialogOverlay],
})
export class HlmDialogOverlay {
	constructor() {
		classes(() => hlmDialogOverlayClass);
	}
}
