import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDialogOverlay } from '@spartan-ng/brain/dialog';

@Component({
	selector: 'brn-alert-dialog-overlay',
	providers: [provideCustomClassSettableExisting(() => BrnAlertDialogOverlay)],
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnAlertDialogOverlay extends BrnDialogOverlay {}
