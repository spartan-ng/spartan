import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
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
	template: `
		<hlm-drawer-overlay />
		<ng-content />
	`,
})
export class HlmDrawer extends BrnDrawer {}
