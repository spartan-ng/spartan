import type { OverlayRef } from '@angular/cdk/overlay';
import { afterNextRender, computed, type Injector, signal } from '@angular/core';
import { cssClassesToArray, getActiveElementAnimations, waitForAnimations } from '@spartan-ng/brain/core';
import { type Observable, ReplaySubject, Subject } from 'rxjs';
import type { BrnOverlayOptions } from './brn-overlay-options';
import type { BrnOverlayDismissReason, BrnOverlayPhase, BrnOverlayState } from './brn-overlay-state';

export class BrnOverlayRef<OverlayResult = unknown> {
	private readonly _closing = new Subject<void>();
	public readonly closing$ = this._closing.asObservable();

	private readonly _closed = new ReplaySubject<OverlayResult | undefined>(1);
	public readonly closed$: Observable<OverlayResult | undefined> = this._closed.asObservable();

	private readonly _stateChanged = new ReplaySubject<BrnOverlayState>(1);
	public readonly stateChanged$ = this._stateChanged.asObservable();

	private readonly _phase = signal<BrnOverlayPhase>('open');
	public readonly phase = this._phase.asReadonly();
	public readonly state = computed<BrnOverlayState>(() => (this._phase() === 'open' ? 'open' : 'closed'));

	private _closeGeneration = 0;
	private _panelClasses: string[];
	private _backdropClasses: string[];

	public get open(): boolean {
		return this._phase() === 'open';
	}

	public get id(): string {
		return this.initialOptions.id;
	}

	constructor(
		private readonly _overlayRef: OverlayRef,
		private readonly _injector: Injector,
		public readonly overlayId: number,
		private readonly initialOptions: BrnOverlayOptions,
		private readonly _onDisposed: () => void,
	) {
		this._panelClasses = cssClassesToArray(initialOptions.panelClass);
		this._backdropClasses = cssClassesToArray(initialOptions.backdropClass);
		this._setDataState('open');
		this._stateChanged.next('open');
	}

	public close(result?: OverlayResult): void {
		if (!this.open) return;

		const generation = ++this._closeGeneration;
		const animationsBeforeClose = new Set(this._getActiveAnimations());

		this._phase.set('closing');
		this._setDataState('closed');
		this._closing.next();
		this._stateChanged.next('closed');

		afterNextRender(
			() => {
				void this._finishClose(generation, animationsBeforeClose, result);
			},
			{ injector: this._injector },
		);
	}

	public dismiss(reason: BrnOverlayDismissReason): boolean {
		const options = this.initialOptions;
		if (!this.open || options.disableClose) return false;
		if (reason === 'backdrop' && !options.closeOnBackdropClick) return false;
		if (reason === 'outside' && !options.closeOnOutsidePointerEvents) return false;

		this.close();
		return true;
	}

	public reopen(): void {
		if (this._phase() !== 'closing') return;

		this._closeGeneration++;
		this._phase.set('open');
		this._setDataState('open');
		this._stateChanged.next('open');
	}

	public forceClose(result?: OverlayResult): void {
		if (this._phase() === 'closed') return;

		this._closeGeneration++;
		this._dispose(result);
	}

	public setPanelClass(panelClass: string | string[] | null | undefined): void {
		if (this._panelClasses.length) this._overlayRef.removePanelClass(this._panelClasses);
		this._panelClasses = cssClassesToArray(panelClass);
		if (this._panelClasses.length) this._overlayRef.addPanelClass(this._panelClasses);
	}

	public setBackdropClass(backdropClass: string | string[] | null | undefined): void {
		const backdrop = this._overlayRef.backdropElement;
		if (!backdrop) return;

		backdrop.classList.remove(...this._backdropClasses);
		this._backdropClasses = cssClassesToArray(backdropClass);
		backdrop.classList.add(...this._backdropClasses);
	}

	public updatePosition(): void {
		this._overlayRef.updatePosition();
	}

	private async _finishClose(
		generation: number,
		animationsBeforeClose: ReadonlySet<Animation>,
		result?: OverlayResult,
	): Promise<void> {
		if (generation !== this._closeGeneration || this._phase() !== 'closing') return;

		const exitAnimations = this._getActiveAnimations().filter((animation) => !animationsBeforeClose.has(animation));
		await waitForAnimations(exitAnimations);

		if (generation === this._closeGeneration && this._phase() === 'closing') {
			this._dispose(result);
		}
	}

	private _dispose(result?: OverlayResult): void {
		this._phase.set('closed');
		this._overlayRef.dispose();
		this._onDisposed();
		this._closed.next(result);
		this._closed.complete();
		this._closing.complete();
		this._stateChanged.complete();
	}

	private _getActiveAnimations(): Animation[] {
		return getActiveElementAnimations([this._overlayRef.overlayElement, this._overlayRef.backdropElement]);
	}

	private _setDataState(state: BrnOverlayState): void {
		this._overlayRef.overlayElement.setAttribute('data-state', state);
		this._overlayRef.backdropElement?.setAttribute('data-state', state);
	}
}
