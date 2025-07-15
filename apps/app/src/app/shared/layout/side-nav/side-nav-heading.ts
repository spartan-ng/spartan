import { Directive } from '@angular/core';

@Directive({
	selector: '[spartanSideNavHeading]',
	host: {
		class: 'flex items-center justify-between mb-1 rounded-md px-2 py-1 font-semibold',
	},
})
export class SideNavHeading {}
