import { Directive } from '@angular/core';

@Directive({
	selector: '[brnSelectList]',
	host: {
		role: 'listbox',
	},
})
export class BrnSelectList {}
