import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { HlmDialogOverlay } from './hlm-dialog-overlay';

@Component({
	selector: 'hlm-dialog',
	exportAs: 'hlmDialog',
	imports: [HlmDialogOverlay],
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => HlmDialog),
		},
		{
			provide: BrnOverlay,
			useExisting: forwardRef(() => HlmDialog),
		},
		provideBrnDialogDefaultOptions({}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog-overlay />
		<ng-content />
	`,
})
export class HlmDialog extends BrnDialog {}
