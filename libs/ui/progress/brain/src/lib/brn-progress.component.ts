import { type NumberInput } from '@angular/cdk/coercion';
import { Component, OnChanges, SimpleChanges, computed, input, numberAttribute } from '@angular/core';
import { provideBrnProgress } from './brn-progress.token';

@Component({
	selector: 'brn-progress',
	standalone: true,
	template: '<ng-content/>',
	exportAs: 'brnProgress',
	providers: [provideBrnProgress(BrnProgressComponent)],
	host: {
		role: 'progressbar',
		'[attr.aria-valuemax]': 'max()',
		'[attr.aria-valuemin]': '0',
		'[attr.aria-valuenow]': 'value()',
		'[attr.aria-valuetext]': 'label()',
		'[attr.data-state]': 'state()',
		'[attr.data-value]': 'value()',
		'[attr.data-max]': 'max()',
	},
})
export class BrnProgressComponent implements OnChanges {
	public readonly value = input<number | null | undefined, NumberInput>(undefined, {
		transform: (value) => (value === undefined || value === null ? undefined : Number(value)),
	});
	public readonly max = input<number, NumberInput>(100, { transform: numberAttribute });
	public readonly getValueLabel = input<BrnProgressLabelFn>((value, max) => `${Math.round((value / max) * 100)}%`);
	protected readonly label = computed(() => {
		const value = this.value();
		return value === null || value === undefined ? undefined : this.getValueLabel()(value, this.max());
	});

	protected readonly state = computed(() => {
		const value = this.value();
		const max = this.max();

		return value === null || value === undefined ? 'indeterminate' : value === max ? 'complete' : 'loading';
	});

	ngOnChanges(changes: SimpleChanges): void {
		if ('value' in changes || 'max' in changes) {
			this.validate();
		}
	}

	private validate(): void {
		// validate that the value is within the bounds of the max
		const value = this.value();
		const max = this.max();

		if (value === null || value === undefined) {
			return;
		}

		if (value > max || value < 0) {
			throw Error('Value must be 0 or greater and less or equal to max');
		}

		if (max < 0) {
			throw Error('max must be greater than 0');
		}
	}
}

export type BrnProgressLabelFn = (value: number, max: number) => string;
