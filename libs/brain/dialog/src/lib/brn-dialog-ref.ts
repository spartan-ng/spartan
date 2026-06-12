import type { DialogRef } from '@angular/cdk/dialog';
import type { Signal, WritableSignal } from '@angular/core';
import { signal } from '@angular/core';
import { type Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import type { BrnDialogOptions } from './brn-dialog-options';
import type { BrnDialogState } from './brn-dialog-state';
import { cssClassesToArray } from './brn-dialog-utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class BrnDialogRef<DialogResult = any> {
	private readonly _closing$ = new Subject<void>();
	public readonly closing$ = this._closing$.asObservable();

	public readonly closed$: Observable<DialogResult | undefined>;

	private _previousTimeout: ReturnType<typeof setTimeout> | undefined;

	public get open() {
		return this.state() === 'open';
	}

	private readonly _options = signal<undefined | BrnDialogOptions>(undefined);
	public readonly options = this._options.asReadonly();

	constructor(
		private readonly _cdkDialogRef: DialogRef<DialogResult>,
		private readonly _open: WritableSignal<boolean>,
		public readonly state: Signal<BrnDialogState>,
		public readonly dialogId: number,
		_options?: BrnDialogOptions,
	) {
		if (_options) {
			this._options.set(_options);
		}
		this.closed$ = this._cdkDialogRef.closed.pipe(take(1));
	}

	public updateOptions(options: Partial<BrnDialogOptions>): void {
		this._options.update((prev) => ({ ...(prev ?? {}), ...options }) as BrnDialogOptions);
	}

	public close(result?: DialogResult, delay: number = this._options()?.closeDelay ?? 0): void {
		if (!this.open || this._options()?.disableClose) return;

		this._closing$.next();
		this._open.set(false);

		if (this._previousTimeout) {
			clearTimeout(this._previousTimeout);
		}

		this._previousTimeout = setTimeout(() => {
			// Clear the handle once the teardown actually runs so a fired timeout is
			// distinguishable from a pending one - this is what lets _reopen() know
			// the overlay is gone and refuse to revive it.
			this._previousTimeout = undefined;
			this._cdkDialogRef.close(result);
		}, delay);
	}

	/**
	 * Revive a dialog whose close() was called but whose deferred CDK teardown
	 * (the `closeDelay` window) has not run yet: cancels the pending teardown and
	 * restores the open state, so a re-open landing inside that window re-shows
	 * the existing overlay instead of being dropped and flickering closed.
	 *
	 * No-ops unless a teardown is actually pending, so it can never force an
	 * already-closed (disposed) overlay back open.
	 *
	 * @internal Only `BrnDialog.open()` should call this.
	 */
	public _reopen(): void {
		if (!this._previousTimeout) return;
		clearTimeout(this._previousTimeout);
		this._previousTimeout = undefined;
		this._open.set(true);
	}

	public setPanelClass(paneClass: string | null | undefined): void {
		this._cdkDialogRef.config.panelClass = cssClassesToArray(paneClass);
	}

	public setOverlayClass(overlayClass: string | null | undefined): void {
		this._cdkDialogRef.config.backdropClass = cssClassesToArray(overlayClass);
	}

	public setAriaDescribedBy(ariaDescribedBy: string | null | undefined): void {
		this._cdkDialogRef.config.ariaDescribedBy = ariaDescribedBy;
	}

	public setAriaLabelledBy(ariaLabelledBy: string | null | undefined): void {
		this._cdkDialogRef.config.ariaLabelledBy = ariaLabelledBy;
	}

	public setAriaLabel(ariaLabel: string | null | undefined): void {
		this._cdkDialogRef.config.ariaLabel = ariaLabel;
	}

	public updatePosition(): void {
		this._cdkDialogRef.overlayRef?.updatePosition();
	}
}
