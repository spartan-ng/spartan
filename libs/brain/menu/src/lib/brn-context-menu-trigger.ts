import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { Directive, effect, inject, input, type TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type BrnMenuAlign, BrnMenuSide, getBrnMenuPosition } from './brn-menu-align';

@Directive({
	selector: '[brnCtxMenuTriggerFor]',
	hostDirectives: [CdkContextMenuTrigger],
})
export class BrnContextMenuTrigger {
	private readonly _cdkTrigger = inject(CdkContextMenuTrigger, { host: true });
	public readonly brnCtxMenuTriggerFor = input<TemplateRef<unknown> | null>(null);
	public readonly brnCtxMenuTriggerData = input<unknown>(undefined);
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

		effect(() => (this._cdkTrigger.menuTemplateRef = this.brnCtxMenuTriggerFor()));
		effect(() => (this._cdkTrigger.menuData = this.brnCtxMenuTriggerData()));
		effect(() => {
			const align = this.align();
			const side = this.side();
			this._cdkTrigger.menuPosition = getBrnMenuPosition(align, side);
		});
	}
}
