import { Directive } from '@angular/core';
import { BrnDialogTitle } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnSheetTitle]',
	hostDirectives: [BrnDialogTitle],
})
export class BrnSheetTitle {}
