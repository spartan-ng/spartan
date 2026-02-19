/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectionStrategy, Component, effect, inject, viewChild } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTimeInput, HlmTimeInputImports } from '@spartan-ng/helm/time-input';
import { FHandler } from '../engine/handlers';
import { TimeOperators } from '../engine/operators';
import { FILTER_HANDLER } from '../engine/token';
import { FieldTypes } from '../engine/types';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';

@Component({selector: 'spartan-rich-filter-time-field',
imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmTimeInputImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
	],
providers: [provideIcons({ lucideLink2, lucideX })],
changeDetection: ChangeDetectionStrategy.OnPush,
host: {},
template: `
		<div
			hlmButtonGroup
			class="[&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
		>
			<!-- label -->
			<spartan-rich-filter-field-label [label]="service.controlLabel()" [for]="service.formId()" />
			<!-- operator dropdown -->
			<spartan-rich-filter-field-operator
				[operatorValue]="service.operatorValue()"
				(operatorValueChange)="service.setOperator($event)"
				[operators]="operators"
			/>

			<!-- time input -->
			<hlm-time-input
				[displaySeconds]="true"
				class="dark:bg-input/30 rounded-none border-l-0 bg-transparent shadow-none focus-within:ring-0 focus-within:ring-transparent"
				[value]="service.controlValue()"
				(valueChange)="service.updateControl($event)"
			/>

			<!-- close button -->
			<spartan-rich-filter-field-close (fieldclosed)="service.closeField()" />
		</div>
	`})
export class TimeField {
	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.time>;

	private readonly timeInput = viewChild.required(HlmTimeInput);

	public readonly operators = TimeOperators;

	public readonly onFocusElement = effect(() => {
		this.service.isFocused() && this.timeInput().focus();
	});
}
