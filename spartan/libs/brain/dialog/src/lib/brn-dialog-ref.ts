import type { DialogRef } from '@angular/cdk/dialog';
import type { Signal, WritableSignal } from '@angular/core';
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

	constructor(
		private readonly _cdkDialogRef: DialogRef<DialogResult>,
		private readonly _open: WritableSignal<boolean>,
		public readonly state: Signal<BrnDialogState>,
		public readonly dialogId: number,
		private readonly _options?: BrnDialogOptions,
	) {
		this.closed$ = this._cdkDialogRef.closed.pipe(take(1));
	}

	public close(result?: DialogResult, delay: number = this._options?.closeDelay ?? 0) {
		if (!this.open || this._options?.disableClose) return;

		this._closing$.next();
		this._open.set(false);

		if (this._previousTimeout) {
			clearTimeout(this._previousTimeout);
		}

		this._previousTimeout = setTimeout(() => {
			this._cdkDialogRef.close(result);
		}, delay);
	}

	public setPanelClass(paneClass: string | null | undefined) {
		this._cdkDialogRef.config.panelClass = cssClassesToArray(paneClass);
	}

	public setOverlayClass(overlayClass: string | null | undefined) {
		this._cdkDialogRef.config.backdropClass = cssClassesToArray(overlayClass);
	}

	public setAriaDescribedBy(ariaDescribedBy: string | null | undefined) {
		this._cdkDialogRef.config.ariaDescribedBy = ariaDescribedBy;
	}

	public setAriaLabelledBy(ariaLabelledBy: string | null | undefined) {
		this._cdkDialogRef.config.ariaLabelledBy = ariaLabelledBy;
	}

	public setAriaLabel(ariaLabel: string | null | undefined) {
		this._cdkDialogRef.config.ariaLabel = ariaLabel;
	}
}
