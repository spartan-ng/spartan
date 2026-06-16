import { CdkStepperNext } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

/** Button that moves to the next step in a stepper workflow. */
@Directive({
	selector: 'button[spartanStepperNext]',
	host: {
		class: 'spartan-stepper-next',
		'[type]': 'type',
		'[style.touch-action]': '"manipulation"',
	},
})
export class SpartanStepperNext extends CdkStepperNext {}
