import { Directionality } from '@angular/cdk/bidi';
import type { BooleanInput } from '@angular/cdk/coercion';
import { OverlayPositionBuilder, type ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
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
import type { BrnDialogOptions } from './brn-dialog-options';
import type { BrnDialogRef } from './brn-dialog-ref';
import type { BrnDialogState } from './brn-dialog-state';
import { injectBrnDialogDefaultOptions } from './brn-dialog-token';
import { cssClassesToArray } from './brn-dialog-utils';
import { BrnDialogService } from './brn-dialog.service';

let dialogIdSequence = 0;

type DialogContentRegistration<TContext> = {
	template: TemplateRef<unknown>;
	context: Signal<TContext | undefined>;
	panelClass: Signal<string | null | undefined>;
};

@Directive({
	selector: '[brnDialog],brn-dialog',
	exportAs: 'brnDialog',
})
export class BrnDialog<TResult = unknown, TContext extends Record<string, unknown> = Record<string, unknown>> {
	private readonly _dialogService = inject(BrnDialogService);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _vcr = inject(ViewContainerRef);
	protected readonly positionBuilder = inject(OverlayPositionBuilder);
	private readonly _scrollStrategies = inject(ScrollStrategyOptions);
	private readonly _injector = inject(Injector);
	private readonly _directionality = inject(Directionality);
	protected readonly _defaultOptions = injectBrnDialogDefaultOptions();

	private readonly _dialogRef = signal<BrnDialogRef<TResult> | undefined>(undefined);
	private readonly _origin = signal<BrnDialogOptions['attachTo']>(undefined);
	private readonly _panelClass = signal<string | null | undefined>(undefined);
	private readonly _backdropClass = signal<string | null | undefined>(undefined);
	private _content: DialogContentRegistration<TContext> | undefined;
	private _overlayClass: Signal<string | null | undefined> | undefined;

	public readonly closed = output<TResult>();
	public readonly stateChanged = output<BrnDialogState>();
	public readonly stateComputed = computed<BrnDialogState>(() => this._dialogRef()?.state() ?? 'closed');

	public readonly id = input<string>(`brn-dialog-${++dialogIdSequence}`);
	public readonly state = input<BrnDialogState | null>(null);
	public readonly role = input<BrnDialogOptions['role']>(this._defaultOptions.role);
	public readonly hasBackdrop = input<boolean, BooleanInput>(this._defaultOptions.hasBackdrop, {
		transform: booleanAttribute,
	});
	public readonly positionStrategy = input<BrnDialogOptions['positionStrategy']>(
		this._defaultOptions.positionStrategy,
	);
	public readonly scrollStrategy = input<BrnDialogOptions['scrollStrategy'] | 'close' | 'reposition' | null>(
		this._defaultOptions.scrollStrategy,
	);
	public readonly restoreFocus = input<BrnDialogOptions['restoreFocus']>(this._defaultOptions.restoreFocus);
	public readonly closeOnOutsidePointerEvents = input<boolean, BooleanInput>(
		this._defaultOptions.closeOnOutsidePointerEvents,
		{ transform: booleanAttribute },
	);
	public readonly closeOnBackdropClick = input<boolean, BooleanInput>(this._defaultOptions.closeOnBackdropClick, {
		transform: booleanAttribute,
	});
	public readonly attachTo = input<BrnDialogOptions['attachTo']>(this._defaultOptions.attachTo);
	public readonly attachPositions = input<BrnDialogOptions['attachPositions']>(this._defaultOptions.attachPositions);
	public readonly autoFocus = input<BrnDialogOptions['autoFocus']>(this._defaultOptions.autoFocus);
	public readonly disableClose = input<boolean, BooleanInput>(this._defaultOptions.disableClose, {
		transform: booleanAttribute,
	});
	public readonly ariaDescribedBy = input<BrnDialogOptions['ariaDescribedBy']>(
		this._defaultOptions.ariaDescribedBy,
		{ alias: 'aria-describedby' },
	);
	public readonly ariaLabelledBy = input<BrnDialogOptions['ariaLabelledBy']>(
		this._defaultOptions.ariaLabelledBy,
		{ alias: 'aria-labelledby' },
	);
	public readonly ariaLabel = input<BrnDialogOptions['ariaLabel']>(this._defaultOptions.ariaLabel, {
		alias: 'aria-label',
	});
	public readonly ariaModal = input<boolean, BooleanInput>(this._defaultOptions.ariaModal, {
		alias: 'aria-modal',
		transform: booleanAttribute,
	});

	protected readonly _options = computed<Partial<BrnDialogOptions>>(() => ({
		id: this.id(),
		role: this.role(),
		direction: this._directionality.valueSignal(),
		hasBackdrop: this.hasBackdrop(),
		positionStrategy: this.getPositionStrategy(),
		scrollStrategy: this.getScrollStrategy(),
		restoreFocus: this.restoreFocus(),
		closeOnOutsidePointerEvents: this.closeOnOutsidePointerEvents(),
		closeOnBackdropClick: this.closeOnBackdropClick(),
		attachTo: this.getAttachTo(),
		attachPositions: this.attachPositions(),
		autoFocus: this.autoFocus(),
		disableClose: this.disableClose(),
		backdropClass: cssClassesToArray(
			this._backdropClass() ?? this._overlayClass?.() ?? this._defaultOptions.backdropClass,
		),
		panelClass: cssClassesToArray(
			this._panelClass() ?? this._content?.panelClass() ?? this._defaultOptions.panelClass,
		),
		ariaDescribedBy: this.ariaDescribedBy(),
		ariaLabelledBy: this.ariaLabelledBy(),
		ariaLabel: this.ariaLabel(),
		ariaModal: this.ariaModal(),
	}));

	constructor() {
		this._destroyRef.onDestroy(() => this._dialogRef()?.forceClose());

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

	public open(): void {
		if (!this._content) return;

		const currentRef = this._dialogRef();
		if (currentRef) {
			currentRef.reopen();
			return;
		}

		const dialogRef = this._dialogService.open<TContext, TResult>(
			this._content.template,
			this._vcr,
			this._content.context() ?? ({} as TContext),
			this._options(),
		);
		this._dialogRef.set(dialogRef);

		dialogRef.stateChanged$
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe((state) => this.stateChanged.emit(state));

		dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
			if (this._dialogRef() === dialogRef) this._dialogRef.set(undefined);
			this.closed.emit(result as TResult);
		});
	}

	public close(result?: TResult): void {
		this._dialogRef()?.close(result);
	}

	public registerContent(
		template: TemplateRef<unknown>,
		context: Signal<TContext | undefined>,
		panelClass: Signal<string | null | undefined>,
	): void {
		this._content = { template, context, panelClass };
	}

	public registerOverlayClass(overlayClass: Signal<string | null | undefined>): void {
		this._overlayClass = overlayClass;
	}

	public setOrigin(origin: BrnDialogOptions['attachTo']): void {
		this._origin.set(origin);
	}

	public setOverlayClass(overlayClass: string | null | undefined): void {
		this._backdropClass.set(overlayClass);
		this._dialogRef()?.setOverlayClass(overlayClass);
	}

	public setPanelClass(panelClass: string | null | undefined): void {
		this._panelClass.set(panelClass);
		this._dialogRef()?.setPanelClass(panelClass);
	}

	public updatePosition(): void {
		this._dialogRef()?.updatePosition();
	}

	protected getAttachTo(): BrnDialogOptions['attachTo'] {
		return this._origin() ?? this.attachTo();
	}

	protected getPositionStrategy(): BrnDialogOptions['positionStrategy'] {
		return this.positionStrategy();
	}

	private getScrollStrategy(): ScrollStrategy | null | undefined {
		const strategy = this.scrollStrategy();
		if (strategy === 'close') return this._scrollStrategies.close();
		if (strategy === 'reposition') return this._scrollStrategies.reposition();
		return strategy;
	}
}
