import { Directive, inject, input } from '@angular/core';
import { BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { BrnDrawer } from './brn-drawer';

@Directive({
	selector: 'button[brnDrawerTrigger]',
})
export class BrnDrawerTrigger extends BrnDialogTrigger {
	private readonly _drawer = inject(BrnDrawer, { optional: true });

	public readonly direction = input<'bottom' | 'top' | 'left' | 'right' | undefined>(undefined);

	override open() {
		const direction = this.direction();
		if (this._drawer && direction) {
			this._drawer.direction.set(direction);
		}
		super.open();
	}
}
