// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import { computed, Directive, signal } from '@angular/core';

export interface BrnDrawerVisualState {
	swipeProgress: number;
	frontmostHeight: number;
}

/** Notifies listeners of the frontmost drawer's swipe state without going through change detection. */
export class BrnDrawerVisualStateStore {
	private _state: BrnDrawerVisualState = { swipeProgress: 0, frontmostHeight: 0 };
	private readonly _listeners = new Set<() => void>();

	public getSnapshot(): BrnDrawerVisualState {
		return this._state;
	}

	public set(nextState: Partial<BrnDrawerVisualState>): void {
		const finite = (value: number | undefined, fallback: number) =>
			value === undefined ? fallback : Number.isFinite(value) ? value : 0;
		const swipeProgress = finite(nextState.swipeProgress, this._state.swipeProgress);
		const frontmostHeight = finite(nextState.frontmostHeight, this._state.frontmostHeight);
		if (swipeProgress === this._state.swipeProgress && frontmostHeight === this._state.frontmostHeight) return;

		this._state = { swipeProgress, frontmostHeight };
		this._listeners.forEach((listener) => listener());
	}

	public subscribe(listener: () => void): () => void {
		this._listeners.add(listener);
		return () => this._listeners.delete(listener);
	}
}

/**
 * Tracks the drawers opened within it, so `brnDrawerIndent` and `brnDrawerIndentBackground` can
 * react to them. Only drawers declared inside its subtree report to it.
 */
@Directive({
	selector: '[brnDrawerProvider],brn-drawer-provider',
	exportAs: 'brnDrawerProvider',
})
export class BrnDrawerProvider {
	private readonly _openDrawers = signal<ReadonlySet<object>>(new Set());

	/** Whether any drawer in the provider is open. */
	public readonly active = computed(() => this._openDrawers().size > 0);
	public readonly visualStateStore = new BrnDrawerVisualStateStore();

	public setDrawerOpen(drawer: object, open: boolean): void {
		const openDrawers = this._openDrawers();
		if (openDrawers.has(drawer) === open) return;

		const next = new Set(openDrawers);
		if (open) {
			next.add(drawer);
		} else {
			next.delete(drawer);
		}
		this._openDrawers.set(next);
	}

	public removeDrawer(drawer: object): void {
		this.setDrawerOpen(drawer, false);
	}
}
