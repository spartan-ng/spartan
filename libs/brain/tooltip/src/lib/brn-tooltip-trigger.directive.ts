/**
 * We are building on shoulders of giants here and adapt the implementation provided by the incredible Angular
 * team: https://github.com/angular/components/blob/main/src/material/tooltip/tooltip.ts
 * Check them out! Give them a try! Leave a star! Their work is incredible!
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { hasModifierKey } from '@angular/cdk/keycodes';
import {
	type ConnectedPosition,
	type ConnectionPositionPair,
	type FlexibleConnectedPositionStrategy,
	type HorizontalConnectionPos,
	type OriginConnectionPosition,
	Overlay,
	type OverlayConnectionPosition,
	type OverlayRef,
	ScrollDispatcher,
	type ScrollStrategy,
	type VerticalConnectionPos,
} from '@angular/cdk/overlay';
import { normalizePassiveListenerOptions, Platform } from '@angular/cdk/platform';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
	type AfterViewInit,
	booleanAttribute,
	computed,
	Directive,
	effect,
	ElementRef,
	inject,
	InjectionToken,
	input,
	isDevMode,
	NgZone,
	numberAttribute,
	type OnDestroy,
	type Provider,
	type TemplateRef,
	untracked,
	ViewContainerRef,
} from '@angular/core';
import { brnDevMode } from '@spartan-ng/brain/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BrnTooltipContentComponent } from './brn-tooltip-content.component';
import { BrnTooltipDirective } from './brn-tooltip.directive';
import { injectBrnTooltipDefaultOptions } from './brn-tooltip.token';
import { computedPrevious } from './computed-previous';

export type TooltipPosition = 'left' | 'right' | 'above' | 'below' | 'before' | 'after';
export type TooltipTouchGestures = 'auto' | 'on' | 'off';

/** Time in ms to throttle repositioning after scroll events. */
export const SCROLL_THROTTLE_MS = 20;

export function getBrnTooltipInvalidPositionError(position: string) {
	return Error(`Tooltip position "${position}" is invalid.`);
}

/** Injection token that determines the scroll handling while a tooltip is visible. */
export const BRN_TOOLTIP_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>('brn-tooltip-scroll-strategy');
export const BRN_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER: Provider = {
	provide: BRN_TOOLTIP_SCROLL_STRATEGY,
	deps: [Overlay],
	useFactory:
		(overlay: Overlay): (() => ScrollStrategy) =>
		() =>
			overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS }),
};

const PANEL_CLASS = 'tooltip-panel';

/** Options used to bind passive event listeners. */
const passiveListenerOptions = normalizePassiveListenerOptions({ passive: true });

/**
 * Time between the user putting the pointer on a tooltip
 * trigger and the long press event being fired.
 */
const LONGPRESS_DELAY = 500;

// These constants were taken from MDC's `numbers` object.
const MIN_VIEWPORT_TOOLTIP_THRESHOLD = 8;
const UNBOUNDED_ANCHOR_GAP = 8;

@Directive({
	selector: '[brnTooltipTrigger]',
	standalone: true,
	exportAs: 'brnTooltipTrigger',
	providers: [BRN_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
	host: {
		class: 'brn-tooltip-trigger',
		'[class.brn-tooltip-disabled]': 'brnTooltipDisabled()',
	},
})
export class BrnTooltipTriggerDirective implements OnDestroy, AfterViewInit {
	private readonly _tooltipDirective = inject(BrnTooltipDirective, { optional: true });
	private readonly _tooltipComponent = BrnTooltipContentComponent;
	private readonly _cssClassPrefix: string = 'brn';
	private readonly _destroyed = new Subject<void>();
	private readonly _passiveListeners: (readonly [string, EventListenerOrEventListenerObject])[] = [];
	private readonly _defaultOptions = injectBrnTooltipDefaultOptions();

	private readonly _overlay = inject(Overlay);
	private readonly _elementRef = inject(ElementRef<HTMLElement>);
	private readonly _scrollDispatcher = inject(ScrollDispatcher);
	private readonly _viewContainerRef = inject(ViewContainerRef);
	private readonly _ngZone = inject(NgZone);
	private readonly _platform = inject(Platform);
	private readonly _ariaDescriber = inject(AriaDescriber);
	private readonly _focusMonitor = inject(FocusMonitor);
	private readonly _dir = inject(Directionality);
	private readonly _scrollStrategy = inject(BRN_TOOLTIP_SCROLL_STRATEGY);
	private readonly _document = inject(DOCUMENT);

	private _portal?: ComponentPortal<BrnTooltipContentComponent>;
	private _viewInitialized = false;
	private _pointerExitEventsInitialized = false;
	private readonly _viewportMargin = 8;
	private _currentPosition?: TooltipPosition;
	private _touchstartTimeout?: ReturnType<typeof setTimeout>;

	private _overlayRef: OverlayRef | null = null;
	private _tooltipInstance: BrnTooltipContentComponent | null = null;

	/** Allows the user to define the position of the tooltip relative to the parent element */

	public readonly position = input<TooltipPosition>(this._defaultOptions?.position ?? 'above');

	/**
	 * Whether tooltip should be relative to the click or touch origin
	 * instead of outside the element bounding box.
	 */

	public readonly positionAtOrigin = input(this._defaultOptions?.positionAtOrigin ?? false, {
		transform: booleanAttribute,
	});

	/** Disables the display of the tooltip. */

	public readonly brnTooltipDisabled = input(false, { transform: booleanAttribute });

	/** The default delay in ms before showing the tooltip after show is called */

	public readonly showDelay = input(this._defaultOptions?.showDelay ?? 0, { transform: numberAttribute });

	/** The default delay in ms before hiding the tooltip after hide is called */

	public readonly hideDelay = input(this._defaultOptions?.hideDelay ?? 0, { transform: numberAttribute });

	/** The default duration in ms that exit animation takes before hiding */

	public readonly exitAnimationDuration = input(this._defaultOptions?.exitAnimationDuration ?? 0, {
		transform: numberAttribute,
	});

	/** The default delay in ms before hiding the tooltip after hide is called */

	public readonly tooltipContentClasses = input<string>(this._defaultOptions?.tooltipContentClasses ?? '');

	/**
	 * How touch gestures should be handled by the tooltip. On touch devices the tooltip directive
	 * uses a long press gesture to show and hide, however it can conflict with the native browser
	 * gestures. To work around the conflict, Angular Material disables native gestures on the
	 * trigger, but that might not be desirable on particular elements (e.g. inputs and draggable
	 * elements). The different values for this option configure the touch event handling as follows:
	 * - `auto` - Enables touch gestures for all elements, but tries to avoid conflicts with native
	 *   browser gestures on particular elements. In particular, it allows text selection on inputs
	 *   and textareas, and preserves the native browser dragging on elements marked as `draggable`.
	 * - `on` - Enables touch gestures for all elements and disables native
	 *   browser gestures with no exceptions.
	 * - `off` - Disables touch gestures. Note that this will prevent the tooltip from
	 *   showing on touch devices.
	 */

	public readonly touchGestures = input<TooltipTouchGestures>(this._defaultOptions?.touchGestures ?? 'auto');

	/** The message to be used to describe the aria in the tooltip */

	public readonly ariaDescribedBy = input('', { alias: 'aria-describedby' });
	public readonly ariaDescribedByPrevious = computedPrevious(this.ariaDescribedBy);

	/** The content to be displayed in the tooltip */

	public readonly brnTooltipTrigger = input<string | TemplateRef<unknown> | null>(null);
	public readonly brnTooltipTriggerState = computed(() => {
		if (this._tooltipDirective) {
			return this._tooltipDirective.tooltipTemplate();
		}
		return this.brnTooltipTrigger();
	});

	constructor() {
		this._dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
			if (this._overlayRef) {
				this._updatePosition(this._overlayRef);
			}
		});

		this._viewportMargin = MIN_VIEWPORT_TOOLTIP_THRESHOLD;

		this._initBrnTooltipTriggerEffect();
		this._initAriaDescribedByPreviousEffect();
		this._initTooltipContentClassesEffect();
		this._initPositionEffect();
		this._initPositionAtOriginEffect();
		this._initBrnTooltipDisabledEffect();
		this._initExitAnimationDurationEffect();
		this._initHideDelayEffect();
	}

	private _initPositionEffect(): void {
		effect(() => {
			if (this._overlayRef) {
				this._updatePosition(this._overlayRef);
				this._tooltipInstance?.show(0);
				this._overlayRef.updatePosition();
			}
		});
	}

	private _initBrnTooltipDisabledEffect(): void {
		effect(() => {
			if (this.brnTooltipDisabled()) {
				this.hide(0);
			} else {
				this._setupPointerEnterEventsIfNeeded();
			}
		});
	}

	private _initPositionAtOriginEffect(): void {
		effect(() => {
			// Needed that the effect got triggered
			// eslint-disable-next-line @typescript-eslint/naming-convention
			const _ = this.positionAtOrigin();
			this._detach();
			this._overlayRef = null;
		});
	}

	private _initTooltipContentClassesEffect(): void {
		effect(() => {
			if (this._tooltipInstance) {
				this._tooltipInstance._tooltipClasses.set(this.tooltipContentClasses() ?? '');
			}
		});
	}

	private _initAriaDescribedByPreviousEffect(): void {
		effect(() => {
			const ariaDescribedBy = this.ariaDescribedBy();
			this._ariaDescriber.removeDescription(
				this._elementRef.nativeElement,
				untracked(() => this.ariaDescribedByPrevious()),
				'tooltip',
			);

			if (ariaDescribedBy && !this._isTooltipVisible()) {
				this._ngZone.runOutsideAngular(() => {
					// The `AriaDescriber` has some functionality that avoids adding a description if it's the
					// same as the `aria-label` of an element, however we can't know whether the tooltip trigger
					// has a data-bound `aria-label` or when it'll be set for the first time. We can avoid the
					// issue by deferring the description by a tick so Angular has time to set the `aria-label`.
					Promise.resolve().then(() => {
						this._ariaDescriber.describe(this._elementRef.nativeElement, ariaDescribedBy, 'tooltip');
					});
				});
			}
		});
	}

	private _initBrnTooltipTriggerEffect(): void {
		effect(() => {
			const brnTooltipTriggerState = this.brnTooltipTriggerState();
			const isTooltipVisible = this._isTooltipVisible();
			untracked(() => {
				if (!brnTooltipTriggerState && isTooltipVisible) {
					this.hide(0);
				} else {
					this._setupPointerEnterEventsIfNeeded();
					this._updateTooltipContent();
				}
			});
		});
	}

	private _initExitAnimationDurationEffect(): void {
		effect(() => {
			if (this._tooltipInstance) {
				this._tooltipInstance._exitAnimationDuration = this.exitAnimationDuration();
			}
		});
	}

	private _initHideDelayEffect(): void {
		effect(() => {
			if (this._tooltipInstance) {
				this._tooltipInstance._mouseLeaveHideDelay = this.hideDelay();
			}
		});
	}

	ngAfterViewInit(): void {
		// This needs to happen after view init so the initial values for all inputs have been set.
		this._viewInitialized = true;
		this._setupPointerEnterEventsIfNeeded();

		this._focusMonitor
			.monitor(this._elementRef)
			.pipe(takeUntil(this._destroyed))
			.subscribe((origin) => {
				// Note that the focus monitor runs outside the Angular zone.
				if (!origin) {
					this._ngZone.run(() => this.hide(0));
				} else if (origin === 'keyboard') {
					this._ngZone.run(() => this.show());
				}
			});

		if (brnDevMode && !this.ariaDescribedBy()) {
			console.warn('BrnTooltip: "aria-describedby" attribute is required for accessibility');
		}
	}

	/**
	 * Dispose the tooltip when destroyed.
	 */
	ngOnDestroy(): void {
		const nativeElement = this._elementRef.nativeElement;

		clearTimeout(this._touchstartTimeout);

		if (this._overlayRef) {
			this._overlayRef.dispose();
			this._tooltipInstance = null;
		}

		// Clean up the event listeners set in the constructor
		this._passiveListeners.forEach(([event, listener]) =>
			nativeElement.removeEventListener(event, listener, passiveListenerOptions),
		);
		this._passiveListeners.length = 0;

		this._destroyed.next();
		this._destroyed.complete();

		this._ariaDescriber.removeDescription(nativeElement, this.ariaDescribedBy(), 'tooltip');
		this._focusMonitor.stopMonitoring(nativeElement);
	}

	/** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
	show(delay: number = this.showDelay(), origin?: { x: number; y: number }): void {
		if (this.brnTooltipDisabled() || this._isTooltipVisible()) {
			this._tooltipInstance?._cancelPendingAnimations();
			return;
		}

		const overlayRef = this._createOverlay(origin);
		this._detach();
		this._portal = this._portal || new ComponentPortal(this._tooltipComponent, this._viewContainerRef);
		const instance = (this._tooltipInstance = overlayRef.attach(this._portal).instance);
		instance._triggerElement = this._elementRef.nativeElement;
		instance._mouseLeaveHideDelay = this.hideDelay();
		instance._tooltipClasses.set(this.tooltipContentClasses());
		instance._exitAnimationDuration = this.exitAnimationDuration();
		instance.side.set(this._currentPosition ?? 'above');
		instance.afterHidden.pipe(takeUntil(this._destroyed)).subscribe(() => this._detach());
		this._updateTooltipContent();
		instance.show(delay);
	}

	/** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
	hide(delay: number = this.hideDelay(), exitAnimationDuration: number = this.exitAnimationDuration()): void {
		const instance = this._tooltipInstance;
		if (instance) {
			if (instance.isVisible()) {
				instance.hide(delay, exitAnimationDuration);
			} else {
				instance._cancelPendingAnimations();
				this._detach();
			}
		}
	}

	toggle(origin?: { x: number; y: number }): void {
		this._isTooltipVisible() ? this.hide() : this.show(undefined, origin);
	}

	_isTooltipVisible(): boolean {
		return !!this._tooltipInstance && this._tooltipInstance.isVisible();
	}

	private _createOverlay(origin?: { x: number; y: number }): OverlayRef {
		if (this._overlayRef) {
			const existingStrategy = this._overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;

			if ((!this.positionAtOrigin() || !origin) && existingStrategy._origin instanceof ElementRef) {
				return this._overlayRef;
			}

			this._detach();
		}

		const scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(this._elementRef);

		// Create connected position strategy that listens for scroll events to reposition.
		const strategy = this._overlay
			.position()
			.flexibleConnectedTo(this.positionAtOrigin() ? origin || this._elementRef : this._elementRef)
			.withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`)
			.withFlexibleDimensions(false)
			.withViewportMargin(this._viewportMargin)
			.withScrollableContainers(scrollableAncestors);

		strategy.positionChanges.pipe(takeUntil(this._destroyed)).subscribe((change) => {
			this._updateCurrentPositionClass(change.connectionPair);

			if (this._tooltipInstance) {
				if (change.scrollableViewProperties.isOverlayClipped && this._tooltipInstance.isVisible()) {
					// After position changes occur and the overlay is clipped by
					// a parent scrollable then close the tooltip.
					this._ngZone.run(() => this.hide(0));
				}
			}
		});

		this._overlayRef = this._overlay.create({
			direction: this._dir,
			positionStrategy: strategy,
			panelClass: `${this._cssClassPrefix}-${PANEL_CLASS}`,
			scrollStrategy: this._scrollStrategy(),
		});

		this._updatePosition(this._overlayRef);

		this._overlayRef
			.detachments()
			.pipe(takeUntil(this._destroyed))
			.subscribe(() => this._detach());

		this._overlayRef
			.outsidePointerEvents()
			.pipe(takeUntil(this._destroyed))
			.subscribe(() => this._tooltipInstance?._handleBodyInteraction());

		this._overlayRef
			.keydownEvents()
			.pipe(takeUntil(this._destroyed))
			.subscribe((event) => {
				if (this._isTooltipVisible() && event.key === 'Escape' && !hasModifierKey(event)) {
					event.preventDefault();
					event.stopPropagation();
					this._ngZone.run(() => this.hide(0));
				}
			});

		if (this._defaultOptions?.disableTooltipInteractivity) {
			this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`);
		}

		return this._overlayRef;
	}

	private _detach(): void {
		if (this._overlayRef?.hasAttached()) {
			this._overlayRef.detach();
		}

		this._tooltipInstance = null;
	}

	private _updatePosition(overlayRef: OverlayRef) {
		const position = overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;
		const origin = this._getOrigin();
		const overlay = this._getOverlayPosition();

		position.withPositions([
			this._addOffset({ ...origin.main, ...overlay.main }),
			this._addOffset({ ...origin.fallback, ...overlay.fallback }),
		]);
	}

	/** Adds the configured offset to a position. Used as a hook for child classes. */
	protected _addOffset(position: ConnectedPosition): ConnectedPosition {
		const offset = UNBOUNDED_ANCHOR_GAP;
		const isLtr = !this._dir || this._dir.value === 'ltr';

		if (position.originY === 'top') {
			position.offsetY = -offset;
		} else if (position.originY === 'bottom') {
			position.offsetY = offset;
		} else if (position.originX === 'start') {
			position.offsetX = isLtr ? -offset : offset;
		} else if (position.originX === 'end') {
			position.offsetX = isLtr ? offset : -offset;
		}

		return position;
	}

	/**
	 * Returns the origin position and a fallback position based on the user's position preference.
	 * The fallback position is the inverse of the origin (e.g. `'below' -> 'above'`).
	 */
	_getOrigin(): { main: OriginConnectionPosition; fallback: OriginConnectionPosition } {
		const isLtr = !this._dir || this._dir.value === 'ltr';
		const position = this.position();
		let originPosition: OriginConnectionPosition;

		if (position === 'above' || position === 'below') {
			originPosition = { originX: 'center', originY: position === 'above' ? 'top' : 'bottom' };
		} else if (position === 'before' || (position === 'left' && isLtr) || (position === 'right' && !isLtr)) {
			originPosition = { originX: 'start', originY: 'center' };
		} else if (position === 'after' || (position === 'right' && isLtr) || (position === 'left' && !isLtr)) {
			originPosition = { originX: 'end', originY: 'center' };
		} else if (typeof isDevMode() === 'undefined' || isDevMode()) {
			throw getBrnTooltipInvalidPositionError(position);
		}

		const { x, y } = this._invertPosition(originPosition!.originX, originPosition!.originY);

		return {
			main: originPosition!,
			fallback: { originX: x, originY: y },
		};
	}

	/** Returns the overlay position and a fallback position based on the user's preference */
	_getOverlayPosition(): { main: OverlayConnectionPosition; fallback: OverlayConnectionPosition } {
		const isLtr = !this._dir || this._dir.value === 'ltr';
		const position = this.position();
		let overlayPosition: OverlayConnectionPosition;

		if (position === 'above') {
			overlayPosition = { overlayX: 'center', overlayY: 'bottom' };
		} else if (position === 'below') {
			overlayPosition = { overlayX: 'center', overlayY: 'top' };
		} else if (position === 'before' || (position === 'left' && isLtr) || (position === 'right' && !isLtr)) {
			overlayPosition = { overlayX: 'end', overlayY: 'center' };
		} else if (position === 'after' || (position === 'right' && isLtr) || (position === 'left' && !isLtr)) {
			overlayPosition = { overlayX: 'start', overlayY: 'center' };
		} else if (typeof isDevMode() === 'undefined' || isDevMode()) {
			throw getBrnTooltipInvalidPositionError(position);
		}

		const { x, y } = this._invertPosition(overlayPosition!.overlayX, overlayPosition!.overlayY);

		return {
			main: overlayPosition!,
			fallback: { overlayX: x, overlayY: y },
		};
	}

	/** Updates the tooltip message and repositions the overlay according to the new message length */
	private _updateTooltipContent(): void {
		// Must wait for the template to be painted to the tooltip so that the overlay can properly
		// calculate the correct positioning based on the size of the tek-pate.
		if (this._tooltipInstance) {
			this._tooltipInstance.content = this.brnTooltipTriggerState();
			this._tooltipInstance._markForCheck();

			this._ngZone.onMicrotaskEmpty.pipe(take(1), takeUntil(this._destroyed)).subscribe(() => {
				if (this._tooltipInstance) {
					this._overlayRef?.updatePosition();
				}
			});
		}
	}

	/** Inverts an overlay position. */
	private _invertPosition(x: HorizontalConnectionPos, y: VerticalConnectionPos) {
		if (this.position() === 'above' || this.position() === 'below') {
			if (y === 'top') {
				y = 'bottom';
			} else if (y === 'bottom') {
				y = 'top';
			}
		} else {
			if (x === 'end') {
				x = 'start';
			} else if (x === 'start') {
				x = 'end';
			}
		}

		return { x, y };
	}

	/** Updates the class on the overlay panel based on the current position of the tooltip. */
	private _updateCurrentPositionClass(connectionPair: ConnectionPositionPair): void {
		const { overlayY, originX, originY } = connectionPair;
		let newPosition: TooltipPosition;

		// If the overlay is in the middle along the Y axis,
		// it means that it's either before or after.
		if (overlayY === 'center') {
			// Note that since this information is used for styling, we want to
			// resolve `start` and `end` to their real values, otherwise consumers
			// would have to remember to do it themselves on each consumption.
			if (this._dir && this._dir.value === 'rtl') {
				newPosition = originX === 'end' ? 'left' : 'right';
			} else {
				newPosition = originX === 'start' ? 'left' : 'right';
			}
		} else {
			newPosition = overlayY === 'bottom' && originY === 'top' ? 'above' : 'below';
		}

		if (newPosition !== this._currentPosition) {
			this._tooltipInstance?.side.set(newPosition);
			this._currentPosition = newPosition;
		}
	}

	/** Binds the pointer events to the tooltip trigger. */
	private _setupPointerEnterEventsIfNeeded(): void {
		// Optimization: Defer hooking up events if there's no content or the tooltip is disabled.
		if (
			this.brnTooltipDisabled() ||
			!this.brnTooltipTriggerState() ||
			!this._viewInitialized ||
			this._passiveListeners.length
		) {
			return;
		}

		// The mouse events shouldn't be bound on mobile devices, because they can prevent the
		// first tap from firing its click event or can cause the tooltip to open for clicks.
		if (this._platformSupportsMouseEvents()) {
			this._passiveListeners.push([
				'mouseenter',
				(event) => {
					this._setupPointerExitEventsIfNeeded();
					let point = undefined;
					if ((event as MouseEvent).x !== undefined && (event as MouseEvent).y !== undefined) {
						point = event as MouseEvent;
					}
					this.show(undefined, point);
				},
			]);
		} else if (this.touchGestures() !== 'off') {
			this._disableNativeGesturesIfNecessary();

			this._passiveListeners.push([
				'touchstart',
				(event) => {
					const touch = (event as TouchEvent).targetTouches?.[0];
					const origin = touch ? { x: touch.clientX, y: touch.clientY } : undefined;
					// Note that it's important that we don't `preventDefault` here,
					// because it can prevent click events from firing on the element.
					this._setupPointerExitEventsIfNeeded();
					clearTimeout(this._touchstartTimeout);
					this._touchstartTimeout = setTimeout(() => this.show(undefined, origin), LONGPRESS_DELAY);
				},
			]);
		}

		this._addListeners(this._passiveListeners);
	}

	private _setupPointerExitEventsIfNeeded(): void {
		if (this._pointerExitEventsInitialized) {
			return;
		}
		this._pointerExitEventsInitialized = true;

		const exitListeners: (readonly [string, EventListenerOrEventListenerObject])[] = [];
		if (this._platformSupportsMouseEvents()) {
			exitListeners.push(
				[
					'mouseleave',
					(event) => {
						const newTarget = (event as MouseEvent).relatedTarget as Node | null;
						if (!newTarget || !this._overlayRef?.overlayElement.contains(newTarget)) {
							this.hide();
						}
					},
				],
				['wheel', (event) => this._wheelListener(event as WheelEvent)],
			);
		} else if (this.touchGestures() !== 'off') {
			this._disableNativeGesturesIfNecessary();
			const touchendListener = () => {
				clearTimeout(this._touchstartTimeout);
				this.hide(this._defaultOptions?.touchendHideDelay);
			};

			exitListeners.push(['touchend', touchendListener], ['touchcancel', touchendListener]);
		}

		this._addListeners(exitListeners);
		this._passiveListeners.push(...exitListeners);
	}

	private _addListeners(listeners: (readonly [string, EventListenerOrEventListenerObject])[]) {
		listeners.forEach(([event, listener]) => {
			this._elementRef.nativeElement.addEventListener(event, listener, passiveListenerOptions);
		});
	}

	private _platformSupportsMouseEvents(): boolean {
		return !this._platform.IOS && !this._platform.ANDROID;
	}

	/** Listener for the `wheel` event on the element. */
	private _wheelListener(event: WheelEvent) {
		if (this._isTooltipVisible()) {
			const elementUnderPointer = this._document.elementFromPoint(event.clientX, event.clientY);
			const element = this._elementRef.nativeElement;

			// On non-touch devices we depend on the `mouseleave` event to close the tooltip, but it
			// won't fire if the user scrolls away using the wheel without moving their cursor. We
			// work around it by finding the element under the user's cursor and closing the tooltip
			// if it's not the trigger.
			if (elementUnderPointer !== element && !element.contains(elementUnderPointer)) {
				this.hide();
			}
		}
	}

	/** Disables the native browser gestures, based on how the tooltip has been configured. */
	private _disableNativeGesturesIfNecessary(): void {
		const gestures = this.touchGestures();

		if (gestures !== 'off') {
			const element = this._elementRef.nativeElement;
			const style = element.style;

			// If gestures are set to `auto`, we don't disable text selection on inputs and
			// textareas, because it prevents the user from typing into them on iOS Safari.
			if (gestures === 'on' || (element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA')) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				style.userSelect = (style as any).msUserSelect = style.webkitUserSelect = (style as any).MozUserSelect = 'none';
			}

			// If we have `auto` gestures and the element uses native HTML dragging,
			// we don't set `-webkit-user-drag` because it prevents the native behavior.
			if (gestures === 'on' || !element.draggable) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(style as any).webkitUserDrag = 'none';
			}

			style.touchAction = 'none';
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(style as any).webkitTapHighlightColor = 'transparent';
		}
	}
}
