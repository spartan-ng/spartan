import { CdkStepLabel } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

@Directive({
	selector: '[hlmStepLabel]',
})
export class HlmStepLabel extends CdkStepLabel {}
