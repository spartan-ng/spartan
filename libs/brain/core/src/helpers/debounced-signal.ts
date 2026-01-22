import type { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

/**
 * Creates a debounced version of a source signal.
 *
 * @param source - The input signal to debounce.
 * @param delay - Debounce time in milliseconds (static value).
 * @returns A new signal that updates only after the source has stopped changing for `delay` ms.
 */
export function debouncedSignal<T>(source: Signal<T>, delay: number): Signal<T>;

/**
 * Creates a debounced version of a source signal with reactive delay.
 *
 * @param source - The input signal to debounce.
 * @param delay - A signal containing the debounce time in milliseconds. When this changes, the debounce pipeline is recreated.
 * @returns A new signal that updates only after the source has stopped changing for the current delay value.
 */
export function debouncedSignal<T>(source: Signal<T>, delay: Signal<number>): Signal<T>;

export function debouncedSignal<T>(source: Signal<T>, delay: number | Signal<number>): Signal<T> {
	const source$ = toObservable(source);

	// If delay is a static number, use the simple implementation
	if (typeof delay === 'number') {
		const debounced$ = source$.pipe(debounceTime(delay), distinctUntilChanged());
		return toSignal(debounced$, { initialValue: source() });
	}

	// If delay is a signal, recreate the debounce pipeline when delay changes
	const delay$ = toObservable(delay);

	const debounced$ = delay$.pipe(
		switchMap((delayValue) => source$.pipe(debounceTime(delayValue), distinctUntilChanged())),
	);

	return toSignal(debounced$, { initialValue: source() });
}
