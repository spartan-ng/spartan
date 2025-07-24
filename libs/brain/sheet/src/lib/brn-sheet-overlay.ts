import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDialogOverlay } from '@spartan-ng/brain/dialog';

@Component({
	selector: 'brn-sheet-overlay',
	providers: [provideCustomClassSettableExisting(() => BrnSheetOverlay)],
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnSheetOverlay extends BrnDialogOverlay {}
