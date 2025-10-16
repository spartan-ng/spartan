/* eslint-disable @angular-eslint/directive-selector */
import type { NumberInput } from '@angular/cdk/coercion';
import { Directive, type OnChanges, type SimpleChanges, computed, input, numberAttribute } from '@angular/core';
import { provideBrnProgress } from './brn-progress.token';

@Directive({
	selector: 'brn-progress',
	exportAs: 'brnProgress',
	providers: [provideBrnProgress(BrnProgress)],
	host: {
		role: 'progressbar',
		'[attr.aria-valuemax]': 'max()',
		'[attr.aria-valuemin]': '0',
		'[attr.aria-valuenow]': 'value()',
		'[attr.aria-valuetext]': '_label()',
		'[attr.data-state]': 'state()',
		'[attr.data-value]': 'value()',
		'[attr.data-max]': 'max()',
	},
})
export class BrnProgress implements OnChanges {
	/**
	 * The current progress value.
	 */
	public readonly value = input<number | null | undefined, NumberInput>(undefined, {
		transform: (value) => (value === undefined || value === null ? undefined : Number(value)),
	});

	/**
	 * The maximum progress value.
	 */
	public readonly max = input<number, NumberInput>(100, { transform: numberAttribute });

	/**
	 * A function that returns the label for the current progress value.
	 */
	public readonly getValueLabel = input<BrnProgressLabelFn>((value, max) => `${Math.round((value / max) * 100)}%`);

	protected readonly _label = computed(() => {
		const value = this.value();
		return value === null || value === undefined ? undefined : this.getValueLabel()(value, this.max());
	});

	public readonly state = computed(() => {
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
