/**
 * We are building on shoulders of giants here and adapt the implementation provided by the incredible Angular
 * team: https://github.com/angular/components/blob/main/src/material/tooltip/tooltip.ts
 * Check them out! Give them a try! Leave a star! Their work is incredible!
 */

import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	inject,
	type OnDestroy,
	PLATFORM_ID,
	Renderer2,
	signal,
	type TemplateRef,
	viewChild,
	ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
@Component({
	selector: 'brn-tooltip-content',
	template: `
		<div
			(mouseenter)="_contentHovered.set(true)"
			(mouseleave)="_contentHovered.set(false)"
			[class]="_tooltipClasses()"
			[style.visibility]="'hidden'"
			#tooltip
		>
			@if (_isTypeOfString(content)) {
				{{ content }}
			} @else {
				<ng-container [ngTemplateOutlet]="content" />
			}
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		// Forces the element to have a layout in IE and Edge. This fixes issues where the element
		// won't be rendered if the animations are disabled or there is no web animations polyfill.
		'[style.zoom]': 'isVisible() ? 1 : null',
		'(mouseleave)': '_handleMouseLeave($event)',
		'aria-hidden': 'true',
	},
	imports: [NgTemplateOutlet],
})
export class BrnTooltipContentComponent implements OnDestroy {
	private readonly _cdr = inject(ChangeDetectorRef);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _renderer2 = inject(Renderer2);

	protected readonly _contentHovered = signal(false);

	public readonly _tooltipClasses = signal('');
	public readonly side = signal('above');
	/** Message to display in the tooltip */
	public content: string | TemplateRef<unknown> | null = null;

	/** The timeout ID of any current timer set to show the tooltip */
	private _showTimeoutId: ReturnType<typeof setTimeout> | undefined;
	/** The timeout ID of any current timer set to hide the tooltip */
	private _hideTimeoutId: ReturnType<typeof setTimeout> | undefined;
	/** The timeout ID of any current timer set to animate the tooltip */
	private _animateTimeoutId: ReturnType<typeof setTimeout> | undefined;

	/** Element that caused the tooltip to open. */
	public _triggerElement?: HTMLElement;

	/** Amount of milliseconds to delay the closing sequence. */
	public _mouseLeaveHideDelay = 0;
	/** Amount of milliseconds of closing animation. */
	public _exitAnimationDuration = 0;

	/** Reference to the internal tooltip element. */
	public _tooltip = viewChild('tooltip', { read: ElementRef<HTMLElement> });

	/** Whether interactions on the page should close the tooltip */
	private _closeOnInteraction = false;

	/** Whether the tooltip is currently visible. */
	private _isVisible = false;

	/** Subject for notifying that the tooltip has been hidden from the view */
	private readonly _onHide: Subject<void> = new Subject();
	public readonly afterHidden = this._onHide.asObservable();

	/**
	 * Shows the tooltip with originating from the provided origin
	 * @param delay Amount of milliseconds to the delay showing the tooltip.
	 */
	show(delay: number): void {
		// Cancel the delayed hide if it is scheduled
		if (this._hideTimeoutId !== null) {
			clearTimeout(this._hideTimeoutId);
		}
		if (this._animateTimeoutId !== null) {
			clearTimeout(this._animateTimeoutId);
		}
		this._showTimeoutId = setTimeout(() => {
			this._toggleDataAttributes(true, this.side());
			this._toggleVisibility(true);
			this._showTimeoutId = undefined;
		}, delay);
	}

	/**
	 * Begins to hide the tooltip after the provided delay in ms.
	 * @param delay Amount of milliseconds to delay hiding the tooltip.
	 * @param exitAnimationDuration Time before hiding to finish animation
	 * */
	hide(delay: number, exitAnimationDuration: number): void {
		// Cancel the delayed show if it is scheduled
		if (this._showTimeoutId !== null) {
			clearTimeout(this._showTimeoutId);
		}
		// start out animation at delay minus animation delay or immediately if possible
		this._animateTimeoutId = setTimeout(
			() => {
				this._animateTimeoutId = undefined;
				if (this._contentHovered()) return;
				this._toggleDataAttributes(false, this.side());
			},
			Math.max(delay, 0),
		);
		this._hideTimeoutId = setTimeout(() => {
			this._hideTimeoutId = undefined;
			if (this._contentHovered()) return;
			this._toggleVisibility(false);
		}, delay + exitAnimationDuration);
	}

	/** Whether the tooltip is being displayed. */
	isVisible(): boolean {
		return this._isVisible;
	}

	ngOnDestroy() {
		this._cancelPendingAnimations();
		this._onHide.complete();
		this._triggerElement = undefined;
	}

	_isTypeOfString(content: unknown): content is string {
		return typeof content === 'string';
	}

	/**
	 * Interactions on the HTML body should close the tooltip immediately as defined in the
	 * material design spec.
	 * https://material.io/design/components/tooltips.html#behavior
	 */
	_handleBodyInteraction(): void {
		if (this._closeOnInteraction) {
			this.hide(0, 0);
		}
	}

	/**
	 * Marks that the tooltip needs to be checked in the next change detection run.
	 * Mainly used for rendering the initial text before positioning a tooltip, which
	 * can be problematic in components with OnPush change detection.
	 */
	_markForCheck(): void {
		this._cdr.markForCheck();
	}

	_handleMouseLeave({ relatedTarget }: MouseEvent) {
		if (!relatedTarget || !this._triggerElement?.contains(relatedTarget as Node)) {
			if (this.isVisible()) {
				this.hide(this._mouseLeaveHideDelay, this._exitAnimationDuration);
			} else {
				this._finalize(false);
			}
		}
		this._contentHovered.set(false);
	}

	/** Cancels any pending animation sequences. */
	_cancelPendingAnimations() {
		if (this._showTimeoutId !== null) {
			clearTimeout(this._showTimeoutId);
		}

		if (this._hideTimeoutId !== null) {
			clearTimeout(this._hideTimeoutId);
		}

		this._showTimeoutId = this._hideTimeoutId = undefined;
	}

	private _finalize(toVisible: boolean) {
		if (toVisible) {
			this._closeOnInteraction = true;
		} else if (!this.isVisible()) {
			this._onHide.next();
		}
	}

	/** Toggles the visibility of the tooltip element. */
	private _toggleVisibility(isVisible: boolean) {
		// We set the classes directly here ourselves so that toggling the tooltip state
		// isn't bound by change detection. This allows us to hide it even if the
		// view ref has been detached from the CD tree.
		const tooltip = this._tooltip()?.nativeElement;
		if (!tooltip || !this._isBrowser) return;
		this._renderer2.setStyle(tooltip, 'visibility', isVisible ? 'visible' : 'hidden');
		if (isVisible) {
			this._renderer2.removeStyle(tooltip, 'display');
		} else {
			this._renderer2.setStyle(tooltip, 'display', 'none');
		}
		this._isVisible = isVisible;
	}

	private _toggleDataAttributes(isVisible: boolean, side: string) {
		// We set the classes directly here ourselves so that toggling the tooltip state
		// isn't bound by change detection. This allows us to hide it even if the
		// view ref has been detached from the CD tree.
		const tooltip = this._tooltip()?.nativeElement;
		if (!tooltip || !this._isBrowser) return;
		this._renderer2.setAttribute(tooltip, 'data-side', side);
		this._renderer2.setAttribute(tooltip, 'data-state', isVisible ? 'open' : 'closed');
	}
}
