import { isPlatformServer } from '@angular/common';
import { computed, Directive, DOCUMENT, effect, ElementRef, HostListener, inject, input, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { injectBrnRangeSlider } from './brn-range-slider.token';

@Directive({
	selector: '[brnRangeSliderThumb]',
	host: {
		role: 'slider',
		'aria-orientation': 'horizontal',
		'[attr.aria-valuenow]': '_currentValue()',
		'[attr.aria-valuemin]': '_ariaMin()',
		'[attr.aria-valuemax]': '_ariaMax()',
		'[attr.tabindex]': '_slider.mutableDisabled() ? -1 : 0',
		'[attr.data-disabled]': '_slider.mutableDisabled()',
		'[style.inset-inline-start]': '_thumbOffset()',
	},
})
export class BrnRangeSliderThumb {
	protected readonly _slider = injectBrnRangeSlider();
	private readonly _document = inject<Document>(DOCUMENT);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _platform = inject(PLATFORM_ID);

	/** Which end this thumb controls: 'low' or 'high'. */
	public readonly thumb = input.required<'low' | 'high'>();

	/** @internal */
	protected readonly _currentValue = computed(() =>
		this.thumb() === 'low' ? this._slider.value()[0] : this._slider.value()[1],
	);

	/** @internal */
	protected readonly _ariaMin = computed(() =>
		this.thumb() === 'low' ? this._slider.min() : this._slider.value()[0],
	);

	/** @internal */
	protected readonly _ariaMax = computed(() =>
		this.thumb() === 'high' ? this._slider.max() : this._slider.value()[1],
	);

	/** @internal */
	protected readonly _percentage = computed(() =>
		this.thumb() === 'low' ? this._slider.lowPercentage() : this._slider.highPercentage(),
	);

	/**
	 * Offsets the thumb centre point while sliding to ensure it remains
	 * within the bounds of the slider when reaching the edges.
	 * Based on https://github.com/radix-ui/primitives/blob/main/packages/react/slider/src/slider.tsx
	 */
	protected readonly _thumbOffset = computed(() => {
		if (isPlatformServer(this._platform)) {
			return this._percentage() + '%';
		}

		const halfWidth = this._elementRef.nativeElement.offsetWidth / 2;
		const offset = this._linearScale([0, 50], [0, halfWidth]);
		const thumbInBoundsOffset = halfWidth - offset(this._percentage());

		return `calc(${this._percentage()}% + ${thumbInBoundsOffset}px)`;
	});

	constructor() {
		// Register this thumb's element with the parent range slider
		effect(() => {
			if (this.thumb() === 'low') {
				this._slider.lowThumbEl.set(this._elementRef);
			} else {
				this._slider.highThumbEl.set(this._elementRef);
			}
		});

		const pointerdown = fromEvent<PointerEvent>(this._elementRef.nativeElement, 'pointerdown');
		const pointerup = fromEvent<PointerEvent>(this._document, 'pointerup');
		const pointermove = fromEvent<PointerEvent>(this._document, 'pointermove');

		pointerdown
			.pipe(
				switchMap(() => {
					// Set the active thumb on drag start so crossover tracking works
					this._slider.activeThumb.set(this.thumb());
					return pointermove.pipe(takeUntil(pointerup));
				}),
				takeUntilDestroyed(),
			)
			.subscribe(this._dragThumb.bind(this));
	}

	/** @internal */
	private _dragThumb(event: PointerEvent): void {
		if (this._slider.mutableDisabled()) {
			return;
		}

		const rect = this._slider.track()?.elementRef.nativeElement.getBoundingClientRect();

		if (!rect) {
			return;
		}

		const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
		const rawValue = this._slider.min() + (this._slider.max() - this._slider.min()) * percentage;

		// Use activeThumb (which tracks crossover) instead of the fixed thumb() input
		this._slider.setThumbValue(this._slider.activeThumb(), rawValue);
	}

	@HostListener('keydown', ['$event'])
	protected handleKeydown(event: KeyboardEvent): void {
		if (this._slider.mutableDisabled()) {
			return;
		}

		const dir = getComputedStyle(this._elementRef.nativeElement).direction;
		let multiplier = event.shiftKey ? 10 : 1;

		if (dir === 'rtl') {
			multiplier *= -1;
		}

		const current = this._currentValue();

		switch (event.key) {
			case 'ArrowLeft':
				this._slider.setThumbValue(this.thumb(), current - this._slider.step() * multiplier);
				event.preventDefault();
				break;
			case 'ArrowRight':
				this._slider.setThumbValue(this.thumb(), current + this._slider.step() * multiplier);
				event.preventDefault();
				break;
			case 'Home':
				this._slider.setThumbValue(
					this.thumb(),
					this.thumb() === 'low' ? this._slider.min() : this._slider.value()[0],
				);
				event.preventDefault();
				break;
			case 'End':
				this._slider.setThumbValue(
					this.thumb(),
					this.thumb() === 'high' ? this._slider.max() : this._slider.value()[1],
				);
				event.preventDefault();
				break;
		}
	}

	private _linearScale(
		input: readonly [number, number],
		output: readonly [number, number],
	): (value: number) => number {
		return (value: number) => {
			if (input[0] === input[1] || output[0] === output[1]) return output[0];
			const ratio = (output[1] - output[0]) / (input[1] - input[0]);
			return output[0] + ratio * (value - input[0]);
		};
	}
}
