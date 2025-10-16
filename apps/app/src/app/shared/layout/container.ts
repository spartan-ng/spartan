import { Directive } from '@angular/core';

@Directive({
	selector: '[spartanContainer]',
	host: {
		class:
			'w-full mx-auto flex flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:gap-10',
	},
})
export class Container {}
