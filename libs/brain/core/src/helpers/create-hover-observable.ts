import type { NgZone } from '@angular/core';
import { brnZoneOptimized } from '@spartan-ng/brain/core';
import { type Observable, type Subject, fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

function movedOut({ currentTarget, relatedTarget }: MouseEvent): boolean {
	return !isElement(relatedTarget) || !isElement(currentTarget) || !currentTarget.contains(relatedTarget);
}

export function isElement(node?: Element | EventTarget | Node | null): node is Element {
	return !!node && 'nodeType' in node && node.nodeType === Node.ELEMENT_NODE;
}

export const createHoverObservableWithData = (
	nativeElement: HTMLElement,
	zone: NgZone,
	destroyed$: Subject<void>,
): Observable<{ hover: boolean; relatedTarget?: EventTarget | null }> => {
	return merge(
		fromEvent(nativeElement, 'mouseenter').pipe(map(() => ({ hover: true }))),
		fromEvent<MouseEvent>(nativeElement, 'mouseleave').pipe(
			map((e) => ({ hover: false, relatedTarget: e.relatedTarget })),
		),
		// Hello, Safari
		fromEvent<MouseEvent>(nativeElement, 'mouseout').pipe(
			filter(movedOut),
			map(() => ({ hover: false })),
		),
		/**
		 * NOTE: onmouseout events don't trigger when objects move under mouse in Safari
		 * https://bugs.webkit.org/show_bug.cgi?id=4117
		 */
		fromEvent(nativeElement, 'transitionend').pipe(
			filter(() => nativeElement.matches(':hover')),
			map(() => ({ hover: true })),
		),
	).pipe(distinctUntilChanged(), brnZoneOptimized(zone), takeUntil(destroyed$));
};

export const createHoverObservable = (
	nativeElement: HTMLElement,
	zone: NgZone,
	destroyed$: Subject<void>,
): Observable<boolean> => {
	return createHoverObservableWithData(nativeElement, zone, destroyed$).pipe(map((e) => e.hover));
};
