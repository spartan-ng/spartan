import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';

/**
 * CartesianGrid configuration component.
 * Does not render anything - provides configuration to parent chart.
 */
@Component({
	selector: 'spn-cartesian-grid',
	template: '',
	host: { style: 'display: none' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnCartesianGrid {
	// Configuration inputs
	readonly horizontal = input(true, { transform: booleanAttribute });
	readonly vertical = input(true, { transform: booleanAttribute });
	readonly horizontalPoints = input<number[]>();
	readonly verticalPoints = input<number[]>();
	readonly stroke = input('#ccc');
	readonly strokeWidth = input(1, { transform: numberAttribute });
	readonly strokeDasharray = input('');
}
