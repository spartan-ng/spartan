import { Directive } from '@angular/core';
import { BrnDialogTitle } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnDrawerTitle]',
	exportAs: 'brnDrawerTitle',
	hostDirectives: [BrnDialogTitle],
})
export class BrnDrawerTitle {}
