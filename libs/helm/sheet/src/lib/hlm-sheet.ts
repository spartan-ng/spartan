import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { BrnSheet } from '@spartan-ng/brain/sheet';
import { HlmSheetOverlay } from './hlm-sheet-overlay';

@Component({
	selector: 'hlm-sheet',
	exportAs: 'hlmSheet',
	imports: [HlmSheetOverlay],
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => BrnSheet),
		},
		{
			provide: BrnOverlay,
			useExisting: forwardRef(() => HlmSheet),
		},
		{
			provide: BrnSheet,
			useExisting: forwardRef(() => HlmSheet),
		},
		provideBrnDialogDefaultOptions({}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sheet-overlay />
		<ng-content />
	`,
})
export class HlmSheet extends BrnSheet {}
