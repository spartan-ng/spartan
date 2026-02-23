import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
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
	numberAttribute,
	output,
	Renderer2,
	runInInjectionContext,
	signal,
	type TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { of, Subject, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BrnTooltipContent } from './brn-tooltip-content';
import { BRN_TOOLTIP_POSITIONS_MAP, BrnTooltipPosition } from './brn-tooltip-position';
import { BrnTooltipType } from './brn-tooltip-type';
import { injectBrnTooltipDefaultOptions } from './brn-tooltip.token';

interface DelayConfig {
	isShow: boolean;
	delay: number;
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

	private _tooltipHovered = false;
	private _listenersRefs: (() => void)[] = [];
	private _delaySubject: Subject<DelayConfig> | undefined = undefined;
	private _componentRef: ComponentRef<BrnTooltipContent> | undefined = undefined;
	private _overlayRef: OverlayRef | undefined = undefined;
	private _ariaEffectRef: ReturnType<typeof effect> | undefined = undefined;

	public readonly tooltipDisabled = input<boolean, boolean>(false, { transform: booleanAttribute });
	public readonly disableTooltip = signal(false);
	public readonly isDisabled = computed(() => this.disableTooltip() || this.tooltipDisabled());

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
			const positionStrategy = this._overlayPositionBuilder
				.flexibleConnectedTo(this._elementRef)
				.withPositions([BRN_TOOLTIP_POSITIONS_MAP[this.position()]]);
			this._overlayRef = this._overlay.create({ positionStrategy });

			runInInjectionContext(this._injector, () => {
				if (!this._overlayRef) return;
				this._setupDelayMechanism();
				this._cleanupTriggerEvents();
				this._initTriggers();
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

	private _initTriggers() {
		this._initScrollListener();
		this._initHoverListeners();
	}

	private _initHoverListeners(): void {
		this._listenersRefs = [
			...this._listenersRefs,
			this._renderer.listen(this._elementRef.nativeElement, 'mouseenter', () => this.delay(true, this.showDelay())),
			this._renderer.listen(this._elementRef.nativeElement, 'mouseleave', () => this.delay(false, this.hideDelay())),
			this._renderer.listen(this._elementRef.nativeElement, 'focus', () => this.delay(true, this.showDelay())),
			this._renderer.listen(this._elementRef.nativeElement, 'blur', () => this.delay(false, this.hideDelay())),
		];
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

	private delay(isShow: boolean, delay = -1): void {
		this._delaySubject?.next({ isShow, delay });
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
					this._show();
				} else {
					this._hide();
				}
			});
	}

	private _show(): void {
		if (this._componentRef || !this._tooltipText() || this.isDisabled()) {
			return;
		}

		const tooltipPortal = new ComponentPortal(BrnTooltipContent);
		this._componentRef = this._overlayRef?.attach(tooltipPortal);
		this._componentRef?.onDestroy(() => {
			this._componentRef = undefined;
		});
		this._componentRef?.instance.state.set('opened');
		this._componentRef?.instance.setProps(
			this._tooltipText(),
			this.position(),
			this._config.tooltipContentClasses,
			this._config.arrowClasses(this.position()),
			this._config.svgClasses,
		);
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

	private _hide(): void {
		if (!this._componentRef || this._tooltipHovered) return;
		this._clearAriaDescribedBy();

		this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
		this._componentRef.instance.state.set('closed');
		this.hide.emit();
		this._overlayRef?.detach();
	}

	private _clearAriaDescribedBy(): void {
		if (this._ariaEffectRef) {
			this._ariaEffectRef.destroy();
			this._ariaEffectRef = undefined;
		}
	}
}
