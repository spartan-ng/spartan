import { afterNextRender, DestroyRef, Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { injectBrnMessageScroller } from './brn-message-scroller.token';

@Directive({
	selector: '[brnMessageScrollerContent],brn-message-scroller-content',
	exportAs: 'brnMessageScrollerContent',
	host: {
		role: 'log',
		'[attr.aria-relevant]': 'ariaRelevant()',
	},
})
export class BrnMessageScrollerContent {
	private readonly _scroller = injectBrnMessageScroller();
	private readonly _elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
	private readonly _renderer = inject(Renderer2);
	private readonly _destroyRef = inject(DestroyRef);
	private _spacer: HTMLDivElement | null = null;
	private _mutationObserver: MutationObserver | null = null;
	private _resizeObserver: ResizeObserver | null = null;
	private _resizeFrame = 0;

	/**
	 * aria-relevant for the live log region.
	 * @default 'additions'
	 */
	public readonly ariaRelevant = input('additions', { alias: 'aria-relevant' });

	/**
	 * Optional class name applied to the internal tail spacer.
	 */
	public readonly spacerClassName = input<string | undefined>(undefined);

	constructor() {
		const content = this._elementRef.nativeElement;
		this._scroller.setContentElement(content);

		effect(() => {
			const spacerClass = this.spacerClassName();
			if (!this._spacer) {
				return;
			}
			if (spacerClass) {
				this._renderer.setAttribute(this._spacer, 'class', spacerClass);
			} else {
				this._renderer.removeAttribute(this._spacer, 'class');
			}
		});

		// Create the spacer after hydration. Appending it in the constructor puts an
		// extra node in SSR HTML and breaks Angular hydration (NG0500).
		afterNextRender(() => {
			const spacer = this._renderer.createElement('div') as HTMLDivElement;
			this._renderer.setAttribute(spacer, 'aria-hidden', 'true');
			this._renderer.setAttribute(spacer, 'data-message-scroller-spacer', '');
			this._renderer.setAttribute(spacer, 'hidden', '');
			this._renderer.appendChild(content, spacer);
			this._spacer = spacer;
			this._scroller.setSpacerElement(spacer);

			const spacerClass = this.spacerClassName();
			if (spacerClass) {
				this._renderer.setAttribute(spacer, 'class', spacerClass);
			}

			this._scroller.handleContentChange();

			if (typeof MutationObserver !== 'undefined') {
				this._mutationObserver = new MutationObserver(() => {
					this._scroller.handleContentChange();
				});
				this._mutationObserver.observe(content, { childList: true });
			}

			if (typeof ResizeObserver !== 'undefined') {
				// Coalesce into rAF: handleResize mutates the spacer inside this observed
				// element, and resizing an observed element during delivery fires
				// "ResizeObserver loop completed with undelivered notifications".
				this._resizeObserver = new ResizeObserver(() => {
					window.cancelAnimationFrame(this._resizeFrame);
					this._resizeFrame = window.requestAnimationFrame(() => this._scroller.handleResize());
				});
				this._resizeObserver.observe(content);
			}
		});

		this._destroyRef.onDestroy(() => {
			if (typeof window !== 'undefined') {
				window.cancelAnimationFrame(this._resizeFrame);
			}
			this._mutationObserver?.disconnect();
			this._mutationObserver = null;
			this._resizeObserver?.disconnect();
			this._resizeObserver = null;

			const spacer = this._spacer;
			if (spacer) {
				this._renderer.removeChild(content, spacer);
				this._spacer = null;
				this._scroller.clearSpacerElement(spacer);
			}

			this._scroller.clearContentElement(content);
		});
	}
}
