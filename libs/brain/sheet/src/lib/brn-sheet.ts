import {
	ChangeDetectionStrategy,
	Component,
	effect,
	forwardRef,
	input,
	linkedSignal,
	untracked,
	ViewEncapsulation,
} from '@angular/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';

@Component({
	selector: 'brn-sheet',
	exportAs: 'brnSheet',
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => BrnSheet),
		},
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-content />
	`,
})
export class BrnSheet extends BrnDialog {
	/** Specifies the side of the screen where the sheet will appear. */
	public readonly side = input<'top' | 'bottom' | 'left' | 'right'>('top');
	public readonly sideState = linkedSignal(() => this.side());
	constructor() {
		super();
		effect(() => {
			const side = this.sideState();
			untracked(() => {
				if (side === 'top') {
					this.mutablePositionStrategy.set(this.positionBuilder.global().top());
				}
				if (side === 'bottom') {
					this.mutablePositionStrategy.set(this.positionBuilder.global().bottom());
				}
				if (side === 'left') {
					this.mutablePositionStrategy.set(this.positionBuilder.global().left());
				}
				if (side === 'right') {
					this.mutablePositionStrategy.set(this.positionBuilder.global().right());
				}
			});
		});
	}
}
