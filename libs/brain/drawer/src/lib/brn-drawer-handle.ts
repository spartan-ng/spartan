import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject, input } from '@angular/core';
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
	private _startX = 0;
	private _startY = 0;
	private _isDragging = false;
	private _positions: Array<{ x: number; y: number; t: number }> = [];
	private _drawerEl: HTMLElement | null = null;
	private _backdropEl: HTMLElement | null = null;
	private _direction: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
	private _initialBackdropOpacity = 1;
	private _scrollEl: HTMLElement | null = null;

	public readonly closeThreshold = input<number>(0.3);

	private get _isVertical(): boolean {
		return this._direction === 'bottom' || this._direction === 'top';
	}

	private get _isPositive(): boolean {
		return this._direction === 'bottom' || this._direction === 'right';
	}

	protected _onPointerDown(event: PointerEvent): void {
		if (!this._brnDialogRef || !this._brnDrawer || this._isDragging) return;

		this._direction = this._brnDrawer.directionState();
		this._drawerEl = this._element.nativeElement.closest('[data-vaul-drawer-direction]');
		if (!this._drawerEl) return;

		this._scrollEl = this._findScrollableAncestor(event.target as HTMLElement);

		if (!this._scrollEl) {
			event.preventDefault();
		}

		const overlayWrapper = this._drawerEl.closest('.cdk-global-overlay-wrapper');
		this._backdropEl = overlayWrapper?.querySelector('.cdk-overlay-backdrop') as HTMLElement | null;

		if (this._backdropEl) {
			this._initialBackdropOpacity = parseFloat(getComputedStyle(this._backdropEl).opacity) || 1;
		}

		this._startX = event.clientX;
		this._startY = event.clientY;
		this._isDragging = true;
		this._positions = [{ x: event.clientX, y: event.clientY, t: performance.now() }];

		this._drawerEl.style.transition = 'none';
		this._drawerEl.style.touchAction = 'none';

		const onPointerMove = (e: PointerEvent) => {
			if (!this._isDragging || !this._drawerEl) return;

			this._positions.push({ x: e.clientX, y: e.clientY, t: performance.now() });
			if (this._positions.length > 5) {
				this._positions.shift();
			}

			const rawDelta = this._isVertical ? e.clientY - this._startY : e.clientX - this._startX;

			const normalizedDelta = this._isPositive ? rawDelta : -rawDelta;

			if (this._scrollEl && normalizedDelta > 0) {
				const currentScroll = this._isVertical ? this._scrollEl.scrollTop : this._scrollEl.scrollLeft;
				if (this._isPositive) {
					const maxScroll = this._isVertical
						? this._scrollEl.scrollHeight - this._scrollEl.clientHeight
						: this._scrollEl.scrollWidth - this._scrollEl.clientWidth;
					if (currentScroll < maxScroll) return;
				} else if (currentScroll > 0) return;
			}

			e.preventDefault();

			const dimension = this._isVertical ? this._drawerEl.offsetHeight : this._drawerEl.offsetWidth;

			let dragDelta: number;
			if (normalizedDelta < 0) {
				dragDelta = 0;
			} else {
				const softLimit = dimension * this.closeThreshold() * 0.5;
				if (normalizedDelta <= softLimit) {
					dragDelta = normalizedDelta;
				} else {
					const overshoot = normalizedDelta - softLimit;
					dragDelta = softLimit + overshoot * 0.3;
				}
			}

			const signedDrag = this._isPositive ? dragDelta : -dragDelta;
			const prop = this._isVertical ? 'translateY' : 'translateX';
			this._drawerEl.style.transform = `${prop}(${signedDrag}px)`;

			const progress = dimension > 0 ? Math.min(normalizedDelta / dimension, 1) : 0;
			if (this._backdropEl) {
				this._backdropEl.style.opacity = String(Math.max(this._initialBackdropOpacity - progress, 0));
			}
		};

		this._document.addEventListener('pointermove', onPointerMove, { passive: false });

		const resetDrawer = (animate = true) => {
			if (this._drawerEl) {
				if (animate) {
					this._drawerEl.style.transition = 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
				} else {
					this._drawerEl.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
				}
				this._drawerEl.style.transform = '';
				this._drawerEl.style.touchAction = '';
			}
			if (this._backdropEl) {
				if (animate) {
					this._backdropEl.style.transition = 'opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
				}
				this._backdropEl.style.opacity = String(this._initialBackdropOpacity);
			}
		};

		const cleanup = () => {
			this._isDragging = false;
			this._document.removeEventListener('pointermove', onPointerMove);
		};

		const onPointerUp = () => {
			if (!this._drawerEl) {
				cleanup();
				return;
			}

			const delta = this._isVertical ? this._lastPosition().y - this._startY : this._lastPosition().x - this._startX;
			const normalizedDelta = this._isPositive ? delta : -delta;

			const dimension = this._isVertical ? this._drawerEl.offsetHeight : this._drawerEl.offsetWidth;

			const velocity = this._calculateVelocity();

			if ((normalizedDelta > 0 && normalizedDelta / dimension > this.closeThreshold()) || velocity > 0.5) {
				const closingDistance = dimension + Math.abs(delta) * 0.5;
				const signedClose = this._isPositive ? closingDistance : -closingDistance;
				const prop = this._isVertical ? 'translateY' : 'translateX';
				this._drawerEl.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
				this._drawerEl.style.transform = `${prop}(${signedClose}px)`;
				if (this._backdropEl) {
					this._backdropEl.style.transition = 'opacity 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
					this._backdropEl.style.opacity = '0';
				}
				cleanup();
				this._brnDialogRef?.close();
			} else {
				resetDrawer(true);
				cleanup();
				setTimeout(() => {
					if (this._drawerEl) this._drawerEl.style.transition = '';
					if (this._backdropEl) this._backdropEl.style.transition = '';
				}, 500);
			}
		};

		this._document.addEventListener('pointerup', onPointerUp, { once: true });

		this._document.addEventListener(
			'pointercancel',
			() => {
				resetDrawer(true);
				cleanup();
			},
			{ once: true },
		);
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

	private _lastPosition(): { x: number; y: number; t: number } {
		return this._positions[this._positions.length - 1] ?? { x: this._startX, y: this._startY, t: 0 };
	}

	private _calculateVelocity(): number {
		if (this._positions.length < 2) return 0;
		const first = this._positions[0];
		const last = this._positions[this._positions.length - 1];
		const dt = last.t - first.t;
		if (dt <= 0) return 0;
		const dx = last.x - first.x;
		const dy = last.y - first.y;
		const distance = this._isVertical ? dy : dx;
		return Math.min((Math.abs(distance) / dt) * 10, 10);
	}
}
