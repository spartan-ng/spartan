import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';

/**
 * ReferenceLine configuration component.
 * Does not render anything - provides configuration to parent chart.
 */
@Component({
	selector: 'spn-reference-line',
	template: '',
	host: { style: 'display: none' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnReferenceLine {
	// Configuration inputs - one of x or y should be specified
	readonly x = input<number | string | Date>();
	readonly y = input<number | string | Date>();
	readonly xAxisId = input('default');
	readonly yAxisId = input('default');
	readonly stroke = input('#ff0000');
	readonly strokeWidth = input(1, { transform: numberAttribute });
	readonly strokeDasharray = input<string>();
	readonly label = input<string>();
	readonly isFront = input(false, { transform: booleanAttribute });
}
