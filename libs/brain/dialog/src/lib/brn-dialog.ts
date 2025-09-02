import { OverlayPositionBuilder, ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	type EffectRef,
	inject,
	Injector,
	input,
	linkedSignal,
	numberAttribute,
	output,
	runInInjectionContext,
	signal,
	type TemplateRef,
	untracked,
	ViewContainerRef,
	ViewEncapsulation,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { type BrnDialogOptions } from './brn-dialog-options';
import type { BrnDialogRef } from './brn-dialog-ref';
import type { BrnDialogState } from './brn-dialog-state';
import { injectBrnDialogDefaultOptions } from './brn-dialog-token';
import { BrnDialogService } from './brn-dialog.service';

@Component({
	selector: 'brn-dialog',
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'brnDialog',
})
export class BrnDialog {
	private readonly _dialogService = inject(BrnDialogService);
	private readonly _vcr = inject(ViewContainerRef);
	public readonly positionBuilder = inject(OverlayPositionBuilder);
	public readonly ssos = inject(ScrollStrategyOptions);
	private readonly _injector = inject(Injector);

	protected readonly _defaultOptions = injectBrnDialogDefaultOptions();

	private _context = {};
	public readonly stateComputed = computed(() => this._dialogRef()?.state() ?? 'closed');

	private _contentTemplate: TemplateRef<unknown> | undefined;
	private readonly _dialogRef = signal<BrnDialogRef | undefined>(undefined);
	private _dialogStateEffectRef?: EffectRef;
	private readonly _backdropClass = signal<string | null | undefined>(null);
	private readonly _panelClass = signal<string | null | undefined>(null);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public readonly closed = output<any>();

	public readonly stateChanged = output<BrnDialogState>();

	public readonly state = input<BrnDialogState | null>(null);

	public readonly role = input<BrnDialogOptions['role']>(this._defaultOptions.role);

	public readonly hasBackdrop = input(this._defaultOptions.hasBackdrop, { transform: booleanAttribute });

	public readonly positionStrategy = input<BrnDialogOptions['positionStrategy']>(this._defaultOptions.positionStrategy);
	public readonly mutablePositionStrategy = linkedSignal(() => this.positionStrategy());

	public readonly scrollStrategy = input<BrnDialogOptions['scrollStrategy'] | 'close' | 'reposition' | null>(
		this._defaultOptions.scrollStrategy,
	);

	protected readonly _options = computed<Partial<BrnDialogOptions>>(() => {
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
			role: this.role(),
			hasBackdrop: this.hasBackdrop(),
			positionStrategy: this.mutablePositionStrategy(),
			scrollStrategy,
			restoreFocus: this.restoreFocus(),
			closeOnOutsidePointerEvents: this.mutableCloseOnOutsidePointerEvents(),
			closeOnBackdropClick: this.closeOnBackdropClick(),
			attachTo: this.mutableAttachTo(),
			attachPositions: this.mutableAttachPositions(),
			autoFocus: this.autoFocus(),
			closeDelay: this.closeDelay(),
			disableClose: this.disableClose(),
			backdropClass: this._backdropClass() ?? '',
			panelClass: this._panelClass() ?? '',
			ariaDescribedBy: this._mutableAriaDescribedBy(),
			ariaLabelledBy: this._mutableAriaLabelledBy(),
			ariaLabel: this._mutableAriaLabel(),
			ariaModal: this._mutableAriaModal(),
		};
	});

	constructor() {
		effect(() => {
			const state = this.state();
			if (state === 'open') {
				untracked(() => this.open());
			}
			if (state === 'closed') {
				untracked(() => this.close());
			}
		});
	}

	public readonly restoreFocus = input<BrnDialogOptions['restoreFocus']>(this._defaultOptions.restoreFocus);

	public readonly closeOnOutsidePointerEvents = input(this._defaultOptions.closeOnOutsidePointerEvents, {
		transform: booleanAttribute,
	});
	public readonly mutableCloseOnOutsidePointerEvents = linkedSignal(() => this.closeOnOutsidePointerEvents());

	public readonly closeOnBackdropClick = input(this._defaultOptions.closeOnBackdropClick, {
		transform: booleanAttribute,
	});

	public readonly attachTo = input<BrnDialogOptions['attachTo']>(null);
	public readonly mutableAttachTo = linkedSignal(() => this.attachTo());

	public readonly attachPositions = input<BrnDialogOptions['attachPositions']>(this._defaultOptions.attachPositions);
	public readonly mutableAttachPositions = linkedSignal(() => this.attachPositions());

	public readonly autoFocus = input<BrnDialogOptions['autoFocus']>(this._defaultOptions.autoFocus);

	public readonly closeDelay = input(this._defaultOptions.closeDelay, {
		transform: numberAttribute,
	});

	public readonly disableClose = input(this._defaultOptions.disableClose, { transform: booleanAttribute });

	public readonly ariaDescribedBy = input<BrnDialogOptions['ariaDescribedBy']>(null, {
		alias: 'aria-describedby',
	});
	private readonly _mutableAriaDescribedBy = linkedSignal(() => this.ariaDescribedBy());

	public readonly ariaLabelledBy = input<BrnDialogOptions['ariaLabelledBy']>(null, { alias: 'aria-labelledby' });
	private readonly _mutableAriaLabelledBy = linkedSignal(() => this.ariaLabelledBy());

	public readonly ariaLabel = input<BrnDialogOptions['ariaLabel']>(null, { alias: 'aria-label' });
	private readonly _mutableAriaLabel = linkedSignal(() => this.ariaLabel());

	public readonly ariaModal = input(true, { alias: 'aria-modal', transform: booleanAttribute });
	private readonly _mutableAriaModal = linkedSignal(() => this.ariaModal());

	public open<DialogContext>() {
		if (!this._contentTemplate || this._dialogRef()) return;

		this._dialogStateEffectRef?.destroy();

		const dialogRef = this._dialogService.open<DialogContext>(
			this._contentTemplate,
			this._vcr,
			this._context as DialogContext,
			this._options(),
		);

		this._dialogRef.set(dialogRef);

		runInInjectionContext(this._injector, () => {
			this._dialogStateEffectRef = effect(() => {
				const state = dialogRef.state();
				untracked(() => this.stateChanged.emit(state));
			});
		});

		dialogRef.closed$.pipe(take(1)).subscribe((result) => {
			this._dialogRef.set(undefined);
			this.closed.emit(result);
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public close(result?: any, delay?: number) {
		this._dialogRef()?.close(result, delay ?? this._options().closeDelay);
	}

	public registerTemplate(template: TemplateRef<unknown>) {
		this._contentTemplate = template;
	}

	public setOverlayClass(overlayClass: string | null | undefined) {
		this._backdropClass.set(overlayClass);
		this._dialogRef()?.setOverlayClass(overlayClass);
	}

	public setPanelClass(panelClass: string | null | undefined) {
		this._panelClass.set(panelClass ?? '');
		this._dialogRef()?.setPanelClass(panelClass);
	}

	public setContext(context: unknown) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		this._context = { ...this._context, ...context };
	}

	public setAriaDescribedBy(ariaDescribedBy: string | null | undefined) {
		this._mutableAriaDescribedBy.set(ariaDescribedBy);
		this._dialogRef()?.setAriaDescribedBy(ariaDescribedBy);
	}

	public setAriaLabelledBy(ariaLabelledBy: string | null | undefined) {
		this._mutableAriaLabelledBy.set(ariaLabelledBy);
		this._dialogRef()?.setAriaLabelledBy(ariaLabelledBy);
	}

	public setAriaLabel(ariaLabel: string | null | undefined) {
		this._mutableAriaLabel.set(ariaLabel);
		this._dialogRef()?.setAriaLabel(ariaLabel);
	}

	public setAriaModal(ariaModal: boolean) {
		this._mutableAriaModal.set(ariaModal);
	}
}
