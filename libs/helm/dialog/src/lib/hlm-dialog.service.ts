import type { ComponentType } from '@angular/cdk/portal';
import { Injectable, type TemplateRef, inject } from '@angular/core';
import {
	type BrnDialogOptions,
	BrnDialogService,
	DEFAULT_BRN_DIALOG_OPTIONS,
	cssClassesToArray,
	injectBrnDialogDefaultOptions,
} from '@spartan-ng/brain/dialog';
import { HlmDialogContent } from './hlm-dialog-content';
import { hlmDialogOverlayClass } from './hlm-dialog-overlay';

export type HlmDialogOptions<DialogContext = unknown> = BrnDialogOptions & {
	contentClass?: string;
	context?: DialogContext;
};

@Injectable({
	providedIn: 'root',
})
export class HlmDialogService {
	private readonly _defaultOptions = injectBrnDialogDefaultOptions();
	private readonly _brnDialogService = inject(BrnDialogService);

	public open(component: ComponentType<unknown> | TemplateRef<unknown>, options?: Partial<HlmDialogOptions>) {
		const mergedOptions = {
			...DEFAULT_BRN_DIALOG_OPTIONS,
			...this._defaultOptions,

			...(options ?? {}),
			backdropClass: cssClassesToArray(`${hlmDialogOverlayClass} ${options?.backdropClass ?? ''}`),
			context: {
				...(options?.context && typeof options.context === 'object' ? options.context : {}),
				$component: component,
				$dynamicComponentClass: options?.contentClass,
			},
		};

		return this._brnDialogService.open(HlmDialogContent, undefined, mergedOptions.context, mergedOptions);
	}
}
