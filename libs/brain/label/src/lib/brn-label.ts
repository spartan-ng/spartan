import { computed, Directive, inject, input } from '@angular/core';
import { BrnField } from '@spartan-ng/brain/field';

@Directive({
	selector: '[brnLabel]',
	host: {
		'[id]': 'id()',
		'[attr.for]': '_for()',
	},
})
export class BrnLabel {
	private static _id = 0;

	private readonly _brnField = inject(BrnField, { optional: true });

	/** The id of the label. */
	public readonly id = input<string>(`brn-label-${++BrnLabel._id}`);

	/** The id of the form control this label is associated with. */
	public readonly for = input<string>();

	protected readonly _for = computed(() => {
		const forValue = this.for();
		if (forValue) return forValue;

		return this._brnField?.labelableId();
	});
}
