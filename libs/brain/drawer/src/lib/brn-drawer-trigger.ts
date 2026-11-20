import { booleanAttribute, Directive, inject, input } from '@angular/core';
import { BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { BrnDrawer } from './brn-drawer';

/**
 * Opens the enclosing drawer, or the one passed to `brnDrawerTriggerFor` (a trigger outside the
 * drawer). `payload` is exposed as `BrnDrawer.payload()` while the drawer is open. Only the
 * trigger that opened the drawer reports it as expanded.
 */
@Directive({
	selector: 'button[brnDrawerTrigger],button[brnDrawerTriggerFor]',
	exportAs: 'brnDrawerTrigger',
	host: {
		'[disabled]': 'disabled()',
		'[attr.data-disabled]': 'disabled() ? "" : null',
	},
})
export class BrnDrawerTrigger extends BrnDialogTrigger {
	private readonly _drawer = inject(BrnDrawer, { optional: true });

	public readonly brnDrawerTriggerFor = input<BrnDrawer | undefined>(undefined);
	public readonly payload = input<unknown>(undefined);
	/** Whether the button is disabled. */
	public readonly disabled = input(false, { transform: booleanAttribute });

	protected override getDialog(): BrnDrawer | undefined {
		return this.brnDrawerTriggerFor() ?? this._drawer ?? undefined;
	}

	protected override isActiveTrigger(): boolean {
		return this.getDialog()?.activeTrigger() === this;
	}

	public override open(): void {
		const drawer = this.getDialog();
		if (!drawer) return;
		drawer.payload.set(this.payload());
		drawer.activeTrigger.set(this);
		drawer.open();
	}
}
