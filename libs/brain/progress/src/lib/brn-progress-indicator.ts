import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectBrnProgress } from './brn-progress.token';

@Component({
	selector: 'brn-progress-indicator',
	template: '',
	host: {
		'[attr.data-state]': 'progress.state()',
		'[attr.data-value]': 'progress.value()',
		'[attr.data-max]': 'progress.max()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnProgressIndicator {
	protected readonly progress = injectBrnProgress();
}
