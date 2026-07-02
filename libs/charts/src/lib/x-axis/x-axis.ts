import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { AxisOrientation, AxisType, DataKey, Domain, LabelConfig, TickFormatter } from '../types';

/**
 * X-axis configuration component.
 * Does not render anything - provides configuration to parent chart.
 */
@Component({
	selector: 'spn-x-axis',
	template: '',
	host: { style: 'display: none' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnXAxis {
	// Configuration inputs - exposed to parent chart
	readonly dataKey = input<DataKey>('');
	readonly type = input<AxisType>('category');
	readonly domain = input<Domain>(['auto', 'auto']);
	readonly orientation = input<AxisOrientation>('bottom');
	readonly axisId = input<string>('default');
	readonly hide = input(false, { transform: booleanAttribute });
	readonly axisLine = input(true, { transform: booleanAttribute });
	readonly tickLine = input(true, { transform: booleanAttribute });
	readonly label = input<string | LabelConfig>();
	readonly tickFormatter = input<TickFormatter>();
	readonly ticks = input<number, unknown>(undefined, {
		transform: numberAttribute,
	});
	readonly tickSize = input(6, { transform: numberAttribute });
	readonly tickPadding = input(3, { transform: numberAttribute });
	readonly stroke = input<string>('#666');
	/**
	 * Minimum gap (in px) between rendered tick labels. Labels closer than this
	 * are dropped, anchored at the last tick (recharts `minTickGap`, preserveEnd).
	 * 0 keeps every tick.
	 */
	readonly minTickGap = input(0, { transform: numberAttribute });
}
