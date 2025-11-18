import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDialogOverlay } from '@spartan-ng/brain/dialog';

@Component({
	selector: 'brn-alert-dialog-overlay',
	providers: [provideCustomClassSettableExisting(() => BrnAlertDialogOverlay)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '',
})
export class BrnAlertDialogOverlay extends BrnDialogOverlay {}
