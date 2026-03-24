import { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	EffectRef,
	inject,
	input,
	OnDestroy,
} from '@angular/core';
import { BrnField } from '@spartan-ng/brain/field';
import { classes } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';
import { HlmFieldA11yService } from './hlm-field-aria.service';

@Component({
	selector: 'hlm-field-error',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		role: 'alert',
		'data-slot': 'field-error',
		'[attr.id]': '_computedId()',
		'[hidden]': '!_hasError()',
	},
	template: `
		@if (_hasError()) {
			<ng-content />
		}
	`,
})
export class HlmFieldError implements OnDestroy {
	private static _nextId = 0;

	private readonly _field = inject(BrnField, { optional: true });
	private readonly _a11y = inject(HlmFieldA11yService, { optional: true, host: true });

	private _registeredId?: string;

	private readonly _autoId = `hlm-field-error-${++HlmFieldError._nextId}`;

	/** The unique ID for the field error. If none is supplied, it will be auto-generated. */
	public readonly id = input<string | undefined>(undefined);

	/** Additional CSS classes to apply to the field error element. */
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/**
	 * The name of the specific validator error key to match (e.g. 'required').
	 * When omitted, the error is shown if any validation error is present.
	 */
	public readonly validator = input<string>();

	/** Forces the error message to be visible regardless of the control's validation state. */
	public readonly forceShow = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _computedId = computed(() => this.id() ?? this._autoId);

	protected readonly _hasError = computed(() => {
		if (this.forceShow()) return true;

		const errors = this._field?.errors() ?? {};
		const validator = this.validator();
		const spartanInvalid = this._field?.controlState()?.spartanInvalid;

		if (!spartanInvalid) return false;

		return validator ? validator in errors : Object.keys(errors).length > 0;
	});

	constructor() {
		classes(() => ['text-destructive text-sm font-normal', this.userClass()]);
	}

	private readonly _cleanup: EffectRef | null = this._a11y
		? effect(() => {
				const a11y = this._a11y;
				if (!a11y) return;

				const id = this._computedId();
				const hasError = this._hasError();

				if (this._registeredId && (this._registeredId !== id || !hasError)) {
					a11y.unregisterError(this._registeredId);
					this._registeredId = undefined;
				}

				if (hasError && this._registeredId !== id) {
					a11y.registerError(id);
					this._registeredId = id;
				}
			})
		: null;

	ngOnDestroy() {
		this._cleanup?.destroy();

		if (this._registeredId) {
			this._a11y?.unregisterError(this._registeredId);
		}
	}
}
