import { Directive, inject, input } from '@angular/core';
import { BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import { BrnSheetComponent } from './brn-sheet.component';

@Directive({
	selector: 'button[brnSheetTrigger]',
	standalone: true,
})
export class BrnSheetTriggerDirective extends BrnDialogTriggerDirective {
	private readonly _sheet = inject(BrnSheetComponent, { optional: true });

	public side = input<'top' | 'bottom' | 'left' | 'right' | undefined>(undefined);

	override open() {
		const side = this.side();
		if (this._sheet && side) {
			this._sheet.sideInputState().set(side);
		}
		super.open();
	}
}
