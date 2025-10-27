import type { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Creates a debounced version of a source signal.
 *
 * @param source - The input signal to debounce.
 * @param delay - Debounce time in milliseconds.
 * @returns A new signal that updates only after the source has stopped changing for `delay` ms.
 */
export function debouncedSignal<T>(source: Signal<T>, delay: number): Signal<T> {
	const source$ = toObservable(source);

	const debounced$ = source$.pipe(debounceTime(delay), distinctUntilChanged());

	return toSignal(debounced$, { initialValue: source() });
}
