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
import { CurveType, DataKey } from '../types';

@Component({
	selector: 'spn-area',
	template: '',
	host: { style: 'display: none' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnArea implements OnDestroy {
	private readonly chartContext = inject(ChartContextService, {
		optional: true,
	});
	private readonly elementId = `area-${Math.random().toString(36).substr(2, 9)}`;

	readonly dataKey = input.required<DataKey>();
	readonly name = input<string>();
	readonly fill = input<string>('#8884d8');
	readonly fillOpacity = input(0.6, { transform: numberAttribute });
	/**
	 * Fill the area with a vertical linear gradient of `fill` instead of a flat
	 * colour (shadcn-style: ~0.8 opacity at the top fading to ~0.1 at the
	 * bottom). The chart renders the `<linearGradient>` def and the path
	 * references it; `fillOpacity` still applies on top.
	 */
	readonly fillGradient = input(false, { transform: booleanAttribute });
	readonly stroke = input<string>('#8884d8');
	readonly strokeWidth = input(2, { transform: numberAttribute });
	readonly curve = input<CurveType>('linear');
	readonly stackId = input<string>();
	readonly xAxisId = input<string>('default');
	readonly yAxisId = input<string>('default');
	readonly hide = input(false, { transform: booleanAttribute });
	readonly dot = input(false, { transform: booleanAttribute });
	readonly dotSize = input(4, { transform: numberAttribute });
	readonly dotFill = input<string>();
	readonly dotStroke = input<string>('#fff');
	readonly dotStrokeWidth = input(2, { transform: numberAttribute });
	readonly activeDot = input(true, { transform: booleanAttribute });
	readonly activeDotSize = input(6, { transform: numberAttribute });
	readonly activeDotFill = input<string>();
	readonly activeDotStroke = input<string>('#fff');
	readonly activeDotStrokeWidth = input(2, { transform: numberAttribute });
	readonly isAnimationActive = input(true, { transform: booleanAttribute });
	readonly animationDuration = input(400, { transform: numberAttribute });
	readonly animationEasing = input<string>('ease-in-out');

	constructor() {
		const chartContext = this.chartContext;
		if (chartContext) {
			effect(() => {
				chartContext.registerGraphicalElement({
					id: this.elementId,
					dataKey: this.dataKey(),
					name: this.name() || String(this.dataKey()),
					color: this.fill(),
					type: 'area',
					hide: this.hide(),
				});
			});
		}
	}

	ngOnDestroy(): void {
		if (this.chartContext) {
			this.chartContext.unregisterGraphicalElement(this.elementId);
		}
	}
}
