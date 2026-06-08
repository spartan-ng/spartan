import { DestroyRef, inject, signal, type Signal } from '@angular/core';

type ScrollPosition = 'top' | 'bottom' | 'middle' | undefined;

/**
 * Tracks the scroll position of the element passed to `attach()`.
 * Used by the drawer to decide whether to accept a downward drag as a dismiss
 * gesture or let the browser handle native scrolling.
 *
 * Must be called in injection context.
 */
export function trackScrollPosition(
	options: {
		debounceDelay?: number;
		isEnabled?: boolean;
	} = {},
): {
	scrollPosition: Signal<ScrollPosition>;
	isScrollable: Signal<boolean>;
	attach: (element: HTMLElement | null) => void;
	detach: () => void;
	refresh: () => void;
} {
	const { debounceDelay = 32, isEnabled = true } = options;
	const destroyRef = inject(DestroyRef);

	const scrollPosition = signal<ScrollPosition>(undefined);
	const isScrollable = signal(false);
	let scrollTimeoutId: ReturnType<typeof setTimeout> | null = null;
	let currentElement: HTMLElement | null = null;

	function determineScrollPosition(element: HTMLElement): void {
		const { scrollTop, scrollHeight, clientHeight } = element;
		const nextIsScrollable = scrollHeight > clientHeight;
		if (isScrollable() !== nextIsScrollable) isScrollable.set(nextIsScrollable);

		if (!nextIsScrollable) {
			if (scrollPosition() !== undefined) scrollPosition.set(undefined);
			return;
		}

		const isAtTop = scrollTop <= 0;
		const isAtBottom = scrollHeight - scrollTop - clientHeight <= 1;

		const position: 'top' | 'bottom' | 'middle' = isAtTop ? 'top' : isAtBottom ? 'bottom' : 'middle';

		if (position === scrollPosition()) return;
		scrollPosition.set(position);
	}

	function onScroll(event: Event): void {
		if (event.currentTarget instanceof HTMLElement) {
			const el = event.currentTarget;

			if (scrollTimeoutId) clearTimeout(scrollTimeoutId);

			if (debounceDelay === 0) {
				determineScrollPosition(el);
			} else {
				scrollTimeoutId = setTimeout(() => determineScrollPosition(el), debounceDelay);
			}
		}
	}

	function onTouchStart(event: Event): void {
		if (event.currentTarget instanceof HTMLElement) {
			determineScrollPosition(event.currentTarget);
		}
	}

	function refresh(): void {
		if (currentElement) {
			determineScrollPosition(currentElement);
		}
	}

	function attach(element: HTMLElement | null): void {
		detach();

		if (!element || !isEnabled) return;

		currentElement = element;
		determineScrollPosition(element);
		element.addEventListener('scroll', onScroll);
		element.addEventListener('touchstart', onTouchStart);
	}

	function detach(): void {
		if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
		if (currentElement) {
			currentElement.removeEventListener('scroll', onScroll);
			currentElement.removeEventListener('touchstart', onTouchStart);
			currentElement = null;
		}
	}

	destroyRef.onDestroy(() => detach());

	return {
		scrollPosition: scrollPosition.asReadonly(),
		isScrollable: isScrollable.asReadonly(),
		attach,
		detach,
		refresh,
	};
}
