import { isPlatformServer } from '@angular/common';
import { computed, Directive, ElementRef, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
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
		'(pointerdown)': '_onPointerDown($event)',
		'(pointermove)': '_onPointerMove($event)',
		'(pointerup)': '_onPointerUp($event)',
		'(focus)': 'focus()',
		'(keydown)': 'handleKeydown($event)',
	},
})
export class BrnSliderThumb implements OnDestroy {
	private readonly _platform = inject(PLATFORM_ID);
	protected readonly _slider = injectBrnSlider();
	public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

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

		const halfWidth = this.elementRef.nativeElement.offsetWidth / 2;
		const offset = linearScale([0, 50], [0, halfWidth]);
		const thumbInBoundsOffset = halfWidth - offset(this.percentage());

		return thumbInBoundsOffset;
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

	public focus() {
		this.elementRef.nativeElement.focus();
		this._slider.valueIndexToChange.set(this._index());
	}

	/**
	 * Handle keyboard events.
	 * @param event
	 */
	protected handleKeydown(event: KeyboardEvent) {
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
