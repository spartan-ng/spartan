import { Directive } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnAlertDialogContent]',
	standalone: true,
	providers: [provideExposesStateProviderExisting(() => BrnAlertDialogContentDirective)],
})
export class BrnAlertDialogContentDirective<T> extends BrnDialogContentDirective<T> {}
