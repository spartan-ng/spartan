import { Component } from '@angular/core';

@Component({
	selector: 'spartan-side-nav-links',
	host: {
		tabindex: '-1',
		class: 'grid grid-flow-row auto-rows-max',
	},
	template: '<ng-content/>',
})
export class SideNavLinks {}
