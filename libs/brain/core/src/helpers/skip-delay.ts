import { DestroyRef, inject, type Signal, signal } from '@angular/core';

/** Skip-delay grouping: once one member opens, siblings skip their delay until the window elapses. */
export interface SkipDelay {
	/** Whether the next open should still wait for its delay (`true`) or open instantly (`false`). */
	readonly isOpenDelayed: Signal<boolean>;
	/** Report that a member opened: opens the skip window so siblings skip their delay. */
	open(): void;
	/** Report that a member closed: re-require the delay once the window elapses. */
	close(): void;
}

/** Must be called in an injection context; cleans up its pending timer on destroy. */
export function injectSkipDelay(skipDelayDuration: () => number): SkipDelay {
	const isOpenDelayed = signal(true);
	let timer: ReturnType<typeof setTimeout> | undefined;

	inject(DestroyRef).onDestroy(() => clearTimeout(timer));

	return {
		isOpenDelayed: isOpenDelayed.asReadonly(),
		open(): void {
			clearTimeout(timer);
			if (skipDelayDuration() > 0) isOpenDelayed.set(false);
		},
		close(): void {
			clearTimeout(timer);
			const duration = skipDelayDuration();
			if (duration > 0) {
				timer = setTimeout(() => isOpenDelayed.set(true), duration);
			}
		},
	};
}
