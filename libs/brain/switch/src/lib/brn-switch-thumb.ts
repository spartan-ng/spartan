import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'brn-switch-thumb',
	template: '',
	host: {
		role: 'presentation',
		'(click)': '$event.preventDefault()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnSwitchThumb {}
