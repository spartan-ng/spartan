import type { NgZone } from '@angular/core';
import { brnZoneOptimized } from '@spartan-ng/brain/core';
import { Observable, Subject, fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

function movedOut({ currentTarget, relatedTarget }: MouseEvent): boolean {
	return !isElement(relatedTarget) || !isElement(currentTarget) || !currentTarget.contains(relatedTarget);
}

export function isElement(node?: Element | EventTarget | Node | null): node is Element {
	return !!node && 'nodeType' in node && node.nodeType === Node.ELEMENT_NODE;
}

export const createHoverObservable = (
	nativeElement: HTMLElement,
	zone: NgZone,
	destroyed$: Subject<void>,
): Observable<boolean> => {
	return merge(
		fromEvent(nativeElement, 'mouseenter').pipe(map(() => true)),
		fromEvent(nativeElement, 'mouseleave').pipe(map(() => false)),
		// Hello, Safari
		fromEvent<MouseEvent>(nativeElement, 'mouseout').pipe(
			filter(movedOut),
			map(() => false),
		),
		/**
		 * NOTE: onmouseout events don't trigger when objects move under mouse in Safari
		 * https://bugs.webkit.org/show_bug.cgi?id=4117
		 */
		fromEvent(nativeElement, 'transitionend').pipe(map(() => nativeElement.matches(':hover'))),
	).pipe(distinctUntilChanged(), brnZoneOptimized(zone), takeUntil(destroyed$));
};
