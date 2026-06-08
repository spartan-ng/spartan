import { isPlatformBrowser } from '@angular/common';
import {
	DestroyRef,
	Directive,
	ElementRef,
	NgZone,
	PLATFORM_ID,
	afterNextRender,
	afterRenderEffect,
	effect,
	inject,
	input,
	signal,
	untracked,
} from '@angular/core';
import { measureDimensions } from '@spartan-ng/brain/core';
import { injectBrnCollapsible, injectBrnCollapsibleConfig } from './brn-collapsible-token';

@Directive({
	selector: '[brnCollapsibleContent],brn-collapsible-content',
	host: {
		'[attr.inert]': "_collapsible?.state() === 'closed' ? true : undefined",
		'[attr.data-state]': '_collapsible?.state()',
		'[id]': '_collapsible?.contentId()',
		'[style.display]': "_hidden() ? 'none' : null",
		'[style.--brn-collapsible-content-width.px]': '_width()',
		'[style.--brn-collapsible-content-height.px]': '_height()',
	},
})
export class BrnCollapsibleContent {
	private readonly _config = injectBrnCollapsibleConfig();
	private readonly _elementRef = inject<ElementRef>(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _ngZone = inject(NgZone);
	private readonly _platformId = inject(PLATFORM_ID);
	protected readonly _collapsible = injectBrnCollapsible();

	protected readonly _width = signal<number | null>(null);
	protected readonly _height = signal<number | null>(null);

	/**
	 * Whether the content is removed from the layout (via `display: none`).
	 *
	 * Closed content is hidden so it takes no space, but only when it has no CSS transition or
	 * animation. Animated content stays in the layout while closed so its exit/enter animations can
	 * run; collapsing it (e.g. to `height: 0`) is then the responsibility of the consumer's CSS.
	 */
	protected readonly _hidden = signal(this._collapsible?.state() === 'closed');

	/**
	 * The id of the collapsible content element.
	 */
	public readonly id = input<string | null | undefined>();

	constructor() {
		if (!this._collapsible) {
			throw Error('Collapsible trigger directive can only be used inside a brn-collapsible element.');
		}

		effect(() => {
			const id = this.id();
			const collapsible = this._collapsible;
			if (!id || !collapsible) return;
			untracked(() => collapsible.contentId.set(id));
		});

		// Browser only: keep `_hidden` in sync with the open state on every user toggle. Open content
		// is always shown; closed content is hidden unless it animates, in which case it stays in the
		// layout so the exit/enter animation can play. Runs after render so computed styles are ready.
		afterRenderEffect(() => {
			this._collapsible?.state();
			untracked(() => this._updateHidden());
		});

		afterNextRender(() => {
			// Re-evaluate once the first frame has passed: the styling layer suppresses transitions on
			// the initial paint, which would otherwise make animated content look non-animated and get
			// hidden (snapping on its first open).
			requestAnimationFrame(() => this._updateHidden());

			const hasValidDimensions = this._measureAndSetDimensions();
			if (!hasValidDimensions) {
				this._setupVisibilityObserver();
			}
		});
	}

	/**
	 * Hide closed content from the layout, but keep animated content mounted so its transition or
	 * animation can play (the consumer's CSS is responsible for collapsing it, e.g. to `height: 0`).
	 */
	private _updateHidden(): void {
		const open = this._collapsible?.state() === 'open';
		this._hidden.set(open ? false : !this._contentAnimates());
	}

	/** Whether the host element has a CSS transition or animation that should play before it hides. */
	private _contentAnimates(): boolean {
		const styles = getComputedStyle(this._elementRef.nativeElement);
		const hasDuration = (value: string): boolean => value.split(',').some((part) => Number.parseFloat(part) > 0);
		const hasTransition = hasDuration(styles.transitionDuration);
		const hasAnimation = styles.animationName !== 'none' && hasDuration(styles.animationDuration);
		return hasTransition || hasAnimation;
	}

	private _measureAndSetDimensions(): boolean {
		const { width, height } = measureDimensions(this._elementRef.nativeElement, this._config.measurementDisplay);
		this._width.set(width);
		this._height.set(height);

		return width > 0 && height > 0;
	}

	private _setupVisibilityObserver(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		if (typeof IntersectionObserver === 'undefined') return;

		this._ngZone.runOutsideAngular(() => {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						this._ngZone.run(() => {
							if (this._measureAndSetDimensions()) {
								observer.disconnect();
							}
						});
					}
				},
				{ root: null, threshold: 0 },
			);

			observer.observe(this._elementRef.nativeElement);
			this._destroyRef.onDestroy(() => observer.disconnect());
		});
	}
}
