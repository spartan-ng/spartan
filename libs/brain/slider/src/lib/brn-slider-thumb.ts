import { isPlatformServer } from '@angular/common';
import { computed, Directive, DOCUMENT, ElementRef, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { fromEvent } from 'rxjs';
import { injectBrnSlider } from './brn-slider.token';
import { linearScale } from './utils/linear-scale';

@Directive({
	selector: '[brnSliderThumb]',
	host: {
		role: 'slider',
		'[attr.aria-valuenow]': '_slider.value()[_index()]',
		'[attr.aria-valuemin]': '_slider.min()',
		'[attr.aria-valuemax]': '_slider.max()',
		'[attr.tabindex]': '_slider.mutableDisabled() ? -1 : 0',
		'[attr.data-disabled]': '_slider.mutableDisabled()',
		'[style.inset-inline-start]': '_thumbOffset()',
		'(focus)': 'focus()',
	},
})
export class BrnSliderThumb {
	protected readonly _slider = injectBrnSlider();
	private readonly _document = inject<Document>(DOCUMENT);
	public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _platform = inject(PLATFORM_ID);

	protected readonly _index = computed(() => this._slider.thumbs().findIndex((thumb) => thumb === this));

	public readonly percentage = computed(
		() =>
			((this._slider.value()[this._index()] - this._slider.min()) / (this._slider.max() - this._slider.min())) * 100,
	);

	/**
	 * Offsets the thumb centre point while sliding to ensure it remains
	 * within the bounds of the slider when reaching the edges.
	 * Based on https://github.com/radix-ui/primitives/blob/main/packages/react/slider/src/slider.tsx
	 */
	protected readonly _thumbOffset = computed(() => {
		// we can't compute the offset on the server
		if (isPlatformServer(this._platform)) {
			return this.percentage() + '%';
		}

		const halfWidth = this.elementRef.nativeElement.offsetWidth / 2;
		const offset = linearScale([0, 50], [0, halfWidth]);
		const thumbInBoundsOffset = halfWidth - offset(this.percentage());
		const percent = this.percentage();

		return `calc(${percent}% + ${thumbInBoundsOffset}px)`;
	});

	constructor() {
		const mousedown = fromEvent<MouseEvent>(this.elementRef.nativeElement, 'pointerdown');
		const mouseup = fromEvent<MouseEvent>(this._document, 'pointerup');
		const mousemove = fromEvent<MouseEvent>(this._document, 'pointermove');

		// Listen for mousedown events on the slider thumb
		// mousedown
		// 	.pipe(
		// 		switchMap((e) => {
		// 			e.preventDefault();
		// 			return mousemove.pipe(
		// 				takeUntil(mouseup),
		// 				takeUntil(this._focusMonitor.monitor(this.elementRef, true).pipe(filter((val) => val === null))),
		// 			);
		// 		}),
		// 		takeUntilDestroyed(),
		// 	)
		// 	.subscribe(this.dragThumb.bind(this));
	}

	public focus() {
		this.elementRef.nativeElement.focus();
		this._slider.valueIndexToChange.set(this._index());
	}

	public blur() {
		this.elementRef.nativeElement.blur();
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
			this._index(),
		);
	}

	/**
	 * Handle keyboard events.
	 * @param event
	 */
	@HostListener('keydown', ['$event'])
	protected handleKeydown(event: KeyboardEvent): void {
		const dir = getComputedStyle(this.elementRef.nativeElement).direction;
		let multiplier = event.shiftKey ? 10 : 1;
		const index = this._index();
		const value = this._slider.value()[index];

		// if the slider is RTL, flip the multiplier
		if (dir === 'rtl') {
			multiplier = event.shiftKey ? -10 : -1;
		}

		switch (event.key) {
			case 'ArrowLeft':
				this._slider.setValue(Math.max(value - this._slider.step() * multiplier, this._slider.min()), index);
				event.preventDefault();
				break;
			case 'ArrowRight':
				this._slider.setValue(Math.min(value + this._slider.step() * multiplier, this._slider.max()), index);
				event.preventDefault();
				break;
			case 'Home':
				this._slider.setValue(this._slider.min(), index);
				event.preventDefault();
				break;
			case 'End':
				this._slider.setValue(this._slider.max(), index);
				event.preventDefault();
				break;
		}
	}
}
