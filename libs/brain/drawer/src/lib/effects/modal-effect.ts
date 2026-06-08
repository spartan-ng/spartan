import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, type Signal } from '@angular/core';
import type { BehaviorSubject, Subscription } from 'rxjs';
import type { BrnDrawerDetent, BrnDrawerSnapPoint } from '../types';
import { getSafeAreaInsets } from './safe-area-insets';

/**
 * Applies a scale / translate "modal" effect on a root element as the drawer opens —
 * the Vaul visual effect where the page behind the drawer recedes and rounds its corners.
 *
 * Must be called in injection context.
 */
export function applyModalEffect(options: {
	y$: BehaviorSubject<number>;
	detent: Signal<BrnDrawerDetent>;
	sheetHeight: Signal<number>;
	snapPoints: Signal<BrnDrawerSnapPoint[]>;
	rootId: Signal<string | undefined>;
	startThreshold: Signal<number | undefined>;
}): { setup: () => void; cleanup: () => void } {
	const doc = inject(DOCUMENT);
	const destroyRef = inject(DestroyRef);
	const win = doc.defaultView;
	const insetTop = getSafeAreaInsets().top;

	let subscription: Subscription | null = null;

	function setup(): void {
		cleanup();

		let rootId = options.rootId();
		const detent = options.detent();
		const sheetHeight = options.sheetHeight();
		const snapPoints = options.snapPoints();
		const startThreshold = options.startThreshold();

		if (rootId && detent === 'full') {
			console.warn('Using the "full" detent with modal effect is not supported.');
			rootId = undefined;
		}

		if (!rootId) return;

		const root = doc.querySelector(`#${rootId}`) as HTMLDivElement;
		if (!root) return;

		const effectRootId = rootId;

		subscription = options.y$.subscribe((yValue) => {
			let progress = Math.max(0, 1 - yValue / sheetHeight);

			/**
			 * Start the effect only once the drawer has passed the second-to-last snap point,
			 * so the effect becomes fully active by the time the drawer reaches its final resting
			 * position.
			 */
			const snapThresholdPoint = snapPoints.length > 1 ? snapPoints[snapPoints.length - 2] : undefined;

			if (snapThresholdPoint !== undefined) {
				const snapThresholdValue = snapThresholdPoint.snapValueY;

				if (yValue <= snapThresholdValue) {
					progress = (snapThresholdValue - yValue) / snapThresholdValue;
				} else {
					progress = 0;
				}
			}

			if (startThreshold !== undefined) {
				const startThresholdValue = sheetHeight - Math.min(Math.floor(startThreshold * sheetHeight), sheetHeight);

				// Guard against startThreshold === 1 (threshold at the drawer top) which
				// collapses startThresholdValue to 0 and would otherwise divide by zero,
				// producing NaN transforms and a stuck modal-effect state on the root.
				if (startThresholdValue <= 0) {
					progress = yValue <= 0 ? 1 : 0;
				} else if (yValue <= startThresholdValue) {
					progress = (startThresholdValue - yValue) / startThresholdValue;
				} else {
					progress = 0;
				}
			}

			// Make sure progress is between 0 and 1
			progress = Math.max(0, Math.min(1, progress));

			if (progress === 0) {
				// -5 for imprecision tolerance — cleanup when the drawer is essentially closed
				if (yValue - 5 >= sheetHeight) {
					cleanupModalEffect(doc, effectRootId);
				}
				return;
			}

			// Setup transition properties on first non-zero progress
			setupModalEffect(doc, effectRootId);

			const pageWidth = win?.innerWidth ?? 0;
			const ty = lerp(progress, 0, 24 + insetTop);
			const s = lerp(progress, 1, (pageWidth - 16) / pageWidth);
			const borderRadius = lerp(progress, 0, 10);

			root.style.transform = `scale(${s}) translate3d(0, ${ty}px, 0)`;
			root.style.borderTopRightRadius = `${borderRadius}px`;
			root.style.borderTopLeftRadius = `${borderRadius}px`;
		});
	}

	function cleanup(): void {
		subscription?.unsubscribe();
		subscription = null;
		const rootId = options.rootId();
		if (rootId) cleanupModalEffect(doc, rootId);
	}

	destroyRef.onDestroy(() => cleanup());

	return { setup, cleanup };
}

function lerp(progress: number, from: number, to: number): number {
	return from + (to - from) * progress;
}

function setupModalEffect(doc: Document, rootId: string): void {
	const root = doc.querySelector(`#${rootId}`) as HTMLDivElement;
	if (!root) return;

	doc.body.style.backgroundColor = 'black';
	root.style.overflow = 'hidden';
	root.style.transitionTimingFunction = 'cubic-bezier(0.32, 0.72, 0, 1)';
	root.style.transitionProperty = 'transform, border-radius';
	root.style.transitionDuration = '0.5s';
	root.style.transformOrigin = 'center top';
}

function cleanupModalEffect(doc: Document, rootId: string): void {
	const root = doc.querySelector(`#${rootId}`) as HTMLDivElement;
	if (!root) return;

	doc.body.style.removeProperty('background-color');
	root.style.removeProperty('overflow');
	root.style.removeProperty('transition-timing-function');
	root.style.removeProperty('transition-property');
	root.style.removeProperty('transition-duration');
	root.style.removeProperty('transform-origin');
	root.style.removeProperty('transform');
	root.style.removeProperty('border-top-right-radius');
	root.style.removeProperty('border-top-left-radius');
}
