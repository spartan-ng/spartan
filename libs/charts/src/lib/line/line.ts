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
import { CurveType, DataKey, LineDotRenderer } from '../types';

/**
 * Line configuration component.
 * Does not render anything - provides configuration to parent chart.
 * Registers itself with the chart context for tooltips and legends.
 */
@Component({
	selector: 'spn-line',
	template: '',
	host: { style: 'display: none' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnLine implements OnDestroy {
	private readonly chartContext = inject(ChartContextService, {
		optional: true,
	});
	private readonly elementId = `line-${Math.random().toString(36).substr(2, 9)}`;

	// Configuration inputs - exposed to parent chart
	readonly dataKey = input.required<DataKey>();
	readonly name = input<string>();
	readonly stroke = input<string>('#8884d8');
	readonly strokeWidth = input(2, { transform: numberAttribute });
	readonly fill = input<string>('none');
	readonly curve = input<CurveType>('linear');
	readonly xAxisId = input<string>('default');
	readonly yAxisId = input<string>('default');
	readonly hide = input(false, { transform: booleanAttribute });
	readonly dot = input(false, { transform: booleanAttribute });
	readonly dotSize = input(4, { transform: numberAttribute });
	readonly dotFill = input<string>(); // Defaults to line stroke
	readonly dotStroke = input<string>('#fff');
	readonly dotStrokeWidth = input(2, { transform: numberAttribute });
	/**
	 * Optional custom dot. Receives each point's position, index and datum and returns an SVG
	 * fragment drawn centred on the dot (a `translate(cx,cy)` is already applied). Mirrors the
	 * render-prop dots in the shadcn charts (e.g. per-datum colours or an icon per point).
	 */
	readonly dotRenderer = input<LineDotRenderer>();
	readonly activeDot = input(true, { transform: booleanAttribute });
	readonly activeDotSize = input(6, { transform: numberAttribute });
	readonly activeDotFill = input<string>(); // Defaults to line stroke
	readonly activeDotStroke = input<string>('#fff');
	readonly activeDotStrokeWidth = input(2, { transform: numberAttribute });
	readonly isAnimationActive = input(true, { transform: booleanAttribute });
	readonly animationDuration = input(400, { transform: numberAttribute });
	readonly animationEasing = input<string>('ease-in-out');

	// Hover effects
	readonly hoverStroke = input<string>();
	readonly hoverStrokeWidth = input<number>();
	readonly hoverOpacity = input(1, { transform: numberAttribute });
	readonly dimOthers = input(false, { transform: booleanAttribute });
	readonly dimOpacity = input(0.3, { transform: numberAttribute });
	readonly hoverTransitionDuration = input(150, { transform: numberAttribute });

	constructor() {
		// Register this line with the chart context for tooltips and legends
		const chartContext = this.chartContext;
		if (chartContext) {
			effect(() => {
				chartContext.registerGraphicalElement({
					id: this.elementId,
					dataKey: this.dataKey(),
					name: this.name() || String(this.dataKey()),
					color: this.stroke(),
					type: 'line',
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
