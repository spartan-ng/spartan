import { Directive } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';

/** Marks the template the drawer renders in an overlay while open: `<ng-template brnDrawerPortal>`. */
@Directive({
	selector: '[brnDrawerPortal]',
	exportAs: 'brnDrawerPortal',
	providers: [provideExposesStateProviderExisting(() => BrnDrawerPortal)],
})
export class BrnDrawerPortal<T extends Record<string, unknown>> extends BrnDialogContent<T> {}
