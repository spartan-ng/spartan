import { animationFrames, Observable } from 'rxjs';
import { endWith, map, takeWhile } from 'rxjs/operators';
import type { BrnDrawerTweenConfig } from '../types';

function easeOut(t: number): number {
	return t * (2 - t);
}

function linear(t: number): number {
	return t;
}

function getEasingFn(ease: BrnDrawerTweenConfig['ease']): (t: number) => number {
	switch (ease) {
		case 'easeOut':
			return easeOut;
		case 'linear':
			return linear;
		default:
			return easeOut;
	}
}

/**
 * RxJS-based tween engine used by the drawer's animation pipeline.
 *
 * Returns an Observable that emits intermediate values on each animation frame,
 * moving from `from` to `to` using the given easing and duration.
 *
 * Usage:
 *   tweenTo(from, to, config).subscribe(y$);      // pipe into BehaviorSubject
 *   await lastValueFrom(tweenTo(from, to, config)); // await completion
 *
 * Cancel by unsubscribing.
 */
export function tweenTo(from: number, to: number, config: BrnDrawerTweenConfig): Observable<number> {
	const durationMs = config.duration * 1000;
	const easingFn = getEasingFn(config.ease);

	if (durationMs <= 0 || from === to) {
		return new Observable<number>((subscriber) => {
			subscriber.next(to);
			subscriber.complete();
		});
	}

	return animationFrames().pipe(
		map(({ elapsed }) => Math.min(elapsed / durationMs, 1)),
		takeWhile((progress) => progress < 1, true),
		map(easingFn),
		map((eased) => from + (to - from) * eased),
		endWith(to),
	);
}
