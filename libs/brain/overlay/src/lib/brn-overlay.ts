import { Directionality } from '@angular/cdk/bidi';
import type { BooleanInput } from '@angular/cdk/coercion';
import { OverlayPositionBuilder, type ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
	afterNextRender,
	booleanAttribute,
	computed,
	DestroyRef,
	Directive,
	effect,
	inject,
	Injector,
	input,
	output,
	type Signal,
	signal,
	type TemplateRef,
	untracked,
	ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { cssClassesToArray } from '@spartan-ng/brain/core';
import type { BrnOverlayOptions } from './brn-overlay-options';
import type { BrnOverlayRef } from './brn-overlay-ref';
import type { BrnOverlayState } from './brn-overlay-state';
import type { BrnOverlayDefaultOptions } from './brn-overlay-token';
import { injectBrnOverlayDefaultOptions } from './brn-overlay-token';
import { BrnOverlayService } from './brn-overlay.service';

let overlayIdSequence = 0;

type OverlayContentRegistration<TContext> = {
	template: TemplateRef<unknown>;
	context: Signal<TContext | undefined>;
	panelClass: Signal<string | null | undefined>;
};

@Directive({
	selector: '[brnOverlay],brn-overlay',
	exportAs: 'brnOverlay',
})
export class BrnOverlay<TResult = unknown, TContext extends Record<string, unknown> = Record<string, unknown>> {
	private readonly _overlayService = inject(BrnOverlayService);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _vcr = inject(ViewContainerRef);
	protected readonly _positionBuilder = inject(OverlayPositionBuilder);
	private readonly _scrollStrategies = inject(ScrollStrategyOptions);
	private readonly _injector = inject(Injector);
	private readonly _directionality = inject(Directionality);
	private readonly _document = inject(DOCUMENT);
	protected readonly _defaultOptions = this.getDefaultOptions();

	private readonly _overlayRef = signal<BrnOverlayRef<TResult> | undefined>(undefined);
	private readonly _origin = signal<BrnOverlayOptions['attachTo']>(undefined);
	private readonly _panelClass = signal<string | string[] | null | undefined>(undefined);
	private readonly _backdropClass = signal<string | string[] | null | undefined>(undefined);
	private _content: OverlayContentRegistration<TContext> | undefined;
	private readonly _resolvedBackdropClass = computed(() => this._backdropClass() ?? this._defaultOptions.backdropClass);
	private readonly _resolvedPanelClass = computed(
		() => this._panelClass() ?? this._content?.panelClass() ?? this._defaultOptions.panelClass,
	);

	public readonly closed = output<TResult>();
	public readonly stateChanged = output<BrnOverlayState>();
	public readonly stateComputed = computed<BrnOverlayState>(() => this._overlayRef()?.state() ?? 'closed');

	public readonly id = input<string>(`brn-overlay-${++overlayIdSequence}`);
	public readonly state = input<BrnOverlayState | null>(null);
	public readonly role = input<BrnOverlayOptions['role']>(this._defaultOptions.role);
	public readonly hasBackdrop = input<boolean, BooleanInput>(this._defaultOptions.hasBackdrop, {
		transform: booleanAttribute,
	});
	public readonly positionStrategy = input<BrnOverlayOptions['positionStrategy']>(
		this._defaultOptions.positionStrategy,
	);
	public readonly scrollStrategy = input<BrnOverlayOptions['scrollStrategy'] | 'close' | 'reposition' | null>(
		this._defaultOptions.scrollStrategy,
	);
	public readonly closeOnOutsidePointerEvents = input<boolean, BooleanInput>(
		this._defaultOptions.closeOnOutsidePointerEvents,
		{ transform: booleanAttribute },
	);
	public readonly closeOnBackdropClick = input<boolean, BooleanInput>(this._defaultOptions.closeOnBackdropClick, {
		transform: booleanAttribute,
	});
	public readonly attachTo = input<BrnOverlayOptions['attachTo']>(this._defaultOptions.attachTo);
	public readonly attachPositions = input<BrnOverlayOptions['attachPositions']>(this._defaultOptions.attachPositions);
	public readonly disableClose = input<boolean, BooleanInput>(this._defaultOptions.disableClose, {
		transform: booleanAttribute,
	});

	protected readonly _options = computed<Partial<BrnOverlayOptions>>(() => ({
		id: this.id(),
		role: this.role(),
		direction: this._directionality.valueSignal(),
		hasBackdrop: this.hasBackdrop(),
		positionStrategy: this.getPositionStrategy(),
		scrollStrategy: this.getScrollStrategy(),
		closeOnOutsidePointerEvents: this.closeOnOutsidePointerEvents(),
		closeOnBackdropClick: this.getCloseOnBackdropClick(),
		attachTo: this.getAttachTo(),
		attachPositions: this.getAttachPositions(),
		disableClose: this.disableClose(),
		backdropClass: cssClassesToArray(this._resolvedBackdropClass()),
		panelClass: cssClassesToArray(this._resolvedPanelClass()),
	}));

	constructor() {
		this._destroyRef.onDestroy(() => this._overlayRef()?.forceClose());
		this._syncPanelClass();
		this._syncBackdropClass();

		afterNextRender(() => {
			effect(
				() => {
					const state = this.state();
					if (state === 'open') untracked(() => this.open());
					if (state === 'closed') untracked(() => this.close());
				},
				{ injector: this._injector },
			);
		});
	}

	protected getDefaultOptions(): BrnOverlayDefaultOptions {
		return injectBrnOverlayDefaultOptions();
	}

	public open(): void {
		if (!this._content) return;

		const currentRef = this._overlayRef();
		if (currentRef) {
			currentRef.reopen();
			return;
		}

		const elementToRestoreFocusTo = this._document.activeElement;
		const overlayRef = this._overlayService.open<TContext, TResult>(
			this._content.template,
			this._vcr,
			this._content.context() ?? ({} as TContext),
			this._options(),
		);
		this._overlayRef.set(overlayRef);

		overlayRef.stateChanged$
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((state) => this.stateChanged.emit(state));

		overlayRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
			if (this._overlayRef() === overlayRef) this._overlayRef.set(undefined);
			this._restoreFocus(elementToRestoreFocusTo);
			this.closed.emit(result as TResult);
		});
	}

	public close(result?: TResult): void {
		this._overlayRef()?.close(result);
	}

	public toggle(result?: TResult): void {
		this.stateComputed() === 'open' ? this.close(result) : this.open();
	}

	public registerContent(
		template: TemplateRef<unknown>,
		context: Signal<TContext | undefined>,
		panelClass: Signal<string | null | undefined>,
	): void {
		this._content = { template, context, panelClass };
	}

	public setOrigin(origin: BrnOverlayOptions['attachTo']): void {
		this._origin.set(origin);
	}

	public setOverlayClass(overlayClass: string | string[] | null | undefined): void {
		this._backdropClass.set(overlayClass);
		this._overlayRef()?.setBackdropClass(overlayClass);
	}

	public setPanelClass(panelClass: string | string[] | null | undefined): void {
		this._panelClass.set(panelClass);
		this._overlayRef()?.setPanelClass(panelClass);
	}

	public updatePosition(): void {
		this._overlayRef()?.updatePosition();
	}

	protected getAttachTo(): BrnOverlayOptions['attachTo'] {
		return this._origin() ?? this.attachTo();
	}

	protected getAttachPositions(): BrnOverlayOptions['attachPositions'] {
		return this.attachPositions();
	}

	protected getPositionStrategy(): BrnOverlayOptions['positionStrategy'] {
		return this.positionStrategy();
	}

	protected getCloseOnBackdropClick(): boolean {
		return this.closeOnBackdropClick();
	}

	private getScrollStrategy(): ScrollStrategy | null | undefined {
		const strategy = this.scrollStrategy();
		if (strategy === 'close') return this._scrollStrategies.close();
		if (strategy === 'reposition') return this._scrollStrategies.reposition();
		return strategy;
	}

	private _restoreFocus(element: Element | null): void {
		const HTMLElementCtor = this._document.defaultView?.HTMLElement;
		if (
			!HTMLElementCtor ||
			!(element instanceof HTMLElementCtor) ||
			element === this._document.body ||
			!element.isConnected
		) {
			return;
		}

		const activeElement = this._document.activeElement;
		const shouldRestoreFocus = activeElement === this._document.body || !activeElement || !activeElement.isConnected;

		if (shouldRestoreFocus) element.focus({ preventScroll: true });
	}

	private _syncPanelClass(): void {
		effect(
			() => {
				const overlayRef = this._overlayRef();
				if (!overlayRef) return;

				const panelClass = this._resolvedPanelClass();
				untracked(() => overlayRef.setPanelClass(panelClass));
			},
			{ injector: this._injector },
		);
	}

	private _syncBackdropClass(): void {
		effect(
			() => {
				const overlayRef = this._overlayRef();
				if (!overlayRef) return;

				const backdropClass = this._resolvedBackdropClass();
				untracked(() => overlayRef.setBackdropClass(backdropClass));
			},
			{ injector: this._injector },
		);
	}
}
