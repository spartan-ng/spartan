import { Directive, inject, input, forwardRef } from '@angular/core';
import { BrnDialogTrigger } from '@spartan-ng/brain/dialog';

// allow use of CommonJS require in this module (fixes TS error)
declare const require: any;

@Directive({
    selector: 'button[brnSheetTrigger]',
})
export class BrnSheetTrigger extends BrnDialogTrigger {
    private readonly _sheet = inject<unknown | null>(
        forwardRef(() => (require('./brn-sheet') as any).BrnSheet),
        { optional: true }
    );

    /** Override the side from where the sheet appears for this trigger. */
    public readonly side = input<'top' | 'bottom' | 'left' | 'right' | undefined>(undefined);

    override open() {
        const side = this.side();
        // guard runtime access to avoid future runtime errors if shape changes
        if (this._sheet && side && typeof (this._sheet as any).sideState?.set === 'function') {
            (this._sheet as any).sideState.set(side);
        }
        super.open();
    }
}
