import { Directive, forwardRef } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDialogOverlay } from '@spartan-ng/brain/dialog';

@Directive({
    selector: '[brnSheetOverlay],brn-sheet-overlay',
    providers: [provideCustomClassSettableExisting(() => forwardRef(() => BrnSheetOverlay))],
})
export class BrnSheetOverlay extends BrnDialogOverlay {}
