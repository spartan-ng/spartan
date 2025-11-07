import {
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	contentChildren,
	effect,
	input,
} from '@angular/core';
import { BrnFormFieldControl, BrnFormFieldDirective } from '@spartan-ng/brain/form-field';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmError } from './hlm-error';

@Component({
	selector: 'hlm-form-field',
	template: `
		<ng-content />
		<ng-content select="hlm-hint" />
		<ng-content select="hlm-error" />
	`,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnFormFieldDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmFormField {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('block space-y-2', this.userClass()));
	public readonly control = contentChild(BrnFormFieldControl, { descendants: true });

	public readonly errorChildren = contentChildren(HlmError);

	protected readonly _hasDisplayedMessage = computed<'error' | 'hint'>(() =>
		this.errorChildren() && this.errorChildren().length > 0 && this.control()?.errorState() ? 'error' : 'hint',
	);

	constructor() {
		effect(() => {
			if (!this.control()) {
				throw new Error('hlm-form-field must contain a BrnFormFieldControl.');
			}
		});
	}
}
