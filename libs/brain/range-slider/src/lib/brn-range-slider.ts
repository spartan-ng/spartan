import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectorRef,
	computed,
	Directive,
	type ElementRef,
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
import type { BrnRangeSliderTrack } from './brn-range-slider-track';
import { provideBrnRangeSlider } from './brn-range-slider.token';

export type RangeValue = [number, number];

@Directive({
	selector: '[brnRangeSlider]',
	exportAs: 'brnRangeSlider',
	providers: [
		provideBrnRangeSlider(BrnRangeSlider),
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BrnRangeSlider),
			multi: true,
		},
	],
	host: {
		role: 'group',
		'data-orientation': 'horizontal',
		'(focusout)': '_onTouched?.()',
	},
})
export class BrnRangeSlider implements ControlValueAccessor, OnInit {
	private readonly _changeDetectorRef = inject(ChangeDetectorRef);

	public readonly value = model<RangeValue>([0, 100]);

	/** Emits when the value changes. */
	public readonly valueChange = output<RangeValue>();

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

	/** @internal */
	public readonly mutableDisabled = linkedSignal(() => this.disabled());

	/** @internal Percentage of the low thumb (0–100). */
	public readonly lowPercentage = computed(
		() => ((this.value()[0] - this.min()) / (this.max() - this.min())) * 100,
	);

	/** @internal Percentage of the high thumb (0–100). */
	public readonly highPercentage = computed(
		() => ((this.value()[1] - this.min()) / (this.max() - this.min())) * 100,
	);

	/** @internal Store the on change callback */
	protected _onChange?: ChangeFn<RangeValue>;

	/** @internal Store the on touched callback */
	protected _onTouched?: TouchFn;

	/** @internal Store the track element reference */
	public readonly track = signal<BrnRangeSliderTrack | null>(null);

	/** @internal Thumb element refs, registered by BrnRangeSliderThumb */
	public readonly lowThumbEl = signal<ElementRef<HTMLElement> | null>(null);
	public readonly highThumbEl = signal<ElementRef<HTMLElement> | null>(null);

	/**
	 * @internal Tracks which role ('low'|'high') the currently-dragged thumb
	 * controls. After a crossover sort, this flips so the drag follows the pointer.
	 * Mirrors Radix's `valueIndexToChangeRef`.
	 */
	public readonly activeThumb = signal<'low' | 'high'>('low');

	ngOnInit(): void {
		const [low, high] = this.value();
		const clampedLow = clamp(low, [this.min(), this.max()]);
		const clampedHigh = clamp(high, [this.min(), this.max()]);
		if (low !== clampedLow || high !== clampedHigh) {
			const v: RangeValue = [Math.min(clampedLow, clampedHigh), Math.max(clampedLow, clampedHigh)];
			this.value.set(v);
			this.valueChange.emit(v);
		}
	}

	registerOnChange(fn: ChangeFn<RangeValue>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.mutableDisabled.set(isDisabled);
	}

	writeValue(value: RangeValue): void {
		if (!Array.isArray(value)) return;
		const lo = clamp(value[0], [this.min(), this.max()]);
		const hi = clamp(value[1], [this.min(), this.max()]);
		const v: RangeValue = [Math.min(lo, hi), Math.max(lo, hi)];
		this.value.set(v);
		this._changeDetectorRef.detectChanges();
	}

	/**
	 * Set the value for a specific thumb, snapping to step.
	 * Follows the Radix/shadcn approach: thumbs can cross over each other.
	 * Values are always sorted so value[0] <= value[1]. After sorting,
	 * activeThumb is updated to where the dragged value ended up, so
	 * subsequent drag events follow the pointer correctly across crossover.
	 */
	setThumbValue(thumb: 'low' | 'high', rawValue: number): void {
		const decimalCount = getDecimalCount(this.step());
		const snapped = roundValue(
			Math.round((rawValue - this.min()) / this.step()) * this.step() + this.min(),
			decimalCount,
		);

		const clamped = clamp(snapped, [this.min(), this.max()]);
		const [low, high] = this.value();

		// Place the new value at the thumb's index, then sort so [0] <= [1].
		const unsorted: RangeValue = thumb === 'low' ? [clamped, high] : [low, clamped];
		const newValue: RangeValue = [Math.min(unsorted[0], unsorted[1]), Math.max(unsorted[0], unsorted[1])];

		// Track where the dragged value landed after sorting (Radix: valueIndexToChangeRef)
		this.activeThumb.set(newValue[0] === clamped ? 'low' : 'high');

		this.value.set(newValue);
		this.valueChange.emit(newValue);
		this._onChange?.(newValue);
	}

	/** Determine which thumb is closest to a given raw value. */
	closestThumb(rawValue: number): 'low' | 'high' {
		const [low, high] = this.value();
		return Math.abs(rawValue - low) <= Math.abs(rawValue - high) ? 'low' : 'high';
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
