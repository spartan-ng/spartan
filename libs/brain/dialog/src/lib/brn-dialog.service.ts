import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import {
	type ComponentType,
	FlexibleConnectedPositionStrategy,
	OverlayOutsideClickDispatcher,
	OverlayPositionBuilder,
	OverlayRef,
	ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { BasePortalOutlet } from '@angular/cdk/portal';
import {
	ChangeDetectorRef,
	type EffectRef,
	ElementRef,
	type InjectOptions,
	Injectable,
	Injector,
	RendererFactory2,
	type StaticProvider,
	type TemplateRef,
	type ViewContainerRef,
	computed,
	effect,
	inject,
	runInInjectionContext,
	signal,
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import type { BrnDialogOptions } from './brn-dialog-options';
import { BrnDialogRef } from './brn-dialog-ref';
import type { BrnDialogState } from './brn-dialog-state';
import { injectBrnDialogDefaultOptions } from './brn-dialog-token';
import { cssClassesToArray } from './brn-dialog-utils';

let dialogSequence = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BrnDialogContext<T> = T & { close: (result?: any) => void };

/** @deprecated `injectBrnDialogCtx` will no longer be supported once components are stable. Use `injectBrnDialogContext` instead.  */
export const injectBrnDialogCtx = <T>(): BrnDialogContext<T> => {
	return inject(DIALOG_DATA);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const injectBrnDialogContext = <DialogContext = any>(options: InjectOptions = {}) => {
	return inject(DIALOG_DATA, options) as DialogContext;
};

@Injectable({ providedIn: 'root' })
export class BrnDialogService {
	private readonly _overlayCloseDispatcher = inject(OverlayOutsideClickDispatcher);
	private readonly _cdkDialog = inject(Dialog);
	private readonly _rendererFactory = inject(RendererFactory2);
	private readonly _renderer = this._rendererFactory.createRenderer(null, null);
	private readonly _positionBuilder = inject(OverlayPositionBuilder);
	private readonly _sso = inject(ScrollStrategyOptions);
	private readonly _injector = inject(Injector);
	private readonly _defaultOptions = injectBrnDialogDefaultOptions();

	public open<DialogContext>(
		content: ComponentType<unknown> | TemplateRef<unknown>,
		vcr?: ViewContainerRef,
		context?: DialogContext,
		options?: Partial<BrnDialogOptions>,
	) {
		if (options?.id && this._cdkDialog.getDialogById(options.id)) {
			throw new Error(`Dialog with ID: ${options.id} already exists`);
		}

		const attachTo = options?.attachTo ?? this._defaultOptions.attachTo;

		const positionStrategy =
			options?.positionStrategy ??
			this._defaultOptions.positionStrategy ??
			(attachTo && options?.attachPositions && options?.attachPositions?.length > 0
				? this._positionBuilder?.flexibleConnectedTo(attachTo).withPositions(options.attachPositions ?? [])
				: this._positionBuilder.global().centerHorizontally().centerVertically());

		let brnDialogRef!: BrnDialogRef;
		let effectRef!: EffectRef;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const contextOrData: BrnDialogContext<any> = {
			...context,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			close: (result: any = undefined) => brnDialogRef.close(result, options?.closeDelay),
		};

		const destroyed$ = new Subject<void>();
		const open = signal<boolean>(true);
		const state = computed<BrnDialogState>(() => (open() ? 'open' : 'closed'));
		const dialogId = ++dialogSequence;

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const cdkDialogRef = this._cdkDialog.open(content, {
			id: options?.id ?? `brn-dialog-${dialogId}`,
			role: options?.role ?? this._defaultOptions.role,
			viewContainerRef: vcr,
			templateContext: () => ({
				$implicit: contextOrData,
			}),
			data: contextOrData,
			hasBackdrop: options?.hasBackdrop ?? this._defaultOptions.hasBackdrop,
			panelClass: cssClassesToArray(options?.panelClass) ?? cssClassesToArray(this._defaultOptions.panelClass),
			backdropClass: cssClassesToArray(options?.backdropClass) ?? cssClassesToArray(this._defaultOptions.backdropClass),
			positionStrategy,
			scrollStrategy: options?.scrollStrategy ?? this._defaultOptions.scrollStrategy ?? this._sso?.block(),
			restoreFocus: options?.restoreFocus ?? this._defaultOptions.restoreFocus,
			disableClose: true,
			autoFocus: options?.autoFocus ?? this._defaultOptions.autoFocus,
			ariaDescribedBy: options?.ariaDescribedBy ?? `brn-dialog-description-${dialogId}`,
			ariaLabelledBy: options?.ariaLabelledBy ?? `brn-dialog-title-${dialogId}`,
			ariaLabel: options?.ariaLabel ?? this._defaultOptions.ariaLabel,
			ariaModal: options?.ariaModal ?? this._defaultOptions.ariaModal,
			providers: (cdkDialogRef) => {
				brnDialogRef = new BrnDialogRef(cdkDialogRef, open, state, dialogId, options as BrnDialogOptions);

				runInInjectionContext(this._injector, () => {
					effectRef = effect(() => {
						if (overlay) {
							this._renderer.setAttribute(overlay, 'data-state', state());
						}
						if (backdrop) {
							this._renderer.setAttribute(backdrop, 'data-state', state());
						}
					});
				});

				const providers: StaticProvider[] = [
					{
						provide: BrnDialogRef,
						useValue: brnDialogRef,
					},
				];

				if (options?.providers) {
					if (typeof options.providers === 'function') {
						providers.push(...options.providers());
					}

					if (Array.isArray(options.providers)) {
						providers.push(...options.providers);
					}
				}

				return providers;
			},
		});

		const overlay = cdkDialogRef.overlayRef.overlayElement;
		const backdrop = cdkDialogRef.overlayRef.backdropElement;

		const closeOnOutsidePointerEvents =
			options?.closeOnOutsidePointerEvents ?? this._defaultOptions.closeOnOutsidePointerEvents;
		if (closeOnOutsidePointerEvents) {
			cdkDialogRef.outsidePointerEvents.pipe(takeUntil(destroyed$)).subscribe(() => {
				const overlays = this._overlayCloseDispatcher._attachedOverlays;
				const index = overlays.indexOf(cdkDialogRef.overlayRef);
				// close if this is the topmost overlay
				// but prevent closing if this overlay contains the top overlay (which will be closed)
				if (
					index === overlays.length - 1 ||
					(overlays.length > 1 && !this.isNested(cdkDialogRef.overlayRef, overlays.at(-1)!))
				) {
					brnDialogRef.close(undefined, options?.closeDelay);
				}
			});
		}

		const closeOnBackdropClick = options?.closeOnBackdropClick ?? this._defaultOptions.closeOnBackdropClick;
		if (closeOnBackdropClick) {
			cdkDialogRef.backdropClick.pipe(takeUntil(destroyed$)).subscribe(() => {
				brnDialogRef.close(undefined, options?.closeDelay);
			});
		}

		const disableClose = options?.disableClose ?? this._defaultOptions.disableClose;
		if (!disableClose) {
			cdkDialogRef.keydownEvents
				.pipe(
					filter((e) => e.key === 'Escape'),
					takeUntil(destroyed$),
				)
				.subscribe(() => {
					brnDialogRef.close(undefined, options?.closeDelay);
				});
		}

		cdkDialogRef.closed.pipe(takeUntil(destroyed$)).subscribe(() => {
			effectRef?.destroy();
			destroyed$.next();
		});

		// this is not ideal, but we need to force change detection to run in the dialog,
		// otherwise in some conditions (like menu launching a dialog) the dialog content
		// does not render.
		if ('_changeDetectorRef' in cdkDialogRef.containerInstance) {
			const containerInstance = cdkDialogRef.containerInstance as BasePortalOutlet & {
				_changeDetectorRef: ChangeDetectorRef;
			};
			containerInstance._changeDetectorRef.detectChanges();
		}

		return brnDialogRef;
	}

	private isNested(parent: OverlayRef, child: OverlayRef): boolean {
		const childOrigin = (child.getConfig().positionStrategy as FlexibleConnectedPositionStrategy)._origin;
		if (!childOrigin) {
			return false;
		} else if ('width' in childOrigin && 'height' in childOrigin) {
			const rect = parent.hostElement.getBoundingClientRect();
			return (
				childOrigin.x >= rect.left &&
				childOrigin.x <= rect.right &&
				childOrigin.y >= rect.top &&
				childOrigin.y <= rect.bottom
			);
		} else {
			const element: Element = (childOrigin as ElementRef).nativeElement || childOrigin;
			return parent.hostElement.contains(element);
		}
	}
}
