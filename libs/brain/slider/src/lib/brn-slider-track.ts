import { Directive, ElementRef, inject } from '@angular/core';
import { provideBrnSliderTrack } from './brn-slider-track.token';
import { injectBrnSlider } from './brn-slider.token';
import { linearScale } from './utils/linear-scale';

@Directive({
	selector: '[brnSliderTrack]',
	providers: [provideBrnSliderTrack(BrnSliderTrack)],
	host: {
		'[attr.data-disabled]': '_slider.mutableDisabled() ? "" : null',
		'[attr.data-orientation]': '_slider.orientation()',
		'data-slot': 'slider-track',
		'(pointerdown)': '_onPointerDown($event)',
		'(pointermove)': '_onPointerMove($event)',
		'(pointerup)': '_onPointerUp($event)',
	},
})
export class BrnSliderTrack {
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	protected readonly _slider = injectBrnSlider();

	private _rangeDragStartPointer: number | null = null;

	constructor() {
		this._slider.track.set(this);
	}

	public _onPointerDown(event: PointerEvent) {
		if (this._slider.mutableDisabled()) return;

		const target = event.target as HTMLElement;
		target.setPointerCapture(event.pointerId);

		const isTrackOrRange = this._isTrackOrRange(target);
		const isRange = this._slider.range()?.elementRef.nativeElement === target;

		// Prevent browser focus behaviour because we instead focus a thumb manually when values change.
		if (isTrackOrRange) {
			event.preventDefault();
		}

		// Start range drag if enabled
		if (isRange && this._slider.isDraggableRange()) {
			this._rangeDragStartPointer = this._getPointerPosition(event);
			return;
		}

		const pointerPosition = this._getPointerPosition(event);
		const value = this._getValueFromPointer(pointerPosition);
		const closestIndex = getClosestValueIndex(this._slider.normalizedValue(), value);

		// Track press → jump value to pointer position.
		// Thumb press → select thumb to drag without forcing a value update.
		if (isTrackOrRange) {
			this._slider.setValue(value, closestIndex);
		} else {
			this._slider.valueIndexToChange.set(closestIndex);
		}
	}

	public _onPointerMove(event: PointerEvent) {
		if (this._slider.mutableDisabled()) return;

		const target = event.target as HTMLElement;
		if (!target.hasPointerCapture(event.pointerId)) return;

		if (this._rangeDragStartPointer !== null && this._slider.isDraggableRange()) {
			const currentPointer = this._getPointerPosition(event);
			const pixelDelta = currentPointer - this._rangeDragStartPointer;

			const valueDelta = this._pixelDeltaToValueDelta(pixelDelta);

			this._slider.setAllValuesByDelta(valueDelta);

			// Important: reset start pointer so delta stays incremental
			this._rangeDragStartPointer = currentPointer;
			return;
		}

		const pointerPosition = this._getPointerPosition(event);
		const value = this._getValueFromPointer(pointerPosition);
		this._slider.setValue(value, this._slider.valueIndexToChange());
	}

	public _onPointerUp(event: PointerEvent) {
		const target = event.target as HTMLElement;

		if (target.hasPointerCapture(event.pointerId)) {
			target.releasePointerCapture(event.pointerId);
		}

		this._rangeDragStartPointer = null;
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

	private _pixelDeltaToValueDelta(pixelDelta: number): number {
		const rect = this._elementRef.nativeElement.getBoundingClientRect();
		const size = this._slider.isHorizontal() ? rect.width : rect.height;

		const scale = linearScale([0, size], [this._slider.min(), this._slider.max()]);

		// Determine direction multiplier based on sliding source
		let direction = 1;
		switch (this._slider.slidingSource()) {
			case 'right':
			case 'bottom':
				direction = -1;
				break;
			case 'left':
			case 'top':
				direction = 1;
				break;
		}

		return scale(pixelDelta * direction) - scale(0);
	}

	private _isTrackOrRange(el: HTMLElement) {
		return this._elementRef.nativeElement === el || this._slider.range()?.elementRef.nativeElement === el;
	}

	private _getPointerPosition(event: PointerEvent): number {
		return this._slider.orientation() === 'horizontal' ? event.clientX : event.clientY;
	}
}

function getClosestValueIndex(values: number[], nextValue: number) {
	if (values.length === 1) return 0;
	const distances = values.map((value) => Math.abs(value - nextValue));
	const closestDistance = Math.min(...distances);
	return distances.indexOf(closestDistance);
}
