import { Directionality } from '@angular/cdk/bidi';
import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectorRef,
	computed,
	Directive,
	effect,
	forwardRef,
	inject,
	input,
	linkedSignal,
	model,
	numberAttribute,
	type OnInit,
	signal,
	untracked,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnSliderRange } from './brn-slider-range';
import { BrnSliderThumb } from './brn-slider-thumb';
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
		'[attr.dir]': 'direction()',
		'[attr.data-disabled]': 'mutableDisabled() ? "" : null',
		'[attr.data-inverted]': 'inverted() ? "" : null',
		'[attr.data-orientation]': 'orientation()',
		'data-slot': 'slider',
		'(focusout)': '_onFocusOut($event)',
	},
})
export class BrnSlider implements ControlValueAccessor, OnInit {
	private readonly _changeDetectorRef = inject(ChangeDetectorRef);
	private readonly _dir = inject(Directionality);

	public readonly value = model<number[]>([]);

	// TODO: remove, only for dev
	public readonly dirInput = input<'ltr' | 'rtl'>();

	public readonly min = input<number, NumberInput>(0, {
		transform: numberAttribute,
	});

	public readonly max = input<number, NumberInput>(100, {
		transform: numberAttribute,
	});

	public readonly step = input<number, NumberInput>(1, {
		transform: numberAttribute,
	});

	public readonly minStepsBetweenThumbs = input<number, NumberInput>(0, {
		transform: numberAttribute,
	});

	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	public readonly inverted = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

	/** Whether we should show tick marks */
	public readonly showTicks = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	public readonly maxTicks = input<number, NumberInput>(25, {
		transform: numberAttribute,
	});

	public readonly tickLabelInterval = input<number, NumberInput>(2, {
		transform: numberAttribute,
	});

	/** @internal */
	public readonly normalizedValue = computed(
		() =>
			this.value()
				.sort((a, b) => a - b)
				.map((v) => clamp(v, [this.min(), this.max()])),
		{ equal: areArrsEqual },
	);

	public readonly thumbIndexes = computed(() => Array.from({ length: this.normalizedValue().length }, (_, i) => i), {
		equal: (a, b) => a.length === b.length,
	});

	/** @internal */
	public readonly direction = computed(() => {
		if (this.dirInput()) return this.dirInput();

		return this._dir.valueSignal();
	});

	/** @internal */
	public readonly slidingSource = computed<'top' | 'bottom' | 'left' | 'right'>(() => {
		const orientation = this.orientation();
		const inverted = this.inverted();

		if (orientation === 'vertical') {
			return inverted ? 'top' : 'bottom';
		}

		const isLtr = this.direction() === 'ltr';
		const fromLeft = (isLtr && !inverted) || (!isLtr && inverted);

		return fromLeft ? 'left' : 'right';
	});

	/** @internal */
	public readonly isHorizontal = computed(() => this.orientation() === 'horizontal');

	/** @internal Store the track */
	public readonly track = signal<BrnSliderTrack | null>(null);

	/** @internal Store the range */
	public readonly range = signal<BrnSliderRange | null>(null);

	/** @internal */
	public readonly thumbs = signal<BrnSliderThumb[]>([]);

	/** @internal */
	public readonly valueIndexToChange = signal(0);

	/** @internal */
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

	/** @internal */
	public readonly mutableDisabled = linkedSignal(() => this.disabled());

	/** @internal Store the on change callback */
	private _onChange?: ChangeFn<number[]>;

	/** @internal Store the on touched callback */
	private _onTouched?: TouchFn;

	constructor() {
		effect(() => {
			this.normalizedValue();
			const index = untracked(this.valueIndexToChange);
			const thumbs = untracked(this.thumbs);

			if (thumbs[index]) {
				thumbs[index].elementRef.nativeElement.focus();
			}
		});
	}

	ngOnInit(): void {
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
		const newValue = value.sort((a, b) => a - b).map((v) => clamp(v, [this.min(), this.max()]));

		this.value.set(newValue);
		this._onChange?.(newValue);

		this._changeDetectorRef.detectChanges();
	}

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
