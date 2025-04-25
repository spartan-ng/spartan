import { Component } from '@angular/core';

@Component({
	selector: 'brn-switch-thumb',
	imports: [],
	template: '',
	host: {
		role: 'presentation',
		'(click)': '$event.preventDefault()',
	},
})
export class BrnSwitchThumbComponent {}
