import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject, input } from '@angular/core';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { BrnDrawer } from './brn-drawer';

const VELOCITY_THRESHOLD = 0.4;
const DEFAULT_CLOSE_THRESHOLD = 0.25;
const SCROLL_LOCK_TIMEOUT = 100;
const TOUCH_SWIPE_THRESHOLD = 10;
const MOUSE_SWIPE_THRESHOLD = 2;
const OPEN_TIME_COOLDOWN = 500;
const TRANSITION = 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
const OVERLAY_TRANSITION = 'opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1)';

function dampenValue(v: number): number {
	return 8 * (Math.log(v + 1) - 2);
}

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

	private _drawerEl: HTMLElement | null = null;
	private _backdropEl: HTMLElement | null = null;
	private _direction: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
	private _initialBackdropOpacity = 1;
	private _scrollEl: HTMLElement | null = null;

	private _pointerStartX = 0;
	private _pointerStartY = 0;
	private _pointerStart = 0;
	private _pointerType = '';
	private _isDragging = false;
	private _isAllowedToDrag = false;
	private _wasBeyondThreshold = false;

	private _openTime: number | null = null;
	private _lastTimeDragPrevented: number | null = null;
	private _dragStartTime: number | null = null;

	public readonly closeThreshold = input<number>(DEFAULT_CLOSE_THRESHOLD);

	private get _isVertical(): boolean {
		return this._direction === 'bottom' || this._direction === 'top';
	}

	private get _isPositive(): boolean {
		return this._direction === 'bottom' || this._direction === 'right';
	}

	private get _dimensionMultiplier(): number {
		return this._isPositive ? 1 : -1;
	}

	private get _swipeThreshold(): number {
		return this._pointerType === 'touch' ? TOUCH_SWIPE_THRESHOLD : MOUSE_SWIPE_THRESHOLD;
	}

	protected _onPointerDown(event: PointerEvent): void {
		if (!this._brnDialogRef || !this._brnDrawer || this._isDragging) return;

		this._direction = this._brnDrawer.directionState();
		this._drawerEl = this._element.nativeElement.closest('[data-vaul-drawer-direction]');
		if (!this._drawerEl) return;

		if (this._openTime === null && this._brnDialogRef.state() === 'open') {
			this._openTime = Date.now();
		}

		this._pointerType = event.pointerType;
		this._pointerStartX = event.pageX;
		this._pointerStartY = event.pageY;
		this._pointerStart = this._isVertical ? event.pageY : event.pageX;
		this._isDragging = true;
		this._isAllowedToDrag = false;
		this._wasBeyondThreshold = false;
		this._dragStartTime = Date.now();

		this._drawerEl.style.transition = 'none';

		this._scrollEl = this._findScrollableAncestor(event.target as HTMLElement);
		if (!this._scrollEl) {
			event.preventDefault();
		}

		const overlayWrapper = this._drawerEl.closest('.cdk-global-overlay-wrapper');
		this._backdropEl = overlayWrapper?.querySelector('.cdk-overlay-backdrop') as HTMLElement | null;
		if (this._backdropEl) {
			this._initialBackdropOpacity = parseFloat(getComputedStyle(this._backdropEl).opacity) || 1;
		}

		this._document.addEventListener('pointermove', this._onPointerMove, { passive: false });
		this._document.addEventListener('pointerup', this._onPointerUp, { once: true });
		this._document.addEventListener('pointercancel', this._onPointerCancel, { once: true });
	}

	private readonly _onPointerMove = (e: PointerEvent) => {
		if (!this._isDragging || !this._drawerEl) return;

		const currentX = e.pageX;
		const currentY = e.pageY;
		const xDelta = currentX - this._pointerStartX;
		const yDelta = currentY - this._pointerStartY;

		if (!this._wasBeyondThreshold) {
			const absX = Math.abs(xDelta);
			const absY = Math.abs(yDelta);
			if (this._isVertical) {
				if (absY < this._swipeThreshold) {
					if (absX >= this._swipeThreshold) {
						this._pointerStartX = currentX;
						this._pointerStartY = currentY;
					}
					return;
				}
				if (absX > absY) return;
			} else {
				if (absX < this._swipeThreshold) {
					if (absY >= this._swipeThreshold) {
						this._pointerStartX = currentX;
						this._pointerStartY = currentY;
					}
					return;
				}
				if (absY > absX) return;
			}
			this._wasBeyondThreshold = true;
		}

		const currentPosition = this._isVertical ? currentY : currentX;
		const draggedDistance = (this._pointerStart - currentPosition) * this._dimensionMultiplier;
		const isDraggingInDirection = draggedDistance > 0;
		const absDraggedDistance = Math.abs(draggedDistance);

		if (!this._isAllowedToDrag && !this._shouldDrag(e.target, isDraggingInDirection)) return;

		this._isAllowedToDrag = true;
		this._drawerEl.classList.add('vaul-dragging');

		const dimension = this._isVertical ? this._drawerEl.offsetHeight : this._drawerEl.offsetWidth;

		const progress = dimension > 0 ? Math.min(absDraggedDistance / dimension, 1) : 0;

		if (isDraggingInDirection) {
			const dampened = dampenValue(draggedDistance);
			const translateValue = Math.min(dampened * -1, 0) * this._dimensionMultiplier;
			const prop = this._isVertical ? 'translateY' : 'translateX';
			this._drawerEl.style.transform = `${prop}(${translateValue}px)`;
			if (this._backdropEl) {
				this._backdropEl.style.opacity = String(Math.max(this._initialBackdropOpacity - progress * 0.3, 0));
			}
			return;
		}

		e.preventDefault();

		const translateValue = absDraggedDistance * this._dimensionMultiplier;
		const prop = this._isVertical ? 'translateY' : 'translateX';
		this._drawerEl.style.transform = `${prop}(${translateValue}px)`;

		if (this._backdropEl) {
			this._backdropEl.style.opacity = String(Math.max(this._initialBackdropOpacity - progress, 0));
		}
	};

	private readonly _onPointerUp = (e: PointerEvent) => {
		if (!this._isDragging || !this._drawerEl) {
			this._cleanup();
			return;
		}

		this._drawerEl.classList.remove('vaul-dragging');

		const swipeAmount = this._getTranslate();

		if (!this._isAllowedToDrag || swipeAmount === null || Number.isNaN(swipeAmount)) {
			this._resetDrawer(true);
			this._cleanup();
			return;
		}

		const currentPosition = this._isVertical ? e.pageY : e.pageX;
		const distMoved = this._pointerStart - currentPosition;
		const timeTaken = Date.now() - (this._dragStartTime ?? Date.now());
		const velocity = timeTaken > 0 ? Math.abs(distMoved) / timeTaken : 0;

		if (this._isPositive ? distMoved > 0 : distMoved < 0) {
			this._resetDrawer(true);
			this._cleanup();
			return;
		}

		if (velocity > VELOCITY_THRESHOLD) {
			this._animateAndClose();
			this._cleanup();
			this._brnDialogRef?.close();
			return;
		}

		const dimension = this._isVertical ? this._drawerEl.offsetHeight : this._drawerEl.offsetWidth;
		if (Math.abs(swipeAmount) >= dimension * this.closeThreshold()) {
			this._animateAndClose();
			this._cleanup();
			this._brnDialogRef?.close();
			return;
		}

		this._resetDrawer(true);
		this._cleanup();
	};

	private readonly _onPointerCancel = () => {
		this._resetDrawer(true);
		this._cleanup();
	};

	private _shouldDrag(el: EventTarget, isDraggingInDirection: boolean): boolean {
		if (this._direction === 'left' || this._direction === 'right') return true;

		const now = Date.now();

		if (this._openTime !== null && now - this._openTime < OPEN_TIME_COOLDOWN) return false;

		const currentTranslate = this._getTranslate();
		if (this._isPositive ? currentTranslate > 0 : currentTranslate < 0) return true;

		if (
			this._lastTimeDragPrevented !== null &&
			now - this._lastTimeDragPrevented < SCROLL_LOCK_TIMEOUT &&
			currentTranslate === 0
		) {
			this._lastTimeDragPrevented = now;
			return false;
		}

		if (isDraggingInDirection) {
			this._lastTimeDragPrevented = now;
			return false;
		}

		let element = el as HTMLElement | null;
		while (element) {
			if (element.scrollHeight > element.clientHeight) {
				if (element.scrollTop !== 0) {
					this._lastTimeDragPrevented = now;
					return false;
				}
				if (element.getAttribute('role') === 'dialog') return true;
			}
			element = element.parentElement;
		}

		return true;
	}

	private _getTranslate(): number {
		if (!this._drawerEl) return 0;
		const style = getComputedStyle(this._drawerEl);
		const transform = style.transform || (style as any).webkitTransform;
		if (!transform || transform === 'none') return 0;
		let mat = transform.match(/^matrix3d\((.+)\)$/);
		if (mat) {
			return parseFloat(mat[1].split(', ')[this._isVertical ? 13 : 12]);
		}
		mat = transform.match(/^matrix\((.+)\)$/);
		if (mat) {
			return parseFloat(mat[1].split(', ')[this._isVertical ? 5 : 4]);
		}
		return 0;
	}

	private _resetDrawer(animate = true): void {
		if (this._drawerEl) {
			this._drawerEl.style.transition = animate ? TRANSITION : 'none';
			this._drawerEl.style.transform = '';
		}
		if (this._backdropEl) {
			this._backdropEl.style.transition = animate ? OVERLAY_TRANSITION : 'none';
			this._backdropEl.style.opacity = String(this._initialBackdropOpacity);
		}
		setTimeout(() => {
			if (this._drawerEl) this._drawerEl.style.transition = '';
			if (this._backdropEl) this._backdropEl.style.transition = '';
		}, 500);
	}

	private _animateAndClose(): void {
		if (!this._drawerEl) return;
		const dimension = this._isVertical ? this._drawerEl.offsetHeight : this._drawerEl.offsetWidth;
		const dist = dimension + this._getTranslate();
		const signedClose = this._isPositive ? dist : -dist;
		const prop = this._isVertical ? 'translateY' : 'translateX';
		this._drawerEl.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
		this._drawerEl.style.transform = `${prop}(${signedClose}px)`;
		if (this._backdropEl) {
			this._backdropEl.style.transition = 'opacity 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
			this._backdropEl.style.opacity = '0';
		}
	}

	private _cleanup(): void {
		this._isDragging = false;
		this._isAllowedToDrag = false;
		this._document.removeEventListener('pointermove', this._onPointerMove);
	}

	private _findScrollableAncestor(element: HTMLElement | null): HTMLElement | null {
		if (!element) return null;
		const scrollProp = this._isVertical ? 'overflow-y' : 'overflow-x';
		const sizeProp = this._isVertical ? 'scrollHeight' : 'scrollWidth';
		const clientProp = this._isVertical ? 'clientHeight' : 'clientWidth';
		let el: HTMLElement | null = element.parentElement;
		while (el) {
			const overflow = getComputedStyle(el)[scrollProp as any];
			if ((overflow === 'auto' || overflow === 'scroll') && (el as any)[sizeProp] > (el as any)[clientProp]) {
				return el;
			}
			el = el.parentElement;
		}
		return null;
	}
}
