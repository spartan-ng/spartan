import { Directive } from '@angular/core';
import { BrnSheetClose } from '@spartan-ng/brain/sheet';

@Directive({
	selector: 'button[hlmSheetClose]',
	exportAs: 'hlmSheetClose',
	hostDirectives: [BrnSheetClose],
	host: { 'data-slot': 'sheet-close' },
})
export class HlmSheetClose {}
