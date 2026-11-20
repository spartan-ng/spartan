import type { DialogRef } from '@angular/cdk/dialog';
import { afterNextRender, computed, type Injector, signal } from '@angular/core';
import { getActiveElementAnimations, waitForAnimations } from '@spartan-ng/brain/core';
import { type Observable, ReplaySubject, Subject } from 'rxjs';
import type { BrnDialogOptions } from './brn-dialog-options';
import type {
	BrnDialogDismissReason,
	BrnDialogPhase,
	BrnDialogState,
	BrnDialogTransitionStatus,
} from './brn-dialog-state';
import { cssClassesToArray } from './brn-dialog-utils';

const STARTING_STYLE_ATTRIBUTE = 'data-starting-style';
const ENDING_STYLE_ATTRIBUTE = 'data-ending-style';

export class BrnDialogRef<DialogResult = unknown> {
	private readonly _closing = new Subject<void>();
	public readonly closing$ = this._closing.asObservable();

	private readonly _closed = new ReplaySubject<DialogResult | undefined>(1);
	public readonly closed$: Observable<DialogResult | undefined> = this._closed.asObservable();

	private readonly _stateChanged = new ReplaySubject<BrnDialogState>(1);
	public readonly stateChanged$ = this._stateChanged.asObservable();

	/** Emits `true` once the open transition finished and `false` once the close transition finished. */
	private readonly _openChangeComplete = new Subject<boolean>();
	public readonly openChangeComplete$ = this._openChangeComplete.asObservable();

	private readonly _phase = signal<BrnDialogPhase>('open');
	public readonly phase = this._phase.asReadonly();
	public readonly state = computed<BrnDialogState>(() => (this._phase() === 'open' ? 'open' : 'closed'));

	private readonly _transitionStatus = signal<BrnDialogTransitionStatus>('starting');
	public readonly transitionStatus = this._transitionStatus.asReadonly();

	private _closeGeneration = 0;
	private _openGeneration = 0;
	private _startingFrame: number | null = null;
	private _panelClasses: string[];
	private _backdropClasses: string[];
	private readonly _descriptionIds = new Set<string>();

	public get open(): boolean {
		return this._phase() === 'open';
	}

	public get id(): string {
		return this.initialOptions.id;
	}

	/** The overlay pane the dialog is rendered in. */
	public get overlayElement(): HTMLElement {
		return this._cdkDialogRef.overlayRef.overlayElement;
	}

	/** The overlay backdrop, if the dialog has one. */
	public get backdropElement(): HTMLElement | null {
		return this._cdkDialogRef.overlayRef.backdropElement;
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
		this._setTransitionStatus('starting');
		this._stateChanged.next('open');

		afterNextRender(
			() => {
				// The container's `aria-describedby` host binding writes `null` on its first pass, which can
				// wipe the attribute set while the declarative content view is created. Re-assert once after.
				this._syncAriaDescribedBy();
				this._endStartingStyle();
			},
			{ injector: this._injector },
		);

		this._cdkDialogRef.closed.subscribe((result) => {
			this._cancelStartingFrame();
			this._phase.set('closed');
			this._transitionStatus.set(undefined);
			this._closed.next(result);
			this._closed.complete();
			this._closing.complete();
			this._stateChanged.complete();
			this._openChangeComplete.complete();
		});
	}

	public close(result?: DialogResult): void {
		if (!this.open) return;

		const generation = ++this._closeGeneration;
		this._openGeneration++;
		this._cancelStartingFrame();
		const animationsBeforeClose = new Set(this._getActiveAnimations());

		this._phase.set('closing');
		this._setDataState('closed');
		this._setTransitionStatus('ending');
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
		const isOutsideInteraction = reason === 'outside' || reason === 'backdrop';
		const outsideCloseAllowed = options.closeOnOutsidePointerEvents;
		if (!this.open || options.disableClose) return false;
		if (isOutsideInteraction && !outsideCloseAllowed) return false;

		this.close();
		return true;
	}

	public reopen(): void {
		if (this._phase() !== 'closing') return;

		this._closeGeneration++;
		this._phase.set('open');
		this._setDataState('open');
		this._setTransitionStatus(undefined);
		this._stateChanged.next('open');

		afterNextRender(() => void this._completeOpen(), { injector: this._injector });
	}

	public forceClose(result?: DialogResult): void {
		if (this._phase() === 'closed') return;

		this._closeGeneration++;
		this._openGeneration++;
		this._phase.set('closed');
		this._openChangeComplete.next(false);
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

	public registerDescription(id: string): void {
		this._descriptionIds.add(id);
		this._syncAriaDescribedBy();
	}

	public unregisterDescription(id: string): void {
		this._descriptionIds.delete(id);
		this._syncAriaDescribedBy();
	}

	private _syncAriaDescribedBy(): void {
		if (this.initialOptions.ariaDescribedBy !== undefined) return;

		const id = this._descriptionIds.size ? [...this._descriptionIds].join(' ') : undefined;
		const container = this._cdkDialogRef.overlayRef.overlayElement?.querySelector('cdk-dialog-container');

		if (id) {
			container?.setAttribute('aria-describedby', id);
		} else {
			container?.removeAttribute('aria-describedby');
		}
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
			this._openChangeComplete.next(false);
			this._cdkDialogRef.close(result);
		}
	}

	/**
	 * Keeps `data-starting-style` for exactly one rendered frame, so CSS transitions run from the
	 * starting style to the open style. Layout is flushed first: without a computed starting style
	 * (on the overlay and everything rendered inside it) the browser has nothing to transition from.
	 */
	private _endStartingStyle(): void {
		if (this._transitionStatus() !== 'starting') return;

		void this._cdkDialogRef.overlayRef.overlayElement.offsetWidth;

		this._startingFrame = requestAnimationFrame(() => {
			this._startingFrame = null;
			if (this._transitionStatus() !== 'starting') return;
			this._setTransitionStatus(undefined);
			void this._completeOpen();
		});
	}

	private _cancelStartingFrame(): void {
		if (this._startingFrame === null) return;
		cancelAnimationFrame(this._startingFrame);
		this._startingFrame = null;
	}

	private async _completeOpen(): Promise<void> {
		const generation = ++this._openGeneration;
		await waitForAnimations(this._getActiveAnimations());
		if (generation === this._openGeneration && this._phase() === 'open') this._openChangeComplete.next(true);
	}

	private _setTransitionStatus(status: BrnDialogTransitionStatus): void {
		this._transitionStatus.set(status);
		const { overlayElement, backdropElement } = this._cdkDialogRef.overlayRef;
		for (const element of [overlayElement, backdropElement]) {
			element?.toggleAttribute(STARTING_STYLE_ATTRIBUTE, status === 'starting');
			element?.toggleAttribute(ENDING_STYLE_ATTRIBUTE, status === 'ending');
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
