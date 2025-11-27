import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import {
	type ComponentType,
	ConnectionPositionPair,
	OverlayOutsideClickDispatcher,
	OverlayPositionBuilder,
	ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { BasePortalOutlet } from '@angular/cdk/portal';
import {
	ChangeDetectorRef,
	type EffectRef,
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
import { getTransformOrigin } from '@spartan-ng/brain/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import type { BrnDialogOptions } from './brn-dialog-options';
import { BrnDialogRef } from './brn-dialog-ref';
import type { BrnDialogState } from './brn-dialog-state';
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

	public open<DialogContext>(
		content: ComponentType<unknown> | TemplateRef<unknown>,
		vcr?: ViewContainerRef,
		context?: DialogContext,
		options?: Partial<BrnDialogOptions>,
	) {
		if (options?.id && this._cdkDialog.getDialogById(options.id)) {
			throw new Error(`Dialog with ID: ${options.id} already exists`);
		}

		const positionStrategy =
			options?.positionStrategy ??
			(options?.attachTo && options?.attachPositions && options?.attachPositions?.length > 0
				? this._positionBuilder?.flexibleConnectedTo(options.attachTo).withPositions(options.attachPositions ?? [])
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
			role: options?.role,
			viewContainerRef: vcr,
			templateContext: () => ({
				$implicit: contextOrData,
			}),
			data: contextOrData,
			hasBackdrop: options?.hasBackdrop,
			panelClass: cssClassesToArray(options?.panelClass),
			backdropClass: cssClassesToArray(options?.backdropClass, 'bg-transparent'),
			positionStrategy,
			scrollStrategy: options?.scrollStrategy ?? this._sso?.block(),
			restoreFocus: options?.restoreFocus,
			disableClose: true,
			autoFocus: options?.autoFocus ?? 'first-tabbable',
			ariaDescribedBy: options?.ariaDescribedBy ?? `brn-dialog-description-${dialogId}`,
			ariaLabelledBy: options?.ariaLabelledBy ?? `brn-dialog-title-${dialogId}`,
			ariaLabel: options?.ariaLabel,
			ariaModal: options?.ariaModal,
			providers: (cdkDialogRef) => {
				brnDialogRef = new BrnDialogRef(cdkDialogRef, open, state, dialogId, options as BrnDialogOptions);

				runInInjectionContext(this._injector, () => {
					effectRef = effect(() => {
						// wait for next microtask to ensure position strategy has applied the last position
						new Promise<void>((resolve) => resolve()).then(() => {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const lastPosition = (cdkDialogRef.overlayRef as any)['_positionStrategy'][
								'_lastPosition'
							] as ConnectionPositionPair;
							// set transform origin based on last position as css var to be exposed to cdk projected content
							this._renderer.setAttribute(
								overlay,
								'style',
								`${overlay.style.cssText}
							--brn-dialog-transform-origin: ${getTransformOrigin(lastPosition)};`,
							);
							if (overlay) {
								this._renderer.setAttribute(overlay, 'data-state', state());
							}
							if (backdrop) {
								this._renderer.setAttribute(backdrop, 'data-state', state());
							}
						});
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

		if (options?.closeOnOutsidePointerEvents) {
			cdkDialogRef.outsidePointerEvents.pipe(takeUntil(destroyed$)).subscribe(() => {
				// only close if this is the topmost overlay
				if (this._overlayCloseDispatcher._attachedOverlays.at(-1) === cdkDialogRef.overlayRef) {
					brnDialogRef.close(undefined, options?.closeDelay);
				}
			});
		}

		if (options?.closeOnBackdropClick) {
			cdkDialogRef.backdropClick.pipe(takeUntil(destroyed$)).subscribe(() => {
				brnDialogRef.close(undefined, options?.closeDelay);
			});
		}

		if (!options?.disableClose) {
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
}
