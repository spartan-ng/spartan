import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

/** Button that moves to the next step in a stepper workflow. */
@Directive({
	selector: 'button[hlmStepperNext]',
	host: {
		class: 'hlm-stepper-next',
		'[type]': 'type',
		'[style.touch-action]': '"manipulation"',
	},
})
export class HlmStepperNext extends CdkStepperNext {}

/** Button that moves to the previous step in a stepper workflow. */
@Directive({
	selector: 'button[hlmStepperPrevious]',
	host: {
		class: 'hlm-stepper-previous',
		'[type]': 'type',
		'[style.touch-action]': '"manipulation"',
	},
})
export class HlmStepperPrevious extends CdkStepperPrevious {}
