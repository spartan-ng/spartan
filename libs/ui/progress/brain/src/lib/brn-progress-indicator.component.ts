import { Component } from '@angular/core';
import { injectBrnProgress } from './brn-progress.token';

@Component({
	selector: 'brn-progress-indicator',
	standalone: true,
	template: '',
	host: {
		'[attr.data-state]': 'progress.state()',
		'[attr.data-value]': 'progress.value()',
		'[attr.data-max]': 'progress.max()',
	},
})
export class BrnProgressIndicatorComponent {
	protected readonly progress = injectBrnProgress();
}
