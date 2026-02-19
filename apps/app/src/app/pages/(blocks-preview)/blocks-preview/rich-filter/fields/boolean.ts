/* eslint-disable @typescript-eslint/naming-convention */
import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { FHandler } from '../engine/handlers';
import { FILTER_HANDLER } from '../engine/token';
import { FieldTypes } from '../engine/types';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FocusElementOptions } from './utils/focus-element';
import { FAKE_FOCUS_ORIGIN } from '../engine/constants';

@Component({selector: 'spartan-rich-filter-boolean-field',
imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmInputImports,
		HlmCheckboxImports,
		FieldClose,
		FieldLabel,
	],
changeDetection: ChangeDetectionStrategy.OnPush,
host: {},
template: `
		<div
			hlmButtonGroup
			class="[&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
		>
			<!-- label -->
			<spartan-rich-filter-field-label [for]="service.formId()" [label]="service.controlLabel()" />
			<!-- operator dropdown -->

			<!-- boolean input -->
			<div hlmButtonGroupSeparator></div>

			<div hlmButtonGroupText class="dark:bg-input/30 bg-transparent">
				<hlm-checkbox
					#monitoredInput
					[id]="service.formId()"
					[checked]="service.controlValue()"
					(checkedChange)="service.updateControl($event)"
				/>
			</div>
			<!-- close button -->
			<spartan-rich-filter-field-close (fieldclosed)="service.closeField()"></spartan-rich-filter-field-close>
		</div>
	`})
export class BooleanField implements FocusElementOptions {
	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.boolean>;

	public readonly focusMonitor = inject(FocusMonitor);
	public readonly monitoredInput = viewChild.required('monitoredInput', { read: ElementRef<HTMLElement> });

	public readonly onFocusElement = effect(() => {
		// Helm checkbox doesn't expose the input element, so we need to query it manually here
		// TODO refactor the checkbox to expose the input element and avoid this query
		const el = this.monitoredInput().nativeElement.querySelector('button[role="checkbox"]') ;
		this.service.isFocused() && this.focusMonitor.focusVia(el, FAKE_FOCUS_ORIGIN);
	});
}
