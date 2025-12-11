import { Directive } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnAlertDialogContent]',
	providers: [provideExposesStateProviderExisting(() => BrnAlertDialogContent)],
})
export class BrnAlertDialogContent<T> extends BrnDialogContent<T> {}
