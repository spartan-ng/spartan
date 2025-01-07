import { Directive, inject } from '@angular/core';
import {
	type ExposesSide,
	provideExposedSideProviderExisting,
	provideExposesStateProviderExisting,
} from '@spartan-ng/brain/core';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import { BrnSheetComponent } from './brn-sheet.component';

@Directive({
	selector: '[brnSheetContent]',
	standalone: true,
	providers: [
		provideExposesStateProviderExisting(() => BrnSheetContentDirective),
		provideExposedSideProviderExisting(() => BrnSheetContentDirective),
	],
})
export class BrnSheetContentDirective<T> extends BrnDialogContentDirective<T> implements ExposesSide {
	public readonly side = inject(BrnSheetComponent).side;
}
