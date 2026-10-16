import { Directive } from '@angular/core';
import { BrnDialogTitle } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnSheetTitle]',
	exportAs: 'brnSheetTitle',
	hostDirectives: [BrnDialogTitle],
})
export class BrnSheetTitle {}
