import { computed, DestroyRef, Directive, DoCheck, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { type AbstractControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { createStateTracker, ErrorStateMatcher, type StateTracker } from '@spartan-ng/brain/forms';
import { BrnField } from './brn-field';
import { BrnLabelable } from './brn-labelable';

@Directive()
export class BrnFieldControl implements OnInit, DoCheck {
	private readonly _injector = inject(Injector);
	private readonly _errorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });
	private readonly _field = inject(BrnField, { optional: true });
	private readonly _destroyRef = inject(DestroyRef);

	private _idEffectRef?: ReturnType<typeof effect>;
	private readonly _stateTracker = signal<StateTracker | null>(null);
	/** Sentinel value to differentiate "never checked" from "control is null". */
	private _lastControl: AbstractControl | null = null;

	/** Gets the AbstractControlDirective for this control. */
	public ngControl: NgControl | null = null;

	public readonly id = signal<string | null | undefined>(undefined);

	public readonly controlState = computed(() => this._stateTracker()?.controlState() ?? null);
	public readonly errors = computed(() => this._stateTracker()?.errors() ?? null);
	public readonly dirty = computed(() => this._stateTracker()?.dirty() ?? null);
	public readonly invalid = computed(() => this._stateTracker()?.invalid() ?? null);
	public readonly spartanInvalid = computed(() => this._stateTracker()?.spartanInvalid() ?? null);
	public readonly touched = computed(() => this._stateTracker()?.touched() ?? null);

	constructor() {
		this._field?.registerFieldControl(this);
		this._destroyRef.onDestroy(() => {
			this._idEffectRef?.destroy();
			this._stateTracker()?.destroy();
		});
	}

	ngOnInit(): void {
		this.ngControl = this._injector.get(NgControl, null);

		// Try to sync the tracker eagerly.
		this._syncTracker();

		// For template-driven forms and FormControlName, the control is often resolved
		// asynchronously by Angular's directives after our ngOnInit/ngDoCheck.
		// Schedule a one-time microtask to catch the initial resolution.
		if (this.ngControl) {
			Promise.resolve().then(() => {
				this._syncTracker();
			});
		}

		const labelable = this._injector.get(BrnLabelable, null);
		if (labelable) {
			this._idEffectRef = effect(
				() => {
					this.id.set(labelable.labelableId());
				},
				{ injector: this._injector },
			);
		}
	}

	// Re-evaluate the control reference on every change detection cycle because
	// the underlying AbstractControl may change when [formControl] rebinds to a new instance.
	// When the instance changes we tear down the old tracker and create a fresh one.
	ngDoCheck(): void {
		this._syncTracker();
	}

	/** @returns true if the control reference changed */
	private _syncTracker(): void {
		if (!this.ngControl) return;
		const currentControl = this.ngControl.control ?? null;
		if (currentControl === this._lastControl) return;
		this._lastControl = currentControl;
		this._stateTracker()?.destroy();
		this._stateTracker.set(
			currentControl
				? createStateTracker(this.ngControl, this._errorStateMatcher, this._parentFormGroup, this._parentForm)
				: null,
		);
	}
}
