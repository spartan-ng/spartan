import { Directive, inject } from '@angular/core';
import {
	type ExposesSide,
	provideExposedSideProviderExisting,
	provideExposesStateProviderExisting,
} from '@spartan-ng/brain/core';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';
import { BrnDrawer } from './brn-drawer';

@Directive({
	selector: '[brnDrawerContent]',
	providers: [
		provideExposesStateProviderExisting(() => BrnDrawerContent),
		provideExposedSideProviderExisting(() => BrnDrawerContent),
	],
})
export class BrnDrawerContent<T> extends BrnDialogContent<T> implements ExposesSide {
	public readonly side = inject(BrnDrawer).directionState;
}
