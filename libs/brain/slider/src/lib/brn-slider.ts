import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectorRef,
	computed,
	Directive,
	DoCheck,
	ElementRef,
	forwardRef,
	inject,
	Injector,
	input,
	linkedSignal,
	model,
	numberAttribute,
	type OnInit,
	output,
	signal,
} from '@angular/core';
import { type ControlValueAccessor, FormGroupDirective, NG_VALUE_ACCESSOR, NgControl, NgForm } from '@angular/forms';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { type ChangeFn, ErrorStateMatcher, ErrorStateTracker, type TouchFn } from '@spartan-ng/brain/forms';
import type { BrnSliderTrack } from './brn-slider-track';
import { provideBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSlider]',
	exportAs: 'brnSlider',
	providers: [
		provideBrnSlider(BrnSlider),
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BrnSlider),
			multi: true,
		},
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => BrnSlider),
		},
	],
	host: {
		'aria-orientation': 'horizontal',
		'(focusout)': '_onTouched?.()',
		'[attr.aria-invalid]': 'errorState() ? "true" : null',
	},
})
export class BrnSlider implements ControlValueAccessor, OnInit, DoCheck, BrnFormFieldControl {
	private readonly _changeDetectorRef = inject(ChangeDetectorRef);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });
	private readonly _injector = inject(Injector);
	public ngControl: NgControl | null = null;
	private readonly _errorStateTracker: ErrorStateTracker;
	public readonly errorState = computed(() => this._errorStateTracker.errorState());

	public readonly value = model<number>(0);

	/** Emits when the value changes. */
	public readonly valueChange = output<number>();

	public readonly min = input<number, NumberInput>(0, {
		transform: numberAttribute,
	});

	public readonly max = input<number, NumberInput>(100, {
		transform: numberAttribute,
	});

	public readonly step = input<number, NumberInput>(1, {
		transform: numberAttribute,
	});

	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Whether we should show tick marks */
	public readonly showTicks = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** @internal */
	public readonly ticks = computed(() => {
		const value = this.value();

		if (!this.showTicks()) {
			return [];
		}

		let numActive = Math.max(Math.floor((value - this.min()) / this.step()), 0);
		let numInactive = Math.max(Math.floor((this.max() - value) / this.step()), 0);

		const direction = getComputedStyle(this._elementRef.nativeElement).direction;

		direction === 'rtl' ? numInactive++ : numActive++;

		return Array(numActive).fill(true).concat(Array(numInactive).fill(false));
	});

	/** @internal */
	public readonly mutableDisabled = linkedSignal(() => this.disabled());

	/** @internal */
	public readonly percentage = computed(() => ((this.value() - this.min()) / (this.max() - this.min())) * 100);

	/** @internal Store the on change callback */
	protected _onChange?: ChangeFn<number>;

	/** @internal Store the on touched callback */
	protected _onTouched?: TouchFn;

	/** @internal Store the track */
	public readonly track = signal<BrnSliderTrack | null>(null);

	constructor() {
		this._errorStateTracker = new ErrorStateTracker(
			this._defaultErrorStateMatcher,
			null,
			this._parentFormGroup,
			this._parentForm,
		);
	}

	ngOnInit(): void {
		this.ngControl = this._injector.get(NgControl, null);
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}
		this._errorStateTracker.ngControl = this.ngControl;

		// ensure the value is within the min and max range
		if (this.value() < this.min()) {
			this.value.set(this.min());
			this.valueChange.emit(this.min());
		}
		if (this.value() > this.max()) {
			this.value.set(this.max());
			this.valueChange.emit(this.max());
		}
	}

	ngDoCheck(): void {
		this._errorStateTracker.updateErrorState();
	}

	registerOnChange(fn: (value: number) => void): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.mutableDisabled.set(isDisabled);
	}

	writeValue(value: number): void {
		const clampedValue = clamp(value, [this.min(), this.max()]);
		this.value.set(clampedValue);

		if (value !== clampedValue) {
			this._onChange?.(clampedValue);
			this.valueChange.emit(clampedValue);
		}

		this._changeDetectorRef.detectChanges();
	}

	setValue(value: number): void {
		const decimalCount = getDecimalCount(this.step());
		const snapToStep = roundValue(
			Math.round((value - this.min()) / this.step()) * this.step() + this.min(),
			decimalCount,
		);

		value = clamp(snapToStep, [this.min(), this.max()]);

		this.value.set(value);
		this.valueChange.emit(value);
		this._onChange?.(value);
	}
}

function roundValue(value: number, decimalCount: number): number {
	const rounder = Math.pow(10, decimalCount);
	return Math.round(value * rounder) / rounder;
}

function getDecimalCount(value: number): number {
	return (String(value).split('.')[1] || '').length;
}

function clamp(value: number, [min, max]: [number, number]): number {
	return Math.min(max, Math.max(min, value));
}
