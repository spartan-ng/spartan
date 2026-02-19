/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { provideIcons } from '@ng-icons/core';

import { FocusMonitor } from '@angular/cdk/a11y';
import { FormsModule } from '@angular/forms';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { FAKE_FOCUS_ORIGIN } from '../engine/constants';
import { FHandler } from '../engine/handlers';
import { TextOperators } from '../engine/operators';
import { FILTER_HANDLER } from '../engine/token';
import { FieldTypes } from '../engine/types';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FocusElementOptions } from './utils/focus-element';

@Component({
	selector: 'spartan-rich-filter-text-field',
	imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmInputImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
		// todo replace with signals form as soon as spartan supports them
		FormsModule,
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

			<!-- text input -->
			<input
				#monitoredInput
				class="w-40"
				hlmInput
				[id]="service.formId()"
				[ngModel]="service.controlValue()"
				(ngModelChange)="service.updateControl($event)"
				[required]="service.fieldRequired()"
			/>
			<!-- close button -->
			<spartan-rich-filter-field-close (fieldclosed)="service.closeField()" />
		</div>
	`,
})
export class TextField implements FocusElementOptions {
	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.text>;

	public readonly focusMonitor = inject(FocusMonitor);

	public readonly monitoredInput = viewChild.required('monitoredInput', { read: ElementRef<HTMLElement> });

	public readonly operators = TextOperators;

	public readonly onFocusElement = effect(() => {
		this.service.isFocused() && this.focusMonitor.focusVia(this.monitoredInput(), FAKE_FOCUS_ORIGIN);
	});
}
