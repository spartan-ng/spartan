import type { Direction } from '@angular/cdk/bidi';
import { Directionality } from '@angular/cdk/bidi';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { isPlatformBrowser } from '@angular/common';
import {
	type AfterViewInit,
	Directive,
	ElementRef,
	InjectionToken,
	Injector,
	type OnDestroy,
	PLATFORM_ID,
	Renderer2,
	type Signal,
	type WritableSignal,
	computed,
	contentChild,
	effect,
	forwardRef,
	inject,
	input,
	model,
	signal,
	untracked,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { BrnLabelDirective } from '@spartan-ng/brain/label';
import { Subject, merge } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

export const BRN_SLIDER_INPUT = new InjectionToken<BrnSliderInput>('BrnSliderInput');

export interface BrnSliderInput {
	/** The slider's native input element wrapper value. */
	value: Signal<number>;

	/** Flag indicating if native input element is currently focused. */
	isFocused: Signal<boolean>;
}

export const BRN_SLIDER_TRACK = new InjectionToken<BrnSliderTrack>('BrnSliderTrack');

export const BRN_SLIDER = new InjectionToken<BrnSlider>('BrnSlider');

export interface BrnSlider {
	/** The minimun value of the slider. */
	min: WritableSignal<number>;

	/** The maximun value of the slider. */
	max: WritableSignal<number>;

	/** The amount that slider values can increment or decrement by. */
	step: Signal<number>;

	/** Whether the slider is disabled. */
	disabled: WritableSignal<boolean>;

	/** Whether the slider displays tick marks along the slider track. */
	showTickMarks: Signal<boolean>;

	/** Whether the slider is ltr or rtl.
	 * Any consumer of slider interested in getting the current
	 * direction state, will consume this signal.
	 */
	direction: Signal<Direction>;

	/** The underlying slider's track element */
	brnSliderTrack: Signal<BrnSliderTrack | undefined>;

	/** The aria-labelledby element */
	label: Signal<BrnLabelDirective | null>;

	/** The optional aria-label fallback value.
	 * If no label is provided, this input must be provided by the user,
	 * otherwise an error will be displayed prompting the user to either
	 * provide a spartan-ui label or a fallback aria label text.
	 */
	ariaLabel: Signal<string | null>;
}

/**
 * Directive that adds slider-specific behaviors to an input element inside `<brn-slider>`.
 */
@Directive({
	selector: 'input[brnSliderInput]',
	host: {
		type: 'range',
		role: 'slider',
		'(change)': 'onChange()',
		'(input)': 'onInput()',
		'(focus)': 'onFocus()',
		'(blur)': 'onBlur()',
		'[attr.disabled]': 'isDisabled()',
		'[attr.aria-valuenow]': 'valueNow()',
		'[attr.aria-valuemin]': 'valueMin()',
		'[attr.aria-valuemax]': 'valueMax()',
		'[attr.aria-labelledby]': 'ariaLabelledby()',
		'[attr.aria-label]': 'ariaLabel()',
		'aria-orientation': 'horizontal',
	},
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: BrnSliderInputDirective,
			multi: true,
		},
		{
			provide: BRN_SLIDER_INPUT,
			useExisting: BrnSliderInputDirective,
		},
	],
	standalone: true,
})
export class BrnSliderInputDirective implements ControlValueAccessor, BrnSliderInput {
	private _onChangeFn: ((value: string | number) => void) | undefined;
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onTouchedFn: () => void = () => {};
	protected isDisabled = computed(() => (this._slider.disabled() === true ? true : undefined));
	protected valueNow = computed(() => this.value() ?? 0);
	protected valueMin = computed(() => this._slider.min());
	protected valueMax = computed(() => this._slider.max());
	protected ariaLabelledby = computed(() => this._slider.label()?.id);
	protected ariaLabel = computed(() => {
		if (!this._slider.ariaLabel() && !this.ariaLabelledby()) {
			throw new Error(
				"'ariaLabel' input must be provided as fallback accessibility aria label when no aria-labelledby element is provided.",
			);
		}
		return this._slider.ariaLabel();
	});
	public readonly value = signal(0);
	public readonly isFocused = signal(false);

	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef<HTMLInputElement>);
	private readonly _slider = inject(BRN_SLIDER);
	private readonly _renderer2 = inject(Renderer2);

	constructor() {
		effect(() => {
			if (isPlatformBrowser(this._platformId)) {
				const step = this._slider.step();
				const min = this._slider.min();
				const max = this._slider.max();
				const direction = this._slider.direction();
				untracked(() => {
					this._updateHostElementStep(step);
					this._updateMinValue(min);
					this._updateMaxValue(max);
					this._updateDirection(direction);
				});
			}
		});
	}

	onFocus(): void {
		this.isFocused.set(true);
	}

	onBlur(): void {
		this.isFocused.set(false);
		this._onTouchedFn();
	}

	onInput(): void {
		this._updateValue();
	}

	onChange(): void {
		this._updateValue();
	}

	writeValue(obj: number): void {
		this.value.set(obj);
		this._updateHostElementValue(obj);
	}

	registerOnChange(fn: (value: string | number) => void): void {
		this._onChangeFn = fn;
	}

	registerOnTouched(fn: () => void): void {
		this._onTouchedFn = fn;
	}

	/**
	 * Sets the disabled state of the slider.
	 * @param isDisabled The new disabled state
	 */
	setDisabledState(isDisabled: boolean): void {
		/** Disable slider only when slider component
		 * is not disabled and isDisabled param is explicitly set to true
		 */
		if (isDisabled && !this._slider.disabled()) {
			this._slider.disabled.set(isDisabled);
		}
	}

	private _updateHostElementValue(value: number | null) {
		this._elementRef.nativeElement.value = value?.toString() ?? '0';
	}

	private _updateValue() {
		this.value.set(+this._elementRef.nativeElement.value);
		this._onChangeFn?.(this.value());
	}

	private _updateHostElementStep(step: number) {
		this._elementRef.nativeElement.step = step.toString();
		this._updateValue();
	}

	private _updateMinValue(value: number) {
		this._elementRef.nativeElement.min = value.toString();
		this._updateValue();
	}

	private _updateMaxValue(value: number) {
		this._elementRef.nativeElement.max = value.toString();
		this._updateValue();
	}

	private _updateDirection(direction: Direction) {
		this._renderer2.setStyle(this._elementRef.nativeElement, 'direction', direction);
	}
}

@Directive({
	selector: '[brnSlider]',
	standalone: true,
	providers: [
		{
			provide: BRN_SLIDER,
			useExisting: BrnSliderDirective,
		},
	],
	exportAs: 'brnSlider',
})
export class BrnSliderDirective implements BrnSlider, AfterViewInit, OnDestroy {
	public readonly label = input<BrnLabelDirective | null>(null);
	public readonly ariaLabel = input<string | null>(null);
	/** Used only as an input. */
	public readonly dir = input<Direction>('ltr');
	public readonly disabled = model<boolean>(false, { alias: 'brnSliderDisabled' });
	public readonly min = model<number>(0);
	public readonly max = model<number>(100);
	public readonly step = input<number>(1);
	public readonly showTickMarks = input<boolean>(false);

	public readonly direction = signal<Direction>('ltr');
	private readonly _destroyed = new Subject<void>();

	private readonly _injector = inject(Injector);
	private readonly _dir = inject(Directionality);
	private readonly _platformId = inject(PLATFORM_ID);

	public readonly brnSliderTrack = contentChild(BRN_SLIDER_TRACK);

	ngAfterViewInit(): void {
		if (isPlatformBrowser(this._platformId)) {
			this._updateDirectionality();
		}
	}

	ngOnDestroy(): void {
		this._destroyed.next();
		this._destroyed.complete();
	}

	/**
	 * The method is responsible of setting the current direction state
	 * based on the latest 'dir' input or bidi state change. The only
	 * source of truth for slider direction state is the 'direction' signal
	 * and all interested consumers of it, will consume this interface exposed signal.
	 */
	private _updateDirectionality() {
		merge(toObservable(this.dir, { injector: this._injector }), this._dir.change)
			.pipe(
				takeUntil(this._destroyed),
				tap((dir) => this.direction.set(dir)),
			)
			.subscribe();
	}
}

export interface BrnSliderTrack {
	/** The track's active portion. */
	activeTrackPercentage: Signal<number>;

	/** The host element's bounding client rect width without padding left and right. */
	hostElementWidth: Signal<number>;

	/** The available tick mark track width based on slider's step min and max values. */
	tickMarkTrackWidth: Signal<number>;

	/** The tick marks array indicating if a mark is currently active or inactive. */
	tickMarks: Signal<Array<boolean>>;

	/** The underlying slider's track input element */
	brnSliderInput: Signal<BrnSliderInput | undefined>;
}

@Directive({
	selector: '[brnSliderTrack]',
	standalone: true,
	providers: [
		{
			provide: BRN_SLIDER_TRACK,
			useExisting: BrnSliderTrackDirective,
		},
	],
})
export class BrnSliderTrackDirective implements BrnSliderTrack, AfterViewInit, OnDestroy {
	public readonly hostElementWidth = signal<number>(0);
	private readonly _destroyed = new Subject<void>();

	private readonly _slider = inject(BRN_SLIDER);
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
	private readonly _sharedResizeObserver = inject(SharedResizeObserver);

	public readonly brnSliderInput = contentChild<BrnSliderInput>(forwardRef(() => BRN_SLIDER_INPUT));

	public activeTrackPercentage = computed(() => {
		const inputValue = this.brnSliderInput()?.value();

		if (this._slider.min() >= this._slider.max() || !inputValue || inputValue < this._slider.min()) {
			return 0;
		}

		if (inputValue > this._slider.max()) {
			return 1;
		}

		return (inputValue - this._slider.min()) / (this._slider.max() - this._slider.min());
	});

	public tickMarkTrackWidth = computed(() => {
		if (!this._slider.showTickMarks()) {
			return 0;
		}

		const sliderStep = this._slider.step();
		const sliderMax = this._slider.max();
		const sliderMin = this._slider.min();

		const step = sliderStep && sliderStep > 0 ? sliderStep : 1;
		const maxValue = Math.floor((sliderMax - sliderMin) / step) * step + sliderMin;
		const percentage = (maxValue - sliderMin) / (sliderMax - sliderMin);

		return this.hostElementWidth() * percentage;
	});

	public tickMarks = computed(() => {
		const inputValue = this.brnSliderInput()?.value();

		if (!this._slider.showTickMarks() || inputValue === null || inputValue === undefined) {
			return [];
		}

		let numActive = Math.max(Math.floor((inputValue - this._slider.min()) / this._slider.step()), 0);
		let numInactive = Math.max(Math.floor((this._slider.max() - inputValue) / this._slider.step()), 0);

		this._slider.direction() === 'rtl' ? numInactive++ : numActive++;

		return Array(numActive).fill(true).concat(Array(numInactive).fill(false));
	});

	ngAfterViewInit(): void {
		if (isPlatformBrowser(this._platformId)) {
			this._storeDimensions();
			this._onResize();
		}
	}

	ngOnDestroy(): void {
		this._destroyed.next();
		this._destroyed.complete();
	}

	private _onResize() {
		this._sharedResizeObserver
			.observe(this._elementRef.nativeElement)
			.pipe(
				debounceTime(32),
				takeUntil(this._destroyed),
				tap(() => this._storeDimensions()),
			)
			.subscribe();
	}

	private _storeDimensions(): void {
		const computedStyle = getComputedStyle(this._elementRef.nativeElement);

		this.hostElementWidth.set(
			this._elementRef.nativeElement.offsetWidth -
				Number.parseFloat(computedStyle.paddingLeft) -
				Number.parseFloat(computedStyle.paddingRight),
		);
	}
}
