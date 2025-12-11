import { Directive } from '@angular/core';

@Directive({
	selector: '[spartanMainSection]',
	host: {
		class: 'flex flex-col w-full min-h-[calc(100vh-3.5rem)]',
	},
})
export class MainSection {}
