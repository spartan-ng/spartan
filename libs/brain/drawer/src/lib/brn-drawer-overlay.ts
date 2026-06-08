import { Directive, inject } from '@angular/core';
import { BrnDrawer } from './brn-drawer';

/**
 * The backdrop element behind the drawer. Host bindings reflect the dynamic
 * opacity (fades linearly with drag progress) and pointer-events (disabled
 * when fully transparent). A click on the backdrop is routed to the
 * coordinator which closes the drawer unless `disableDismiss` is set.
 */
@Directive({
	selector: '[brnDrawerOverlay]',
	host: {
		'[style.opacity]': '_drawer.backdropOpacity()',
		'[style.pointer-events]': '_drawer.backdropPointerEvents()',
		'(click)': '_drawer.onBackdropTap()',
	},
})
export class BrnDrawerOverlay {
	protected readonly _drawer = inject(BrnDrawer);
}
