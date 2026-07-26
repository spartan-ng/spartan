import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';

/**
 * Polar grid configuration component for radar charts.
 * Does not render anything - provides configuration to the parent SpnRadarChart.
 */
@Component({
	selector: 'spn-polar-grid',
	template: '',
	host: { style: 'display: none' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnPolarGrid {
	/** 'polygon' (default, equiangular polygon rings) or 'circle' (concentric circles). */
	readonly gridType = input<'polygon' | 'circle'>('polygon');
	/** Draw the radial spokes from centre to each axis. */
	readonly radialLines = input(true, { transform: booleanAttribute });
	readonly stroke = input<string>('var(--border)');
	readonly strokeWidth = input(1, { transform: numberAttribute });

	/** Optional fill for the concentric grid rings (recharts grid-fill variant). */
	readonly fill = input<string>();
	readonly fillOpacity = input(1, { transform: numberAttribute });

	/**
	 * Explicit ring radii (px). When set, the grid draws exactly these concentric
	 * rings instead of the default evenly-spaced tick rings (recharts polarRadius).
	 */
	readonly polarRadius = input<number[] | undefined>(undefined);

	/** Hide the concentric rings entirely (used for the "no grid" radar variant). */
	readonly hideRings = input(false, { transform: booleanAttribute });
}
