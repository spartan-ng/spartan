import { isPlatformServer } from '@angular/common';
import {
	afterNextRender,
	DestroyRef,
	ElementRef,
	inject,
	Injector,
	PLATFORM_ID,
	runInInjectionContext,
	type Signal,
	signal,
	type WritableSignal,
} from '@angular/core';

/**
 * Returns a reactive signal that tracks the size of a DOM element.
 *
 * This function uses a shared {@link ResizeObserver} internally to monitor multiple elements efficiently.
 * The returned signal updates whenever the element's width or height changes. It is fully SSR-safe.
 *
 * @param options Optional {@link ElementSizeOptions} configuration object.
 * @param options.elementRef The {@link ElementRef} of the element to observe. Defaults to the {@link ElementRef} injected in the current context.
 * @param options.injector Optional custom {@link Injector} to run the function in. Defaults to the current injection context.
 *
 * @returns A readonly {@link Signal} containing `{ width, height }` of the element, or `undefined` if the element has not yet been measured or on the server.
 *
 * Based on https://github.com/radix-ui/primitives/blob/main/packages/react/use-size/src/use-size.tsx
 */
export function injectElementSize(
	options: ElementSizeOptions = {},
): Signal<{ width: number; height: number } | undefined> {
	return runInInjectionContext(options.injector ?? inject(Injector), () => {
		const elementRef = options.elementRef ?? inject(ElementRef);
		const platformId = inject(PLATFORM_ID);
		const destroyRef = inject(DestroyRef);

		const element = elementRef.nativeElement;
		const size = signal<{ width: number; height: number } | undefined>(undefined);

		if (isPlatformServer(platformId)) {
			return size;
		}

		afterNextRender({
			read: () => {
				// Initial read
				size.set({
					width: element.offsetWidth,
					height: element.offsetHeight,
				});

				// Register element in shared observer
				observerMap.set(element, { element, size });
				getSharedObserver().observe(element, { box: 'border-box' });

				destroyRef.onDestroy(() => {
					getSharedObserver().unobserve(element);
					observerMap.delete(element);

					// Disconnect global observer if no elements left
					if (observerMap.size === 0 && sharedObserver) {
						sharedObserver.disconnect();
						sharedObserver = undefined;
					}
				});
			},
		});

		return size.asReadonly();
	});
}

const observerMap = new Map<HTMLElement, SizeEntry>();
let sharedObserver: ResizeObserver | undefined;

function getSharedObserver() {
	if (!sharedObserver) {
		sharedObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const el = entry.target as HTMLElement;
				const entryData = observerMap.get(el);
				if (!entryData) continue;

				let width: number;
				let height: number;

				if ('borderBoxSize' in entry) {
					// Iron out differences between browsers
					const borderSize = Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize;
					width = borderSize.inlineSize;
					height = borderSize.blockSize;
				} else {
					width = el.offsetWidth;
					height = el.offsetHeight;
				}

				entryData.size.set({ width, height });
			}
		});
	}

	return sharedObserver;
}

/**
 * Options to configure `injectElementSize`.
 */
interface ElementSizeOptions {
	/** The ElementRef of the element to observe. Defaults to injected ElementRef in the current context. */
	elementRef?: ElementRef<HTMLElement>;
	/** Optional Injector to run the function in. Defaults to the current injection context. */
	injector?: Injector;
}

/**
 * Internal type used to track each observed element in the shared ResizeObserver.
 */
interface SizeEntry {
	/** The HTML element being observed. */
	element: HTMLElement;
	/** Writable signal storing the element's current width and height. */
	size: WritableSignal<{ width: number; height: number } | undefined>;
}
