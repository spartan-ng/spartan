import { isPlatformServer } from '@angular/common';
import { afterNextRender, DestroyRef, ElementRef, inject, PLATFORM_ID, type Signal, signal } from '@angular/core';

/** Reactive natural size of a collapsible host's projected content, or `null` before measurement. */
export interface ContentDimensions {
	width: Signal<number | null>;
	height: Signal<number | null>;
}

/**
 * Measures the natural size of a collapsible host's content via `scrollHeight` so it can animate
 * between `height: 0` and a measured pixel height - the whole content is covered, regardless of how
 * it is projected. A `ResizeObserver` on the content keeps the value live. SSR-safe; the host must
 * be a block-level element for `scrollHeight` to reflect its content.
 *
 * @returns Signals with the content's width and height in px, or `null` before measurement.
 */
export function injectContentDimensions(): ContentDimensions {
	const host = inject(ElementRef).nativeElement as HTMLElement;
	const platformId = inject(PLATFORM_ID);
	const destroyRef = inject(DestroyRef);

	const width = signal<number | null>(null);
	const height = signal<number | null>(null);

	if (isPlatformServer(platformId)) {
		return { width: width.asReadonly(), height: height.asReadonly() };
	}

	const measure = (): void => {
		// Drop the clamped height for the read: scrollHeight is never smaller than the element's own
		// height, so while clamped it would only ever grow. `height: auto` lets it reflect the real
		// content size (and shrink). The read is synchronous, so the swap never paints.
		const previousHeight = host.style.height;
		host.style.height = 'auto';
		width.set(host.scrollWidth);
		height.set(host.scrollHeight);
		host.style.height = previousHeight;
	};

	afterNextRender({
		read: () => {
			measure();
			if (typeof ResizeObserver === 'undefined') return;

			// Observe the content wrapper (not the clamped/animated host) so re-measures fire on content
			// changes, never on the open/close height animation. Re-measure on a fresh frame rather than
			// inside the callback: measure() mutates the host's inline height, and doing that during
			// delivery trips "ResizeObserver loop completed with undelivered notifications".
			let frame = 0;
			const observer = new ResizeObserver(() => {
				cancelAnimationFrame(frame);
				frame = requestAnimationFrame(measure);
			});
			const content = host.firstElementChild;
			if (content) {
				observer.observe(content);
			}
			destroyRef.onDestroy(() => {
				cancelAnimationFrame(frame);
				observer.disconnect();
			});
		},
	});

	return { width: width.asReadonly(), height: height.asReadonly() };
}
