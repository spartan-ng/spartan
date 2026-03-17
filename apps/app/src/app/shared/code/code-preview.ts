import { Directive, inject } from '@angular/core';
import { StyleService } from '@spartan-ng/app/app/shared/style.service';

@Directive({
	selector: '[spartanCodePreview]',
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center px-4 lg:px-10 py-10 items-center',

		'[attr.data-style]': '_styleService.style()',
		'[class]': '"style-"+_styleService.style()',
	},
})
export class CodePreview {
	protected readonly _styleService = inject(StyleService);
}
