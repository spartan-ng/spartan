import { CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

/** Button that moves to the previous step in a stepper workflow. */
@Directive({
	selector: 'button[spartanStepperPrevious]',
	host: {
		class: 'spartan-stepper-previous',
		'[type]': 'type',
		'[style.touch-action]': '"manipulation"',
	},
})
export class SpartanStepperPrevious extends CdkStepperPrevious {}
