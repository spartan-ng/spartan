import { Directive, ElementRef, inject } from '@angular/core';
import { provideBrnSliderTrack } from './brn-slider-track.token';
import { injectBrnSlider } from './brn-slider.token';
import { linearScale } from './utils/linear-scale';

@Directive({
	selector: '[brnSliderTrack]',
	providers: [provideBrnSliderTrack(BrnSliderTrack)],
	host: {
		'[attr.data-orientation]': '_slider.orientation()',
		'[attr.data-disabled]': '_slider.mutableDisabled() ? "" : null',
		'data-slot': 'slider-track',
		'(pointerdown)': '_onPointerDown($event)',
		'(pointermove)': '_onPointerMove($event)',
		'(pointerup)': '_onPointerUp($event)',
	},
})
export class BrnSliderTrack {
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	protected readonly _slider = injectBrnSlider();

	constructor() {
		this._slider.track.set(this);
	}

	public _onPointerDown(event: PointerEvent) {
		if (this._slider.mutableDisabled()) return;

		const target = event.target as HTMLElement;
		target.setPointerCapture(event.pointerId);
		// Prevent browser focus behaviour because we focus a thumb manually when values change.
		event.preventDefault();

		const pointerPosition = this._slider.orientation() === 'horizontal' ? event.clientX : event.clientY;
		const value = this._getValueFromPointer(pointerPosition);
		const closestIndex = getClosestValueIndex(this._slider.normalizedValue(), value);

		// Track press → jump value to pointer position.
		// Thumb press → select thumb to drag without forcing a value update.
		if (this._isTrackOrRange(target)) {
			this._slider.setValue(value, closestIndex);
		} else {
			this._slider.valueIndexToChange.set(closestIndex);
		}
	}

	public _onPointerMove(event: PointerEvent) {
		if (this._slider.mutableDisabled()) return;

		const target = event.target as HTMLElement;

		if (target.hasPointerCapture(event.pointerId)) {
			const pointerPosition = this._slider.orientation() === 'horizontal' ? event.clientX : event.clientY;
			const value = this._getValueFromPointer(pointerPosition);
			this._slider.setValue(value, this._slider.valueIndexToChange());
		}
	}

	public _onPointerUp(event: PointerEvent) {
		if (this._slider.mutableDisabled()) return;

		const target = event.target as HTMLElement;

		if (target.hasPointerCapture(event.pointerId)) {
			target.releasePointerCapture(event.pointerId);
		}
	}

	private _getValueFromPointer(pointerPosition: number) {
		const rect = this._elementRef.nativeElement.getBoundingClientRect();
		const source = this._slider.slidingSource();

		const isVertical = source === 'top' || source === 'bottom';
		const size = isVertical ? rect.height : rect.width;

		const input: [number, number] = [0, size];
		const output: [number, number] = [this._slider.min(), this._slider.max()];
		const value = linearScale(input, output);

		let relativePosition: number;

		switch (source) {
			case 'left':
				relativePosition = pointerPosition - rect.left;
				break;
			case 'right':
				relativePosition = rect.right - pointerPosition;
				break;
			case 'top':
				relativePosition = pointerPosition - rect.top;
				break;
			case 'bottom':
				relativePosition = rect.bottom - pointerPosition;
				break;
		}

		return value(relativePosition);
	}

	private _isTrackOrRange(el: HTMLElement) {
		return this._elementRef.nativeElement === el || this._slider.range()?.elementRef.nativeElement === el;
	}
}

function getClosestValueIndex(values: number[], nextValue: number) {
	if (values.length === 1) return 0;
	const distances = values.map((value) => Math.abs(value - nextValue));
	const closestDistance = Math.min(...distances);
	return distances.indexOf(closestDistance);
}
