import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'brn-switch-thumb',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		role: 'presentation',
		'(click)': '$event.preventDefault()',
	},
	template: '',
})
export class BrnSwitchThumb {}
