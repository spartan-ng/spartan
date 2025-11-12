import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'brn-switch-thumb',
	host: {
		role: 'presentation',
		'(click)': '$event.preventDefault()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '',
})
export class BrnSwitchThumb {}
