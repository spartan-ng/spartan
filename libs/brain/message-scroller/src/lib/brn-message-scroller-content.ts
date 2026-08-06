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
		const scroller = injectBrnMessageScroller();
		const content = inject<ElementRef<HTMLDivElement>>(ElementRef).nativeElement;
		const renderer = inject(Renderer2);
		let spacer: HTMLDivElement | null = null;
		let mutationObserver: MutationObserver | null = null;
		let resizeObserver: ResizeObserver | null = null;
		let resizeFrame = 0;

		scroller.setContentElement(content);

		effect(() => {
			const spacerClass = this.spacerClassName();
			if (!spacer) {
				return;
			}
			if (spacerClass) {
				renderer.setAttribute(spacer, 'class', spacerClass);
			} else {
				renderer.removeAttribute(spacer, 'class');
			}
		});

		// Create the spacer after hydration. Appending it in the constructor puts an
		// extra node in SSR HTML and breaks Angular hydration (NG0500).
		afterNextRender(() => {
			const nextSpacer = renderer.createElement('div') as HTMLDivElement;
			renderer.setAttribute(nextSpacer, 'aria-hidden', 'true');
			renderer.setAttribute(nextSpacer, 'data-message-scroller-spacer', '');
			renderer.setAttribute(nextSpacer, 'hidden', '');
			renderer.appendChild(content, nextSpacer);
			spacer = nextSpacer;
			scroller.setSpacerElement(nextSpacer);

			const spacerClass = this.spacerClassName();
			if (spacerClass) {
				renderer.setAttribute(nextSpacer, 'class', spacerClass);
			}

			scroller.handleContentChange();

			if (typeof MutationObserver !== 'undefined') {
				mutationObserver = new MutationObserver(() => {
					scroller.handleContentChange();
				});
				mutationObserver.observe(content, { childList: true });
			}

			if (typeof ResizeObserver !== 'undefined') {
				// Coalesce into rAF: handleResize mutates the spacer inside this observed
				// element, and resizing an observed element during delivery fires
				// "ResizeObserver loop completed with undelivered notifications".
				resizeObserver = new ResizeObserver(() => {
					window.cancelAnimationFrame(resizeFrame);
					resizeFrame = window.requestAnimationFrame(() => scroller.handleResize());
				});
				resizeObserver.observe(content);
			}
		});

		inject(DestroyRef).onDestroy(() => {
			if (typeof window !== 'undefined') {
				window.cancelAnimationFrame(resizeFrame);
			}
			mutationObserver?.disconnect();
			mutationObserver = null;
			resizeObserver?.disconnect();
			resizeObserver = null;

			if (spacer) {
				renderer.removeChild(content, spacer);
				scroller.clearSpacerElement(spacer);
				spacer = null;
			}

			scroller.clearContentElement(content);
		});
	}
}
