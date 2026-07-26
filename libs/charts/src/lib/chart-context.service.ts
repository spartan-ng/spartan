import { computed, Injectable, signal } from '@angular/core';
import { ChartData, ChartLayout, ChartMargin, DataKey, DEFAULT_MARGIN, HoverState, Scale, TooltipState } from './types';

/**
 * Service that provides shared context for chart components.
 * Container components create and provide this service, while child components inject and consume it.
 */
@Injectable()
export class ChartContextService<T = unknown> {
	// Core chart data and configuration
	readonly data = signal<ChartData<T>>([]);
	readonly width = signal<number>(0);
	readonly height = signal<number>(0);
	readonly margin = signal<ChartMargin>(DEFAULT_MARGIN);
	readonly layout = signal<ChartLayout>('horizontal');

	// Computed inner dimensions (accounting for margin)
	readonly innerWidth = computed(() => {
		const w = this.width();
		const m = this.margin();
		return Math.max(0, w - m.left - m.right);
	});

	readonly innerHeight = computed(() => {
		const h = this.height();
		const m = this.margin();
		return Math.max(0, h - m.top - m.bottom);
	});

	// Scale maps for axes (allows multiple axes with different IDs)
	readonly xAxisMap = signal<Map<string, Scale>>(new Map());
	readonly yAxisMap = signal<Map<string, Scale>>(new Map());

	// Default scales (for components that don't specify an axis ID)
	readonly xScale = computed(() => this.xAxisMap().get('default'));
	readonly yScale = computed(() => this.yAxisMap().get('default'));

	// Graphical elements registry (for tooltips, legends, etc.)
	readonly graphicalElements = signal<
		Array<{
			id: string;
			dataKey: DataKey;
			name?: string;
			color?: string;
			type: 'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'histogram' | 'heatmap';
			hide?: boolean;
		}>
	>([]);

	// Tooltip state for hover interactions
	readonly tooltipData = signal<TooltipState<T> | null>(null);

	// Hover state for visual feedback
	readonly hoverState = signal<HoverState | null>(null);

	// Scale factors for responsive mode (viewBox to actual pixels)
	readonly scaleX = signal<number>(1);
	readonly scaleY = signal<number>(1);

	/**
	 * Register a scale for an axis
	 * Optimized to skip update if scale reference is unchanged
	 */
	registerXScale(scale: Scale, id = 'default'): void {
		this.xAxisMap.update((map) => {
			const existing = map.get(id);
			if (existing === scale) return map;
			const newMap = new Map(map);
			newMap.set(id, scale);
			return newMap;
		});
	}

	/**
	 * Register a scale for an axis
	 * Optimized to skip update if scale reference is unchanged
	 */
	registerYScale(scale: Scale, id = 'default'): void {
		this.yAxisMap.update((map) => {
			const existing = map.get(id);
			if (existing === scale) return map;
			const newMap = new Map(map);
			newMap.set(id, scale);
			return newMap;
		});
	}

	/**
	 * Register a graphical element (for tooltips, legends)
	 * Optimized to skip update if element properties are unchanged
	 */
	registerGraphicalElement(element: {
		id: string;
		dataKey: DataKey;
		name?: string;
		color?: string;
		type: 'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'histogram' | 'heatmap';
		hide?: boolean;
	}): void {
		this.graphicalElements.update((elements) => {
			const existingIndex = elements.findIndex((e) => e.id === element.id);

			// Check if element already exists with same properties
			if (existingIndex !== -1) {
				const existing = elements[existingIndex];
				if (
					existing.dataKey === element.dataKey &&
					existing.name === element.name &&
					existing.color === element.color &&
					existing.type === element.type &&
					existing.hide === element.hide
				) {
					return elements; // No change needed
				}
				// Update existing element
				const updated = [...elements];
				updated[existingIndex] = element;
				return updated;
			}

			// Add new element
			return [...elements, element];
		});
	}

	/**
	 * Unregister a graphical element
	 */
	unregisterGraphicalElement(id: string): void {
		this.graphicalElements.update((elements) => elements.filter((e) => e.id !== id));
	}

	/**
	 * Remove every registered graphical element of a given type. Used by container charts that
	 * re-register their elements on each render (e.g. pie sectors) so stale entries don't accumulate.
	 */
	clearGraphicalElementsByType(type: string): void {
		this.graphicalElements.update((elements) =>
			elements.some((e) => e.type === type) ? elements.filter((e) => e.type !== type) : elements,
		);
	}

	/**
	 * Get a scale by axis ID
	 */
	getXScale(id = 'default'): Scale | undefined {
		return this.xAxisMap().get(id);
	}

	/**
	 * Get a scale by axis ID
	 */
	getYScale(id = 'default'): Scale | undefined {
		return this.yAxisMap().get(id);
	}

	/**
	 * Set hover state for visual feedback
	 */
	setHoverState(state: HoverState | null): void {
		this.hoverState.set(state);
	}

	/**
	 * Clear hover state
	 */
	clearHoverState(): void {
		this.hoverState.set(null);
	}
}
