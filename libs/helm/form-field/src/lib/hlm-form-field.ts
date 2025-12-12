import { ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, effect } from '@angular/core';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { classes } from '@spartan-ng/helm/utils';
import { HlmError } from './hlm-error';

@Component({
	selector: 'hlm-form-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-content />

		@switch (_hasDisplayedMessage()) {
			@case ('error') {
				<ng-content select="hlm-error" />
			}
			@default {
				<ng-content select="hlm-hint" />
			}
		}
	`,
})
export class HlmFormField {
	public readonly control = contentChild(BrnFormFieldControl);

	public readonly errorChildren = contentChildren(HlmError);

	protected readonly _hasDisplayedMessage = computed<'error' | 'hint'>(() =>
		this.errorChildren() && this.errorChildren().length > 0 && this.control()?.errorState() ? 'error' : 'hint',
	);

	constructor() {
		classes(() => 'block space-y-2');
		effect(() => {
			if (!this.control()) {
				throw new Error('hlm-form-field must contain a BrnFormFieldControl.');
			}
		});
	}
}
