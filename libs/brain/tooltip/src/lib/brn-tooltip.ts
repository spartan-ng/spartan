import {
	ConnectedPosition,
	FlexibleConnectedPositionStrategy,
	Overlay,
	OverlayPositionBuilder,
	type OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
	afterNextRender,
	booleanAttribute,
	type ComponentRef,
	computed,
	DestroyRef,
	Directive,
	effect,
	ElementRef,
	inject,
	Injector,
	input,
	linkedSignal,
	numberAttribute,
	output,
	Renderer2,
	runInInjectionContext,
	type TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Directionality } from '@angular/cdk/bidi';
import { waitForElementAnimations } from '@spartan-ng/brain/core';
import { of, Subject, Subscription, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BrnTooltipContent } from './brn-tooltip-content';
import { BrnTooltipGroup } from './brn-tooltip-group';
import {
	BRN_TOOLTIP_FALLBACK_POSITIONS,
	BRN_TOOLTIP_POSITIONS_MAP,
	BrnTooltipPosition,
	resolveTooltipPosition,
} from './brn-tooltip-position';
import { BrnTooltipType } from './brn-tooltip-type';
import { injectBrnTooltipDefaultOptions } from './brn-tooltip.token';

interface DelayConfig {
	isShow: boolean;
	delay: number;
	/** Snapshotted at request time: open instantly (no enter animation) because the group window was open. */
	instant: boolean;
}

@Directive({ selector: '[brnTooltip]', exportAs: 'brnTooltip' })
export class BrnTooltip {
	private readonly _config = injectBrnTooltipDefaultOptions();

	private readonly _destroyRef = inject(DestroyRef);
	private readonly _document = inject(DOCUMENT);
	private readonly _elementRef = inject(ElementRef<HTMLElement>);
	private readonly _injector = inject(Injector);
	private readonly _overlay = inject(Overlay);
	private readonly _overlayPositionBuilder = inject(OverlayPositionBuilder);
	private readonly _renderer = inject(Renderer2);
	private readonly _dir = inject(Directionality);
	private readonly _group = inject(BrnTooltipGroup, { optional: true });

	private _tooltipHovered = false;
	private _listenersRefs: (() => void)[] = [];
	private _delaySubject: Subject<DelayConfig> | undefined = undefined;
	private _componentRef: ComponentRef<BrnTooltipContent> | undefined = undefined;
	private _overlayRef: OverlayRef | undefined = undefined;
	private _ariaEffectRef: ReturnType<typeof effect> | undefined = undefined;
	private _positionChangeSub: Subscription | undefined = undefined;
	/** Bumped on every close/show so a pending exit-animation teardown can detect it was superseded. */
	private _closeGeneration = 0;
	/** The position currently applied to the content - the CDK-resolved one after a flip, not the raw input. */
	private _activePosition: BrnTooltipPosition | undefined = undefined;

	public readonly tooltipDisabled = input<boolean, boolean>(false, { transform: booleanAttribute });
	public readonly mutableTooltipDisabled = linkedSignal(this.tooltipDisabled);

	public readonly position = input<BrnTooltipPosition>(this._config.position ?? 'top');
	public readonly brnTooltip = input<BrnTooltipType>(null);
	public readonly showDelay = input<number, number>(this._config.showDelay, { transform: numberAttribute });
	public readonly hideDelay = input<number, number>(this._config.hideDelay, { transform: numberAttribute });

	public readonly show = output<void>();
	public readonly hide = output<void>();

	private readonly _tooltipText = computed<string | TemplateRef<void>>(() => {
		let tooltipText = this.brnTooltip();
		if (!tooltipText) {
			return '';
		} else if (typeof tooltipText === 'string') {
			tooltipText = tooltipText.trim();
		}
		return tooltipText;
	});

	constructor() {
		afterNextRender(() => {
			this._overlayRef = this._overlay.create({
				direction: this._dir,
				positionStrategy: this._buildPositionStrategy(),
			});

			this._dir.change.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
				if (this._overlayRef) {
					this._updatePosition();
					if (this._overlayRef.hasAttached()) {
						this._overlayRef.updatePosition();
					}
				}
			});

			runInInjectionContext(this._injector, () => {
				if (!this._overlayRef) return;
				this._setupDelayMechanism();
				this._cleanupTriggerEvents();
				this._initTriggers();

				/**
				 * This effect is used to update the tooltip content when the tooltip text changes.
				 * It's the reactive bridge between the tooltip text and the tooltip content.
				 */
				effect(() => {
					const text = this._tooltipText();
					if (this._componentRef) {
						this._applyContentProps(this._componentRef.instance, this._activePosition ?? this.position(), text);
					}
				});
				this._listenersRefs = [
					...this._listenersRefs,
					this._renderer.listen(this._overlayRef.hostElement, 'mouseenter', () => (this._tooltipHovered = true)),
					this._renderer.listen(this._overlayRef.hostElement, 'mouseleave', () => {
						this._tooltipHovered = false;
						this.delay(false, this.hideDelay());
					}),
				];
			});
		});

		this._destroyRef.onDestroy(() => {
			this._clearAriaDescribedBy();
			this._delaySubject?.complete();
			this._cleanupTriggerEvents();
			this._overlayRef?.dispose();
		});
	}

	private _updatePosition(): void {
		const strategy = this._overlayRef?.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;

		if (strategy) {
			strategy.withPositions(this._getAllPositions());
		}
	}

	private _buildPositionStrategy() {
		return this._overlayPositionBuilder
			.flexibleConnectedTo(this._elementRef)
			.withPositions(this._getAllPositions())
			.withViewportMargin(8);
	}

	/** Build [preferred, ...fallbacks] position array for viewport-aware auto-flip. */
	private _getAllPositions(): ConnectedPosition[] {
		const preferred = this.position();
		return [preferred, ...BRN_TOOLTIP_FALLBACK_POSITIONS[preferred]].map((pos) => this._getAdjustedPositionFor(pos));
	}

	private _getAdjustedPositionFor(pos: BrnTooltipPosition): ConnectedPosition {
		const position = BRN_TOOLTIP_POSITIONS_MAP[pos];
		const isLtr = this._dir.value !== 'rtl';

		return {
			...position,
			offsetX: position.offsetX != null ? (isLtr ? position.offsetX : -position.offsetX) : undefined,
		};
	}

	private _initTriggers() {
		this._initScrollListener();
		this._initHoverListeners();
	}

	private _initHoverListeners(): void {
		this._listenersRefs = [
			...this._listenersRefs,
			this._renderer.listen(this._elementRef.nativeElement, 'mouseenter', () => this._requestShow()),
			this._renderer.listen(this._elementRef.nativeElement, 'mouseleave', () => this.delay(false, this.hideDelay())),
			this._renderer.listen(this._elementRef.nativeElement, 'focus', () => this._requestShow()),
			this._renderer.listen(this._elementRef.nativeElement, 'blur', () => this.delay(false, this.hideDelay())),
		];
	}

	/** Snapshot the group skip decision once, so the delay and the instant-open state agree even if a
	 *  sibling flips the window during the show delay. */
	private _requestShow(): void {
		const skip = !!this._group && !this._group.isOpenDelayed();
		this.delay(true, skip ? 0 : this.showDelay(), skip);
	}

	private _initScrollListener(): void {
		this._listenersRefs = [
			...this._listenersRefs,
			this._renderer.listen(this._document.defaultView, 'scroll', () => this._hide()),
		];
	}

	private _cleanupTriggerEvents(): void {
		for (const eventRef of this._listenersRefs) {
			eventRef();
		}
		this._listenersRefs = [];
	}

	private delay(isShow: boolean, delay = -1, instant = false): void {
		this._delaySubject?.next({ isShow, delay, instant });
	}

	private _setupDelayMechanism(): void {
		this._delaySubject?.complete();
		this._delaySubject = new Subject<DelayConfig>();

		this._delaySubject
			.pipe(
				switchMap((config) => (config.delay < 0 ? of(config) : timer(config.delay).pipe(map(() => config)))),
				takeUntilDestroyed(this._destroyRef),
			)
			.subscribe((config) => {
				if (config.isShow) {
					this._show(config.instant);
				} else {
					this._hide();
				}
			});
	}

	private _show(instant = false): void {
		if (!this._tooltipText() || this.mutableTooltipDisabled()) {
			return;
		}

		// 'instant-open' suppresses the enter animation. Decided with the delay at request time so a sibling
		// flipping the group window mid-delay can't desync the animation from the wait that actually happened.
		const openState = instant ? 'instant-open' : 'open';

		// Already attached: revive only if it is mid-close (exit animation playing). Cancel the
		// pending teardown and flip it back open instead of letting it fade out and detach.
		if (this._componentRef) {
			if (this._componentRef.instance.state() === 'closed') {
				this._closeGeneration++;
				this._componentRef.instance.state.set(openState);
				// Re-apply props so a programmatic text change during the close is reflected on revive.
				// Keep the live (possibly flipped) position rather than resetting to the raw input.
				this._applyContentProps(this._componentRef.instance, this._activePosition ?? this.position());
				this._group?.onOpen();
				this.show.emit();
			}
			return;
		}

		const tooltipPortal = new ComponentPortal(BrnTooltipContent);
		this._componentRef = this._overlayRef?.attach(tooltipPortal);
		this._componentRef?.onDestroy(() => {
			this._componentRef = undefined;
		});
		this._componentRef?.instance.state.set(openState);
		this._group?.onOpen();
		if (this._componentRef) {
			this._applyContentProps(this._componentRef.instance, this.position());
		}

		// Subscribe to position changes for the lifetime of the tooltip so that
		// arrow direction and CSS classes stay in sync when the CDK flips the
		// overlay (initial show, viewport resize, scroll, etc.).
		const strategy = this._overlayRef?.getConfig().positionStrategy as FlexibleConnectedPositionStrategy | undefined;
		if (strategy && this._componentRef) {
			const compRef = this._componentRef;
			this._positionChangeSub = strategy.positionChanges
				.pipe(takeUntilDestroyed(this._destroyRef))
				.subscribe((change) => {
					const resolved = resolveTooltipPosition(change.connectionPair);
					if (resolved) {
						this._applyContentProps(compRef.instance, resolved, null);
					}
				});
		}

		runInInjectionContext(this._injector, () => {
			this._ariaEffectRef = effect(() => {
				const tooltipId = this._componentRef?.instance.id();
				if (tooltipId) {
					this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', tooltipId);
					this._ariaEffectRef?.destroy();
					this._ariaEffectRef = undefined;
				}
			});
		});
		this.show.emit();
	}

	/** Apply text + position (and the position-derived classes) to the content, recording the position as
	 *  active. Pass `text = null` for a position-only update that keeps the content's existing text. */
	private _applyContentProps(
		content: BrnTooltipContent,
		position: BrnTooltipPosition,
		text: BrnTooltipType = this._tooltipText(),
	): void {
		this._activePosition = position;
		content.setProps(
			text,
			position,
			this._config.tooltipContentClasses,
			this._config.arrowClasses(position),
			this._config.svgClasses,
		);
	}

	private _hide(): void {
		if (!this._componentRef || this._tooltipHovered) return;
		// Already closing (exit animation in flight): nothing to do.
		if (this._componentRef.instance.state() === 'closed') return;
		this._componentRef.instance.state.set('closed');
		this._group?.onClose();
		this.hide.emit();
		this._scheduleDetach(this._componentRef);
	}

	/**
	 * Keep the content mounted until its `data-[state=closed]` exit animation finishes, then tear it
	 * down. A re-show (revive) bumps `_closeGeneration`, which cancels the pending detach.
	 */
	private _scheduleDetach(componentRef: ComponentRef<BrnTooltipContent>): void {
		const generation = ++this._closeGeneration;
		const content = componentRef.location.nativeElement as HTMLElement;
		afterNextRender(
			() => {
				void waitForElementAnimations(content).then(() => {
					if (generation === this._closeGeneration) this._detach();
				});
			},
			{ injector: this._injector },
		);
	}

	private _detach(): void {
		this._clearAriaDescribedBy();
		this._positionChangeSub?.unsubscribe();
		this._positionChangeSub = undefined;
		this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
		this._overlayRef?.detach();
	}

	private _clearAriaDescribedBy(): void {
		if (this._ariaEffectRef) {
			this._ariaEffectRef.destroy();
			this._ariaEffectRef = undefined;
		}
	}
}
