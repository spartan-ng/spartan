import type { DialogRef } from '@angular/cdk/dialog';
import type { Signal, WritableSignal } from '@angular/core';
import { signal } from '@angular/core';
import { type Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import type { BrnDialogOptions } from './brn-dialog-options';
import type { BrnDialogState } from './brn-dialog-state';
import { cssClassesToArray } from './brn-dialog-utils';

// Absolute ceiling so a stuck/never-ending exit animation can never pin the
// overlay open. Comfortably longer than any reasonable close animation.
const MAX_EXIT_ANIMATION_MS = 3000;

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
			this._previousTimeout = undefined;
		}

		const finalize = () => this._cdkDialogRef.close(result);

		// The dialog content is attached as a portal *inside* the CDK dialog container.
		// Disposing the overlay (or detaching the container portal) tears the whole
		// container subtree out of the DOM in a single removal, so Angular never
		// individually removes the content element and `animate.leave` on it never
		// fires - the exit animation is skipped and the panel is yanked mid-close (the
		// intermittent flicker). Detaching just the *content* portal removes the content
		// element on its own, through Angular's animation-aware renderer, so
		// `animate.leave` coordinates the exit and the element is only removed once the
		// animation has finished. We dispose the overlay once the content has actually
		// left the DOM, with a safety ceiling so a stuck/absent animation can never pin
		// the overlay open. Falls back to a timed teardown where the content portal is
		// unreachable or the DOM APIs are unavailable (SSR).
		const container = this._cdkDialogRef.containerInstance as unknown as
			| {
					_portalOutlet?: { hasAttached(): boolean; detach(): void };
					_elementRef?: { nativeElement?: HTMLElement };
			  }
			| null
			| undefined;
		const contentOutlet = container?._portalOutlet;
		const host = container?._elementRef?.nativeElement;
		// The content sits alongside the focus-trap anchors the container injects; the
		// single non-anchor child is the element that carries `animate.leave`.
		const content = host
			? Array.from(host.children).find((el) => !el.classList.contains('cdk-focus-trap-anchor'))
			: undefined;

		if (contentOutlet?.hasAttached() && host && content && typeof MutationObserver !== 'undefined') {
			let finalized = false;
			const done = (): void => {
				if (finalized) return;
				finalized = true;
				observer.disconnect();
				if (this._previousTimeout) {
					clearTimeout(this._previousTimeout);
					this._previousTimeout = undefined;
				}
				finalize();
			};
			const observer = new MutationObserver(() => {
				if (!host.contains(content)) done();
			});
			observer.observe(host, { childList: true });
			this._previousTimeout = setTimeout(done, MAX_EXIT_ANIMATION_MS);
			contentOutlet.detach();
			// Content without an exit animation is already gone synchronously.
			if (!host.contains(content)) done();
			return;
		}

		// SSR / no DOM -> timed teardown (preserves the exit animation for content that
		// has not adopted `animate.leave`).
		this._previousTimeout = setTimeout(finalize, delay);
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
