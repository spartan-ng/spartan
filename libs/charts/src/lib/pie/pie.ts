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
import {
	ChartData,
	DataKey,
	DEFAULT_PIE_COLORS,
	dimensionAttribute,
	PieLabelConfig,
	PieLabelLineConfig,
} from '../types';

/**
 * Pie configuration component.
 * Does not render anything - provides configuration to parent chart.
 * Registers itself with the chart context for tooltips and legends.
 */
@Component({
	selector: 'spn-pie',
	template: '',
	host: { style: 'display: none' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnPie<T = unknown> implements OnDestroy {
	private readonly chartContext = inject(ChartContextService, {
		optional: true,
	});
	private readonly elementId = `pie-${Math.random().toString(36).substr(2, 9)}`;

	// Data configuration
	readonly data = input<ChartData<T>>(); // Optional - for nested charts with different data
	readonly dataKey = input.required<DataKey<T>>(); // Value field
	readonly nameKey = input<DataKey<T>>(); // Category/label field

	// Radius configuration (supports number or percentage string like '80%')
	readonly innerRadius = input<string | number, string | number>(0, { transform: dimensionAttribute }); // 0 = pie, >0 = donut
	readonly outerRadius = input<string | number, string | number>('80%', { transform: dimensionAttribute });

	// Angle configuration (degrees)
	readonly startAngle = input(0, { transform: numberAttribute });
	readonly endAngle = input(360, { transform: numberAttribute });
	readonly paddingAngle = input(0, { transform: numberAttribute }); // Gap between sectors

	// Styling configuration
	readonly fill = input<string>('#8884d8'); // Default fill color
	readonly colors = input<string[]>(DEFAULT_PIE_COLORS); // Color palette for sectors
	readonly stroke = input<string>('#fff');
	readonly strokeWidth = input(1, { transform: numberAttribute });
	readonly cornerRadius = input(0, { transform: numberAttribute }); // Rounded sector corners

	// Highlight one sector by index with an enlarged "active shape" (recharts activeShape).
	readonly activeIndex = input(-1, { transform: numberAttribute });
	// Draw a detached outer ring around the active sector (used by the interactive pie).
	readonly activeRing = input(false, { transform: booleanAttribute });

	// Label configuration
	readonly label = input<boolean | PieLabelConfig>(false);
	readonly labelLine = input<boolean | PieLabelLineConfig>(false);

	// Animation configuration
	readonly isAnimationActive = input(true, { transform: booleanAttribute });
	readonly animationDuration = input(400, { transform: numberAttribute });
	readonly animationEasing = input<string>('ease-in-out');

	// Hover effects configuration
	readonly hoverFill = input<string>(); // Fill color on hover (default: inherit)
	readonly hoverStroke = input<string>(); // Stroke color on hover (default: inherit)
	readonly hoverStrokeWidth = input<number>(); // Stroke width on hover (default: inherit)
	readonly hoverOpacity = input(1, { transform: numberAttribute }); // Opacity on hover
	readonly dimOthers = input(false, { transform: booleanAttribute }); // Dim non-hovered elements
	readonly dimOpacity = input(0.3, { transform: numberAttribute }); // Opacity of dimmed elements
	readonly hoverTransitionDuration = input(150, { transform: numberAttribute }); // Transition duration in ms
	readonly hoverExplodeOffset = input(0, { transform: numberAttribute }); // Offset to "explode" slice outward on hover

	// Identification
	readonly name = input<string>();
	readonly hide = input(false, { transform: booleanAttribute });

	constructor() {
		// Register this pie with the chart context for tooltips and legends
		const chartContext = this.chartContext;
		if (chartContext) {
			effect(() => {
				chartContext.registerGraphicalElement({
					id: this.elementId,
					dataKey: this.dataKey() as DataKey,
					name: this.name() || String(this.dataKey()),
					color: this.fill(),
					type: 'pie',
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
