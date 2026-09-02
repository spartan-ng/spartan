import { Directive, input } from '@angular/core';
import { BrnQuestionnaireSubmit } from '@spartan-ng/brain/questionnaire';
import { type ButtonVariants, buttonVariants } from '@spartan-ng/helm/button';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmQuestionnaireSubmit]',
	exportAs: 'hlmQuestionnaireSubmit',
	hostDirectives: [
		{
			directive: BrnQuestionnaireSubmit,
			inputs: ['disabled'],
		},
	],
	host: {
		'data-slot': 'questionnaire-submit',
		'[attr.data-size]': 'size()',
		'[attr.data-variant]': 'variant()',
	},
})
export class HlmQuestionnaireSubmit {
	public readonly variant = input<ButtonVariants['variant']>('default');
	public readonly size = input<ButtonVariants['size']>('default');

	constructor() {
		classes(() => [
			buttonVariants({ variant: this.variant(), size: this.size() }),
			'col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0',
		]);
	}
}
