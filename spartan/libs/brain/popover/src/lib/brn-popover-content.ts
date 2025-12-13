import { Directive, forwardRef } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';

@Directive({
    selector: '[brnPopoverContent]',
    providers: [provideExposesStateProviderExisting(() => forwardRef(() => BrnPopoverContent))],
})
export class BrnPopoverContent<T> extends BrnDialogContent<T> {}
