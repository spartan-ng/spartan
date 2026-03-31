import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, input, signal } from '@angular/core';
import { BrnFieldA11yService } from './brn-field-aria.service';
import { BrnFieldControl } from './brn-field-control';
import { BrnLabelable } from './brn-labelable';

@Directive({
	selector: '[brnField],brn-field',
	providers: [BrnFieldA11yService],
	host: {
		'[attr.data-invalid]': '_invalid() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid() ? "true" : null',
		'[attr.data-touched]': '_touched() ? "true" : null',
		'[attr.data-dirty]': '_dirty() ? "true" : null',
	},
})
export class BrnField {
	private readonly _brnFieldControl = signal<BrnFieldControl | null>(null);
	private readonly _labelable = signal<BrnLabelable | null>(null);

	/** Whether the field is invalid. Overrides the `data-invalid` attribute. */
	public readonly dataInvalid = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
		alias: 'data-invalid',
	});

	/**
	 * Whether to force the field into an invalid state, regardless of the form control's state.
	 * Overrides both the `data-invalid` and `data-matches-spartan-invalid` attributes.
	 */
	public readonly forceInvalid = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	protected readonly _invalid = computed(() => {
		if (this.forceInvalid() || this.dataInvalid()) return true;

		const control = this._brnFieldControl();
		if (!control || !control.ngControl) return false;

		return control.controlState()?.invalid;
	});

	protected readonly _spartanInvalid = computed(() => {
		return this.forceInvalid() || (this._brnFieldControl()?.controlState()?.spartanInvalid ?? null);
	});

	protected readonly _dirty = computed(() => {
		return this._brnFieldControl()?.controlState()?.dirty ?? null;
	});

	protected readonly _touched = computed(() => {
		return this._brnFieldControl()?.controlState()?.touched ?? null;
	});

	public readonly labelableId = computed(() => this._brnFieldControl()?.id?.() ?? this._labelable()?.labelableId());

	public readonly errors = computed(() => this._brnFieldControl()?.errors() ?? null);
	public readonly controlState = computed(() => this._brnFieldControl()?.controlState() ?? null);

	public registerFieldControl(fieldControl: BrnFieldControl) {
		this._brnFieldControl.set(fieldControl);
	}

	public registerLabelable(labelable: BrnLabelable) {
		this._labelable.set(labelable);
	}
}
