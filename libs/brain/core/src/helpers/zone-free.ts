/**
 * We are building on shoulders of giants here and use the implementation provided by the incredible TaigaUI
 * team: https://github.com/taiga-family/taiga-ui/blob/main/projects/cdk/observables/zone-free.ts#L22
 * Check them out! Give them a try! Leave a star! Their work is incredible!
 */
import type { NgZone } from '@angular/core';
import { type MonoTypeOperatorFunction, Observable, pipe } from 'rxjs';

export function brnZoneFull<T>(zone: NgZone): MonoTypeOperatorFunction<T> {
	return (source) =>
		new Observable((subscriber) =>
			source.subscribe({
				next: (value) => zone.run(() => subscriber.next(value)),
				error: (error: unknown) => zone.run(() => subscriber.error(error)),
				complete: () => zone.run(() => subscriber.complete()),
			}),
		);
}

export function brnZoneFree<T>(zone: NgZone): MonoTypeOperatorFunction<T> {
	return (source) => new Observable((subscriber) => zone.runOutsideAngular(() => source.subscribe(subscriber)));
}

export function brnZoneOptimized<T>(zone: NgZone): MonoTypeOperatorFunction<T> {
	return pipe(brnZoneFree(zone), brnZoneFull(zone));
}
