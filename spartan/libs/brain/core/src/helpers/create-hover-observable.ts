import type { NgZone } from '@angular/core';
import { type Observable, type Subject, fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { brnZoneOptimized } from './zone-free';

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
): Observable<{ hover: boolean; relatedTarget?: EventTarget | null }> => {
	return merge(
		fromEvent(nativeElement, 'mouseenter').pipe(map(() => ({ hover: true }))),
		fromEvent<MouseEvent>(nativeElement, 'mouseleave').pipe(
			map((e) => ({ hover: false, relatedTarget: e.relatedTarget })),
		),
		// Hello, Safari
		fromEvent<MouseEvent>(nativeElement, 'mouseout').pipe(
			filter(movedOut),
			map((e) => ({ hover: false, relatedTarget: e.relatedTarget })),
		),
	).pipe(distinctUntilChanged(), brnZoneOptimized(zone), takeUntil(destroyed$));
};
