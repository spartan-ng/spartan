import { isPlatformServer } from '@angular/common';
import { computed, Directive, ElementRef, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { injectElementSize } from '@spartan-ng/brain/core';
import { injectBrnSlider } from './brn-slider.token';
import { linearScale } from './utils/linear-scale';

@Directive({
	selector: '[brnSliderThumb]',
	host: {
		role: 'slider',
		'[attr.aria-label]': `_ariaLabel`,
		'[attr.aria-valuenow]': '_slider.value()[_index()]',
		'[attr.aria-valuemin]': '_slider.min()',
		'[attr.aria-valuemax]': '_slider.max()',
		'[attr.tabindex]': '_slider.mutableDisabled() ? -1 : 0',
		'[attr.data-disabled]': '_slider.mutableDisabled()',
		'[style.inset-inline-start]': '_slider.inverted() ? undefined :_thumbOffset()',
		'[style.inset-inline-end]': '_slider.inverted() ? _thumbOffset() : undefined',
		'[style.visibility]': '_thumbReady() ? undefined : "hidden"',
		'[style.pointer-events]': '_thumbReady() ? undefined : "none"',
		'[style.transform]': "'translateX(-50%)'",
		'data-slot': 'slider-thumb',
		'(pointerdown)': '_onPointerDown($event)',
		'(pointermove)': '_onPointerMove($event)',
		'(pointerup)': '_onPointerUp($event)',
		'(keydown)': 'handleKeydown($event)',
	},
})
export class BrnSliderThumb implements OnDestroy {
	private readonly _platform = inject(PLATFORM_ID);
	protected readonly _slider = injectBrnSlider();
	private readonly _size = injectElementSize();
	public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	/**
	 * Indicates whether the thumb is ready to be displayed and interactable.
	 *
	 * This signal returns `true` when the element's size has been measured
	 * and the width is greater than 0. It ensures that the thumb is not
	 * rendered or interacted with prematurely, which prevents layout
	 * issues or first-frame “jerks” when using SSR.
	 */
	protected readonly _thumbReady = computed(() => {
		const size = this._size();
		return !!size && size.width > 0;
	});

	protected readonly _index = computed(() => this._slider.thumbs().findIndex((thumb) => thumb === this));

	public readonly percentage = computed(
		() =>
			((this._slider.value()[this._index()] - this._slider.min()) / (this._slider.max() - this._slider.min())) * 100,
	);

	public readonly thumbInBoundsOffset = computed(() => {
		// we can't compute the offset on the server
		if (isPlatformServer(this._platform)) {
			return 0;
		}

		const width = this._size()?.width;
		if (!width) {
			return 0;
		}

		const halfWidth = width / 2;
		const offset = linearScale([0, 50], [0, halfWidth]);
		const direction = this._slider.isSlidingFromLeft() ? 1 : -1;

		return (halfWidth - offset(this.percentage()) * direction) * direction;
	});

	/**
	 * Offsets the thumb centre point while sliding to ensure it remains
	 * within the bounds of the slider when reaching the edges.
	 * Based on https://github.com/radix-ui/primitives/blob/main/packages/react/slider/src/slider.tsx
	 */
	public readonly _thumbOffset = computed(() => {
		// we can't compute the offset on the server
		if (isPlatformServer(this._platform)) {
			return this.percentage() + '%';
		}

		return `calc(${this.percentage()}% + ${this.thumbInBoundsOffset()}px)`;
	});

	public readonly _thumbOffsetInverted = computed(() => {
		// we can't compute the offset on the server
		if (isPlatformServer(this._platform)) {
			return 100 - this.percentage() + '%';
		}

		return `calc(${100 - this.percentage()}% - ${this.thumbInBoundsOffset()}px)`;
	});

	protected readonly _ariaLabel = computed(() => `Value ${this._index() + 1} of ${this._slider.value().length}`);

	constructor() {
		this._slider.addThumb(this);
	}

	ngOnDestroy() {
		this._slider.removeThumb(this);
	}

	_onPointerDown(event: PointerEvent) {
		this._slider.track()?._onPointerDown(event);
	}

	_onPointerMove(event: PointerEvent) {
		this._slider.track()?._onPointerMove(event);
	}

	_onPointerUp(event: PointerEvent) {
		this._slider.track()?._onPointerUp(event);
	}

	/**
	 * Handle keyboard events.
	 * @param event
	 */
	protected handleKeydown(event: KeyboardEvent) {
		const isSlidingFromLeft = this._slider.isSlidingFromLeft();
		let multiplier = event.shiftKey ? 10 : 1;
		const index = this._index();
		const value = this._slider.value()[index];

		// if the slider is RTL, flip the multiplier
		if (!isSlidingFromLeft) {
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
