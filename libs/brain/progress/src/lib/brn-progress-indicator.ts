import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectBrnProgress } from './brn-progress.token';

@Component({
	selector: 'brn-progress-indicator',
	template: '',
	host: {
		'[attr.data-state]': '_progress.state()',
		'[attr.data-value]': '_progress.value()',
		'[attr.data-max]': '_progress.max()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnProgressIndicator {
	protected readonly _progress = injectBrnProgress();
}
