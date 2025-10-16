import { Directive, inject } from '@angular/core';
import {
	type ExposesSide,
	provideExposedSideProviderExisting,
	provideExposesStateProviderExisting,
} from '@spartan-ng/brain/core';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';
import { BrnSheet } from './brn-sheet';

@Directive({
	selector: '[brnSheetContent]',
	providers: [
		provideExposesStateProviderExisting(() => BrnSheetContent),
		provideExposedSideProviderExisting(() => BrnSheetContent),
	],
})
export class BrnSheetContent<T> extends BrnDialogContent<T> implements ExposesSide {
	public readonly side = inject(BrnSheet).sideState;
}
