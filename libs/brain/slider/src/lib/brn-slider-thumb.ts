import { isPlatformServer } from '@angular/common';
import { computed, Directive, DOCUMENT, ElementRef, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { injectBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSliderThumb]',
	host: {
		role: 'slider',
		'[attr.aria-valuenow]': '_slider.value()',
		'[attr.aria-valuemin]': '_slider.min()',
		'[attr.aria-valuemax]': '_slider.max()',
		'[attr.tabindex]': '_slider.mutableDisabled() ? -1 : 0',
		'[attr.data-disabled]': '_slider.mutableDisabled()',
		'[style.inset-inline-start]': '_thumbOffset()',
	},
})
export class BrnSliderThumb {
	protected readonly _slider = injectBrnSlider();
	private readonly _document = inject<Document>(DOCUMENT);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _platform = inject(PLATFORM_ID);

	/**
	 * Offsets the thumb centre point while sliding to ensure it remains
	 * within the bounds of the slider when reaching the edges.
	 * Based on https://github.com/radix-ui/primitives/blob/main/packages/react/slider/src/slider.tsx
	 */
	protected readonly _thumbOffset = computed(() => {
		// we can't compute the offset on the server
		if (isPlatformServer(this._platform)) {
			return this._slider.percentage() + '%';
		}

		const halfWidth = this._elementRef.nativeElement.offsetWidth / 2;
		const offset = this.linearScale([0, 50], [0, halfWidth]);
		const thumbInBoundsOffset = halfWidth - offset(this._slider.percentage());
		const percent = this._slider.percentage();

		return `calc(${percent}% + ${thumbInBoundsOffset}px)`;
	});

	constructor() {
		const mousedown = fromEvent<MouseEvent>(this._elementRef.nativeElement, 'pointerdown');
		const mouseup = fromEvent<MouseEvent>(this._document, 'pointerup');
		const mousemove = fromEvent<MouseEvent>(this._document, 'pointermove');

		// Listen for mousedown events on the slider thumb
		mousedown
			.pipe(
				switchMap(() => mousemove.pipe(takeUntil(mouseup))),
				takeUntilDestroyed(),
			)
			.subscribe(this.dragThumb.bind(this));
	}

	/** @internal */
	private dragThumb(event: MouseEvent): void {
		if (this._slider.mutableDisabled()) {
			return;
		}

		const rect = this._slider.track()?.elementRef.nativeElement.getBoundingClientRect();

		if (!rect) {
			return;
		}

		const percentage = (event.clientX - rect.left) / rect.width;

		this._slider.setValue(
			this._slider.min() + (this._slider.max() - this._slider.min()) * Math.max(0, Math.min(1, percentage)),
		);
	}

	/**
	 * Handle keyboard events.
	 * @param event
	 */
	@HostListener('keydown', ['$event'])
	protected handleKeydown(event: KeyboardEvent): void {
		const dir = getComputedStyle(this._elementRef.nativeElement).direction;
		let multiplier = event.shiftKey ? 10 : 1;
		const value = this._slider.value();

		// if the slider is RTL, flip the multiplier
		if (dir === 'rtl') {
			multiplier = event.shiftKey ? -10 : -1;
		}

		switch (event.key) {
			case 'ArrowLeft':
				this._slider.setValue(Math.max(value - this._slider.step() * multiplier, this._slider.min()));
				event.preventDefault();
				break;
			case 'ArrowRight':
				this._slider.setValue(Math.min(value + this._slider.step() * multiplier, this._slider.max()));
				event.preventDefault();
				break;
			case 'Home':
				this._slider.setValue(this._slider.min());
				event.preventDefault();
				break;
			case 'End':
				this._slider.setValue(this._slider.max());
				event.preventDefault();
				break;
		}
	}

	private linearScale(input: readonly [number, number], output: readonly [number, number]): (value: number) => number {
		return (value: number) => {
			if (input[0] === input[1] || output[0] === output[1]) return output[0];
			const ratio = (output[1] - output[0]) / (input[1] - input[0]);
			return output[0] + ratio * (value - input[0]);
		};
	}
}
