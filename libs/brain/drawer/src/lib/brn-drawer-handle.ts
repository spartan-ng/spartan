import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject, input, signal } from '@angular/core';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { BrnDrawer } from './brn-drawer';

@Directive({
	selector: '[brnDrawerHandle]',
	host: {
		role: 'presentation',
		'(pointerdown)': '_onPointerDown($event)',
	},
})
export class BrnDrawerHandle {
	private readonly _brnDialogRef = inject(BrnDialogRef, { optional: true });
	private readonly _brnDrawer = inject(BrnDrawer, { optional: true });
	private readonly _element: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly _document = inject(DOCUMENT);
	private readonly _dragging = signal(false);
	private _startX = 0;
	private _startY = 0;
	private _currentX = 0;
	private _currentY = 0;

	public readonly closeThreshold = input<number>(0.3);

	protected _onPointerDown(event: PointerEvent): void {
		if (!this._brnDialogRef || !this._brnDrawer) return;

		const direction = this._brnDrawer.directionState();
		const isVertical = direction === 'bottom' || direction === 'top';
		const isPositive = direction === 'bottom' || direction === 'right';

		this._startX = event.clientX;
		this._startY = event.clientY;
		this._currentX = event.clientX;
		this._currentY = event.clientY;
		this._dragging.set(true);

		const el = this._element.nativeElement;

		const onPointerMove = (e: PointerEvent) => {
			this._currentX = e.clientX;
			this._currentY = e.clientY;
			const delta = isVertical ? this._currentY - this._startY : this._currentX - this._startX;

			if ((isPositive && delta > 0) || (!isPositive && delta < 0)) {
				const prop = isVertical ? 'translateY' : 'translateX';
				el.style.transform = `${prop}(${delta}px)`;
			}
		};

		this._document.addEventListener('pointermove', onPointerMove);

		const onPointerUp = () => {
			this._dragging.set(false);
			this._document.removeEventListener('pointermove', onPointerMove);
			const delta = isVertical ? this._currentY - this._startY : this._currentX - this._startX;
			const drawerEl = el.closest('[data-vaul-drawer-direction]');
			if (!drawerEl) return;
			const dimension = isVertical ? (drawerEl as HTMLElement).offsetHeight : (drawerEl as HTMLElement).offsetWidth;
			if (dimension === 0) return;
			const normalizedDelta = isPositive ? delta : -delta;

			if (normalizedDelta > 0 && normalizedDelta / dimension > this.closeThreshold()) {
				this._brnDialogRef?.close();
			}
			el.style.transform = '';
		};

		this._document.addEventListener('pointerup', onPointerUp, { once: true });
	}
}
