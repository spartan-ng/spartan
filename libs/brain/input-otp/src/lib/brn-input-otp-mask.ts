import { Directive, input } from '@angular/core';

@Directive({
	selector: '[brnInputOtpMask]',
})
export class BrnInputOtpMask {
	/* Determine if the input should be masked */
	public readonly mask = input<boolean | undefined>(undefined);
}
