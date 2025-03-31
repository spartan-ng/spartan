import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { injectBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSliderThumb]',
	host: {
		'[attr.aria-valuenow]': 'slider.value()',
		'[attr.aria-valuemin]': 'slider.min()',
		'[attr.aria-valuemax]': 'slider.max()',
		'[attr.tabindex]': 'slider.disabled() ? -1 : 0',
		'[attr.data-disabled]': 'slider.disabled()',
		'[style.inset-inline-start.%]': 'slider.percentage()',
	},
})
export class BrnSliderThumbDirective {
	protected readonly slider = injectBrnSlider();
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		const mousedown = fromEvent<MouseEvent>(this._elementRef.nativeElement, 'mousedown');
		const mouseup = fromEvent<MouseEvent>(document, 'mouseup');
		const mousemove = fromEvent<MouseEvent>(document, 'mousemove');

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
}
