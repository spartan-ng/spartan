import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { BrnDrawer } from '@spartan-ng/brain/drawer';
import { HlmDrawerOverlay } from './hlm-drawer-overlay';

@Component({
	selector: 'hlm-drawer',
	exportAs: 'hlmDrawer',
	imports: [HlmDrawerOverlay],
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => HlmDrawer),
		},
		{
			provide: BrnDrawer,
			useExisting: forwardRef(() => HlmDrawer),
		},
		provideBrnDialogDefaultOptions({
			// add custom options here
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { 'data-slot': 'drawer' },
	template: `
		<hlm-drawer-overlay />
		<ng-content />
	`,
})
export class HlmDrawer extends BrnDrawer {
	/** Renders a swipe handle at the edge of the drawer. */
	public readonly showSwipeHandle = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
}
