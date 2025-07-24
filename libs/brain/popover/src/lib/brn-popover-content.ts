import { Directive } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnPopoverContent]',
	providers: [provideExposesStateProviderExisting(() => BrnPopoverContent)],
})
export class BrnPopoverContent<T> extends BrnDialogContent<T> {}
