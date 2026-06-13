import { Directive } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnOverlayContent } from '@spartan-ng/brain/overlay';

@Directive({
	selector: '[brnDialogContent]',
	providers: [provideExposesStateProviderExisting(() => BrnDialogContent)],
})
export class BrnDialogContent<T> extends BrnOverlayContent<T> {}
