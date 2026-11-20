import { FocusTrapFactory } from '@angular/cdk/a11y';
import { CdkDialogContainer, Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import {
	type ComponentType,
	FlexibleConnectedPositionStrategy,
	OverlayContainer,
	OverlayOutsideClickDispatcher,
	OverlayPositionBuilder,
	type OverlayRef,
	ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import type { TemplateRef, ViewContainerRef } from '@angular/core';
import { ElementRef, inject, Injectable, type InjectOptions, Injector, type StaticProvider } from '@angular/core';
import { filter, take, takeUntil } from 'rxjs/operators';
import { nextBrnDialogId } from './brn-dialog-id';
import type { BrnDialogOptions } from './brn-dialog-options';
import { BrnDialogRef } from './brn-dialog-ref';
import { injectBrnDialogDefaultOptions } from './brn-dialog-token';

let dialogSequence = 0;

export type BrnDialogContext<T> = T & { close: (result?: unknown) => void };

export const injectBrnDialogContext = <DialogContext = unknown>(options: InjectOptions = {}) =>
	inject(DIALOG_DATA, options) as DialogContext;

@Injectable({ providedIn: 'root' })
export class BrnDialogService {
	private readonly _overlayCloseDispatcher = inject(OverlayOutsideClickDispatcher);
	private readonly _cdkDialog = inject(Dialog);
	private readonly _overlayContainer = inject(OverlayContainer);
	private readonly _document = inject(DOCUMENT);
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
			id: options?.id ?? nextBrnDialogId(),
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

		// The CDK hides the rest of the page from assistive technology once the first dialog moves focus
		// in. A dialog that doesn't trap focus leaves the page usable, so it must stay accessible too.
		const restorePageAccessibility = mergedOptions.trapFocus ? null : this._snapshotPageAriaHidden();

		const cdkDialogRef = this._cdkDialog.open<DialogResult, BrnDialogContext<DialogContext>, unknown>(content, {
			id: mergedOptions.id,
			role: mergedOptions.role,
			viewContainerRef: vcr,
			templateContext: () => ({ $implicit: contextOrData }),
			data: contextOrData,
			direction: mergedOptions.direction,
			hasBackdrop: mergedOptions.hasBackdrop,
			// Only when set: an explicit undefined would override the CDK DEFAULT_DIALOG_CONFIG size.
			...(mergedOptions.width !== undefined && { width: mergedOptions.width }),
			...(mergedOptions.height !== undefined && { height: mergedOptions.height }),
			...(mergedOptions.maxWidth !== undefined && { maxWidth: mergedOptions.maxWidth }),
			...(mergedOptions.maxHeight !== undefined && { maxHeight: mergedOptions.maxHeight }),
			panelClass: mergedOptions.panelClass,
			backdropClass: mergedOptions.backdropClass,
			positionStrategy,
			scrollStrategy,
			restoreFocus: mergedOptions.restoreFocus,
			disableClose: true,
			autoFocus: mergedOptions.autoFocus,
			ariaDescribedBy: mergedOptions.ariaDescribedBy,
			ariaLabelledBy:
				mergedOptions.ariaLabelledBy === undefined ? `brn-dialog-title-${dialogId}` : mergedOptions.ariaLabelledBy,
			ariaLabel: mergedOptions.ariaLabel,
			ariaModal: mergedOptions.ariaModal,
			// Only when not trapping: an explicit undefined would override a DEFAULT_DIALOG_CONFIG container.
			...(!mergedOptions.trapFocus && {
				container: {
					type: CdkDialogContainer,
					providers: () => [{ provide: FocusTrapFactory, useClass: BrnInertFocusTrapFactory, deps: [] }],
				},
			}),
			providers: (dialogRef) => {
				brnDialogRef = new BrnDialogRef(dialogRef, this._injector, dialogId, mergedOptions);
				return this._createProviders(brnDialogRef, mergedOptions);
			},
		});

		if (restorePageAccessibility) {
			cdkDialogRef.containerInstance._focusTrapped?.pipe(take(1)).subscribe(restorePageAccessibility);
		}

		this._connectDismissalEvents(brnDialogRef, cdkDialogRef.overlayRef);
		if (mergedOptions.closeOnFocusOut) this._connectFocusOut(brnDialogRef, cdkDialogRef.overlayRef);
		return brnDialogRef;
	}

	private _createProviders<Result>(dialogRef: BrnDialogRef<Result>, options: BrnDialogOptions): StaticProvider[] {
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
				filter((event) => event.key === 'Escape' && !event.defaultPrevented),
				takeUntil(closed$),
			)
			.subscribe((event) => {
				if (this._overlayCloseDispatcher._attachedOverlays.at(-1) !== overlayRef) return;
				if (dialogRef.dismiss('escape')) event.preventDefault();
			});
	}

	private _connectFocusOut<Result>(dialogRef: BrnDialogRef<Result>, overlayRef: OverlayRef): void {
		// Kept in a constant: the overlay ref no longer exposes its element once it is disposed.
		const pane = overlayRef.overlayElement;
		// Focus moving into an overlay stacked above (a nested popup) stays within the dialog, and
		// leaving that overlay for the page leaves the dialog as well. Track focus on the document, as
		// the pane gets no `focusout` when focus leaves a nested overlay.
		const isWithinDialog = (target: Node) => {
			if (pane.contains(target)) return true;
			const overlays = this._overlayCloseDispatcher._attachedOverlays;
			const above = overlays.slice(overlays.indexOf(overlayRef) + 1);
			return above.some((overlay) => overlay.hostElement.contains(target));
		};
		const activeElement = this._document.activeElement;
		let focusWithin = activeElement instanceof Node && isWithinDialog(activeElement);
		const onFocusIn = (event: FocusEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			const wasWithin = focusWithin;
			focusWithin = isWithinDialog(target);
			if (wasWithin && !focusWithin) dialogRef.dismiss('focus-out');
		};
		this._document.addEventListener('focusin', onFocusIn, true);
		dialogRef.closed$.subscribe(() => this._document.removeEventListener('focusin', onFocusIn, true));
	}

	/** Records the `aria-hidden` of the overlay container's siblings and returns a restore function. */
	private _snapshotPageAriaHidden(): () => void {
		const siblings = Array.from(this._overlayContainer.getContainerElement().parentElement?.children ?? []);
		const snapshot = new Map(siblings.map((sibling) => [sibling, sibling.getAttribute('aria-hidden')]));
		return () => {
			for (const [sibling, value] of snapshot) {
				if (value === null) sibling.removeAttribute('aria-hidden');
				else sibling.setAttribute('aria-hidden', value);
			}
		};
	}

	private _isTopmostOutsideTarget(overlayRef: OverlayRef): boolean {
		const overlays = this._overlayCloseDispatcher._attachedOverlays;
		const index = overlays.indexOf(overlayRef);
		if (index === overlays.length - 1) return true;
		// A modal overlay above (one with a backdrop) blocks outside-dismissal of everything below it.
		if (overlays.at(-1)?.backdropElement) return false;
		return overlays.length > 1 && !this._isNested(overlayRef, overlays.at(-1)!);
	}

	private _isNested(parent: OverlayRef, child: OverlayRef): boolean {
		const childOrigin = (child.getConfig().positionStrategy as FlexibleConnectedPositionStrategy)._origin;
		if (!childOrigin) return false;

		if ('x' in childOrigin && 'y' in childOrigin) {
			const rect = parent.hostElement.getBoundingClientRect();
			return (
				childOrigin.x >= rect.left &&
				childOrigin.x <= rect.right &&
				childOrigin.y >= rect.top &&
				childOrigin.y <= rect.bottom
			);
		}

		const element = childOrigin instanceof ElementRef ? childOrigin.nativeElement : childOrigin;
		return typeof Node !== 'undefined' && element instanceof Node ? parent.hostElement.contains(element) : false;
	}
}

/** Creates focus traps whose tab anchors are disabled: the dialog still moves focus in, but Tab can leave it. */
@Injectable()
class BrnInertFocusTrapFactory extends FocusTrapFactory {
	public override create(element: HTMLElement, deferCaptureElements?: boolean) {
		const focusTrap = super.create(element, deferCaptureElements);
		focusTrap.enabled = false;
		return focusTrap;
	}
}
