import {
	ConnectedPosition,
	FlexibleConnectedPositionStrategy,
	Overlay,
	OverlayConfig,
	OverlayPositionBuilder,
	OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ElementRef, inject, Injectable, NgZone, signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { createHoverObservable } from '@spartan-ng/brain/core';
import { BehaviorSubject, Observable, of, Subject, switchMap } from 'rxjs';

export type BrnNavigationMenuContentOptions = Partial<
	{
		attachTo: ElementRef;
	} & OverlayConfig
>;

const bottomFirstPositions: ConnectedPosition[] = [
	{
		originX: 'start',
		originY: 'bottom',
		overlayX: 'start',
		overlayY: 'top',
	},
	{
		originX: 'start',
		originY: 'top',
		overlayX: 'start',
		overlayY: 'bottom',
	},
];

@Injectable()
export class BrnNavigationMenuContentService {
	private readonly _overlay = inject(Overlay);
	private readonly _zone = inject(NgZone);
	private readonly _psBuilder = inject(OverlayPositionBuilder);

	private readonly _content = signal<TemplatePortal<unknown> | null>(null);

	private _config: BrnNavigationMenuContentOptions = {};
	private _overlayRef?: OverlayRef;
	private _positionStrategy?: FlexibleConnectedPositionStrategy;
	private _destroyed$ = new Subject<void>();

	private readonly _contentEl = signal<HTMLElement | undefined>(undefined);
	public readonly contentEl = this._contentEl.asReadonly();

	private readonly _overlayHoveredObservables$ = new BehaviorSubject<Observable<boolean> | undefined>(undefined);

	public readonly hovered$: Observable<boolean> = this._overlayHoveredObservables$.pipe(
		switchMap((overlayHoveredObservable) => (overlayHoveredObservable ? overlayHoveredObservable : of(false))),
	);

	public setConfig(config: BrnNavigationMenuContentOptions) {
		this._config = config;
		if (config.attachTo) {
			this._positionStrategy = this._psBuilder
				.flexibleConnectedTo(config.attachTo)
				.withPositions(bottomFirstPositions)
				.withDefaultOffsetY(0)
				.withDefaultOffsetX(0);
			this._config = {
				...this._config,
				positionStrategy: this._positionStrategy,
				scrollStrategy: this._overlay.scrollStrategies.reposition(),
			};
		}
		this._overlayRef = this._overlay.create(this._config);
	}

	public setContent(value: TemplateRef<unknown>, vcr: ViewContainerRef) {
		this._content.set(new TemplatePortal<unknown>(value, vcr));

		if (!this._overlayRef) {
			this._overlayRef = this._overlay.create(this._config);
		}
	}

	public show() {
		const content = this._content();
		if (!content || !this._overlayRef) return;

		this._overlayRef?.detach();
		const embededViewRef = this._overlayRef?.attach(content);

		this._destroyed$ = new Subject<void>();

		this._contentEl.set(embededViewRef.rootNodes[0] as HTMLElement);
		this._overlayHoveredObservables$.next(
			createHoverObservable(this._overlayRef.hostElement, this._zone, this._destroyed$),
		);
	}

	public hide() {
		this._overlayRef?.detach();
		this._contentEl.set(undefined);

		this._destroyed$.next();
		this._destroyed$.complete();
		this._destroyed$ = new Subject<void>();
	}
}
