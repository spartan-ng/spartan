import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	input,
	numberAttribute,
	OnDestroy,
} from '@angular/core';
import { ChartContextService } from '../chart-context.service';
import { DataKey } from '../types';

/**
 * Radial bar configuration component.
 * Does not render anything - provides configuration to the parent SpnRadialBarChart.
 * One <spn-radial-bar> renders one ring per datum (or, when a stackId is set,
 * a stacked arc segment per datum).
 */
@Component({
	selector: 'spn-radial-bar',
	template: '',
	host: { style: 'display: none' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnRadialBar<T = unknown> implements OnDestroy {
	private readonly chartContext = inject(ChartContextService, { optional: true });
	private readonly elementId = `radial-bar-${Math.random().toString(36).substr(2, 9)}`;

	/** Value field for this series. */
	readonly dataKey = input.required<DataKey<T>>();
	/** Category/label field (used for the per-ring legend + label). */
	readonly nameKey = input<DataKey<T>>();

	/** Optional series-specific fill (used for stacked variants). Falls back to per-datum fill. */
	readonly fill = input<string>();
	/** Stack id - bars sharing a stackId are stacked along the angle axis. */
	readonly stackId = input<string>();

	/** Draw a faint background track behind each bar. */
	readonly background = input(false, { transform: booleanAttribute });
	/** Rounded corners on the arc ends. */
	readonly cornerRadius = input(0, { transform: numberAttribute });

	readonly stroke = input<string>();
	readonly strokeWidth = input(0, { transform: numberAttribute });

	/** Optional per-datum label drawn inside the arc start (e.g. the category name). */
	readonly label = input(false, { transform: booleanAttribute });
	/** Field to use for the label text (defaults to nameKey). */
	readonly labelKey = input<DataKey<T>>();

	readonly isAnimationActive = input(true, { transform: booleanAttribute });
	readonly animationDuration = input(400, { transform: numberAttribute });
	readonly name = input<string>();
	readonly hide = input(false, { transform: booleanAttribute });

	constructor() {
		const chartContext = this.chartContext;
		if (chartContext) {
			effect(() => {
				chartContext.registerGraphicalElement({
					id: this.elementId,
					dataKey: this.dataKey() as DataKey,
					name: this.name() || String(this.dataKey()),
					color: this.fill() ?? '#8884d8',
					type: 'pie',
					hide: this.hide(),
				});
			});
		}
	}

	ngOnDestroy(): void {
		this.chartContext?.unregisterGraphicalElement(this.elementId);
	}
}
