import { DIALOG_DATA } from '@angular/cdk/dialog';
import type { ComponentType } from '@angular/cdk/overlay';
import { inject, Injectable, type InjectOptions, type TemplateRef, type ViewContainerRef } from '@angular/core';
import {
	BRN_OVERLAY_DATA,
	type BrnOverlayContext,
	BrnOverlayService,
	injectBrnOverlayContext,
} from '@spartan-ng/brain/overlay';
import type { BrnDialogOptions } from './brn-dialog-options';
import type { BrnDialogRef } from './brn-dialog-ref';
import { injectBrnDialogDefaultOptions } from './brn-dialog-token';

export type BrnDialogContext<T> = BrnOverlayContext<T>;

/** @deprecated Use `injectBrnDialogContext` instead. */
export const injectBrnDialogCtx = <T>(): BrnDialogContext<T> => {
	return inject(DIALOG_DATA);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const injectBrnDialogContext = <DialogContext = any>(options: InjectOptions = {}) => {
	return inject(BRN_OVERLAY_DATA, options) as DialogContext;
};

@Injectable({ providedIn: 'root' })
export class BrnDialogService {
	private readonly _overlayService = inject(BrnOverlayService);
	private readonly _defaultOptions = injectBrnDialogDefaultOptions();

	public open<DialogContext, DialogResult = unknown>(
		content: ComponentType<unknown> | TemplateRef<unknown>,
		vcr?: ViewContainerRef,
		context?: DialogContext,
		options?: Partial<BrnDialogOptions>,
	): BrnDialogRef<DialogResult> {
		return this._overlayService.open<DialogContext, DialogResult>(content, vcr, context, {
			...this._defaultOptions,
			...options,
		});
	}
}

export { injectBrnOverlayContext };
