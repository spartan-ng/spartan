import { DOCUMENT } from '@angular/common';
import { DestroyRef, Directive, effect, ElementRef, inject, input, untracked } from '@angular/core';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { BrnDrawer } from './brn-drawer';

const VELOCITY_THRESHOLD = 0.4;
const DEFAULT_CLOSE_THRESHOLD = 0.25;
const TOUCH_SWIPE_THRESHOLD = 10;
const MOUSE_SWIPE_THRESHOLD = 2;
const TRANSITION = 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
const CLOSE_TRANSITION = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
const OVERLAY_TRANSITION = 'opacity 0.3s cubic-bezier(0.32, 0.72, 0, 1)';

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
	private readonly _destroyRef = inject(DestroyRef);
	private _pointerId = -1;

	constructor() {
		this._destroyRef.onDestroy(() => {
			this._cleanup();
			this._clearResetTimeout();
		});
		effect(() => {
			const state = this._brnDialogRef?.state();
			untracked(() => {
				if (state === 'closed') {
					this._currentTranslate = 0;
				}
			});
		});
	}

	private _drawerEl: HTMLElement | null = null;
	private _backdropEl: HTMLElement | null = null;
	private _direction: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
	private _initialBackdropOpacity = 1;

	private _pointerStartX = 0;
	private _pointerStartY = 0;
	private _pointerStart = 0;
	private _pointerType = '';
	private _isDragging = false;
	private _isAllowedToDrag = false;
	private _wasBeyondThreshold = false;

	private _currentTranslate = 0;
	private _scrollableAncestors: HTMLElement[] = [];
	private _dragStartTime: number | null = null;
	private _resetTimeout: ReturnType<typeof setTimeout> | null = null;

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

		this._direction = this._brnDrawer.direction();
		this._drawerEl = this._element.nativeElement.closest('[data-vaul-drawer-direction]');
		if (!this._drawerEl) return;

		this._pointerType = event.pointerType;
		this._pointerStartX = event.pageX;
		this._pointerStartY = event.pageY;
		this._pointerStart = this._isVertical ? event.pageY : event.pageX;
		this._isDragging = true;
		this._isAllowedToDrag = false;
		this._wasBeyondThreshold = false;
		this._dragStartTime = Date.now();

		this._drawerEl.style.transition = 'none';
		this._drawerEl.style.willChange = 'transform';

		this._scrollableAncestors = this._findScrollableAncestors(event.target as HTMLElement);
		if (!this._scrollableAncestors.length) {
			this._drawerEl.style.touchAction = 'none';
		}

		const overlayWrapper = this._drawerEl.closest('.cdk-global-overlay-wrapper');
		this._backdropEl = overlayWrapper?.querySelector('.cdk-overlay-backdrop') as HTMLElement | null;
		if (this._backdropEl) {
			this._initialBackdropOpacity = parseFloat(this._backdropEl.style.opacity) || 1;
		}

		this._pointerId = event.pointerId;

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

		if (!this._isAllowedToDrag && !this._shouldDrag(isDraggingInDirection)) return;

		this._isAllowedToDrag = true;
		try {
			this._element.nativeElement.setPointerCapture(e.pointerId);
		} catch {
			/* empty - pointer capture not supported */
		}
		this._drawerEl.classList.add('vaul-dragging');

		const dimension = this._isVertical ? this._drawerEl.offsetHeight : this._drawerEl.offsetWidth;

		const progress = dimension > 0 ? Math.min(absDraggedDistance / dimension, 1) : 0;

		if (isDraggingInDirection) {
			const dampened = dampenValue(draggedDistance);
			const translateValue = Math.min(dampened * -1, 0) * this._dimensionMultiplier;
			this._applyTransform(translateValue);
			if (this._backdropEl) {
				this._backdropEl.style.opacity = String(Math.max(this._initialBackdropOpacity - progress * 0.3, 0));
			}
			return;
		}

		e.preventDefault();

		const translateValue = absDraggedDistance * this._dimensionMultiplier;
		this._applyTransform(translateValue);

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

		const swipeAmount = this._currentTranslate;

		if (!this._isAllowedToDrag) {
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

	private _applyTransform(value: number): void {
		if (!this._drawerEl) return;
		this._currentTranslate = value;
		const prop = this._isVertical ? 'translateY' : 'translateX';
		this._drawerEl.style.transform = `${prop}(${value}px)`;
	}

	private _shouldDrag(isDraggingInDirection: boolean): boolean {
		if (this._direction === 'left' || this._direction === 'right') return true;

		const isAlreadyOpen = this._isPositive ? this._currentTranslate > 0 : this._currentTranslate < 0;
		if (isAlreadyOpen) return true;

		if (isDraggingInDirection) return false;

		for (const ancestor of this._scrollableAncestors) {
			if (ancestor.scrollTop !== 0) return false;
		}

		return true;
	}

	private _resetDrawer(animate = true): void {
		if (this._drawerEl) {
			this._drawerEl.style.transition = animate ? TRANSITION : 'none';
			this._drawerEl.style.transform = '';
			this._currentTranslate = 0;
		}
		if (this._backdropEl) {
			this._backdropEl.style.transition = animate ? OVERLAY_TRANSITION : 'none';
			this._backdropEl.style.opacity = String(this._initialBackdropOpacity);
		}
		this._clearResetTimeout();
		this._resetTimeout = setTimeout(() => {
			this._resetTimeout = null;
			if (this._drawerEl) {
				this._drawerEl.style.transition = '';
				this._drawerEl.style.willChange = '';
				this._drawerEl.style.animation = '';
			}
			if (this._backdropEl) this._backdropEl.style.transition = '';
		}, 500);
	}

	private _clearResetTimeout(): void {
		if (this._resetTimeout !== null) {
			clearTimeout(this._resetTimeout);
			this._resetTimeout = null;
		}
	}

	private _animateAndClose(): void {
		if (!this._drawerEl) return;
		const dimension = this._isVertical ? this._drawerEl.offsetHeight : this._drawerEl.offsetWidth;
		const targetClose = this._isPositive ? dimension : -dimension;
		const prop = this._isVertical ? 'translateY' : 'translateX';
		this._drawerEl.style.transition = CLOSE_TRANSITION;
		this._drawerEl.style.transform = `${prop}(${targetClose}px)`;
		if (this._backdropEl) {
			this._backdropEl.style.transition = OVERLAY_TRANSITION;
			this._backdropEl.style.opacity = '0';
		}
	}

	private _cleanup(): void {
		this._isDragging = false;
		this._isAllowedToDrag = false;
		if (this._drawerEl) {
			this._drawerEl.style.touchAction = '';
			this._drawerEl.style.willChange = '';
		}
		if (this._pointerId !== -1) {
			try {
				this._element.nativeElement.releasePointerCapture(this._pointerId);
			} catch {
				/* empty */
			}
			this._pointerId = -1;
		}
		this._document.removeEventListener('pointermove', this._onPointerMove);
		this._document.removeEventListener('pointerup', this._onPointerUp);
		this._document.removeEventListener('pointercancel', this._onPointerCancel);
	}

	private _findScrollableAncestors(element: HTMLElement | null): HTMLElement[] {
		const ancestors: HTMLElement[] = [];
		if (!element) return ancestors;
		const scrollProp = this._isVertical ? 'overflow-y' : 'overflow-x';
		const sizeProp = this._isVertical ? 'scrollHeight' : 'scrollWidth';
		const clientProp = this._isVertical ? 'clientHeight' : 'clientWidth';
		let el: HTMLElement | null = element.parentElement;
		while (el) {
			const overflow = el.style[scrollProp as any] || getComputedStyle(el)[scrollProp as any];
			if ((overflow === 'auto' || overflow === 'scroll') && (el as any)[sizeProp] > (el as any)[clientProp]) {
				ancestors.push(el);
			}
			if (el.getAttribute('role') === 'dialog') break;
			el = el.parentElement;
		}
		return ancestors;
	}
}
