import { contentChild, contentChildren, Directive, effect } from '@angular/core';
import { BrnInputDirective } from '@spartan-ng/brain/input';
import { BrnErrorDirective } from './brn-error.directive';
import { BrnFormFieldControl } from './brn-form-field-control';
import { BrnHintDirective } from './brn-hint.directive';

@Directive({
	selector: '[brnFormField]',
	standalone: true,
})
export class BrnFormFieldDirective {
	public readonly hintChildren = contentChildren(BrnHintDirective);
	public readonly errorChildren = contentChildren(BrnErrorDirective);
	public readonly control = contentChild(BrnFormFieldControl);
	public readonly input = contentChild(BrnInputDirective);

	constructor() {
		effect(() => {
			if (this.input()) {
				if (this.errorChildren()?.length && this.control()?.errorState()) {
					const errorIds = this.errorChildren().map((error) => error.id());
					this.input()!.setAriaDescribedBy(errorIds.join(' '));
				} else if (this.hintChildren()?.length) {
					const hintIds = this.hintChildren().map((hint) => hint.id());
					this.input()!.setAriaDescribedBy(hintIds.join(' '));
				}
			}
		});
	}
}
