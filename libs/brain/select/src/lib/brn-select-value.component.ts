import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, input } from '@angular/core';
import { BrnSelectPlaceholderDirective } from './brn-select-placeholder.directive';
import { BrnSelectValueDirective } from './brn-select-value.directive';
import { injectBrnSelect } from './brn-select.token';

@Component({
	selector: 'brn-select-value, hlm-select-value',
	imports: [NgTemplateOutlet],
	template: `
		@if (_showPlaceholder()) {
			<ng-container [ngTemplateOutlet]="customPlaceholderTemplate()?.templateRef ?? defaultPlaceholderTemplate" />
		} @else {
			<ng-container
				[ngTemplateOutlet]="customValueTemplate()?.templateRef ?? defaultValueTemplate"
				[ngTemplateOutletContext]="{ $implicit: _select.value() }"
			/>
		}

		<ng-template #defaultValueTemplate>{{ value() }}</ng-template>
		<ng-template #defaultPlaceholderTemplate>{{ placeholder() }}</ng-template>
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
	protected readonly _select = injectBrnSelect<T>();
	public readonly id = computed(() => `${this._select.id()}--value`);
	public readonly placeholder = computed(() => this._select.placeholder());

	protected readonly _showPlaceholder = computed(
		() => this.value() === null || this.value() === undefined || this.value() === '',
	);

	/** Allow a custom value template */
	protected readonly customValueTemplate = contentChild(BrnSelectValueDirective, { descendants: true });
	protected readonly customPlaceholderTemplate = contentChild(BrnSelectPlaceholderDirective, { descendants: true });

	protected readonly value = computed(() => {
		const value = this._values();

		if (value.length === 0) {
			return null;
		}

		// remove any selected values that are not in the options list
		const existingOptions = value.filter((val) => this._select.options().some((option) => option.value() === val));
		const selectedOption = existingOptions.map((val) =>
			this._select.options().find((option) => option.value() === val),
		);

		if (selectedOption.length === 0) {
			return null;
		}

		const selectedLabels = selectedOption.map((option) => option?.getLabel());

		if (this._select.dir() === 'rtl') {
			selectedLabels.reverse();
		}
		return this.transformFn()(selectedLabels);
	});

	/** Normalize the values as an array */
	protected readonly _values = computed(() =>
		Array.isArray(this._select.value()) ? (this._select.value() as T[]) : ([this._select.value()] as T[]),
	);

	public readonly transformFn = input<(values: (string | undefined)[]) => any>((values) => (values ?? []).join(', '));
}
