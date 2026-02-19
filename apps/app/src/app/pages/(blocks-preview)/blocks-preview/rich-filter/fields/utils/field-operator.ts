import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { IOperator } from '../../engine/operators';

@Component({selector: 'spartan-rich-filter-field-operator',
imports: [BrnSelectImports, HlmSelectImports],
changeDetection: ChangeDetectionStrategy.OnPush,
host: { style: 'display: contents' },
template: `
		<brn-select
			class="[&>div>hlm-select-trigger>button]:border-l-none [&>div>hlm-select-trigger>button]:border-r-none inline-block [&>div>hlm-select-trigger>button]:rounded-none"
			placeholder="Select an option"
			[value]="operatorValue()"
			(valueChange)="operatorValueChange.emit($event)"
		>
			<hlm-select-trigger>
				<hlm-select-value>
					<div *brnSelectValue="let value">
						<span>{{ value }}</span>
					</div>
				</hlm-select-value>
			</hlm-select-trigger>
			<hlm-select-content class="!min-w-52">
				@for (operator of _operators(); track operator.key) {
					<hlm-option [value]="operator.value">
						<span>
							{{ operator.value }}
						</span>
						<span class="text-muted-foreground">{{ operator.key }}</span>
					</hlm-option>
				}
			</hlm-select-content>
		</brn-select>
	`})
export class FieldOperator {


	public readonly operators = input.required<Record<string, string>>();

	protected readonly _operators = computed(() =>
		Object.entries(this.operators()).map(([key, value]) => ({ key, value })),
	);

	public operatorValue = input.required<IOperator | IOperator[] | undefined>();

	public operatorValueChange = output<IOperator | IOperator[] | undefined>();


	// updateControlValue(value: IOperator | IOperator[] | undefined) {
	// 	console.log('Selected operator:', value);
	// 	if (value !== undefined) {
	// 		this.state().patchFieldOperator(this.fieldId(), Array.isArray(value) ? (value.at(0) as IOperator) : value);
	// 	} else {
	// 		// TODO check if this edge case is ever hit
	// 		throw new Error('Operator value is undefined');
	// 	}
	// }
}
