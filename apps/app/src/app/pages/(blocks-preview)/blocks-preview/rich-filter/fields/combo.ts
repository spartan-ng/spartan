/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { provideIcons } from '@ng-icons/core';

import { FocusMonitor } from '@angular/cdk/a11y';
import { FormsModule } from '@angular/forms';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { FAKE_FOCUS_ORIGIN } from '../engine/constants';
import { FHandler } from '../engine/handlers';
import { IdentityOperators } from '../engine/operators';
import { FILTER_HANDLER } from '../engine/token';
import { FieldTypes } from '../engine/types';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FocusElementOptions } from './utils/focus-element';

@Component({
	selector: 'spartan-rich-filter-combo-field',
	imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		// HlmInputImports,
		HlmPopoverImports,
		HlmComboboxImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
		// TODO replace with signals form as soon as spartan supports them
		FormsModule,
	],
	providers: [provideIcons({ lucideLink2, lucideX })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {},
	template: `
		<div
			hlmButtonGroup
			class="[&_hlm-input-group]:!rounded-none [&_hlm-input-group]:!border-l-0 [&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
		>
			<!-- label -->
			<spartan-rich-filter-field-label [label]="service.controlLabel()" [for]="service.formId()" />
			<!-- operator dropdown -->
			<spartan-rich-filter-field-operator
				[operatorValue]="service.operatorValue()"
				(operatorValueChange)="service.setOperator($event)"
				[operators]="operators"
			/>

			<!-- select field with options -->
			<hlm-combobox [ngModel]="service.controlValue()" (ngModelChange)="service.updateControl($event)">
				<hlm-combobox-input
					[id]="service.formId()"
					#monitoredInput
					[placeholder]="service.placeholder()"
					class="rounded-none border-l-0"
				/>
				<hlm-combobox-content *hlmComboboxPortal>
					<hlm-combobox-empty>No items found.</hlm-combobox-empty>
					<div hlmComboboxList>
						@for (framework of service.options(); track $index) {
							<hlm-combobox-item [value]="framework">{{ framework.label }}</hlm-combobox-item>
						}
					</div>
				</hlm-combobox-content>
			</hlm-combobox>

			<!-- close button -->
			<spartan-rich-filter-field-close (fieldclosed)="service.closeField()" />
		</div>
	`,
})
export class ComboField implements FocusElementOptions {
	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.combobox>;

	public readonly operators = IdentityOperators;

	public readonly focusMonitor = inject(FocusMonitor);

	public readonly monitoredInput = viewChild.required('monitoredInput', { read: ElementRef<HTMLElement> });
	public readonly onFocusElement = effect(() => {
		// TODO fix combobox api to expose a reference to the input element
		// to make it possible to focus without querying the DOM
		const el = this.monitoredInput().nativeElement.querySelector('input[brnComboboxInput]');
		this.service.isFocused() && this.focusMonitor.focusVia(el, FAKE_FOCUS_ORIGIN);
	});
}
