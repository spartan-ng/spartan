import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';
import { BrnFieldControl, provideBrnLabelable } from '@spartan-ng/brain/field';

@Directive({
	selector: '[brnTextarea]',
	providers: [provideBrnLabelable(BrnTextarea)],
	hostDirectives: [BrnFieldControl],
	host: {
		'[id]': 'id()',
		'[attr.aria-invalid]': '_ariaInvalid?.() ? "true" : null',
		'[attr.data-invalid]': '_ariaInvalid?.() ? "true" : null',
		'[attr.data-touched]': '_touched?.() ? "true" : null',
		'[attr.data-dirty]': '_dirty?.() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid() ? "true" : null',
	},
})
export class BrnTextarea {
	private static _id = 0;

	private readonly _fieldControl = inject(BrnFieldControl, { optional: true });

	/** The id of the textarea. */
	public readonly id = input<string | undefined>(`brn-textarea-${++BrnTextarea._id}`);

	/** Whether to force the textarea into an invalid state. */
	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	public readonly labelableId = this.id;

	protected readonly _ariaInvalid = this._fieldControl?.invalid;
	protected readonly _touched = this._fieldControl?.touched;
	protected readonly _dirty = this._fieldControl?.dirty;
	protected readonly _spartanInvalid = computed(() => this.forceInvalid() || this._fieldControl?.spartanInvalid());
}
