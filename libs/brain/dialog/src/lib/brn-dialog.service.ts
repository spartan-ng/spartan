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
import { _getEventTarget, _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
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

/** Whether `node` is inside `ancestor`, following shadow hosts up to the document. */
function containsComposed(ancestor: Node, node: Node): boolean {
	let current: Node | null = node;
	while (current) {
		if (ancestor.contains(current)) return true;
		const root = current.getRootNode();
		current = root instanceof ShadowRoot ? root.host : null;
	}
	return false;
}

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
	/** The `aria-hidden` of the page before the first dialog opened, restored while no modal is open. */
	private _pageAriaHidden: Map<Element, string | null> | null = null;
	private _openFocusTrappingDialogs = 0;

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

		// The CDK hides the rest of the page from assistive technology only when the first dialog opens.
		// A dialog that doesn't trap focus leaves the page usable, so the page is hidden exactly while a
		// dialog that traps focus is open, whichever dialog opened first.
		if (!this._cdkDialog.openDialogs.length) this._pageAriaHidden = this._snapshotPageAriaHidden();

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

		const trapsFocus = mergedOptions.trapFocus;
		if (trapsFocus) this._openFocusTrappingDialogs++;
		// Runs after the CDK hides the page, which subscribes first.
		cdkDialogRef.containerInstance._focusTrapped?.pipe(take(1)).subscribe(() => this._syncPageAriaHidden());
		cdkDialogRef.closed.subscribe(() => {
			if (trapsFocus) this._openFocusTrappingDialogs--;
			this._syncPageAriaHidden();
			if (!this._cdkDialog.openDialogs.length) this._pageAriaHidden = null;
		});

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
			if (containsComposed(pane, target)) return true;
			const overlays = this._overlayCloseDispatcher._attachedOverlays;
			const above = overlays.slice(overlays.indexOf(overlayRef) + 1);
			return above.some((overlay) => containsComposed(overlay.hostElement, target));
		};
		// The focused element itself, not the shadow host the document sees when it is in a shadow root.
		const activeElement = _getFocusedElementPierceShadowDom();
		let focusWithin = activeElement instanceof Node && isWithinDialog(activeElement);
		const onFocusIn = (event: FocusEvent) => {
			const target = _getEventTarget(event);
			if (!(target instanceof Node)) return;
			const wasWithin = focusWithin;
			focusWithin = isWithinDialog(target);
			if (wasWithin && !focusWithin) dialogRef.dismiss('focus-out');
		};
		this._document.addEventListener('focusin', onFocusIn, true);
		dialogRef.closed$.subscribe(() => this._document.removeEventListener('focusin', onFocusIn, true));
	}

	/** Records the `aria-hidden` of the overlay container's siblings that the CDK hides. */
	private _snapshotPageAriaHidden(): Map<Element, string | null> {
		const container = this._overlayContainer.getContainerElement();
		const siblings = Array.from(container.parentElement?.children ?? []).filter(
			(sibling) =>
				sibling !== container &&
				sibling.nodeName !== 'SCRIPT' &&
				sibling.nodeName !== 'STYLE' &&
				!sibling.hasAttribute('aria-live') &&
				!sibling.hasAttribute('popover'),
		);
		return new Map(siblings.map((sibling) => [sibling, sibling.getAttribute('aria-hidden')]));
	}

	/** Hides the page while a dialog that traps focus is open, and restores it otherwise. */
	private _syncPageAriaHidden(): void {
		const snapshot = this._pageAriaHidden;
		if (!snapshot) return;
		for (const [sibling, value] of snapshot) {
			if (this._openFocusTrappingDialogs > 0) sibling.setAttribute('aria-hidden', 'true');
			else if (value === null) sibling.removeAttribute('aria-hidden');
			else sibling.setAttribute('aria-hidden', value);
		}
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
