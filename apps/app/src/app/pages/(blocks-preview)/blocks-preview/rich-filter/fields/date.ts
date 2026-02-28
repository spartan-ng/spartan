/* eslint-disable @typescript-eslint/naming-convention */
import { FocusMonitor } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { FAKE_FOCUS_ORIGIN } from '../engine/constants';
import { FHandler } from '../engine/handlers';
import { TimeOperators } from '../engine/operators';
import { FILTER_HANDLER } from '../engine/token';
import { FieldTypes } from '../engine/types';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FocusElementOptions } from './utils/focus-element';

@Component({
	selector: 'spartan-rich-filter-date-field',
	imports: [
		NgIcon,
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmPopoverImports,
		HlmCalendarImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
		DatePipe,
	],
	providers: [provideIcons({ lucideCalendar, lucideX })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {},
	template: `
		@let value = service.controlValue();
		<hlm-popover sideOffset="5" align="end">
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

				<!-- popover with calendar -->
				<button
					#monitoredInput
					hlmPopoverTrigger
					hlmBtn
					variant="outline"
					#dateTrigger
					class="focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
				>
					<ng-icon hlm name="lucideCalendar" size="sm" />
					{{ value | date: 'mediumDate' }}
				</button>
				<hlm-popover-content class="w-auto rounded-xl p-0" *hlmPopoverPortal="let ctx">
					<hlm-calendar
						[min]="service.min()"
						[max]="service.max()"
						[date]="value"
						(dateChange)="updateControlValue($event)"
					/>
				</hlm-popover-content>

				<!-- close button -->
				<spartan-rich-filter-field-close (fieldclosed)="service.closeField()" />
			</div>
		</hlm-popover>
	`,
})
export class DateField implements FocusElementOptions {
	private readonly popoverBtn = viewChild<ElementRef<HTMLButtonElement>>('dateTrigger');

	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.date>;

	public readonly focusMonitor = inject(FocusMonitor);

	public readonly monitoredInput = viewChild.required('monitoredInput', { read: ElementRef<HTMLElement> });

	public readonly operators = TimeOperators;

	updateControlValue(value: Date | null) {
		if (!value) return; // datepicker can return null, but null makes no sense in the context of the filter

		this.service.updateControl(value);
		Promise.resolve().then(() => {
			this.popoverBtn()?.nativeElement.click();
		});
	}
	public readonly onFocusElement = effect(() => {
		this.service.isFocused() && this.focusMonitor.focusVia(this.monitoredInput(), FAKE_FOCUS_ORIGIN);
	});
}
