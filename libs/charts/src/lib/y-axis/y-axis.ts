import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { AxisOrientation, AxisType, DataKey, Domain, LabelConfig, TickFormatter } from '../types';

/**
 * Y-axis configuration component.
 * Does not render anything - provides configuration to parent chart.
 */
@Component({
	selector: 'spn-y-axis',
	template: '',
	host: { style: 'display: none' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnYAxis {
	// Configuration inputs - exposed to parent chart
	readonly dataKey = input<DataKey>('');
	readonly type = input<AxisType>('number');
	readonly domain = input<Domain>(['auto', 'auto']);
	readonly orientation = input<AxisOrientation>('left');
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
}
