// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import {
	afterRenderEffect,
	computed,
	DestroyRef,
	Directive,
	effect,
	ElementRef,
	inject,
	isDevMode,
	untracked,
} from '@angular/core';
import { BrnDrawer } from './brn-drawer';
import { BrnDrawerCssVars, registerDrawerCssVars } from './brn-drawer-css-vars';
import { BrnDrawerViewport } from './brn-drawer-viewport';
import { getSnapPointSwipeMovement } from './utils/snap-points';

/** Keys that composite widgets (menus, tabs, ...) inside the popup handle themselves. */
const COMPOSITE_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End']);

/** The drawer panel. Place it inside `brnDrawerViewport`. */
@Directive({
	selector: '[brnDrawerPopup],brn-drawer-popup',
	exportAs: 'brnDrawerPopup',
	host: {
		tabindex: '-1',
		'data-drawer-popup': '',
		'[attr.data-state]': '_drawer.stateComputed()',
		'[attr.data-open]': '_drawer.isOpen() ? "" : null',
		'[attr.data-closed]': '_drawer.isOpen() ? null : ""',
		'[attr.data-starting-style]': '_drawer.transitionStatus() === "starting" ? "" : null',
		'[attr.data-ending-style]': '_drawer.transitionStatus() === "ending" ? "" : null',
		'[attr.data-nested]': '_drawer.nested ? "" : null',
		'[attr.data-expanded]': '_drawer.activeSnapPoint() === 1 ? "" : null',
		'[attr.data-nested-drawer-open]': '_nestedDrawerOpen() ? "" : null',
		'[attr.data-nested-drawer-swiping]': '_drawer.nestedSwiping() ? "" : null',
		'[attr.data-swipe-direction]': '_drawer.swipeDirection()',
		'[attr.data-swiping]': '_viewport?.swiping() ? "" : null',
		'[style]': '_hostStyle()',
		'(keydown)': '_onKeydown($event)',
	},
})
export class BrnDrawerPopup {
	protected readonly _drawer = inject(BrnDrawer);
	protected readonly _viewport = inject(BrnDrawerViewport, { optional: true });
	private readonly _element: HTMLElement = inject(ElementRef).nativeElement;

	protected readonly _nestedDrawerOpen = computed(() => this._drawer.nestedOpenDrawerCount() > 0);

	private _popupHeight = 0;

	constructor() {
		const destroyRef = inject(DestroyRef);

		if (isDevMode() && !this._viewport) {
			console.error(
				'brnDrawerPopup expected to be rendered within brnDrawerViewport. Omitting the viewport disables ' +
					'drawer swipe handling and touch scroll locking.',
			);
		}

		registerDrawerCssVars();
		this._drawer.popupElement.set(this._element);
		this._observeHeight(destroyRef);
		this._syncNestedSwipeProgress(destroyRef);

		// Report the frontmost height of this drawer's stack to the parent while open.
		effect((onCleanup) => {
			const parent = this._drawer.parentDrawer;
			if (!parent || !this._drawer.isOpen()) return;
			const frontmostHeight = this._drawer.frontmostHeight();
			untracked(() => parent.onNestedFrontmostHeightChange(frontmostHeight));
			onCleanup(() => parent.onNestedFrontmostHeightChange(0));
		});

		// Report to the parent whether this drawer is present (open or transitioning out).
		effect((onCleanup) => {
			const parent = this._drawer.parentDrawer;
			if (!parent) return;
			const present = this._drawer.mounted();
			untracked(() => parent.onNestedDrawerPresenceChange(present));
			onCleanup(() => parent.onNestedDrawerPresenceChange(false));
		});

		destroyRef.onDestroy(() => {
			this._drawer.onPopupHeightChange(0);
			if (this._drawer.popupElement() === this._element) this._drawer.popupElement.set(null);
		});
	}

	protected _onKeydown(event: KeyboardEvent): void {
		if (COMPOSITE_KEYS.has(event.key)) event.stopPropagation();
	}

	protected _hostStyle(): Record<string, string | null> {
		const drawer = this._drawer;
		const swipeDirection = drawer.swipeDirection();
		const transitionStatus = drawer.transitionStatus();
		const swiping = this._viewport?.swiping() ?? false;
		const swipeStrength = this._viewport?.swipeStrength() ?? null;
		const activeSnapPointOffset = drawer.activeSnapPointOffset();
		const popupHeight = drawer.popupHeight();
		const frontmostHeight = drawer.frontmostHeight();

		const keepHeight = drawer.hasNestedDrawer() || transitionStatus === 'ending';
		const applySnapPoints = drawer.hasSnapPoints() && (swipeDirection === 'down' || swipeDirection === 'up');
		let snapPointOffset: number | null = null;
		if (applySnapPoints && activeSnapPointOffset !== null) {
			snapPointOffset = swipeDirection === 'up' ? -activeSnapPointOffset : activeSnapPointOffset;
		}

		let dragStyles = this._viewport?.getDragStyles() ?? {};
		if (applySnapPoints && swipeDirection === 'down') {
			const movement = Number.parseFloat(String(dragStyles[BrnDrawerCssVars.swipeMovementY]));
			dragStyles = { ...dragStyles, transform: null };
			if (swiping && Number.isFinite(movement)) {
				dragStyles[BrnDrawerCssVars.swipeMovementY] =
					`${getSnapPointSwipeMovement(activeSnapPointOffset ?? 0, movement)}px`;
			}
		}

		return {
			...dragStyles,
			'pointer-events': drawer.isOpen() ? 'auto' : null,
			[BrnDrawerCssVars.swipeProgress]: '0',
			[BrnDrawerCssVars.nestedDrawers]: `${drawer.nestedOpenDrawerCount()}`,
			[BrnDrawerCssVars.height]: popupHeight && keepHeight ? `${popupHeight}px` : null,
			[BrnDrawerCssVars.snapPointOffset]: snapPointOffset !== null ? `${snapPointOffset}px` : '0px',
			[BrnDrawerCssVars.frontmostHeight]: frontmostHeight ? `${frontmostHeight}px` : null,
			[BrnDrawerCssVars.swipeStrength]:
				typeof swipeStrength === 'number' && Number.isFinite(swipeStrength) && swipeStrength > 0
					? `${swipeStrength}`
					: '1',
		};
	}

	private _measureHeight(): void {
		const drawer = this._drawer;
		const offsetHeight = this._element.offsetHeight;
		const lastHeight = this._popupHeight;

		// Skip while the element is still stretched beyond its last measured height by a nested stack.
		if (lastHeight > 0 && drawer.frontmostHeight() > lastHeight && offsetHeight > lastHeight) return;

		if (lastHeight > 0 && drawer.hasNestedDrawer()) {
			drawer.onPopupHeightChange(lastHeight);
			return;
		}

		if (offsetHeight === lastHeight) return;
		this._popupHeight = offsetHeight;
		drawer.onPopupHeightChange(offsetHeight);
	}

	private _observeHeight(destroyRef: DestroyRef): void {
		// Measure after render, never during change detection: reading layout before the host bindings
		// apply would compute a style without the classes and `data-starting-style`, and the enter
		// transition would then start from that intermediate style. Re-measures when a nested drawer
		// opens or closes.
		afterRenderEffect({
			read: () => {
				this._nestedDrawerOpen();
				untracked(() => this._measureHeight());
			},
		});

		if (typeof ResizeObserver !== 'function') return;
		const resizeObserver = new ResizeObserver(() => this._measureHeight());
		resizeObserver.observe(this._element);
		destroyRef.onDestroy(() => resizeObserver.disconnect());
	}

	/** Writes nested swipe progress straight to the element, so a nested drag doesn't run change detection. */
	private _syncNestedSwipeProgress(destroyRef: DestroyRef): void {
		const store = this._drawer.nestedSwipeProgressStore;
		const sync = () => {
			const progress = store.getSnapshot();
			this._element.style.setProperty(BrnDrawerCssVars.swipeProgress, progress > 0 ? `${progress}` : '0');
		};

		sync();
		const unsubscribe = store.subscribe(sync);
		destroyRef.onDestroy(() => {
			unsubscribe();
			this._element.style.setProperty(BrnDrawerCssVars.swipeProgress, '0');
		});
	}
}
