import { Directive } from '@angular/core';
import { BrnDialogDescription } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnDrawerDescription]',
	hostDirectives: [BrnDialogDescription],
})
export class BrnDrawerDescription {}
