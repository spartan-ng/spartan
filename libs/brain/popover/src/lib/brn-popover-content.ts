import { Directive } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnOverlayContent } from '@spartan-ng/brain/overlay';

@Directive({
	selector: '[brnPopoverContent]',
	providers: [provideExposesStateProviderExisting(() => BrnPopoverContent)],
})
export class BrnPopoverContent<T> extends BrnOverlayContent<T> {}
