import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { BrnSheet, BrnSheetOverlay } from '@spartan-ng/brain/sheet';
import { HlmSheetOverlay } from './hlm-sheet-overlay';

@Component({
	selector: 'hlm-sheet',
	imports: [BrnSheetOverlay, HlmSheetOverlay],
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => BrnSheet),
		},
		{
			provide: BrnSheet,
			useExisting: forwardRef(() => HlmSheet),
		},
		provideBrnDialogDefaultOptions({
			// add custom options here
		}),
	],
	template: `
		<brn-sheet-overlay hlm />
		<ng-content />
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	exportAs: 'hlmSheet',
})
export class HlmSheet extends BrnSheet {}
