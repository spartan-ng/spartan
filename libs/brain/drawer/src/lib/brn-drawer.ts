import { Directive, effect, forwardRef, input, linkedSignal, untracked } from '@angular/core';
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

	constructor() {
		super();
		effect(() => {
			const direction = this.directionState();
			untracked(() => {
				if (direction === 'bottom') {
					this.mutablePositionStrategy.set(this.positionBuilder.global().bottom());
				}
				if (direction === 'top') {
					this.mutablePositionStrategy.set(this.positionBuilder.global().top());
				}
				if (direction === 'left') {
					this.mutablePositionStrategy.set(this.positionBuilder.global().left());
				}
				if (direction === 'right') {
					this.mutablePositionStrategy.set(this.positionBuilder.global().right());
				}
			});
		});
	}
}
