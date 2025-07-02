import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectorRef,
	computed,
	Directive,
	ElementRef,
	forwardRef,
	inject,
	input,
	linkedSignal,
	model,
	numberAttribute,
	OnInit,
	signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import type { BrnSliderTrackDirective } from './brn-slider-track.directive';
import { provideBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSlider]',
	exportAs: 'brnSlider',
	providers: [
		provideBrnSlider(BrnSliderDirective),
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BrnSliderDirective),
			multi: true,
		},
	],
	host: {
		'aria-orientation': 'horizontal',
		'(focusout)': '_onTouched?.()',
	},
})
export class BrnSliderDirective implements ControlValueAccessor, OnInit {
	private readonly _changeDetectorRef = inject(ChangeDetectorRef);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	public readonly value = model<number>(0);

	public readonly min = input<number, NumberInput>(0, {
		transform: numberAttribute,
	});

	public readonly max = input<number, NumberInput>(100, {
		transform: numberAttribute,
	});

	public readonly step = input<number, NumberInput>(1, {
		transform: numberAttribute,
	});

	public readonly _disabled = input<boolean, BooleanInput>(false, {
		alias: 'disabled',
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
	public readonly disabled = linkedSignal(() => this._disabled());

	/** @internal */
	public readonly percentage = computed(() => ((this.value() - this.min()) / (this.max() - this.min())) * 100);

	/** @internal Store the on change callback */
	protected _onChange?: ChangeFn<number>;

	/** @internal Store the on touched callback */
	protected _onTouched?: TouchFn;

	/** @internal Store the track */
	public readonly track = signal<BrnSliderTrackDirective | null>(null);

	ngOnInit(): void {
		// ensure the value is within the min and max range
		if (this.value() < this.min()) {
			this.value.set(this.min());
		}
		if (this.value() > this.max()) {
			this.value.set(this.max());
		}
	}

	registerOnChange(fn: (value: number) => void): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}

	writeValue(value: number): void {
		const clampedValue = clamp(value, [this.min(), this.max()]);
		this.value.set(clampedValue);

		if (value !== clampedValue) {
			this._onChange?.(clampedValue);
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
