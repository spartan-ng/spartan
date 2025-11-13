import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDialogOverlay } from '@spartan-ng/brain/dialog';

@Component({
	selector: 'brn-sheet-overlay',
	providers: [provideCustomClassSettableExisting(() => BrnSheetOverlay)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '',
})
export class BrnSheetOverlay extends BrnDialogOverlay {}
