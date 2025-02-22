import { FocusMonitor } from '@angular/cdk/a11y';
import {
	type ConnectedOverlayPositionChange,
	type ConnectedPosition,
	type FlexibleConnectedPositionStrategy,
	Overlay,
	type OverlayConfig,
	OverlayPositionBuilder,
	type OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
	computed,
	Directive,
	effect,
	ElementRef,
	inject,
	Injectable,
	input,
	NgZone,
	type OnDestroy,
	type OnInit,
	type Signal,
	signal,
	TemplateRef,
	untracked,
	ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	type ExposesSide,
	type ExposesState,
	provideExposedSideProviderExisting,
	provideExposesStateProviderExisting,
} from '@spartan-ng/brain/core';
import { BehaviorSubject, fromEvent, merge, Observable, of, Subject } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, share, switchMap, takeUntil, tap } from 'rxjs/operators';
import { createHoverObservable } from './createHoverObservable';

@Directive({
	selector: '[brnHoverCardContent]',
	standalone: true,
	exportAs: 'brnHoverCardContent',
	providers: [
		provideExposedSideProviderExisting(() => BrnHoverCardContentDirective),
		provideExposesStateProviderExisting(() => BrnHoverCardContentDirective),
	],
})
export class BrnHoverCardContentDirective implements ExposesState, ExposesSide {
	private readonly _contentService = inject(BrnHoverCardContentService);
	public readonly state = this._contentService.state;
	public readonly side = this._contentService.side;
	public readonly template = inject(TemplateRef);
}

/**
 * We are building on shoulders of giants here and use the implementation provided by the incredible TaigaUI
 * team: https://github.com/taiga-family/taiga-ui/blob/main/projects/core/directives/dropdown/dropdown-hover.directive.ts
 * Check them out! Give them a try! Leave a star! Their work is incredible!
 */

export type BrnHoverCardOptions = Partial<
	{
		attachTo: ElementRef;
		attachPositions: ConnectedPosition[];
		align: 'top' | 'bottom';
		sideOffset: number;
	} & OverlayConfig
>;

const topFirstPositions: ConnectedPosition[] = [
	{
		originX: 'center',
		originY: 'top',
		overlayX: 'center',
		overlayY: 'bottom',
	},
	{
		originX: 'center',
		originY: 'bottom',
		overlayX: 'center',
		overlayY: 'top',
	},
];
const bottomFirstPositions: ConnectedPosition[] = [
	{
		originX: 'center',
		originY: 'bottom',
		overlayX: 'center',
		overlayY: 'top',
	},
	{
		originX: 'center',
		originY: 'top',
		overlayX: 'center',
		overlayY: 'bottom',
	},
];

@Injectable()
export class BrnHoverCardContentService {
	private readonly _overlay = inject(Overlay);
	private readonly _zone = inject(NgZone);
	private readonly _psBuilder = inject(OverlayPositionBuilder);

	private readonly _content = signal<TemplatePortal<unknown> | null>(null);
	private readonly _state = signal<'open' | 'closed'>('closed');

	private _config: BrnHoverCardOptions = {};
	private _overlayRef?: OverlayRef;
	private _positionStrategy?: FlexibleConnectedPositionStrategy;
	private _destroyed$ = new Subject<void>();

	private readonly _positionChangesObservables$ = new BehaviorSubject<
		Observable<ConnectedOverlayPositionChange> | undefined
	>(undefined);
	private readonly _overlayHoveredObservables$ = new BehaviorSubject<Observable<boolean> | undefined>(undefined);

	public readonly positionChanges$: Observable<ConnectedOverlayPositionChange> = this._positionChangesObservables$.pipe(
		switchMap((positionChangeObservable) => (positionChangeObservable ? positionChangeObservable : of(undefined))),
		filter((change): change is NonNullable<ConnectedOverlayPositionChange> => change !== undefined && change !== null),
	);
	public readonly hovered$: Observable<boolean> = this._overlayHoveredObservables$.pipe(
		switchMap((overlayHoveredObservable) => (overlayHoveredObservable ? overlayHoveredObservable : of(false))),
	);

	public readonly state = this._state.asReadonly();
	public readonly side: Signal<'top' | 'bottom' | 'left' | 'right'> = toSignal(
		this.positionChanges$.pipe(
			map<ConnectedOverlayPositionChange, 'top' | 'bottom' | 'left' | 'right'>((change) =>
				// todo: better translation or adjusting hlm to take that into account
				change.connectionPair.originY === 'center'
					? change.connectionPair.originX === 'start'
						? 'left'
						: 'right'
					: change.connectionPair.originY,
			),
		),
		{ initialValue: 'bottom' },
	);

	public setConfig(config: BrnHoverCardOptions) {
		this._config = config;
		if (config.attachTo) {
			this._positionStrategy = this._psBuilder
				.flexibleConnectedTo(config.attachTo)
				.withPositions((config.attachPositions ?? config.align === 'top') ? topFirstPositions : bottomFirstPositions)
				.withDefaultOffsetY(config.sideOffset ?? 0);
			this._config = {
				...this._config,
				positionStrategy: this._positionStrategy,
				scrollStrategy: this._overlay.scrollStrategies.reposition(),
			};
			this._positionChangesObservables$.next(this._positionStrategy.positionChanges);
		}
		this._overlayRef = this._overlay.create(this._config);
	}

	public setContent(value: TemplateRef<unknown> | BrnHoverCardContentDirective, vcr: ViewContainerRef) {
		this._content.set(new TemplatePortal<unknown>(value instanceof TemplateRef ? value : value.template, vcr));

		if (!this._overlayRef) {
			this._overlayRef = this._overlay.create(this._config);
		}
	}

	public setState(newState: 'open' | 'closed') {
		this._state.set(newState);
	}

	public show() {
		const content = this._content();
		if (!content || !this._overlayRef) return;

		this._overlayRef?.detach();
		this._overlayRef?.attach(content);

		this._destroyed$ = new Subject<void>();

		this._overlayHoveredObservables$.next(
			createHoverObservable(this._overlayRef.hostElement, this._zone, this._destroyed$),
		);
	}

	public hide() {
		this._overlayRef?.detach();
		this._destroyed$.next();
		this._destroyed$.complete();
		this._destroyed$ = new Subject<void>();
	}
}

@Directive({
	selector: '[brnHoverCardTrigger]:not(ng-container),[brnHoverCardTriggerFor]:not(ng-container)',
	standalone: true,
	exportAs: 'brnHoverCardTrigger',
})
export class BrnHoverCardTriggerDirective implements OnInit, OnDestroy {
	private readonly _destroy$ = new Subject<void>();
	private readonly _vcr = inject(ViewContainerRef);
	private readonly _zone = inject(NgZone);
	private readonly _el = inject(ElementRef);
	private readonly _contentService = inject(BrnHoverCardContentService);
	private readonly _focusMonitor = inject(FocusMonitor);

	public readonly focused$: Observable<boolean> = this._focusMonitor.monitor(this._el).pipe(map((e) => e !== null));

	public readonly hovered$: Observable<boolean> = merge(
		fromEvent(this._el.nativeElement, 'click').pipe(map(() => false)),
		createHoverObservable(this._el.nativeElement, this._zone, this._destroy$),
		this._contentService.hovered$,
		this.focused$,
	).pipe(distinctUntilChanged());
	public readonly showing$: Observable<boolean> = this.hovered$.pipe(
		// we set the state to open here because we are about to open show the content
		tap((visible) => visible && this._contentService.setState('open')),
		switchMap((visible) => {
			// we are delaying based on the configure-able input
			return of(visible).pipe(delay(visible ? this.showDelay() : this.hideDelay()));
		}),
		switchMap((visible) => {
			// don't do anything when we are in the process of showing the content
			if (visible) return of(visible);
			// we set the state to closed here to trigger any animations for the element leaving
			this._contentService.setState('closed');
			// then delay to wait for the leaving animation to finish
			return of(visible).pipe(delay(this.animationDelay()));
		}),
		distinctUntilChanged(),
		share(),
		takeUntil(this._destroy$),
	);

	public showDelay = input(300);
	public hideDelay = input(500);
	public animationDelay = input(100);
	public sideOffset = input(5);
	public align = input<'top' | 'bottom'>('bottom');

	public readonly brnHoverCardTriggerFor = input<TemplateRef<unknown> | BrnHoverCardContentDirective | undefined>(
		undefined,
	);
	public readonly mutableBrnHoverCardTriggerFor = computed(() => signal(this.brnHoverCardTriggerFor()));
	private readonly _brnHoverCardTriggerForState = computed(() => this.mutableBrnHoverCardTriggerFor()());

	constructor() {
		effect(() => {
			const value = this._brnHoverCardTriggerForState();
			untracked(() => {
				if (value) {
					this._contentService.setContent(value, this._vcr);
				}
			});
		});
	}

	public ngOnInit() {
		this._contentService.setConfig({ attachTo: this._el, align: this.align(), sideOffset: this.sideOffset() });
		this.showing$.subscribe((isHovered) => {
			if (isHovered) {
				this._contentService.show();
			} else {
				this._contentService.hide();
			}
		});
	}

	public ngOnDestroy() {
		this._destroy$.next();
		this._destroy$.complete();
	}
}
