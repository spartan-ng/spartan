import type { ConfigurableFocusTrap } from '@angular/cdk/a11y';
import type { OverlayRef } from '@angular/cdk/overlay';
import { afterNextRender, type Injector, type Signal, signal, untracked, type WritableSignal } from '@angular/core';
import { type Observable, Subject } from 'rxjs';
import type { BrnOverlayOptions } from './brn-overlay-options';
import type { BrnOverlayDismissReason, BrnOverlayPhase, BrnOverlayState } from './brn-overlay-state';

function classesToArray(classes: string | string[] | null | undefined): string[] {
	if (Array.isArray(classes)) return classes;
	return classes?.split(' ').filter(Boolean) ?? [];
}

export class BrnOverlayRef<OverlayResult = unknown> {
	private readonly _closing = new Subject<void>();
	public readonly closing$ = this._closing.asObservable();

	private readonly _closed = new Subject<OverlayResult | undefined>();
	public readonly closed$: Observable<OverlayResult | undefined> = this._closed.asObservable();

	private readonly _phase = signal<BrnOverlayPhase>('open');
	public readonly phase = this._phase.asReadonly();

	private readonly _state = signal<BrnOverlayState>('open');
	public readonly state = this._state.asReadonly();

	private readonly _options: WritableSignal<BrnOverlayOptions>;
	public readonly options: Signal<BrnOverlayOptions>;

	private _closeGeneration = 0;
	private _panelClasses: string[];
	private _backdropClasses: string[];
	private _focusTrap: ConfigurableFocusTrap | null = null;
	private _restoreFocusTarget: HTMLElement | null = null;

	public get open(): boolean {
		return this._phase() === 'open';
	}

	public get dialogId(): number {
		return this.overlayId;
	}

	constructor(
		private readonly _overlayRef: OverlayRef,
		private readonly _injector: Injector,
		public readonly overlayId: number,
		private readonly _initialOptions: BrnOverlayOptions,
		private readonly _onDisposed: () => void,
	) {
		this._options = signal(_initialOptions);
		this.options = this._options.asReadonly();
		this._panelClasses = classesToArray(_initialOptions.panelClass);
		this._backdropClasses = classesToArray(_initialOptions.backdropClass);
		this._applyDataState();
	}

	public updateOptions(options: Partial<BrnOverlayOptions>): void {
		const [previous, next] = untracked(() => {
			const previousOptions = this._options();
			const nextOptions = { ...previousOptions, ...options };
			this._options.set(nextOptions);
			return [previousOptions, nextOptions] as const;
		});

		if (next.panelClass !== previous.panelClass) {
			this.setPanelClass(next.panelClass);
		}
		if (next.backdropClass !== previous.backdropClass) {
			this.setBackdropClass(next.backdropClass);
		}
	}

	public close(result?: OverlayResult): void {
		if (!this.open) return;

		this._startClose(result);
	}

	public dismiss(reason: BrnOverlayDismissReason): boolean {
		if (!this.open || !this._allowsDismissal(reason)) return false;

		this._startClose();
		return true;
	}

	private _allowsDismissal(reason: BrnOverlayDismissReason): boolean {
		const options = this._options();
		if (options.disableClose) return false;

		if (reason === 'backdrop') return options.closeOnBackdropClick;
		if (reason === 'outside') return options.closeOnOutsidePointerEvents;
		return true;
	}

	private _startClose(result?: OverlayResult): void {
		const generation = ++this._closeGeneration;
		const animationsBeforeClose = new Set(this._collectAnimations());

		this._phase.set('closing');
		this._state.set('closed');
		this._applyDataState();
		this._closing.next();

		afterNextRender(
			() => {
				void this._completeCloseAfterAnimations(generation, animationsBeforeClose, result);
			},
			{ injector: this._injector },
		);
	}

	public reopen(): void {
		if (this._phase() !== 'closing') return;

		this._closeGeneration++;
		this._phase.set('open');
		this._state.set('open');
		this._applyDataState();
	}

	public forceClose(result?: OverlayResult): void {
		if (this._phase() === 'closed') return;
		this._closeGeneration++;
		this._dispose(result);
	}

	public setFocusTrap(focusTrap: ConfigurableFocusTrap | null): void {
		this._focusTrap = focusTrap;
	}

	public setRestoreFocusTarget(target: HTMLElement | null): void {
		this._restoreFocusTarget = target;
	}

	public setPanelClass(panelClass: string | string[] | null | undefined): void {
		if (this._panelClasses.length) {
			this._overlayRef.removePanelClass(this._panelClasses);
		}
		this._panelClasses = classesToArray(panelClass);
		if (this._panelClasses.length) {
			this._overlayRef.addPanelClass(this._panelClasses);
		}
	}

	public setBackdropClass(backdropClass: string | string[] | null | undefined): void {
		const backdrop = this._overlayRef.backdropElement;
		if (!backdrop) return;
		backdrop.classList.remove(...this._backdropClasses);
		this._backdropClasses = classesToArray(backdropClass);
		backdrop.classList.add(...this._backdropClasses);
	}

	public setAriaDescribedBy(ariaDescribedBy: string | null | undefined): void {
		this._setAttribute('aria-describedby', ariaDescribedBy);
	}

	public setAriaLabelledBy(ariaLabelledBy: string | null | undefined): void {
		this._setAttribute('aria-labelledby', ariaLabelledBy);
	}

	public setAriaLabel(ariaLabel: string | null | undefined): void {
		this._setAttribute('aria-label', ariaLabel);
	}

	public setAriaModal(ariaModal: boolean): void {
		this._setAttribute('aria-modal', ariaModal ? 'true' : null);
	}

	public updatePosition(): void {
		this._overlayRef.updatePosition();
	}

	private async _completeCloseAfterAnimations(
		generation: number,
		animationsBeforeClose: Set<Animation>,
		result?: OverlayResult,
	): Promise<void> {
		if (generation !== this._closeGeneration || this._phase() !== 'closing') return;

		const exitAnimations = this._collectAnimations().filter((animation) => !animationsBeforeClose.has(animation));
		if (exitAnimations.length) {
			await Promise.allSettled(exitAnimations.map((animation) => animation.finished));
		}

		if (generation === this._closeGeneration && this._phase() === 'closing') {
			this._dispose(result);
		}
	}

	private _collectAnimations(): Animation[] {
		const elements = [this._overlayRef.overlayElement, this._overlayRef.backdropElement].filter(
			(element): element is HTMLElement => !!element,
		);

		return elements.flatMap((element) => {
			if (typeof element.getAnimations !== 'function') return [];
			return element.getAnimations({ subtree: true }).filter((animation) => animation.playState !== 'finished');
		});
	}

	private _dispose(result?: OverlayResult): void {
		this._phase.set('closed');
		this._state.set('closed');
		this._focusTrap?.destroy();
		this._restoreFocus();
		this._overlayRef.dispose();
		this._onDisposed();
		this._closing.complete();
		this._closed.next(result);
		this._closed.complete();
	}

	private _restoreFocus(): void {
		if (!this._options().restoreFocus || !this._restoreFocusTarget) return;

		const activeElement = document.activeElement;
		const overlayElement = this._overlayRef.overlayElement;
		if (
			!activeElement ||
			activeElement === document.body ||
			activeElement === overlayElement ||
			overlayElement.contains(activeElement)
		) {
			this._restoreFocusTarget.focus();
		}
	}

	private _applyDataState(): void {
		const state = this._state();
		this._overlayRef.overlayElement.setAttribute('data-state', state);
		this._overlayRef.backdropElement?.setAttribute('data-state', state);
	}

	private _setAttribute(name: string, value: string | null | undefined): void {
		if (value === null || value === undefined || value === '') {
			this._overlayRef.overlayElement.removeAttribute(name);
		} else {
			this._overlayRef.overlayElement.setAttribute(name, value);
		}
	}
}
