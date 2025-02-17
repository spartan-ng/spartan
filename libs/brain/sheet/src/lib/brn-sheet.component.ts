import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	forwardRef,
	input,
	signal,
	untracked,
	ViewEncapsulation,
} from '@angular/core';
import { BrnDialogComponent } from '@spartan-ng/brain/dialog';

@Component({
	selector: 'brn-sheet',
	standalone: true,
	template: `
		<ng-content />
	`,
	providers: [
		{
			provide: BrnDialogComponent,
			useExisting: forwardRef(() => BrnSheetComponent),
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'brnSheet',
})
export class BrnSheetComponent extends BrnDialogComponent {
	public readonly sideInput = input<'top' | 'bottom' | 'left' | 'right'>('top', { alias: 'side' });
	public readonly sideInputState = computed(() => signal(this.sideInput()));
	public readonly side = computed(() => this.sideInputState().asReadonly()());
	constructor() {
		super();
		effect(() => {
			const side = this.side();
			untracked(() => {
				if (side === 'top') {
					this.mutablePositionStrategy().set(this.positionBuilder.global().top());
				}
				if (side === 'bottom') {
					this.mutablePositionStrategy().set(this.positionBuilder.global().bottom());
				}
				if (side === 'left') {
					this.mutablePositionStrategy().set(this.positionBuilder.global().left());
				}
				if (side === 'right') {
					this.mutablePositionStrategy().set(this.positionBuilder.global().right());
				}
			});
		});
	}
}
