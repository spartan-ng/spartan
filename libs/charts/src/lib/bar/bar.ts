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
import { BarLabelConfig, BarRadius, barRadiusAttribute, DataKey } from '../types';

/**
 * Bar configuration component.
 * Does not render anything - provides configuration to parent chart.
 * Registers itself with the chart context for tooltips and legends.
 */
@Component({
	selector: 'spn-bar',
	template: '',
	host: { style: 'display: none' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnBar implements OnDestroy {
	private readonly chartContext = inject(ChartContextService, {
		optional: true,
	});
	private readonly elementId = `bar-${Math.random().toString(36).substr(2, 9)}`;

	// Required - data key for bar values
	readonly dataKey = input.required<DataKey>();

	// Display configuration
	readonly name = input<string>();
	readonly fill = input<string>('#8884d8');
	readonly stroke = input<string>();
	readonly strokeWidth = input(0, { transform: numberAttribute });
	readonly radius = input<BarRadius, BarRadius | string>(0, { transform: barRadiusAttribute });

	// Statically highlight one bar by data index (recharts custom active shape):
	// reduced fill opacity + a dashed stroke in the bar's own colour.
	readonly activeIndex = input(-1, { transform: numberAttribute });
	readonly activeFillOpacity = input(0.8, { transform: numberAttribute });
	readonly activeStrokeDasharray = input<string>();

	// Grouping configuration
	readonly stackId = input<string>(); // Group bars for stacking
	readonly xAxisId = input<string>('default');
	readonly yAxisId = input<string>('default');

	// Visibility
	readonly hide = input(false, { transform: booleanAttribute });

	// Animation configuration
	readonly isAnimationActive = input(true, { transform: booleanAttribute });
	readonly animationDuration = input(400, { transform: numberAttribute });
	readonly animationEasing = input<string>('ease-in-out');

	// Labels configuration (a single label or several per bar)
	readonly label = input<boolean | BarLabelConfig | BarLabelConfig[]>(false);

	// Hover effects configuration
	readonly hoverFill = input<string>(); // Fill color on hover (default: inherit)
	readonly hoverStroke = input<string>(); // Stroke color on hover (default: inherit)
	readonly hoverStrokeWidth = input<number>(); // Stroke width on hover (default: inherit)
	readonly hoverOpacity = input(1, { transform: numberAttribute }); // Opacity on hover
	readonly dimOthers = input(false, { transform: booleanAttribute }); // Dim non-hovered elements
	readonly dimOpacity = input(0.3, { transform: numberAttribute }); // Opacity of dimmed elements
	readonly hoverTransitionDuration = input(150, { transform: numberAttribute }); // Transition duration in ms

	constructor() {
		// Register this bar with the chart context for tooltips and legends
		const chartContext = this.chartContext;
		if (chartContext) {
			effect(() => {
				chartContext.registerGraphicalElement({
					id: this.elementId,
					dataKey: this.dataKey(),
					name: this.name() || String(this.dataKey()),
					color: this.fill(),
					type: 'bar',
					hide: this.hide(),
				});
			});
		}
	}

	ngOnDestroy(): void {
		// Unregister when component is destroyed
		if (this.chartContext) {
			this.chartContext.unregisterGraphicalElement(this.elementId);
		}
	}
}
