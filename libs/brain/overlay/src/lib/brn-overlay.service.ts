import { InteractivityChecker } from '@angular/cdk/a11y';
import { Overlay, OverlayPositionBuilder, type OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ComponentPortal, type ComponentType, TemplatePortal } from '@angular/cdk/portal';
import type { ViewContainerRef } from '@angular/core';
import { afterNextRender, inject, Injectable, Injector, type StaticProvider, TemplateRef } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import type { BrnOverlayOptions } from './brn-overlay-options';
import { BrnOverlayRef } from './brn-overlay-ref';
import type { BrnOverlayDismissReason } from './brn-overlay-state';
import { BRN_OVERLAY_DATA, injectBrnOverlayDefaultOptions } from './brn-overlay-token';

let overlaySequence = 0;

export type BrnOverlayContext<T> = T & { close: (result?: unknown) => void };

@Injectable({ providedIn: 'root' })
export class BrnOverlayService {
	private readonly _overlay = inject(Overlay);
	private readonly _positionBuilder = inject(OverlayPositionBuilder);
	private readonly _scrollStrategies = inject(ScrollStrategyOptions);
	private readonly _injector = inject(Injector);
	private readonly _interactivityChecker = inject(InteractivityChecker);
	private readonly _defaultOptions = injectBrnOverlayDefaultOptions();

	private readonly _openOverlayIds = new Set<string>();
	private readonly _overlayStack: OverlayRef[] = [];

	public open<OverlayContext, OverlayResult = unknown>(
		content: ComponentType<unknown> | TemplateRef<unknown>,
		vcr?: ViewContainerRef,
		context?: OverlayContext,
		options?: Partial<BrnOverlayOptions>,
	): BrnOverlayRef<OverlayResult> {
		const overlayId = ++overlaySequence;
		const mergedOptions: BrnOverlayOptions = {
			...this._defaultOptions,
			...options,
			id: options?.id ?? `brn-overlay-${overlayId}`,
		};

		if (this._openOverlayIds.has(mergedOptions.id)) {
			throw new Error(`Overlay with ID: ${mergedOptions.id} already exists`);
		}

		const overlayRef = this._overlay.create({
			positionStrategy:
				mergedOptions.positionStrategy ??
				(mergedOptions.attachTo && mergedOptions.attachPositions.length
					? this._positionBuilder
							.flexibleConnectedTo(mergedOptions.attachTo)
							.withPositions(mergedOptions.attachPositions)
					: this._positionBuilder.global().centerHorizontally().centerVertically()),
			scrollStrategy:
				mergedOptions.scrollStrategy === 'close'
					? this._scrollStrategies.close()
					: mergedOptions.scrollStrategy === 'reposition'
						? this._scrollStrategies.reposition()
						: (mergedOptions.scrollStrategy ?? this._scrollStrategies.block()),
			hasBackdrop: mergedOptions.hasBackdrop,
			panelClass: mergedOptions.panelClass,
			backdropClass: mergedOptions.backdropClass,
			direction: mergedOptions.direction,
		});

		const destroyed = new Subject<void>();
		const brnOverlayRef = new BrnOverlayRef<OverlayResult>(overlayRef, this._injector, overlayId, mergedOptions, () => {
			destroyed.next();
			destroyed.complete();
			this._openOverlayIds.delete(mergedOptions.id);
			this._removeFromStack(overlayRef);
		});

		const contextOrData: BrnOverlayContext<OverlayContext> = {
			...(context as OverlayContext),
			close: (result: unknown = undefined) => brnOverlayRef.close(result as OverlayResult),
		};
		const portalInjector = Injector.create({
			parent: vcr?.injector ?? this._injector,
			providers: this._createProviders(brnOverlayRef, contextOrData, mergedOptions),
		});

		this._configureElement(overlayRef, mergedOptions);
		this._openOverlayIds.add(mergedOptions.id);
		this._overlayStack.push(overlayRef);
		this._connectDismissalEvents(brnOverlayRef, overlayRef, destroyed);
		overlayRef
			.detachments()
			.pipe(takeUntil(destroyed))
			.subscribe(() => brnOverlayRef.forceClose());

		try {
			if (content instanceof TemplateRef) {
				if (!vcr) throw new Error('A ViewContainerRef is required to open an overlay from a TemplateRef');
				overlayRef.attach(new TemplatePortal(content, vcr, { $implicit: contextOrData }, portalInjector));
			} else {
				overlayRef.attach(new ComponentPortal(content, vcr, portalInjector));
			}
		} catch (error) {
			brnOverlayRef.forceClose();
			throw error;
		}

		if (mergedOptions.autoFocus) {
			this._focusInitialElement(overlayRef, destroyed);
		}

		return brnOverlayRef;
	}

	/**
	 * Moves focus to the first tabbable element inside the overlay once its content has rendered.
	 * If the overlay has no tabbable content (e.g. a select listbox), focus is left untouched so the
	 * trigger keeps it - this is what keeps the `aria-activedescendant` keyboard model working.
	 */
	private _focusInitialElement(overlayRef: OverlayRef, destroyed: Subject<void>): void {
		let cancelled = false;
		destroyed.subscribe(() => (cancelled = true));
		afterNextRender(
			() => {
				if (cancelled) return;
				const root = overlayRef.overlayElement;
				if (!root) return;
				const target = this._firstTabbableElement(root);
				target?.focus();
			},
			{ injector: this._injector },
		);
	}

	private _firstTabbableElement(root: HTMLElement): HTMLElement | null {
		const candidates = root.querySelectorAll<HTMLElement>(
			'a[href], button, input, textarea, select, [tabindex], [contenteditable="true"]',
		);
		for (const candidate of Array.from(candidates)) {
			if (this._interactivityChecker.isTabbable(candidate)) return candidate;
		}
		return null;
	}

	private _createProviders<Result, Context>(
		ref: BrnOverlayRef<Result>,
		context: BrnOverlayContext<Context>,
		options: BrnOverlayOptions,
	): StaticProvider[] {
		const providers: StaticProvider[] = [
			{ provide: BrnOverlayRef, useValue: ref },
			{ provide: BRN_OVERLAY_DATA, useValue: context },
		];
		if (options.providers) {
			providers.push(...(typeof options.providers === 'function' ? options.providers() : options.providers));
		}
		return providers;
	}

	private _configureElement(overlayRef: OverlayRef, options: BrnOverlayOptions): void {
		const element = overlayRef.overlayElement;
		element.id = options.id;
		if (options.role) {
			element.tabIndex = -1;
			element.setAttribute('role', options.role);
		}
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
			.subscribe(({ event, reason }) => this._requestDismissal(ref, overlayRef, reason, event));
	}

	private _requestDismissal<Result>(
		ref: BrnOverlayRef<Result>,
		overlayRef: OverlayRef,
		reason: BrnOverlayDismissReason,
		event: MouseEvent | KeyboardEvent,
	): void {
		if (this._overlayStack.at(-1) !== overlayRef) return;
		if (ref.dismiss(reason, event.target) && reason === 'escape') event.preventDefault();
	}

	private _removeFromStack(overlayRef: OverlayRef): void {
		const index = this._overlayStack.indexOf(overlayRef);
		if (index !== -1) this._overlayStack.splice(index, 1);
	}
}
