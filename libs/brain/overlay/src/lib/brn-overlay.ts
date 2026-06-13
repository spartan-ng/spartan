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
	type EffectRef,
	inject,
	Injector,
	input,
	linkedSignal,
	output,
	runInInjectionContext,
	signal,
	type TemplateRef,
	untracked,
	ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs/operators';
import type { BrnOverlayOptions } from './brn-overlay-options';
import { BrnOverlayRef } from './brn-overlay-ref';
import type { BrnOverlayState } from './brn-overlay-state';
import { type BrnOverlayDefaultOptions, injectBrnOverlayDefaultOptions } from './brn-overlay-token';
import { BrnOverlayService } from './brn-overlay.service';

let overlayIdSequence = 0;

function classesToArray(classes: string | string[] | null | undefined): string[] {
	if (Array.isArray(classes)) return classes;
	return classes?.split(' ').filter(Boolean) ?? [];
}

@Directive({
	selector: '[brnOverlay],brn-overlay',
	exportAs: 'brnOverlay',
})
export class BrnOverlay<TResult = unknown, TContext extends Record<string, unknown> = Record<string, unknown>> {
	private readonly _overlayService = inject(BrnOverlayService);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _vcr = inject(ViewContainerRef);
	public readonly positionBuilder = inject(OverlayPositionBuilder);
	public readonly ssos = inject(ScrollStrategyOptions);
	private readonly _injector = inject(Injector);
	private readonly _directionality = inject(Directionality);

	protected readonly _defaultOptions = this.getDefaultOptions();

	private _context: TContext = {} as TContext;
	private _contentTemplate: TemplateRef<unknown> | undefined;
	private readonly _overlayRef = signal<BrnOverlayRef<TResult> | undefined>(undefined);
	private readonly _overlayStateEffectRefs: EffectRef[] = [];
	private readonly _backdropClass = signal<string | null | undefined>(null);
	private readonly _panelClass = signal<string | null | undefined>(null);

	public readonly stateComputed = computed(() => this._overlayRef()?.state() ?? 'closed');
	public readonly closed = output<TResult>();
	public readonly stateChanged = output<BrnOverlayState>();
	public readonly id = input<string>(`brn-overlay-${++overlayIdSequence}`);
	public readonly state = input<BrnOverlayState | null>(null);
	public readonly role = input<BrnOverlayOptions['role']>(this._defaultOptions.role);
	public readonly hasBackdrop = input<boolean, BooleanInput>(this._defaultOptions.hasBackdrop, {
		transform: booleanAttribute,
	});
	public readonly positionStrategy = input<BrnOverlayOptions['positionStrategy']>(
		this._defaultOptions.positionStrategy,
	);
	public readonly mutablePositionStrategy = linkedSignal(() => this.positionStrategy());
	public readonly scrollStrategy = input<BrnOverlayOptions['scrollStrategy'] | 'close' | 'reposition' | null>(
		this._defaultOptions.scrollStrategy,
	);
	public readonly restoreFocus = input<BrnOverlayOptions['restoreFocus']>(this._defaultOptions.restoreFocus);
	public readonly closeOnOutsidePointerEvents = input<boolean, BooleanInput>(
		this._defaultOptions.closeOnOutsidePointerEvents,
		{ transform: booleanAttribute },
	);
	public readonly closeOnBackdropClick = input<boolean, BooleanInput>(this._defaultOptions.closeOnBackdropClick, {
		transform: booleanAttribute,
	});
	public readonly attachTo = input<BrnOverlayOptions['attachTo']>(null);
	public readonly mutableAttachTo = linkedSignal(() => this.attachTo());
	public readonly attachPositions = input<BrnOverlayOptions['attachPositions']>(this._defaultOptions.attachPositions);
	public readonly mutableAttachPositions = linkedSignal(() => this.attachPositions());
	public readonly autoFocus = input<BrnOverlayOptions['autoFocus']>(this._defaultOptions.autoFocus);
	public readonly disableClose = input<boolean, BooleanInput>(this._defaultOptions.disableClose, {
		transform: booleanAttribute,
	});
	public readonly trapFocus = input<boolean, BooleanInput>(this._defaultOptions.trapFocus, {
		transform: booleanAttribute,
	});
	public readonly ariaDescribedBy = input<BrnOverlayOptions['ariaDescribedBy']>(null, {
		alias: 'aria-describedby',
	});
	private readonly _mutableAriaDescribedBy = linkedSignal(() => this.ariaDescribedBy());
	public readonly ariaLabelledBy = input<BrnOverlayOptions['ariaLabelledBy']>(null, { alias: 'aria-labelledby' });
	private readonly _mutableAriaLabelledBy = linkedSignal(() => this.ariaLabelledBy());
	public readonly ariaLabel = input<BrnOverlayOptions['ariaLabel']>(null, { alias: 'aria-label' });
	private readonly _mutableAriaLabel = linkedSignal(() => this.ariaLabel());
	public readonly ariaModal = input<boolean, BooleanInput>(this._defaultOptions.ariaModal, {
		alias: 'aria-modal',
		transform: booleanAttribute,
	});
	private readonly _mutableAriaModal = linkedSignal(() => this.ariaModal());

	protected readonly _options = computed<Partial<BrnOverlayOptions>>(() => {
		const scrollStrategyInput = this.scrollStrategy();
		let scrollStrategy: ScrollStrategy | null | undefined;
		if (scrollStrategyInput === 'close') {
			scrollStrategy = this.ssos.close();
		} else if (scrollStrategyInput === 'reposition') {
			scrollStrategy = this.ssos.reposition();
		} else {
			scrollStrategy = scrollStrategyInput;
		}

		return {
			id: this.id(),
			role: this.role(),
			direction: this._directionality.valueSignal(),
			hasBackdrop: this.hasBackdrop(),
			positionStrategy: this.mutablePositionStrategy(),
			scrollStrategy,
			restoreFocus: this.restoreFocus(),
			closeOnOutsidePointerEvents: this.closeOnOutsidePointerEvents(),
			closeOnBackdropClick: this.closeOnBackdropClick(),
			attachTo: this.mutableAttachTo(),
			attachPositions: this.mutableAttachPositions(),
			autoFocus: this.autoFocus(),
			disableClose: this.disableClose(),
			trapFocus: this.trapFocus(),
			backdropClass: classesToArray(this._backdropClass() ?? this._defaultOptions.backdropClass),
			panelClass: classesToArray(this._panelClass() ?? this._defaultOptions.panelClass),
			ariaDescribedBy: this._mutableAriaDescribedBy(),
			ariaLabelledBy: this._mutableAriaLabelledBy(),
			ariaLabel: this._mutableAriaLabel(),
			ariaModal: this._mutableAriaModal(),
		};
	});

	constructor() {
		this._destroyRef.onDestroy(() => this._overlayRef()?.forceClose());
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
		if (!this._contentTemplate) return;

		const currentRef = this._overlayRef();
		if (currentRef) {
			currentRef.reopen();
			return;
		}

		this._overlayStateEffectRefs.forEach((ref) => ref.destroy());
		const overlayRef = this._overlayService.open<TContext, TResult>(
			this._contentTemplate,
			this._vcr,
			this._context,
			this._options(),
		);
		this._overlayRef.set(overlayRef);

		runInInjectionContext(this._injector, () => {
			this._overlayStateEffectRefs.push(
				effect(() => {
					const state = overlayRef.state();
					untracked(() => this.stateChanged.emit(state));
				}),
				effect(() => {
					const options = this._options();
					untracked(() => overlayRef.updateOptions(options));
				}),
			);
		});

		overlayRef.closed$.pipe(take(1), takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
			this._overlayStateEffectRefs.forEach((ref) => ref.destroy());
			this._overlayStateEffectRefs.length = 0;
			this._overlayRef.set(undefined);
			this.closed.emit(result as TResult);
		});
	}

	public close(result?: TResult): void {
		this._overlayRef()?.close(result);
	}

	public registerTemplate(template: TemplateRef<unknown>): void {
		this._contentTemplate = template;
	}

	public setOverlayClass(overlayClass: string | null | undefined): void {
		this._backdropClass.set(overlayClass);
		this._overlayRef()?.setBackdropClass(overlayClass);
	}

	public setPanelClass(panelClass: string | null | undefined): void {
		this._panelClass.set(panelClass ?? '');
		this._overlayRef()?.setPanelClass(panelClass);
	}

	public setContext(context: TContext): void {
		this._context = { ...this._context, ...context };
	}

	public setAriaDescribedBy(value: string | null | undefined): void {
		this._mutableAriaDescribedBy.set(value);
		this._overlayRef()?.setAriaDescribedBy(value);
	}

	public setAriaLabelledBy(value: string | null | undefined): void {
		this._mutableAriaLabelledBy.set(value);
		this._overlayRef()?.setAriaLabelledBy(value);
	}

	public setAriaLabel(value: string | null | undefined): void {
		this._mutableAriaLabel.set(value);
		this._overlayRef()?.setAriaLabel(value);
	}

	public setAriaModal(value: boolean): void {
		this._mutableAriaModal.set(value);
		this._overlayRef()?.setAriaModal(value);
	}

	public updatePosition(): void {
		this._overlayRef()?.updatePosition();
	}
}
