import { Directive, forwardRef, input, linkedSignal } from '@angular/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnSheet],brn-sheet',
	exportAs: 'brnSheet',
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => BrnSheet),
		},
	],
})
export class BrnSheet extends BrnDialog {
	/** Specifies the side of the screen where the sheet will appear. */
	public readonly side = input<'top' | 'bottom' | 'left' | 'right'>('top');
	public readonly sideState = linkedSignal(this.side);

	protected override getPositionStrategy() {
		switch (this.sideState()) {
			case 'bottom':
				return this.positionBuilder.global().bottom();
			case 'left':
				return this.positionBuilder.global().left();
			case 'right':
				return this.positionBuilder.global().right();
			case 'top':
				return this.positionBuilder.global().top();
		}
	}
}
