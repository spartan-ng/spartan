import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Directive, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnMenuAlign, getBrnMenuAlign } from './brn-menu-align';

@Directive({
	selector: '[brnMenuTriggerFor]',
	standalone: true,
	hostDirectives: [
		{
			directive: CdkMenuTrigger,
			inputs: ['cdkMenuTriggerFor: brnMenuTriggerFor', 'cdkMenuTriggerData: brnMenuTriggerData'],
			outputs: ['cdkMenuOpened: brnMenuOpened', 'cdkMenuClosed: brnMenuClosed'],
		},
	],
})
export class BrnMenuTriggerDirective {
	private readonly _cdkTrigger = inject(CdkMenuTrigger, { host: true });
	public readonly align = input<BrnMenuAlign>(undefined);

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
			if (!align) return;
			this._cdkTrigger.menuPosition = getBrnMenuAlign(align);
		});
	}
}
