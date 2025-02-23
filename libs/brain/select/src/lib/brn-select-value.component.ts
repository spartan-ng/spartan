import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { injectBrnSelect } from './brn-select.token';

@Component({
	selector: 'brn-select-value, hlm-select-value',
	template: `
		{{ value() || placeholder() }}
	`,
	host: {
		'[id]': 'id()',
	},
	styles: [
		`
			:host {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				white-space: nowrap;
				pointer-events: none;
			}
		`,
	],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnSelectValueComponent<T> {
	private readonly _select = injectBrnSelect<T>();
	public readonly id = computed(() => `${this._select.id()}--value`);
	public readonly placeholder = computed(() => this._select.placeholder());

	protected readonly value = computed(() => {
		const value = Array.isArray(this._select.value()) ? (this._select.value() as T[]) : ([this._select.value()] as T[]);

		if (value.length === 0) {
			return null;
		}

		const selectedOption = value.map((val) => this._select.options().find((option) => option.value === val));

		if (selectedOption.length === 0) {
			return null;
		}

		const selectedLabels = selectedOption.map((option) => option?.getLabel());

		if (this._select.dir() === 'rtl') {
			selectedLabels.reverse();
		}
		return this.transformFn()(selectedLabels);
	});

	public readonly transformFn = input<(values: (string | undefined)[]) => any>((values) => (values ?? []).join(', '));
}
