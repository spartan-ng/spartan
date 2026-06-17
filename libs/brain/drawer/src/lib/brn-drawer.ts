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
	public readonly direction = input<'bottom' | 'top' | 'left' | 'right'>('bottom');
	public readonly directionState = linkedSignal(() => this.direction());

	protected override getPositionStrategy() {
		switch (this.directionState()) {
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
