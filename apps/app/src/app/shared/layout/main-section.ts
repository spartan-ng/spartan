import { Directive } from '@angular/core';

@Directive({
	selector: '[spartanMainSection]',
	host: {
		class: 'flex flex-col p-1 sm:p-0 w-full min-h-[calc(100vh-3.5rem)]',
	},
})
export class MainSection {}
