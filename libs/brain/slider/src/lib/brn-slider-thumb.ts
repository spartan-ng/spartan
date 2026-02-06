import { isPlatformServer } from '@angular/common';
import { computed, Directive, ElementRef, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { injectElementSize } from '@spartan-ng/brain/core';
import { injectBrnSlider } from './brn-slider.token';
import { linearScale } from './utils/linear-scale';

const PAGE_KEYS = ['PageUp', 'PageDown'];

@Directive({
	selector: '[brnSliderThumb]',
	host: {
		role: 'slider',
		'[attr.aria-label]': `_ariaLabel()`,
		'[attr.aria-orientation]': '_slider.orientation()',
		'[attr.aria-valuenow]': '_slider.normalizedValue()[_index()]',
		'[attr.aria-valuemin]': '_slider.min()',
		'[attr.aria-valuemax]': '_slider.max()',
		'[attr.tabindex]': '_slider.mutableDisabled() ? -1 : 0',
		'[attr.data-disabled]': '_slider.mutableDisabled() ? "" : null',
		'[attr.data-orientation]': '_slider.orientation()',
		'[style.inset-inline-start]':
			'_slider.isHorizontal() ?  _slider.inverted() ? undefined : _thumbOffset() : undefined',
		'[style.inset-inline-end]': '_slider.isHorizontal() ? _slider.inverted() ? _thumbOffset() : undefined : undefined',
		'[style.inset-block-end]': '!_slider.isHorizontal() ? _slider.inverted() ? undefined : _thumbOffset() : undefined',
		'[style.inset-block-start]':
			'!_slider.isHorizontal() ? _slider.inverted() ? _thumbOffset() : undefined : undefined',
		'[style.visibility]': '_thumbReady() ? undefined : "hidden"',
		'[style.pointer-events]': '_thumbReady() ? undefined : "none"',
		'[style.transform]': '_transformValue()',
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

	public readonly percentage = computed(() => {
		const range = this._slider.max() - this._slider.min();
		if (range === 0) return 0;

		return ((this._slider.normalizedValue()[this._index()] - this._slider.min()) / range) * 100;
	});

	public readonly thumbInBoundsOffset = computed(() => {
		// we can't compute the offset on the server
		if (isPlatformServer(this._platform)) {
			return 0;
		}

		const size = this._slider.isHorizontal() ? this._size()?.width : this._size()?.height;
		if (!size) {
			return 0;
		}

		const halfSize = size / 2;
		const offset = linearScale([0, 50], [0, halfSize]);
		const direction = this._slider.slidingSource() === 'left' || this._slider.slidingSource() === 'top' ? 1 : -1;

		return (halfSize - offset(this.percentage()) * direction) * direction;
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

	protected readonly _ariaLabel = computed(
		() => `Value ${this._index() + 1} of ${this._slider.normalizedValue().length}`,
	);

	protected readonly _transformValue = computed(() =>
		this._slider.orientation() === 'horizontal' ? 'translateX(-50%)' : 'translateY(-50%)',
	);

	constructor() {
		this._slider.addThumb(this);
	}

	ngOnDestroy() {
		this._slider.removeThumb(this);
	}

	protected _onPointerDown(event: PointerEvent) {
		this._slider.track()?._onPointerDown(event);
	}

	protected _onPointerMove(event: PointerEvent) {
		this._slider.track()?._onPointerMove(event);
	}

	protected _onPointerUp(event: PointerEvent) {
		this._slider.track()?._onPointerUp(event);
	}

	/**
	 * Handle keyboard events.
	 * @param event
	 */
	protected handleKeydown(event: KeyboardEvent) {
		if (this._slider.mutableDisabled()) return;

		const index = this._index();
		const value = this._slider.normalizedValue()[index];
		const step = this._slider.step();
		const min = this._slider.min();
		const max = this._slider.max();

		const multiplier = event.shiftKey || PAGE_KEYS.includes(event.key) ? 10 : 1;

		const dirLR = this._slider.slidingSource() === 'right' ? -1 : 1;
		const dirUD = this._slider.slidingSource() === 'top' ? -1 : 1;

		const deltas: Partial<Record<string, number>> = {
			ArrowLeft: -step * multiplier * dirLR,
			ArrowRight: step * multiplier * dirLR,
			ArrowUp: step * multiplier * dirUD,
			ArrowDown: -step * multiplier * dirUD,
			PageUp: step * multiplier,
			PageDown: -step * multiplier,
		};

		if (event.key === 'Home') {
			this._slider.setValue(min, index);
			event.preventDefault();
			return;
		}

		if (event.key === 'End') {
			this._slider.setValue(max, index);
			event.preventDefault();
			return;
		}

		const delta = deltas[event.key];
		if (delta === undefined) return;

		this._slider.setValue(Math.min(max, Math.max(min, value + delta)), index);

		event.preventDefault();
	}
}
