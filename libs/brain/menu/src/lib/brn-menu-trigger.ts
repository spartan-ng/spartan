import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Directive, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type BrnMenuAlign, BrnMenuSide, getBrnMenuPosition } from './brn-menu-align';

@Directive({
	selector: '[brnMenuTriggerFor]',
	hostDirectives: [
		{
			directive: CdkMenuTrigger,
			inputs: ['cdkMenuTriggerFor: brnMenuTriggerFor', 'cdkMenuTriggerData: brnMenuTriggerData'],
			outputs: ['cdkMenuOpened: brnMenuOpened', 'cdkMenuClosed: brnMenuClosed'],
		},
	],
})
export class BrnMenuTrigger {
	private readonly _cdkTrigger = inject(CdkMenuTrigger, { host: true });
	public readonly align = input<BrnMenuAlign>('center');
	public readonly side = input<BrnMenuSide>('bottom');

	constructor() {
		// once the trigger opens we wait until the next tick and then grab the last position
		// used to position the menu. we store this in our trigger which the brnMenu directive has
		// access to through DI
		this._cdkTrigger.opened.pipe(takeUntilDestroyed()).subscribe(() =>
			setTimeout(
				() =>
					// eslint-disable-next-line
					((this._cdkTrigger as any)._spartanLastPosition = // eslint-disable-next-line
						(this._cdkTrigger as any).overlayRef._positionStrategy._lastPosition),
			),
		);

		effect(() => {
			const align = this.align();
			const side = this.side();
			this._cdkTrigger.menuPosition = getBrnMenuPosition(align, side);
		});
	}
}
