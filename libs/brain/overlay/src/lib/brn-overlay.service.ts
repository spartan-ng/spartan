import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import {
	Overlay,
	OverlayContainer,
	OverlayPositionBuilder,
	type OverlayRef,
	ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { ComponentPortal, type ComponentType, TemplatePortal } from '@angular/cdk/portal';
import {
	afterNextRender,
	inject,
	Injectable,
	Injector,
	type StaticProvider,
	TemplateRef,
	type Type,
	type ViewContainerRef,
} from '@angular/core';
import { merge, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import type { BrnOverlayOptions } from './brn-overlay-options';
import { BrnOverlayRef } from './brn-overlay-ref';
import type { BrnOverlayDismissReason } from './brn-overlay-state';
import { BRN_OVERLAY_DATA, injectBrnOverlayDefaultOptions } from './brn-overlay-token';

let overlaySequence = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BrnOverlayContext<T> = T & { close: (result?: any) => void };

@Injectable({ providedIn: 'root' })
export class BrnOverlayService {
	private readonly _overlay = inject(Overlay);
	private readonly _overlayContainer = inject(OverlayContainer);
	private readonly _positionBuilder = inject(OverlayPositionBuilder);
	private readonly _scrollStrategies = inject(ScrollStrategyOptions);
	private readonly _focusTrapFactory = inject(ConfigurableFocusTrapFactory);
	private readonly _injector = inject(Injector);
	private readonly _defaultOptions = injectBrnOverlayDefaultOptions();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private readonly _openOverlays = new Map<string, BrnOverlayRef<any>>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private readonly _overlayStack: BrnOverlayRef<any>[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private readonly _modalOverlays = new Set<BrnOverlayRef<any>>();
	private readonly _ariaHiddenElements = new Map<Element, string | null>();

	public open<OverlayContext, OverlayResult = unknown>(
		content: ComponentType<unknown> | TemplateRef<unknown>,
		vcr?: ViewContainerRef,
		context?: OverlayContext,
		options?: Partial<BrnOverlayOptions>,
		refTokens: Type<unknown>[] = [],
	): BrnOverlayRef<OverlayResult> {
		const mergedOptions = this._mergeOptions(options);
		if (this._openOverlays.has(mergedOptions.id)) {
			throw new Error(`Overlay with ID: ${mergedOptions.id} already exists`);
		}

		const overlayRef = this._overlay.create({
			positionStrategy: this._createPositionStrategy(mergedOptions),
			scrollStrategy: this._createScrollStrategy(mergedOptions),
			hasBackdrop: mergedOptions.hasBackdrop,
			panelClass: mergedOptions.panelClass,
			backdropClass: mergedOptions.backdropClass,
			direction: mergedOptions.direction,
		});

		const destroyed = new Subject<void>();
		const brnOverlayRef = new BrnOverlayRef<OverlayResult>(
			overlayRef,
			this._injector,
			++overlaySequence,
			mergedOptions,
			() => {
				destroyed.next();
				destroyed.complete();
				this._openOverlays.delete(mergedOptions.id);
				this._removeFromStack(brnOverlayRef);
				this._removeModalOverlay(brnOverlayRef);
			},
		);

		const contextOrData: BrnOverlayContext<OverlayContext> = {
			...(context as OverlayContext),
			close: (result: OverlayResult | undefined = undefined) => brnOverlayRef.close(result),
		};

		const providers: StaticProvider[] = [
			{ provide: BrnOverlayRef, useValue: brnOverlayRef },
			{ provide: BRN_OVERLAY_DATA, useValue: contextOrData },
			{ provide: DIALOG_DATA, useValue: contextOrData },
			...refTokens.map((token) => ({ provide: token, useValue: brnOverlayRef })),
		];
		if (mergedOptions.providers) {
			providers.push(
				...(typeof mergedOptions.providers === 'function' ? mergedOptions.providers() : mergedOptions.providers),
			);
		}

		const portalInjector = Injector.create({
			parent: vcr?.injector ?? this._injector,
			providers,
		});

		if (content instanceof TemplateRef) {
			if (!vcr) {
				throw new Error('A ViewContainerRef is required to open an overlay from a TemplateRef');
			}
			overlayRef.attach(new TemplatePortal(content, vcr, { $implicit: contextOrData }, portalInjector));
		} else {
			overlayRef.attach(new ComponentPortal(content, vcr, portalInjector));
		}

		this._openOverlays.set(mergedOptions.id, brnOverlayRef);
		this._overlayStack.push(brnOverlayRef);
		this._configureElement(brnOverlayRef, overlayRef, mergedOptions);
		this._configureFocus(brnOverlayRef, overlayRef, mergedOptions);
		this._connectDismissalEvents(brnOverlayRef, overlayRef, destroyed);
		overlayRef
			.detachments()
			.pipe(takeUntil(destroyed))
			.subscribe(() => brnOverlayRef.forceClose());

		if (mergedOptions.ariaModal) {
			this._addModalOverlay(brnOverlayRef);
		}

		return brnOverlayRef;
	}

	public getOverlayById(id: string): BrnOverlayRef | undefined {
		return this._openOverlays.get(id);
	}

	private _mergeOptions(options?: Partial<BrnOverlayOptions>): BrnOverlayOptions {
		return {
			...this._defaultOptions,
			...options,
			id: options?.id ?? `brn-overlay-${overlaySequence + 1}`,
		} as BrnOverlayOptions;
	}

	private _createPositionStrategy(options: BrnOverlayOptions) {
		if (options.positionStrategy) return options.positionStrategy;
		if (options.attachTo && options.attachPositions.length) {
			return this._positionBuilder.flexibleConnectedTo(options.attachTo).withPositions(options.attachPositions);
		}
		return this._positionBuilder.global().centerHorizontally().centerVertically();
	}

	private _createScrollStrategy(options: BrnOverlayOptions) {
		if (options.scrollStrategy === 'close') return this._scrollStrategies.close();
		if (options.scrollStrategy === 'reposition') return this._scrollStrategies.reposition();
		return options.scrollStrategy ?? this._scrollStrategies.block();
	}

	private _configureElement<Result>(
		ref: BrnOverlayRef<Result>,
		overlayRef: OverlayRef,
		options: BrnOverlayOptions,
	): void {
		const element = overlayRef.overlayElement;
		element.id = options.id;
		element.tabIndex = -1;
		if (options.role) element.setAttribute('role', options.role);
		ref.setAriaModal(options.ariaModal);
		ref.setAriaLabel(options.ariaLabel);
		ref.setAriaLabelledBy(options.ariaLabelledBy);
		ref.setAriaDescribedBy(options.ariaDescribedBy);
	}

	private _configureFocus<Result>(
		ref: BrnOverlayRef<Result>,
		overlayRef: OverlayRef,
		options: BrnOverlayOptions,
	): void {
		const activeElement = document.activeElement;
		ref.setRestoreFocusTarget(activeElement instanceof HTMLElement ? activeElement : null);

		if (options.trapFocus) {
			const focusTrap = this._focusTrapFactory.create(overlayRef.overlayElement);
			ref.setFocusTrap(focusTrap);
			if (options.autoFocus === true || options.autoFocus === 'first-tabbable') {
				afterNextRender(() => void focusTrap.focusInitialElementWhenReady(), { injector: this._injector });
				return;
			}
		}

		if (options.autoFocus === false) return;
		afterNextRender(
			() => {
				const element = overlayRef.overlayElement;
				if (options.autoFocus === true || options.autoFocus === 'first-tabbable') {
					this._focusFirst(element);
				} else if (options.autoFocus === 'first-heading') {
					this._focus(element.querySelector('h1, h2, h3, h4, h5, h6, [role="heading"]'));
				} else if (options.autoFocus === 'dialog') {
					element.focus();
				} else if (typeof options.autoFocus === 'string') {
					this._focus(element.querySelector(options.autoFocus));
				}
			},
			{ injector: this._injector },
		);
	}

	private _connectDismissalEvents<Result>(
		ref: BrnOverlayRef<Result>,
		overlayRef: OverlayRef,
		destroyed: Subject<void>,
	): void {
		merge(
			overlayRef.outsidePointerEvents().pipe(map((event) => ({ event, reason: 'outside' as const }))),
			overlayRef.backdropClick().pipe(map((event) => ({ event, reason: 'backdrop' as const }))),
			overlayRef.keydownEvents().pipe(
				filter((event) => event.key === 'Escape'),
				map((event) => ({ event, reason: 'escape' as const })),
			),
		)
			.pipe(takeUntil(destroyed))
			.subscribe(({ event, reason }) => this._requestDismissal(ref, reason, event));
	}

	private _focusFirst(element: HTMLElement): void {
		this._focus(
			element.querySelector(
				'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
			),
		);
	}

	private _focus(element: Element | null): void {
		if (element instanceof HTMLElement) element.focus();
	}

	private _requestDismissal<Result>(
		ref: BrnOverlayRef<Result>,
		reason: BrnOverlayDismissReason,
		event: MouseEvent | KeyboardEvent,
	): void {
		if (reason !== 'backdrop' && this._overlayStack.at(-1) !== ref) return;
		if (ref.dismiss(reason) && reason === 'escape') event.preventDefault();
	}

	private _removeFromStack<Result>(ref: BrnOverlayRef<Result>): void {
		const index = this._overlayStack.indexOf(ref);
		if (index !== -1) this._overlayStack.splice(index, 1);
	}

	private _addModalOverlay<Result>(ref: BrnOverlayRef<Result>): void {
		this._modalOverlays.add(ref);
		if (this._modalOverlays.size > 1) return;

		const container = this._overlayContainer.getContainerElement();
		const parent = container.parentElement;
		if (!parent) return;
		for (const sibling of Array.from(parent.children)) {
			if (
				sibling !== container &&
				sibling.nodeName !== 'SCRIPT' &&
				sibling.nodeName !== 'STYLE' &&
				!sibling.hasAttribute('aria-live')
			) {
				this._ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
				sibling.setAttribute('aria-hidden', 'true');
			}
		}
	}

	private _removeModalOverlay<Result>(ref: BrnOverlayRef<Result>): void {
		this._modalOverlays.delete(ref);
		if (this._modalOverlays.size) return;
		for (const [element, previousValue] of this._ariaHiddenElements) {
			if (previousValue === null) {
				element.removeAttribute('aria-hidden');
			} else {
				element.setAttribute('aria-hidden', previousValue);
			}
		}
		this._ariaHiddenElements.clear();
	}
}
