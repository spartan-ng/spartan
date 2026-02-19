import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { FHandler } from '../engine/handlers';
import { EqualityOperators } from '../engine/operators';
import { FILTER_HANDLER } from '../engine/token';
import { FieldTypes } from '../engine/types';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FocusMonitor } from '@angular/cdk/a11y';
import { FocusElementOptions } from './utils/focus-element';
import { FAKE_FOCUS_ORIGIN } from '../engine/constants';

@Component({
	selector: 'spartan-rich-filter-number-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
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

			<!-- numeric input -->
			<input
				#monitoredInput
				class="w-28"
				hlmInput
				[id]="service.formId()"
				type="number"
				[ngModel]="service.controlValue()"
				(ngModelChange)="service.updateControl($event)"
				[min]="service.min()"
				[max]="service.max()"
				[step]="service.step()"
			/>
			<!-- close button -->
			<spartan-rich-filter-field-close (onCloseField)="service.closeField()" />
		</div>
	`,
})
export class NumberField implements FocusElementOptions {
	readonly focusMonitor = inject(FocusMonitor);

	readonly monitoredInput = viewChild.required('monitoredInput', { read: ElementRef<HTMLElement> });
	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.number>;

	readonly operators = EqualityOperators;
	readonly onFocusElement = effect(() => {
		this.service.isFocused() && this.focusMonitor.focusVia(this.monitoredInput(), FAKE_FOCUS_ORIGIN);
	});
}
