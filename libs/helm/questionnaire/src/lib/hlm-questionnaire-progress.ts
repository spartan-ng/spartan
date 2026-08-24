import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BrnQuestionnaireProgress } from '@spartan-ng/brain/questionnaire';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- attribute selector matching brain API
	selector: '[hlmQuestionnaireProgress]',
	exportAs: 'hlmQuestionnaireProgress',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnQuestionnaireProgress, inputs: ['ariaLabel', 'valueText'] }],
	host: {
		'data-slot': 'questionnaire-progress',
	},
	template: `
		{{ _progress.label() }}
	`,
})
export class HlmQuestionnaireProgress {
	protected readonly _progress = inject(BrnQuestionnaireProgress);

	constructor() {
		classes(() => 'spartan-questionnaire-progress min-h-[1lh] w-fit min-w-[14ch] tabular-nums');
	}
}
