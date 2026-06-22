import { CdkStepLabel } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

@Directive({
	selector: '[spartanStepLabel]',
})
export class SpartanStepLabel extends CdkStepLabel {}
