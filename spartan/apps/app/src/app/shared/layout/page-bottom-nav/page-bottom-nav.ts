import { Component } from '@angular/core';

@Component({
	selector: 'spartan-page-bottom-nav',
	host: {
		class: 'mt-12 flex flex-row-reverse items-center justify-between',
	},
	template: `
		<ng-content />
	`,
})
export class PageBottomNav {}
