/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { provideIcons } from '@ng-icons/core';

import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmRangeSliderImports } from '@spartan-ng/helm/range-slider';
import { RangeOperators } from '../engine/operators';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FieldTypes } from '../engine/types';
import { FHandler } from '../engine/handlers';
import { FILTER_HANDLER } from '../engine/token';
import { FocusMonitor } from '@angular/cdk/a11y';
import { FocusElementOptions } from './utils/focus-element';
import { FAKE_FOCUS_ORIGIN } from '../engine/constants';

@Component({selector: 'spartan-rich-filter-range-field',
imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		// HlmInputImports,
		HlmPopoverImports,
		HlmRangeSliderImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
	],
providers: [provideIcons({ lucideLink2, lucideX })],
changeDetection: ChangeDetectionStrategy.OnPush,
host: {},
template: `
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

				<!-- popover with slider -->
				<button
					class="focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
					#monitoredInput
					variant="outline"
					hlmPopoverTrigger
					hlmBtn
					variant="outline"
				>
					{{ _displayRange() }}
				</button>
				<hlm-popover-content class="rounded-xl p-0 text-sm" *hlmPopoverPortal="let ctx">
					<div class="p-4 text-sm">
						<hlm-range-slider
							[min]="service.min()"
							[max]="service.max()"
							[value]="service.controlValue()"
							(valueChange)="service.updateControl($event)"
						/>
					</div>
				</hlm-popover-content>

				<!-- close button -->
				<spartan-rich-filter-field-close (fieldclosed)="service.closeField()" />
			</div>
		</hlm-popover>
	`})
export class RangeField implements FocusElementOptions {
	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.range>;

	protected readonly _displayRange = computed(() => {
		const [low, high] = this.service.controlValue();
		return `${low >= 0 ? low : `(${low})`} - ${high >= 0 ? high : `(${high})`}`;
	});

	public readonly operators = RangeOperators;

	public readonly focusMonitor = inject(FocusMonitor);

	public readonly monitoredInput = viewChild.required('monitoredInput', { read: ElementRef<HTMLElement> });

	public readonly onFocusElement = effect(() => {
		this.service.isFocused() && this.focusMonitor.focusVia(this.monitoredInput(), FAKE_FOCUS_ORIGIN);
	});
}
