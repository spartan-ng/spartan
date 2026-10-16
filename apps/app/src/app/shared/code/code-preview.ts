import { Directive, inject, input } from '@angular/core';
import { StyleService } from '@spartan-ng/app/app/shared/style.service';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[spartanCodePreview]',
	host: {
		'[attr.data-style]': '_styleService.style()',
	},
})
export class CodePreview {
	protected readonly _styleService = inject(StyleService);

	/** Vertical alignment of the preview. Use `start` for content that grows downward, so the top edge stays put. */
	public readonly align = input<'center' | 'start'>('center');

	constructor() {
		classes(() => [
			'preview flex min-h-[350px] w-full justify-center px-4 py-10 lg:px-10',
			`style-${this._styleService.style()}`,
			this.align() === 'start' ? 'items-start' : 'items-center',
		]);
	}
}
