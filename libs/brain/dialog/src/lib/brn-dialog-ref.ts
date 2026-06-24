import type { DialogRef } from '@angular/cdk/dialog';
import { afterNextRender, computed, type Injector, signal } from '@angular/core';
import { getActiveElementAnimations, waitForAnimations } from '@spartan-ng/brain/core';
import { type Observable, ReplaySubject, Subject } from 'rxjs';
import type { BrnDialogOptions } from './brn-dialog-options';
import type { BrnDialogDismissReason, BrnDialogPhase, BrnDialogState } from './brn-dialog-state';
import { cssClassesToArray } from './brn-dialog-utils';

export class BrnDialogRef<DialogResult = unknown> {
	private readonly _closing = new Subject<void>();
	public readonly closing$ = this._closing.asObservable();

	private readonly _closed = new ReplaySubject<DialogResult | undefined>(1);
	public readonly closed$: Observable<DialogResult | undefined> = this._closed.asObservable();

	private readonly _stateChanged = new ReplaySubject<BrnDialogState>(1);
	public readonly stateChanged$ = this._stateChanged.asObservable();

	private readonly _phase = signal<BrnDialogPhase>('open');
	public readonly phase = this._phase.asReadonly();
	public readonly state = computed<BrnDialogState>(() => (this._phase() === 'open' ? 'open' : 'closed'));

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
		private readonly _cdkDialogRef: DialogRef<DialogResult>,
		private readonly _injector: Injector,
		public readonly dialogId: number,
		private readonly initialOptions: BrnDialogOptions,
	) {
		this._panelClasses = cssClassesToArray(initialOptions.panelClass);
		this._backdropClasses = cssClassesToArray(initialOptions.backdropClass);
		this._setDataState('open');
		this._stateChanged.next('open');

		this._cdkDialogRef.closed.subscribe((result) => {
			this._phase.set('closed');
			this._closed.next(result);
			this._closed.complete();
			this._closing.complete();
			this._stateChanged.complete();
		});
	}

	public close(result?: DialogResult): void {
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

	public dismiss(reason: BrnDialogDismissReason): boolean {
		const options = this.initialOptions;
		if (!this.open || options.disableClose) return false;
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

	public forceClose(result?: DialogResult): void {
		if (this._phase() === 'closed') return;

		this._closeGeneration++;
		this._phase.set('closed');
		this._cdkDialogRef.close(result);
	}

	public setPanelClass(panelClass: string | string[] | null | undefined): void {
		if (this._panelClasses.length) this._cdkDialogRef.removePanelClass(this._panelClasses);
		this._panelClasses = cssClassesToArray(panelClass);
		if (this._panelClasses.length) this._cdkDialogRef.addPanelClass(this._panelClasses);
	}

	public setOverlayClass(overlayClass: string | string[] | null | undefined): void {
		const backdrop = this._cdkDialogRef.overlayRef.backdropElement;
		if (!backdrop) return;

		backdrop.classList.remove(...this._backdropClasses);
		this._backdropClasses = cssClassesToArray(overlayClass);
		backdrop.classList.add(...this._backdropClasses);
	}

	public updatePosition(): void {
		this._cdkDialogRef.updatePosition();
	}

	private async _finishClose(
		generation: number,
		animationsBeforeClose: ReadonlySet<Animation>,
		result?: DialogResult,
	): Promise<void> {
		if (generation !== this._closeGeneration || this._phase() !== 'closing') return;

		const exitAnimations = this._getActiveAnimations().filter((animation) => !animationsBeforeClose.has(animation));
		// Pin each exit animation to its final frame. tw-animate-css uses `animation-fill-mode: none`,
		// so a finished exit reverts the element to its visible state in the gap before we dispose it -
		// that one-frame snap-back is the flicker. updateTiming pins only the animations we await.
		for (const animation of exitAnimations) {
			animation.effect?.updateTiming({ fill: 'forwards' });
		}
		await waitForAnimations(exitAnimations);

		if (generation === this._closeGeneration && this._phase() === 'closing') {
			this._phase.set('closed');
			this._cdkDialogRef.close(result);
		}
	}

	private _getActiveAnimations(): Animation[] {
		return getActiveElementAnimations([
			this._cdkDialogRef.overlayRef.overlayElement,
			this._cdkDialogRef.overlayRef.backdropElement,
		]);
	}

	private _setDataState(state: BrnDialogState): void {
		this._cdkDialogRef.overlayRef.overlayElement.setAttribute('data-state', state);
		this._cdkDialogRef.overlayRef.backdropElement?.setAttribute('data-state', state);
	}
}
