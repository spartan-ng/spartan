import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, isSignal, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { debounceTime } from 'rxjs';
import { FAKE_FOCUS_ORIGIN, QueryToken } from '../engine/constants';
import { FHandler } from '../engine/handlers';
import { IdentityOperators } from '../engine/operators';
import { FILTER_HANDLER } from '../engine/token';
import { FieldTypes } from '../engine/types';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FocusElementOptions } from './utils/focus-element';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
	selector: 'spartan-rich-filter-combo-async-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmComboboxImports,
		HlmSpinnerImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
		FormsModule,
	],
	providers: [provideIcons({ lucideLink2, lucideX })],
	host: {},
	template: `
		@let rs = _resource;
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

			<!-- async combobox -->
			<hlm-combobox
				[(search)]="_query"
				[ngModel]="service.controlValue()"
				(ngModelChange)="service.updateControl($event)"
				[itemToString]="service.itemToString()"
			>
				<hlm-combobox-input #monitoredInput [id]="service.formId()" [placeholder]="service.placeholder()" class="rounded-none border-l-0" />
				<hlm-combobox-content *hlmComboboxPortal>
					@if (showStatus()) {
						<hlm-combobox-status>
							@if (rs.error(); as error) {
								{{ error }}
							} @else if (rs.isLoading()) {
								<hlm-spinner />
								Loading...
							} @else if (_query().length === 0) {
								Type to search.
							} @else {
								No matches for "{{ _query() }}".
							}
						</hlm-combobox-status>
					}
					@if (!rs.isLoading()) {
						<hlm-combobox-empty>Try a different search term.</hlm-combobox-empty>
					}
					<div hlmComboboxList>
						@if (rs.hasValue()) {
							@for (item of parsedItems(); track item.raw) {
								<hlm-combobox-item [value]="item.raw">{{ item.label }}</hlm-combobox-item>
							}
						}
					</div>
				</hlm-combobox-content>
			</hlm-combobox>

			<!-- close button -->
			<spartan-rich-filter-field-close (onCloseField)="service.closeField()" />
		</div>
	`,
})
export class ComboAsyncField implements FocusElementOptions {
	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.asyncCombobox>;

	protected readonly operators = IdentityOperators;
	protected readonly _query = signal('');
	protected readonly debouncedQuery = toSignal(toObservable(this._query).pipe(debounceTime(450)), {
		initialValue: this._query(),
	});

	private readonly resourceRequestWithQuery = computed(() => {
		const r = this.service.fieldResourceRequest();
		let wq = isSignal(r) ? r() : r;
		if (wq.url.includes(QueryToken)) {
			wq = { ...wq, url: wq.url.replace(QueryToken, this.debouncedQuery()) };
		}
		return wq;
	});

	protected readonly _resource = httpResource(this.resourceRequestWithQuery, this.service.fieldResourceOptions);

	private readonly safeValue = computed(() => (this._resource.hasValue() ? this._resource.value() : []));

	protected readonly showStatus = computed(
		() => this._resource.error() || this._resource.isLoading() || !this._query().length || !this.safeValue().length,
	);

	protected readonly parsedItems = computed(() => {
		const fn = this.service.itemToString();
		return this.safeValue().map((v) => ({ raw: v, label: fn(v) }));
	});

	readonly focusMonitor = inject(FocusMonitor);
	readonly monitoredInput = viewChild.required('monitoredInput', { read: ElementRef<HTMLElement> });

	readonly onFocusElement = effect(() => {
		// TODO fix combobox api to expose a reference to the input element
		// to make it possible to focus without querying the DOM
		const el = this.monitoredInput().nativeElement.querySelector('input[brnComboboxInput]');
		this.service.isFocused() && this.focusMonitor.focusVia(el, FAKE_FOCUS_ORIGIN);
	});
}
