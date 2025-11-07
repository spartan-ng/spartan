import { Direction } from '@angular/cdk/bidi';
import { hasModifierKey } from '@angular/cdk/keycodes';
import {
	ConnectedPosition,
	FlexibleConnectedPositionStrategy,
	Overlay,
	OverlayConfig,
	OverlayPositionBuilder,
	OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
	ElementRef,
	inject,
	Injectable,
	NgZone,
	Renderer2,
	signal,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { createHoverObservable, waitForElementAnimations } from '@spartan-ng/brain/core';
import { BehaviorSubject, fromEvent, Observable, of, Subject } from 'rxjs';
import { map, share, switchMap, takeUntil } from 'rxjs/operators';

export type BrnNavigationMenuContentOptions = Partial<
	{
		attachTo: ElementRef<HTMLElement>;
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
	private static _id = 0;

	private readonly _overlay = inject(Overlay);
	private readonly _zone = inject(NgZone);
	private readonly _psBuilder = inject(OverlayPositionBuilder);
	private readonly _renderer = inject(Renderer2);

	private readonly _content = signal<TemplatePortal<unknown> | null>(null);

	public readonly id = `brn-navigation-menu-content-${++BrnNavigationMenuContentService._id}`;

	private _shouldDetach = false;

	private _config: BrnNavigationMenuContentOptions = {};
	private _overlayRef?: OverlayRef;
	private _positionStrategy?: FlexibleConnectedPositionStrategy;
	private _destroyed$ = new Subject<void>();

	private readonly _contentEl = signal<HTMLElement | undefined>(undefined);
	public readonly contentEl = this._contentEl.asReadonly();

	private readonly _overlayHoveredObservables$ = new BehaviorSubject<Observable<boolean> | undefined>(undefined);

	private readonly _overlayShiftTabObservables$ = new BehaviorSubject<Observable<KeyboardEvent> | undefined>(undefined);

	private readonly _overlayEscapeObservables$ = new BehaviorSubject<Observable<KeyboardEvent> | undefined>(undefined);

	public readonly hovered$: Observable<boolean> = this._overlayHoveredObservables$.pipe(
		switchMap((overlayHoveredObservable) => (overlayHoveredObservable !== undefined ? overlayHoveredObservable : of())),
		share(),
	);

	private readonly _shiftTabPressed$ = this._overlayShiftTabObservables$.pipe(
		switchMap((contentFocused$) => (contentFocused$ !== undefined ? contentFocused$ : of())),
	);

	public readonly escapePressed$ = this._overlayEscapeObservables$.pipe(
		switchMap((contentFocused$) => (contentFocused$ !== undefined ? contentFocused$ : of())),
	);

	constructor() {
		this._shiftTabPressed$.pipe(takeUntil(this._destroyed$)).subscribe((e) => {
			if (this._config.attachTo?.nativeElement) {
				e.preventDefault();
				this._config.attachTo.nativeElement.focus();
			}
		});
	}

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

		const attachToId = this._config.attachTo?.nativeElement.id;

		this._renderer.setAttribute(contentEl, 'id', this.id);
		if (attachToId !== undefined) {
			this._renderer.setAttribute(contentEl, 'aria-labelledby', attachToId);
		}

		this._contentEl.set(contentEl);

		this._overlayHoveredObservables$.next(
			createHoverObservable(this._overlayRef.hostElement, this._zone, this._destroyed$).pipe(map((e) => e.hover)),
		);

		this._overlayShiftTabObservables$.next(
			fromEvent<KeyboardEvent>(contentEl, 'keydown').pipe(
				switchMap((e) => (e.key === 'Tab' && e.shiftKey && e.target === this.contentEl() ? of(e) : of())),
				takeUntil(this._destroyed$),
			),
		);

		this._overlayEscapeObservables$.next(
			fromEvent<KeyboardEvent>(contentEl, 'keydown').pipe(
				switchMap((e) => (e.key === 'Escape' && !hasModifierKey(e) ? of(e) : of())),
				takeUntil(this._destroyed$),
			),
		);
	}

	public async hide() {
		const contentEl = this._contentEl();
		if (!contentEl) return;

		this._shouldDetach = true;
		if (!this._hasAnimation()) {
			this._detach();
		}

		await waitForElementAnimations(contentEl);
		this._detach();
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
