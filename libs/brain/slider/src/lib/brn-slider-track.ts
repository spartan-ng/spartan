import { Directive, ElementRef, inject } from '@angular/core';
import { provideBrnSliderTrack } from './brn-slider-track.token';
import { injectBrnSlider } from './brn-slider.token';
import { linearScale } from './utils/linear-scale';

@Directive({
	selector: '[brnSliderTrack]',
	providers: [provideBrnSliderTrack(BrnSliderTrack)],
	host: {
		'[attr.data-disabled]': '_slider.mutableDisabled()',
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
		const target = event.target as HTMLElement;
		target.setPointerCapture(event.pointerId);
		// Prevent browser focus behaviour because we focus a thumb manually when values change.
		event.preventDefault();

		const value = this._getValueFromPointer(event.clientX);
		const closestIndex = getClosestValueIndex(this._slider.value(), value);

		this._slider.setValue(value, closestIndex);
	}

	public _onPointerMove(event: PointerEvent) {
		const target = event.target as HTMLElement;

		if (target.hasPointerCapture(event.pointerId)) {
			const value = this._getValueFromPointer(event.clientX);
			this._slider.setValue(value, this._slider.valueIndexToChange());
		}
	}

	public _onPointerUp(event: PointerEvent) {
		const target = event.target as HTMLElement;

		if (target.hasPointerCapture(event.pointerId)) {
			target.releasePointerCapture(event.pointerId);
		}
	}

	private _getValueFromPointer(pointerPosition: number) {
		const rect = this._elementRef.nativeElement.getBoundingClientRect();
		const input: [number, number] = [0, rect.width];
		const output: [number, number] = [this._slider.min(), this._slider.max()];
		const value = linearScale(input, output);

		const isLtr = this._slider.direction() === 'ltr';
		const relativePosition = isLtr ? pointerPosition - rect.left : rect.right - pointerPosition;

		return value(relativePosition);
	}
}

function getClosestValueIndex(values: number[], nextValue: number) {
	if (values.length === 1) return 0;
	const distances = values.map((value) => Math.abs(value - nextValue));
	const closestDistance = Math.min(...distances);
	return distances.indexOf(closestDistance);
}
