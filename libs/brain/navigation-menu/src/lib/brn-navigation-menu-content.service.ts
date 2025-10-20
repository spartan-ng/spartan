import { Direction } from '@angular/cdk/bidi';
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
		orientation: 'horizontal' | 'vertical';
	} & OverlayConfig
>;

const horizontalPositions: ConnectedPosition[] = [
	{
		originX: 'start',
		originY: 'bottom',
		overlayX: 'start',
		overlayY: 'top',
	},
];

const verticalPositions: ConnectedPosition[] = [
	{
		originX: 'end',
		originY: 'top',
		overlayX: 'start',
		overlayY: 'top',
	},
	{
		originX: 'start',
		originY: 'top',
		overlayX: 'end',
		overlayY: 'top',
	},
];

@Injectable()
export class BrnNavigationMenuContentService {
	private readonly _overlay = inject(Overlay);
	private readonly _zone = inject(NgZone);
	private readonly _psBuilder = inject(OverlayPositionBuilder);

	private readonly _content = signal<TemplatePortal<unknown> | null>(null);

	private _shouldDetach = false;

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
			const positions = this._getPositions(config.orientation);
			this._positionStrategy = this._buildPositionStrategy(config.attachTo, positions);

			this._config = {
				...this._config,
				positionStrategy: this._positionStrategy,
				scrollStrategy: this._overlay.scrollStrategies.reposition(),
			};
		}

		this._overlayRef = this._overlay.create(this._config);
	}

	public updateOrientation(orientation: 'horizontal' | 'vertical') {
		if (!this._config.attachTo) return;

		const positions = this._getPositions(orientation);
		this._positionStrategy = this._buildPositionStrategy(this._config.attachTo, positions);

		this._config = {
			...this._config,
			positionStrategy: this._positionStrategy,
			scrollStrategy: this._overlay.scrollStrategies.reposition(),
		};

		this._overlayRef?.updatePositionStrategy(this._positionStrategy);
	}

	public updateDirection(dir: Direction) {
		this._overlayRef?.setDirection(dir);
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
		this._shouldDetach = false;

		this._overlayRef?.detach();
		const embededViewRef = this._overlayRef?.attach(content);

		this._destroyed$ = new Subject<void>();

		const contentEl = embededViewRef.rootNodes[0] as HTMLElement;
		this._contentEl.set(contentEl);

		contentEl.addEventListener('animationend', this._detach);
		contentEl.addEventListener('animationcancel', this._detach);

		this._overlayHoveredObservables$.next(
			createHoverObservable(this._overlayRef.hostElement, this._zone, this._destroyed$),
		);
	}

	public hide() {
		const contentEl = this._contentEl();
		if (!contentEl) return;

		this._shouldDetach = true;
		if (!this._hasAnimation()) {
			this._detach();
		}
	}

	private readonly _detach = () => {
		if (!this._shouldDetach) return;

		this._overlayRef?.detach();
		this._contentEl.set(undefined);

		this._destroyed$.next();
		this._destroyed$.complete();
		this._destroyed$ = new Subject<void>();
	};

	private _hasAnimation() {
		const contentEl = this.contentEl();
		if (!contentEl) return;

		return getComputedStyle(contentEl).animationName !== 'none';
	}

	private _getPositions(orientation?: 'horizontal' | 'vertical') {
		return orientation === 'vertical' ? verticalPositions : horizontalPositions;
	}

	private _buildPositionStrategy(attachTo: ElementRef, positions: ConnectedPosition[]) {
		return this._psBuilder
			.flexibleConnectedTo(attachTo)
			.withPositions(positions)
			.withDefaultOffsetY(0)
			.withDefaultOffsetX(0)
			.withPush(false);
	}
}
