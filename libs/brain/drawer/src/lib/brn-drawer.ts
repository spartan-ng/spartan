import { Directive, forwardRef, input, linkedSignal } from '@angular/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnDrawer],brn-drawer',
	exportAs: 'brnDrawer',
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => BrnDrawer),
		},
	],
})
export class BrnDrawer extends BrnDialog {
	public readonly directionInput = input<'bottom' | 'top' | 'left' | 'right'>('bottom', { alias: 'direction' });
	public readonly direction = linkedSignal(this.directionInput);

	protected override getPositionStrategy() {
		switch (this.direction()) {
			case 'bottom':
				return this._positionBuilder.global().bottom();
			case 'top':
				return this._positionBuilder.global().top();
			case 'left':
				return this._positionBuilder.global().left();
			case 'right':
				return this._positionBuilder.global().right();
		}
	}
}
