import { Directive } from '@angular/core';
import { BrnDialogDescription } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnSheetDescription]',
	hostDirectives: [BrnDialogDescription],
})
export class BrnSheetDescription {}
