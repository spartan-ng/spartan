import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, ElementRef, PLATFORM_ID, computed, inject, signal, type Signal } from '@angular/core';

export interface ChartResponsiveSize {
	readonly width: Signal<number>;
	readonly height: Signal<number>;
	readonly isAnimationActive: Signal<boolean>;
}

export function injectChartResponsiveSize(
	width: Signal<number>,
	height: Signal<number>,
	responsive: Signal<boolean>,
): ChartResponsiveSize {
	const host = inject(ElementRef<HTMLElement>).nativeElement;
	const destroyRef = inject(DestroyRef);
	const platformId = inject(PLATFORM_ID);

	const measuredWidth = signal(0);
	const measuredHeight = signal(0);
	const hasMeasured = signal(false);
	const isAnimationActive = signal(!responsive());

	const renderWidth = computed(() =>
		responsive() && hasMeasured() ? Math.max(0, measuredWidth()) : Math.max(0, width()),
	);
	const renderHeight = computed(() =>
		responsive() && hasMeasured() ? Math.max(0, measuredHeight()) : Math.max(0, height()),
	);

	if (isPlatformBrowser(platformId)) {
		let settled = false;
		let destroyed = false;
		let frame: number | undefined;
		let animationTimer: ReturnType<typeof setTimeout> | undefined;

		const apply = () => {
			const hostWidth = host.clientWidth;
			if (hostWidth <= 0) return false;

			measuredWidth.set(hostWidth);
			measuredHeight.set(host.clientHeight);
			hasMeasured.set(true);
			return true;
		};

		const finishAnimation = () => {
			animationTimer = setTimeout(() => {
				isAnimationActive.set(false);
				settled = true;
			}, 900);
		};

		const mount = () => {
			if (destroyed) return;
			if (!responsive()) {
				isAnimationActive.set(true);
				finishAnimation();
				return;
			}
			if (apply()) {
				isAnimationActive.set(true);
				finishAnimation();
			} else {
				frame = requestAnimationFrame(mount);
			}
		};

		frame = requestAnimationFrame(mount);

		const resizeObserver = new ResizeObserver(() => {
			if (responsive() && settled) apply();
		});
		resizeObserver.observe(host);

		destroyRef.onDestroy(() => {
			destroyed = true;
			resizeObserver.disconnect();
			if (frame !== undefined) cancelAnimationFrame(frame);
			if (animationTimer !== undefined) clearTimeout(animationTimer);
		});
	}

	return { width: renderWidth, height: renderHeight, isAnimationActive };
}
