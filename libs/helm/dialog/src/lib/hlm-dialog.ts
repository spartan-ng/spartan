import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BrnDialog, BrnDialogOverlay, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { HlmDialogOverlay } from './hlm-dialog-overlay';

@Component({
	selector: 'hlm-dialog',
	exportAs: 'hlmDialog',
	imports: [BrnDialogOverlay, HlmDialogOverlay],
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => HlmDialog),
		},
		provideBrnDialogDefaultOptions({
			// add custom options here
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-dialog-overlay hlm />
		<ng-content />
	`,
})
export class HlmDialog extends BrnDialog {}
