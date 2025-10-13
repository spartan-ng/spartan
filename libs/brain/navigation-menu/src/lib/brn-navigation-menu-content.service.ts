import { FlexibleConnectedPositionStrategy, Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { inject, Injectable, NgZone, signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, switchMap } from 'rxjs';

@Injectable()
export class BrnNavigationMenuContentService {
	private readonly _overlay = inject(Overlay);
	private readonly _zone = inject(NgZone);
	private readonly _psBuilder = inject(OverlayPositionBuilder);

	private readonly _content = signal<TemplatePortal<unknown> | null>(null);
	private readonly _state = signal<'open' | 'closed'>('closed');

	// private _config: BrnHoverCardOptions = {};
	private _overlayRef?: OverlayRef;
	private _positionStrategy?: FlexibleConnectedPositionStrategy;
	private _destroyed$ = new Subject<void>();

	private readonly _overlayHoveredObservables$ = new BehaviorSubject<Observable<boolean> | undefined>(undefined);

	public readonly hovered$: Observable<boolean> = this._overlayHoveredObservables$.pipe(
		switchMap((overlayHoveredObservable) => (overlayHoveredObservable ? overlayHoveredObservable : of(false))),
	);

	public setContent(value: TemplateRef<unknown>, vcr: ViewContainerRef) {
		this._content.set(new TemplatePortal<unknown>(value, vcr));

		if (!this._overlayRef) {
			// this._overlay.create(this._config);
			this._overlayRef = this._overlay.create();
		}
	}
}
