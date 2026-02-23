import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, input } from '@angular/core';
import { BrnSelectPlaceholder } from './brn-select-placeholder';
import { BrnSelectValueTemplate } from './brn-select-value-template';
import { injectBrnSelect } from './brn-select.token';

@Component({
	selector: 'brn-select-value, hlm-select-value',
	imports: [NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[id]': 'id()',
		'[attr.data-placeholder]': '_showPlaceholder() ? "" : null',
		'[style]': `{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', whiteSpace: 'nowrap', pointerEvents: 'none'	}`,
	},
	template: `
		@if (_showPlaceholder()) {
			<ng-container [ngTemplateOutlet]="_customPlaceholderTemplate()?.templateRef ?? defaultPlaceholderTemplate" />
		} @else {
			<ng-container
				[ngTemplateOutlet]="_customValueTemplate()?.templateRef ?? defaultValueTemplate"
				[ngTemplateOutletContext]="{ $implicit: _select.value() }"
			/>
		}

		<ng-template #defaultValueTemplate>{{ _value() }}</ng-template>
		<ng-template #defaultPlaceholderTemplate>{{ placeholder() }}</ng-template>
	`,
})
export class BrnSelectValue<T> {
	protected readonly _select = injectBrnSelect<T>();
	public readonly id = computed(() => `${this._select.id()}--value`);
	public readonly placeholder = computed(() => this._select.placeholder());

	protected readonly _showPlaceholder = computed(
		() => this._value() === null || this._value() === undefined || this._value() === '',
	);

	/** Allow a custom value template */
	protected readonly _customValueTemplate = contentChild(BrnSelectValueTemplate, { descendants: true });
	protected readonly _customPlaceholderTemplate = contentChild(BrnSelectPlaceholder, { descendants: true });

	protected readonly _value = computed(() => {
		const value = this._values();

		if (value.length === 0) {
			return null;
		}

		const options = this._select.options();

		// When options are not yet registered (e.g., overlay hasn't been opened yet in the portal pattern),
		// fall back to displaying the raw value so the placeholder isn't shown for pre-set values.
		if (options.length === 0) {
			const rawValues = value.filter((v) => v !== null && v !== undefined && v !== '');
			return rawValues.length > 0 ? this.transformFn()(rawValues as string[]) : null;
		}

		// remove any selected values that are not in the options list
		const existingOptions = value.filter((val) =>
			options.some((option) => this._select.compareWith()(option.value()!, val)),
		);
		const selectedOption = existingOptions.map((val) =>
			options.find((option) => this._select.compareWith()(option.value()!, val)),
		);

		if (selectedOption.length === 0) {
			return null;
		}

		const selectedLabels = selectedOption.map((option) => option?.getLabel());

		if (this._select.direction() === 'rtl') {
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
