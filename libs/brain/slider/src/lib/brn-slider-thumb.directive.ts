import { DOCUMENT, isPlatformServer } from '@angular/common';
import { computed, Directive, ElementRef, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { injectBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSliderThumb]',
	host: {
		role: 'slider',
		'[attr.aria-valuenow]': 'slider.value()',
		'[attr.aria-valuemin]': 'slider.min()',
		'[attr.aria-valuemax]': 'slider.max()',
		'[attr.tabindex]': 'slider.disabled() ? -1 : 0',
		'[attr.data-disabled]': 'slider.disabled()',
		'[style.inset-inline-start]': 'thumbOffset()',
	},
})
export class BrnSliderThumbDirective {
	protected readonly slider = injectBrnSlider();
	private readonly _document = inject<Document>(DOCUMENT);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _platform = inject(PLATFORM_ID);

	/**
	 * Offsets the thumb centre point while sliding to ensure it remains
	 * within the bounds of the slider when reaching the edges.
	 * Based on https://github.com/radix-ui/primitives/blob/main/packages/react/slider/src/slider.tsx
	 */
	protected readonly thumbOffset = computed(() => {
		// we can't compute the offset on the server
		if (isPlatformServer(this._platform)) {
			return this.slider.percentage() + '%';
		}

		const halfWidth = this._elementRef.nativeElement.offsetWidth / 2;
		const offset = this.linearScale([0, 50], [0, halfWidth]);
		const thumbInBoundsOffset = halfWidth - offset(this.slider.percentage());
		const percent = this.slider.percentage();

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
		if (this.slider.disabled()) {
			return;
		}

		const rect = this.slider.track()?.elementRef.nativeElement.getBoundingClientRect();

		if (!rect) {
			return;
		}

		const percentage = (event.clientX - rect.left) / rect.width;

		this.slider.setValue(
			this.slider.min() + (this.slider.max() - this.slider.min()) * Math.max(0, Math.min(1, percentage)),
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
		const value = this.slider.value();

		// if the slider is RTL, flip the multiplier
		if (dir === 'rtl') {
			multiplier = event.shiftKey ? -10 : -1;
		}

		switch (event.key) {
			case 'ArrowLeft':
				this.slider.setValue(Math.max(value - this.slider.step() * multiplier, this.slider.min()));
				event.preventDefault();
				break;
			case 'ArrowRight':
				this.slider.setValue(Math.min(value + this.slider.step() * multiplier, this.slider.max()));
				event.preventDefault();
				break;
			case 'Home':
				this.slider.setValue(this.slider.min());
				event.preventDefault();
				break;
			case 'End':
				this.slider.setValue(this.slider.max());
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
