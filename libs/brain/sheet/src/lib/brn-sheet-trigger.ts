import { Directive, inject, input } from '@angular/core';
import { BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { BrnSheet } from './brn-sheet';

@Directive({
	selector: 'button[brnSheetTrigger]',
})
export class BrnSheetTrigger extends BrnDialogTrigger {
	private readonly _sheet = inject(BrnSheet, { optional: true });

	/** Override the side from where the sheet appears for this trigger. */
	public readonly side = input<'top' | 'bottom' | 'left' | 'right' | undefined>(undefined);

	override open() {
		const side = this.side();
		if (this._sheet && side) {
			this._sheet.sideState.set(side);
		}
		super.open();
	}
}
