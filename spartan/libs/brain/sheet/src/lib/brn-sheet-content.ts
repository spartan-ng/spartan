import { Directive, inject, forwardRef } from '@angular/core';
import {
	type ExposesSide,
	provideExposedSideProviderExisting,
	provideExposesStateProviderExisting,
} from '@spartan-ng/brain/core';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnSheetContent]',
	providers: [
		provideExposesStateProviderExisting(() => BrnSheetContent),
		provideExposedSideProviderExisting(() => BrnSheetContent),
	],
})
export class BrnSheetContent<T> extends BrnDialogContent<T> implements ExposesSide {
	// lazily resolve the BrnSheet provider at runtime to avoid IIC
	public readonly side = inject<any>(
		forwardRef(() => (require('./brn-sheet') as any).BrnSheet)
	).sideState;
}
