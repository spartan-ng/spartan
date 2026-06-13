import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import {
	type ComponentType,
	FlexibleConnectedPositionStrategy,
	OverlayOutsideClickDispatcher,
	OverlayPositionBuilder,
	type OverlayRef,
	ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { ElementRef, inject, Injectable, type InjectOptions, Injector, type StaticProvider } from '@angular/core';
import type { TemplateRef, ViewContainerRef } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import type { BrnDialogOptions } from './brn-dialog-options';
import { BrnDialogRef } from './brn-dialog-ref';
import { injectBrnDialogDefaultOptions } from './brn-dialog-token';

let dialogSequence = 0;

export type BrnDialogContext<T> = T & { close: (result?: unknown) => void };

/** @deprecated Use `injectBrnDialogContext` instead. */
export const injectBrnDialogCtx = <T>(): BrnDialogContext<T> => inject(DIALOG_DATA);

export const injectBrnDialogContext = <DialogContext = unknown>(options: InjectOptions = {}) =>
	inject(DIALOG_DATA, options) as DialogContext;

@Injectable({ providedIn: 'root' })
export class BrnDialogService {
	private readonly _overlayCloseDispatcher = inject(OverlayOutsideClickDispatcher);
	private readonly _cdkDialog = inject(Dialog);
	private readonly _positionBuilder = inject(OverlayPositionBuilder);
	private readonly _scrollStrategies = inject(ScrollStrategyOptions);
	private readonly _injector = inject(Injector);
	private readonly _defaultOptions = injectBrnDialogDefaultOptions();

	public open<DialogContext, DialogResult = unknown>(
		content: ComponentType<unknown> | TemplateRef<unknown>,
		vcr?: ViewContainerRef,
		context?: DialogContext,
		options?: Partial<BrnDialogOptions>,
	): BrnDialogRef<DialogResult> {
		const dialogId = ++dialogSequence;
		const mergedOptions: BrnDialogOptions = {
			...this._defaultOptions,
			...options,
			id: options?.id ?? `brn-dialog-${dialogId}`,
		};

		if (this._cdkDialog.getDialogById(mergedOptions.id)) {
			throw new Error(`Dialog with ID: ${mergedOptions.id} already exists`);
		}

		const positionStrategy =
			mergedOptions.positionStrategy ??
			(mergedOptions.attachTo && mergedOptions.attachPositions.length
				? this._positionBuilder.flexibleConnectedTo(mergedOptions.attachTo).withPositions(mergedOptions.attachPositions)
				: this._positionBuilder.global().centerHorizontally().centerVertically());

		const scrollStrategy =
			mergedOptions.scrollStrategy === 'close'
				? this._scrollStrategies.close()
				: mergedOptions.scrollStrategy === 'reposition'
					? this._scrollStrategies.reposition()
					: (mergedOptions.scrollStrategy ?? this._scrollStrategies.block());

		let brnDialogRef!: BrnDialogRef<DialogResult>;
		const contextOrData: BrnDialogContext<DialogContext> = {
			...(context as DialogContext),
			close: (result: unknown = undefined) => brnDialogRef.close(result as DialogResult),
		};

		const cdkDialogRef = this._cdkDialog.open<DialogResult, BrnDialogContext<DialogContext>, unknown>(content, {
			id: mergedOptions.id,
			role: mergedOptions.role,
			viewContainerRef: vcr,
			templateContext: () => ({ $implicit: contextOrData }),
			data: contextOrData,
			direction: mergedOptions.direction,
			hasBackdrop: mergedOptions.hasBackdrop,
			panelClass: mergedOptions.panelClass,
			backdropClass: mergedOptions.backdropClass,
			positionStrategy,
			scrollStrategy,
			restoreFocus: mergedOptions.restoreFocus,
			disableClose: true,
			autoFocus: mergedOptions.autoFocus,
			ariaDescribedBy: mergedOptions.ariaDescribedBy ?? `brn-dialog-description-${dialogId}`,
			ariaLabelledBy: mergedOptions.ariaLabelledBy ?? `brn-dialog-title-${dialogId}`,
			ariaLabel: mergedOptions.ariaLabel,
			ariaModal: mergedOptions.ariaModal,
			providers: (dialogRef) => {
				brnDialogRef = new BrnDialogRef(dialogRef, this._injector, dialogId, mergedOptions);
				return this._createProviders(brnDialogRef, mergedOptions);
			},
		});

		this._connectDismissalEvents(brnDialogRef, cdkDialogRef.overlayRef);
		return brnDialogRef;
	}

	private _createProviders<Result>(
		dialogRef: BrnDialogRef<Result>,
		options: BrnDialogOptions,
	): StaticProvider[] {
		const providers: StaticProvider[] = [{ provide: BrnDialogRef, useValue: dialogRef }];
		if (options.providers) {
			providers.push(...(typeof options.providers === 'function' ? options.providers() : options.providers));
		}
		return providers;
	}

	private _connectDismissalEvents<Result>(dialogRef: BrnDialogRef<Result>, overlayRef: OverlayRef): void {
		const closed$ = dialogRef.closed$;

		overlayRef
			.outsidePointerEvents()
			.pipe(takeUntil(closed$))
			.subscribe(() => {
				if (this._isTopmostOutsideTarget(overlayRef)) dialogRef.dismiss('outside');
			});

		overlayRef
			.backdropClick()
			.pipe(takeUntil(closed$))
			.subscribe(() => dialogRef.dismiss('backdrop'));

		overlayRef
			.keydownEvents()
			.pipe(
				filter((event) => event.key === 'Escape'),
				takeUntil(closed$),
			)
			.subscribe((event) => {
				if (this._overlayCloseDispatcher._attachedOverlays.at(-1) !== overlayRef) return;
				if (dialogRef.dismiss('escape')) event.preventDefault();
			});
	}

	private _isTopmostOutsideTarget(overlayRef: OverlayRef): boolean {
		const overlays = this._overlayCloseDispatcher._attachedOverlays;
		const index = overlays.indexOf(overlayRef);
		return index === overlays.length - 1 || (overlays.length > 1 && !this._isNested(overlayRef, overlays.at(-1)!));
	}

	private _isNested(parent: OverlayRef, child: OverlayRef): boolean {
		const childOrigin = (child.getConfig().positionStrategy as FlexibleConnectedPositionStrategy)._origin;
		if (!childOrigin) return false;

		if ('width' in childOrigin && 'height' in childOrigin) {
			const rect = parent.hostElement.getBoundingClientRect();
			return (
				childOrigin.x >= rect.left &&
				childOrigin.x <= rect.right &&
				childOrigin.y >= rect.top &&
				childOrigin.y <= rect.bottom
			);
		}

		const element: Element = (childOrigin as ElementRef).nativeElement || childOrigin;
		return parent.hostElement.contains(element);
	}
}
