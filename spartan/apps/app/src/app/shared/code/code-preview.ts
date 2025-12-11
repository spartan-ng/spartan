import { Directive } from '@angular/core';

@Directive({
	selector: '[spartanCodePreview]',
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center px-4 lg:px-10 py-10 items-center',
	},
})
export class CodePreview {}
