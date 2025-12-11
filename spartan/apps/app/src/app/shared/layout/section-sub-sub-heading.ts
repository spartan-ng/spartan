import { Directive } from '@angular/core';

@Directive({
	selector: '[spartanH4]',
	host: {
		class: 'font-heading mt-8 scroll-m-28 text-lg font-medium tracking-tight',
	},
})
export class SectionSubSubHeading {}
