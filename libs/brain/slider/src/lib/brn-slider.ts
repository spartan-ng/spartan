import { Directionality } from '@angular/cdk/bidi';
import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	computed,
	Directive,
	forwardRef,
	inject,
	Injector,
	input,
	linkedSignal,
	model,
	numberAttribute,
	type OnInit,
	signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, NgModel } from '@angular/forms';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import type { BrnSliderRange } from './brn-slider-range';
import type { BrnSliderThumb } from './brn-slider-thumb';
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
	],
	host: {
		'[attr.dir]': '_direction()',
		'[attr.aria-disabled]': 'mutableDisabled() ? "true" : null',
		'[attr.data-disabled]': 'mutableDisabled() ? "" : null',
		'[attr.data-inverted]': 'inverted() ? "" : null',
		'[attr.data-orientation]': 'orientation()',
		'data-slot': 'slider',
		'(focusout)': '_onFocusOut($event)',
	},
})
export class BrnSlider implements ControlValueAccessor, OnInit {
	private readonly _dir = inject(Directionality);
	private readonly _injector = inject(Injector);
	private _ngControl: NgControl | null = null;

	/**
	 * The current slider value(s).
	 *
	 * For single-thumb sliders, this contains one value.
	 * For range sliders, values are kept sorted in ascending order.
	 */
	public readonly value = model<number[]>([]);

	/** Minimum allowed slider value. */
	public readonly min = input<number, NumberInput>(0, {
		transform: numberAttribute,
	});

	/** Maximum allowed slider value. */
	public readonly max = input<number, NumberInput>(100, {
		transform: numberAttribute,
	});

	/** Step increment used when changing values. */
	public readonly step = input<number, NumberInput>(1, {
		transform: numberAttribute,
	});

	/** Minimum number of steps required between thumbs in a range slider. */
	public readonly minStepsBetweenThumbs = input<number, NumberInput>(0, {
		transform: numberAttribute,
	});

	/** Whether the slider is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Whether the slider direction is inverted. */
	public readonly inverted = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Slider orientation. */
	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

	/** Whether tick marks should be displayed. */
	public readonly showTicks = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Maximum number of ticks to render. Excess ticks are evenly distributed. */
	public readonly maxTicks = input<number, NumberInput>(25, {
		transform: numberAttribute,
	});

	/** Interval at which tick labels are shown. A value of `2` shows a label every second tick. */
	public readonly tickLabelInterval = input<number, NumberInput>(2, {
		transform: numberAttribute,
	});

	public readonly draggableRange = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** @internal Normalized slider values. Values are clamped to `[min, max]` and sorted in ascending order. */
	public readonly normalizedValue = computed(
		() => [...this.value()].sort((a, b) => a - b).map((v) => clamp(v, [this.min(), this.max()])),
		{ equal: areArrsEqual },
	);

	/** Indexes for all active thumbs. */
	public readonly thumbIndexes = computed(() => Array.from({ length: this.normalizedValue().length }, (_, i) => i), {
		equal: (a, b) => a.length === b.length,
	});

	/** @internal Whether the slider is in range mode and draggable range is enabled */
	public readonly isDraggableRange = computed(() => this.draggableRange() && this.normalizedValue().length > 1);

	protected readonly _direction = this._dir.valueSignal;

	/** @internal Logical edge from which the slider value increases. */
	public readonly slidingSource = computed<'top' | 'bottom' | 'left' | 'right'>(() => {
		const orientation = this.orientation();
		const inverted = this.inverted();

		if (orientation === 'vertical') {
			return inverted ? 'top' : 'bottom';
		}

		const isLtr = this._direction() === 'ltr';
		const fromLeft = (isLtr && !inverted) || (!isLtr && inverted);

		return fromLeft ? 'left' : 'right';
	});

	/** @internal */
	public readonly isHorizontal = computed(() => this.orientation() === 'horizontal');

	/** @internal Reference to the slider track instance. */
	public readonly track = signal<BrnSliderTrack | null>(null);

	/** @internal Reference to the slider range instance. */
	public readonly range = signal<BrnSliderRange | null>(null);

	/** @internal All registered slider thumbs. */
	public readonly thumbs = signal<BrnSliderThumb[]>([]);

	/** @internal Index of the thumb currently being updated. */
	public readonly valueIndexToChange = signal(0);

	/** @internal Visible tick values after applying density reduction. */
	public readonly ticks = computed(() => {
		if (!this.showTicks()) {
			return [];
		}

		const min = this.min();
		const max = this.max();
		const step = this.step();
		const maxTicks = this.maxTicks();

		if (step <= 0 || min > max) {
			return [];
		}

		const totalCount = Math.floor((max - min) / step) + 1;

		// No need to reduce
		if (totalCount <= maxTicks) {
			return Array.from({ length: totalCount }, (_, i) => min + i * step);
		}

		const stride = Math.ceil(totalCount / maxTicks);

		return Array.from({ length: totalCount }, (_, i) => min + i * step).filter((_, index) => index % stride === 0);
	});

	/** @internal Disabled state that can be controlled internally or externally. */
	public readonly mutableDisabled = linkedSignal(() => this.disabled());

	/** @internal Store the on change callback */
	private _onChange?: ChangeFn<number[]>;

	/** @internal Store the on touched callback */
	private _onTouched?: TouchFn;

	ngOnInit(): void {
		this._ngControl = this._injector.get(NgControl, null);

		if (!this.value().length) {
			this.value.set([this.min()]);
		}

		const normalizedValue = this.value()
			.map((v) => clamp(v, [this.min(), this.max()]))
			.sort((a, b) => a - b);

		if (!areArrsEqual(normalizedValue, this.value())) {
			this.value.set(normalizedValue);
		}
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
		if (!Array.isArray(value)) return;

		if (this._ngControl instanceof NgModel && !this._onChange) {
			// Avoid phantom call for ngModel
			// https://github.com/angular/angular/issues/14988#issuecomment-2946355465
			return;
		}

		const newValue = [...value].sort((a, b) => a - b).map((v) => clamp(v, [this.min(), this.max()]));
		this.value.set(newValue);
	}

	/** Sets a new value for the slider at the given thumb index. */
	setValue(value: number, atIndex: number): void {
		const decimalCount = getDecimalCount(this.step());
		const snapToStep = roundValue(
			Math.round((value - this.min()) / this.step()) * this.step() + this.min(),
			decimalCount,
		);

		value = clamp(snapToStep, [this.min(), this.max()]);

		const newValue = [...this.normalizedValue()];
		newValue[atIndex] = value;
		newValue.sort((a, b) => a - b);

		if (!hasMinStepsBetweenValues(newValue, this.minStepsBetweenThumbs() * this.step())) return;

		const newValIndex = newValue.findIndex((val) => val === value);
		this.valueIndexToChange.set(newValIndex);

		if (areArrsEqual(newValue, this.value())) return;

		this.value.set(newValue);
		this._onChange?.(newValue);

		if (this.thumbs()[newValIndex]) {
			this.thumbs()[newValIndex].elementRef.nativeElement.focus();
		}
	}

	/** Moves the entire range by a delta value, preserving spacing. */
	setAllValuesByDelta(delta: number): void {
		const current = this.normalizedValue();
		if (!current.length || delta === 0) return;

		const min = this.min();
		const max = this.max();

		const next = current.map((v) => v + delta);

		const rangeMin = Math.min(...next);
		const rangeMax = Math.max(...next);

		let adjusted = next;

		if (rangeMin < min) {
			const offset = min - rangeMin;
			adjusted = next.map((v) => v + offset);
		} else if (rangeMax > max) {
			const offset = max - rangeMax;
			adjusted = next.map((v) => v + offset);
		}

		if (areArrsEqual(adjusted, this.value())) return;

		this.value.set(adjusted);
		this._onChange?.(adjusted);
	}

	/** @internal */
	addThumb(thumb: BrnSliderThumb) {
		this.thumbs.update((thumbs) => {
			thumbs.push(thumb);
			return [...thumbs];
		});
	}

	/** @internal */
	removeThumb(thumb: BrnSliderThumb) {
		this.thumbs.update((thumbs) => thumbs.filter((t) => t !== thumb));
	}

	protected _onFocusOut(event: FocusEvent) {
		const currentTarget = event.currentTarget as HTMLElement;
		const focusedEl = event.relatedTarget as HTMLElement | null;

		if (!currentTarget.contains(focusedEl)) {
			this._onTouched?.();
		}
	}
}

function areArrsEqual(arr1: unknown[], arr2: unknown[]) {
	return String(arr1) === String(arr2);
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

function getStepsBetweenValues(values: number[]) {
	return values.slice(0, -1).map((value, index) => values[index + 1]! - value);
}

function hasMinStepsBetweenValues(values: number[], minStepsBetweenValues: number) {
	if (minStepsBetweenValues > 0) {
		const stepsBetweenValues = getStepsBetweenValues(values);
		const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
		return actualMinStepsBetweenValues >= minStepsBetweenValues;
	}
	return true;
}
