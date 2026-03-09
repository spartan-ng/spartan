import {
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

	public readonly id = input<string | undefined>(undefined);
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly validator = input<string>();

	protected readonly _computedId = computed(() => this.id() ?? this._autoId);

	protected readonly _hasError = computed(() => {
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
				if (this._registeredId && this._registeredId !== id) {
					a11y.unregisterError(this._registeredId);
				}

				if (this._registeredId !== id) {
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
