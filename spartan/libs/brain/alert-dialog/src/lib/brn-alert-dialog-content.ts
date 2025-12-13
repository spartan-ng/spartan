import { Directive, forwardRef } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';

@Directive({
    selector: '[brnAlertDialogContent]',
    providers: [
        provideExposesStateProviderExisting(() => forwardRef(() => BrnAlertDialogContent)),
    ],
})
export class BrnAlertDialogContent<T> extends BrnDialogContent<T> {}
