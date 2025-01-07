import { Directive } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnPopoverContent]',
	standalone: true,
	providers: [provideExposesStateProviderExisting(() => BrnPopoverContentDirective)],
})
export class BrnPopoverContentDirective<T> extends BrnDialogContentDirective<T> {}
