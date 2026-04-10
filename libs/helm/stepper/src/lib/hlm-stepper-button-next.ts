import { CdkStepperNext } from '@angular/cdk/stepper';
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
