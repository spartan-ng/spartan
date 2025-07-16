import { Directive, inject, input } from '@angular/core';
import { BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { BrnSheet } from './brn-sheet';

@Directive({
	selector: 'button[brnSheetTrigger]',
})
export class BrnSheetTrigger extends BrnDialogTrigger {
	private readonly _sheet = inject(BrnSheet, { optional: true });

	public side = input<'top' | 'bottom' | 'left' | 'right' | undefined>(undefined);

	override open() {
		const side = this.side();
		if (this._sheet && side) {
			this._sheet.sideInputState().set(side);
		}
		super.open();
	}
}
