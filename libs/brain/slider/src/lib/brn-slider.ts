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
	numberAttribute,
	type OnInit,
	output,
	signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, NgModel } from '@angular/forms';
import { BrnFieldControl } from '@spartan-ng/brain/field';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import type { BrnSliderRange } from './brn-slider-range';
import type { BrnSliderThumb } from './brn-slider-thumb';
import type { BrnSliderTrack } from './brn-slider-track';
import { provideBrnSlider } from './brn-slider.token';

export const BRN_SLIDER_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnSlider),
	multi: true,
};

let nextId = 0;

@Directive({
	selector: '[brnSlider]',
	exportAs: 'brnSlider',
	providers: [BRN_SLIDER_VALUE_ACCESSOR, provideBrnSlider(BrnSlider)],
	hostDirectives: [BrnFieldControl],
	host: {
		'[attr.id]': 'id()',
		'[attr.dir]': '_direction()',
		'[attr.aria-disabled]': 'mutableDisabled() ? "true" : null',
		'[attr.data-disabled]': 'mutableDisabled() ? "" : null',
		'[attr.data-inverted]': 'inverted() ? "" : null',
		'[attr.data-orientation]': 'orientation()',
		'data-slot': 'slider',
		'(focusout)': '_onFocusOut($event)',
		'[attr.aria-invalid]': '_ariaInvalid() ? "true" : null',
		'[attr.data-invalid]': '_ariaInvalid() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_ariaInvalid() ? "true" : null',
		'[attr.data-dirty]': '_dirty() ? "true" : null',
		'[attr.data-touched]': '_touched() ? "true" : null',
	},
})
export class BrnSlider implements ControlValueAccessor, OnInit {
	private readonly _dir = inject(Directionality);
	private readonly _injector = inject(Injector);
	private readonly _fieldControl = inject(BrnFieldControl);
	public ngControl: NgControl | null = null;

	protected readonly _ariaInvalid = this._fieldControl.invalid;
	protected readonly _dirty = this._fieldControl.dirty;
	protected readonly _touched = this._fieldControl.touched;
	protected readonly _spartanInvalid = this._fieldControl.spartanInvalid;

	/** Unique identifier for the slider element. Auto-generated if not provided. */
	public readonly id = input<string>(`brn-slider-${++nextId}`);

	/** Accessibility label for the slider. Forwarded to all thumbs. */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** ID of the element that labels this slider for accessibility. Forwarded to all thumbs. */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

	/**
	 * The current slider value(s).
	 *
	 * For single-thumb sliders, this contains one value.
	 * For range sliders, values are kept sorted in ascending order.
	 */
	public readonly valueInput = input<number[]>([], { alias: 'value' });
	public readonly value = linkedSignal(this.valueInput);

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

	/** Maximum number of steps allowed between thumbs in a range slider. */
	public readonly maxStepsBetweenThumbs = input<number, NumberInput>(Number.POSITIVE_INFINITY, {
		transform: numberAttribute,
	});

	/** Whether a thumb is prevented from being dragged past its neighbouring thumbs in a range slider. */
	public readonly preventStepOverThumb = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
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

	/** Defines how the tick should be displayed in the UI. */
	public readonly formatTick = input<(tick: number) => string>((tick) => tick.toString());

	/** Whether dragging the selected range should move all thumbs together. */
	public readonly draggableRange = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Whether only dragging the range should work (overrides normal track clicks). */
	public readonly draggableRangeOnly = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Emits when the value changes. */
	public readonly valueChange = output<number[]>();

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

	/** @internal Whether dragging should only move the range. */
	public readonly isDraggableRangeOnly = computed(() => this.draggableRangeOnly() && this.isDraggableRange());

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
		this.ngControl = this._injector.get(NgControl, null);

		// If bound to an Angular form control, writeValue() will run after ngOnInit,
		// so avoid initializing defaults here to prevent a transient min-value override.
		if (!this.ngControl) {
			if (!this.value().length) {
				const defaultValue = [this.min()];
				this.value.set(defaultValue);
			}

			const normalizedValue = this.value()
				.map((v) => clamp(v, [this.min(), this.max()]))
				.sort((a, b) => a - b);

			if (!areArrsEqual(normalizedValue, this.value())) {
				this.value.set(normalizedValue);
			}
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

		if (this.ngControl instanceof NgModel && !this._onChange) {
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

		const currentValue = this.normalizedValue();

		if (this.preventStepOverThumb() && currentValue.length > 1) {
			const gap = this.minStepsBetweenThumbs() * this.step();
			const lowerBound = atIndex > 0 ? Math.max(this.min(), currentValue[atIndex - 1] + gap) : this.min();
			const upperBound =
				atIndex < currentValue.length - 1 ? Math.min(this.max(), currentValue[atIndex + 1] - gap) : this.max();
			value = clamp(value, [lowerBound, upperBound]);
		}

		const newValue = [...currentValue];
		newValue[atIndex] = value;
		newValue.sort((a, b) => a - b);

		let newValIndex = 0;
		for (let i = 0; i < newValue.length; i++) {
			if (newValue[i] < value || (newValue[i] === value && i < atIndex)) {
				newValIndex = i + 1;
			}
		}

		// Only validate the gaps adjacent to the moved thumb so that a state which already
		// violates the constraint (e.g. set programmatically via a form control) can still be
		// brought back into compliance by dragging.
		if (!isGapAtIndexWithinBounds(newValue, newValIndex, this.minStepsBetweenThumbs() * this.step(), true)) return;

		if (!isGapAtIndexWithinBounds(newValue, newValIndex, this.maxStepsBetweenThumbs() * this.step(), false)) return;

		this.valueIndexToChange.set(newValIndex);

		if (areArrsEqual(newValue, this.value())) return;

		this.value.set(newValue);
		this._onChange?.(newValue);
		this.valueChange.emit(newValue);

		if (this.thumbs()[newValIndex]) {
			this.thumbs()[newValIndex].elementRef.nativeElement.focus();
		}
	}

	/** Moves the entire range by a delta value, snapping to step and preserving spacing. */
	setAllValuesByDelta(delta: number): void {
		const current = this.normalizedValue();
		if (!current.length || delta === 0) return;

		const min = this.min();
		const max = this.max();
		const step = this.step();
		const decimalCount = getDecimalCount(step);

		const snappedDelta = roundValue(Math.round(delta / step) * step, decimalCount);
		if (snappedDelta === 0) return;

		let next = current.map((v) => v + snappedDelta);

		const rangeMin = Math.min(...next);
		const rangeMax = Math.max(...next);

		if (rangeMin < min) {
			const offset = min - rangeMin;
			next = next.map((v) => v + offset);
		} else if (rangeMax > max) {
			const offset = max - rangeMax;
			next = next.map((v) => v + offset);
		}

		next = next.map((v) => roundValue(v, decimalCount));

		if (areArrsEqual(next, this.value())) return;

		this.value.set(next);
		this._onChange?.(next);
		this.valueChange.emit(next);
	}

	/** @internal */
	addThumb(thumb: BrnSliderThumb): void {
		this.thumbs.update((thumbs) => {
			thumbs.push(thumb);
			return [...thumbs];
		});
	}

	/** @internal */
	removeThumb(thumb: BrnSliderThumb): void {
		this.thumbs.update((thumbs) => thumbs.filter((t) => t !== thumb));
	}

	protected _onFocusOut(event: FocusEvent): void {
		const currentTarget = event.currentTarget as HTMLElement;
		const focusedEl = event.relatedTarget as HTMLElement | null;

		if (!currentTarget.contains(focusedEl)) {
			this._onTouched?.();
		}
	}
}

function areArrsEqual(arr1: unknown[], arr2: unknown[]): boolean {
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

/**
 * Validates only the gaps immediately adjacent to `index`.
 *
 * Checking a single gap (instead of every gap) keeps the slider usable when its initial state
 * already violates the constraint: the unchanged gaps are ignored, so the user can gradually drag
 * the thumbs back into compliance.
 *
 * @param isMin When `true`, the adjacent gaps must be `>= bound`; otherwise they must be `<= bound`.
 */
function isGapAtIndexWithinBounds(values: number[], index: number, bound: number, isMin: boolean): boolean {
	if (isMin ? bound <= 0 : !Number.isFinite(bound)) {
		return true;
	}

	const leftGap = index > 0 ? values[index] - values[index - 1] : undefined;
	const rightGap = index < values.length - 1 ? values[index + 1] - values[index] : undefined;

	for (const gap of [leftGap, rightGap]) {
		if (gap === undefined) continue;
		if (isMin ? gap < bound : gap > bound) return false;
	}

	return true;
}
