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
 * Radar series configuration component.
 * Does not render anything - provides configuration to the parent SpnRadarChart.
 * Each <spn-radar> describes one closed series (line and/or filled area).
 */
@Component({
	selector: 'spn-radar',
	template: '',
	host: { style: 'display: none' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnRadar<T = unknown> implements OnDestroy {
	private readonly chartContext = inject(ChartContextService, { optional: true });
	private readonly elementId = `radar-${Math.random().toString(36).substr(2, 9)}`;

	/** Value field for this series. */
	readonly dataKey = input.required<DataKey<T>>();

	/** Fill colour for the area. */
	readonly fill = input<string>('var(--chart-1)');
	/** Fill opacity (0 = lines only). */
	readonly fillOpacity = input(0.6, { transform: numberAttribute });

	/** Stroke colour (defaults to fill). */
	readonly stroke = input<string>();
	readonly strokeWidth = input(1, { transform: numberAttribute });

	/** Draw dots at each vertex. */
	readonly dot = input(false, { transform: booleanAttribute });
	readonly dotRadius = input(4, { transform: numberAttribute });

	readonly name = input<string>();
	readonly hide = input(false, { transform: booleanAttribute });

	// Animation configuration (scales the polygon out from the centre on load).
	readonly isAnimationActive = input(true, { transform: booleanAttribute });
	readonly animationDuration = input(400, { transform: numberAttribute });

	constructor() {
		const chartContext = this.chartContext;
		if (chartContext) {
			effect(() => {
				chartContext.registerGraphicalElement({
					id: this.elementId,
					dataKey: this.dataKey() as DataKey,
					name: this.name() || String(this.dataKey()),
					color: this.fill(),
					type: 'area',
					hide: this.hide(),
				});
			});
		}
	}

	ngOnDestroy(): void {
		this.chartContext?.unregisterGraphicalElement(this.elementId);
	}
}
