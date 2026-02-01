import { Directionality } from '@angular/cdk/bidi';
import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectorRef,
	computed,
	Directive,
	effect,
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
	untracked,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
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
		'[attr.data-orientation]': 'orientation()',
		'data-slot': 'slider',
		'(focusout)': '_onFocusOut($event)',
	},
})
export class BrnSlider implements ControlValueAccessor, OnInit {
	private readonly _changeDetectorRef = inject(ChangeDetectorRef);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _dir = inject(Directionality);

	public readonly value = model<number[]>([]);

	// TODO: remove, only for dev
	public readonly dirInput = input<'ltr' | 'rtl'>();

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

	public readonly inverted = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

	/** Whether we should show tick marks */
	public readonly showTicks = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	public readonly thumbIndexes = computed(() => Array.from({ length: this.value().length }, (_, i) => i), {
		equal: (a, b) => a.length === b.length,
	});

	/** internal **/
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

	/** @internal */
	public readonly thumbs = signal<BrnSliderThumb[]>([]);

	/** @internal */
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
	private _onChange?: ChangeFn<number[]>;

	/** @internal Store the on touched callback */
	private _onTouched?: TouchFn;

	constructor() {
		effect(() => {
			this.value();
			const index = untracked(this.valueIndexToChange);
			const thumbs = untracked(this.thumbs);

			if (thumbs[index]) {
				thumbs[index].elementRef.nativeElement.focus();
			}
		});
	}

	ngOnInit(): void {
		const sortedValue = [...this.value()].sort((a, b) => a - b);
		// ensure the values are within the min and max range
		if (sortedValue[0] < this.min()) {
			sortedValue[0] = this.min();
		}
		if (sortedValue[sortedValue.length - 1] > this.max()) {
			sortedValue[sortedValue.length - 1] = this.max();
		}

		if (!areArrsEqual(sortedValue, this.value())) {
			this.value.set(sortedValue);
			this.valueChange.emit(sortedValue);
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
		const newValue = value.map((v) => clamp(v, [this.min(), this.max()]));
		if (areArrsEqual(newValue, value)) return;

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
		this.valueIndexToChange.set(newValIndex);

		if (areArrsEqual(newValue, this.value())) return;

		this.value.set(newValue);
		this.valueChange.emit(newValue);
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
