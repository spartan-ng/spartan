import { Directive, forwardRef } from '@angular/core';
import { BrnOverlay, type BrnOverlayDefaultOptions } from '@spartan-ng/brain/overlay';
import { injectBrnDialogDefaultOptions } from './brn-dialog-token';

@Directive({
	selector: '[brnDialog],brn-dialog',
	exportAs: 'brnDialog',
	providers: [
		{
			provide: BrnOverlay,
			useExisting: forwardRef(() => BrnDialog),
		},
	],
})
export class BrnDialog<
	TResult = unknown,
	TContext extends Record<string, unknown> = Record<string, unknown>,
> extends BrnOverlay<TResult, TContext> {
	protected override getDefaultOptions(): BrnOverlayDefaultOptions {
		return injectBrnDialogDefaultOptions();
	}
}
