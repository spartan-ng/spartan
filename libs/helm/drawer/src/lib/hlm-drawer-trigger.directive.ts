import { Directive } from '@angular/core';
import { BrnDrawerTrigger } from '@spartan-ng/brain/drawer';

/**
 * Themed wrapper around `BrnDrawerTrigger`. Applies the spartan trigger
 * `data-slot` attribute and forwards all inputs through `hostDirectives`,
 * so styling can hook on `[data-slot="drawer-trigger"]` and the consumer's
 * markup remains the same as for the brain primitive.
 *
 * Usage:
 * ```html
 * <button hlmBtn hlmDrawerTrigger [hlmDrawerTriggerFor]="myDrawer.drawer">
 *   Open
 * </button>
 * <hlm-drawer #myDrawer="hlmDrawer">…</hlm-drawer>
 * ```
 */
@Directive({
	selector: 'button[hlmDrawerTrigger],button[hlmDrawerTriggerFor]',
	hostDirectives: [
		{
			directive: BrnDrawerTrigger,
			inputs: ['id', 'brnDrawerTriggerFor: hlmDrawerTriggerFor', 'type'],
		},
	],
	host: {
		'data-slot': 'drawer-trigger',
	},
})
export class HlmDrawerTrigger {}
