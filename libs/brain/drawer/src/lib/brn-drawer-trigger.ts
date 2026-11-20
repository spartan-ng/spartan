import { Directive, inject, input } from '@angular/core';
import { BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { BrnDrawer } from './brn-drawer';

/**
 * Opens the enclosing drawer, or the one passed to `brnDrawerTriggerFor` (a trigger outside the
 * drawer). `payload` is exposed as `BrnDrawer.payload()` while the drawer is open.
 */
@Directive({
	selector: 'button[brnDrawerTrigger],button[brnDrawerTriggerFor]',
	exportAs: 'brnDrawerTrigger',
})
export class BrnDrawerTrigger extends BrnDialogTrigger {
	private readonly _drawer = inject(BrnDrawer, { optional: true });

	public readonly brnDrawerTriggerFor = input<BrnDrawer | undefined>(undefined);
	public readonly payload = input<unknown>(undefined);

	protected override getDialog(): BrnDrawer | undefined {
		return this.brnDrawerTriggerFor() ?? this._drawer ?? undefined;
	}

	public override open(): void {
		const drawer = this.getDialog();
		if (!drawer) return;
		drawer.payload.set(this.payload());
		drawer.open();
	}
}
