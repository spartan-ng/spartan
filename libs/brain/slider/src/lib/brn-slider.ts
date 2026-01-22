import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectorRef,
	computed,
	contentChildren,
	Directive,
	ElementRef,
	forwardRef,
	inject,
	input,
	linkedSignal,
	model,
	numberAttribute,
	type OnInit,
	output,
	signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnSliderThumb } from './brn-slider-thumb';
import type { BrnSliderTrack } from './brn-slider-track';
import { provideBrnSlider } from './brn-slider.token';
import { linearScale } from './utils/linear-scale';

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
	],
	host: {
		'aria-orientation': 'horizontal',
		'(pointerdown)': '_onPointerDown($event)',
		'(pointermove)': '_onPointerMove($event)',
		'(pointerup)': '_onPointerUp($event)',
		'(focusout)': '_onTouched?.()',
	},
})
export class BrnSlider implements ControlValueAccessor, OnInit {
	private readonly _changeDetectorRef = inject(ChangeDetectorRef);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	public readonly value = model<number[]>([]);

	/** Emits when the value changes. */
	public readonly valueChange = output<number[]>();

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

	public readonly thumbs = contentChildren(BrnSliderThumb);

	public readonly valueIndexToChange = signal(0);

	/** @internal */
	public readonly ticks = computed(() => {
		const value = this.value();

		if (!this.showTicks()) {
			return [];
		}

		let numActive = Math.max(Math.floor((value[0] - this.min()) / this.step()), 0);
		let numInactive = Math.max(Math.floor((this.max() - value[value.length - 1]) / this.step()), 0);

		const direction = getComputedStyle(this._elementRef.nativeElement).direction;

		direction === 'rtl' ? numInactive++ : numActive++;

		return Array(numActive).fill(true).concat(Array(numInactive).fill(false));
	});

	/** @internal */
	public readonly mutableDisabled = linkedSignal(() => this.disabled());

	/** @internal Store the on change callback */
	protected _onChange?: ChangeFn<number[]>;

	/** @internal Store the on touched callback */
	protected _onTouched?: TouchFn;

	/** @internal Store the track */
	public readonly track = signal<BrnSliderTrack | null>(null);

	ngOnInit(): void {
		const sortedValue = [...this.value()].sort((a, b) => a - b);
		// ensure the values are within the min and max range
		if (sortedValue[0] < this.min()) {
			sortedValue[0] = this.min();
		}
		if (sortedValue[sortedValue.length - 1] > this.max()) {
			sortedValue[sortedValue.length - 1] = this.max();
		}
		this.value.set(sortedValue);
		this.valueChange.emit(sortedValue);
	}

	registerOnChange(fn: (value: number[]) => void): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.mutableDisabled.set(isDisabled);
	}

	writeValue(value: number[]): void {
		const newValue = value.map((v) => clamp(v, [this.min(), this.max()]));
		this.value.set(newValue);

		if (value !== newValue) {
			this._onChange?.(newValue);
			this.valueChange.emit(newValue);
		}

		this._changeDetectorRef.detectChanges();
	}

	setValue(value: number, atIndex: number): void {
		const decimalCount = getDecimalCount(this.step());
		const snapToStep = roundValue(
			Math.round((value - this.min()) / this.step()) * this.step() + this.min(),
			decimalCount,
		);

		value = clamp(snapToStep, [this.min(), this.max()]);

		const newValue = [...this.value()];
		newValue[atIndex] = value;
		newValue.sort((a, b) => a - b);
		const newValIndex = newValue.findIndex((val) => val === value);

		this.thumbs()[newValIndex].focus();

		this.value.set(newValue);
		this.valueChange.emit(newValue);
		this._onChange?.(newValue);
	}

	protected _onPointerDown(event: PointerEvent) {
		const target = event.target as HTMLElement;
		target.setPointerCapture(event.pointerId);
		// Prevent browser focus behaviour because we focus a thumb manually when values change.
		event.preventDefault();

		if (this.thumbs().find((thumb) => thumb.elementRef.nativeElement === target)) {
			target.focus();
		} else {
			const value = this._getValueFromPointer(event.clientX);
			const closestIndex = getClosestValueIndex(this.value(), value);

			this.setValue(value, closestIndex);
		}
	}

	protected _onPointerMove(event: PointerEvent) {
		const target = event.target as HTMLElement;

		if (target.hasPointerCapture(event.pointerId)) {
			const value = this._getValueFromPointer(event.clientX);
			this.setValue(value, this.valueIndexToChange());
		}
	}

	protected _onPointerUp(event: PointerEvent) {
		const target = event.target as HTMLElement;

		if (target.hasPointerCapture(event.pointerId)) {
			target.releasePointerCapture(event.pointerId);
		}
	}

	private _getValueFromPointer(pointerPosition: number) {
		const rect = this._elementRef.nativeElement.getBoundingClientRect();
		const input: [number, number] = [0, rect.width];
		const output: [number, number] = [this.min(), this.max()];
		const value = linearScale(input, output);

		return value(pointerPosition - rect.left);
	}
}

function getClosestValueIndex(values: number[], nextValue: number) {
	if (values.length === 1) return 0;
	const distances = values.map((value) => Math.abs(value - nextValue));
	const closestDistance = Math.min(...distances);
	return distances.indexOf(closestDistance);
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
