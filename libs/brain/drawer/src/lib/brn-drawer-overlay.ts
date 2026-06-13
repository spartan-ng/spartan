import { Directive } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDialogOverlay } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnDrawerOverlay],brn-drawer-overlay',
	providers: [provideCustomClassSettableExisting(() => BrnDrawerOverlay)],
})
export class BrnDrawerOverlay extends BrnDialogOverlay {}
