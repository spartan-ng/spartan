import { FocusMonitor } from '@angular/cdk/a11y';
import { NgComponentOutlet } from '@angular/common';
import {
	afterRenderEffect,
	ChangeDetectionStrategy,
	Component,
	DestroyableInjector,
	DestroyRef,
	effect,
	ElementRef,
	inject,
	Injector,
	linkedSignal,
	model,
	Signal,
	Type,
	viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFunnel, lucideFunnelPlus, lucideFunnelX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { FilterModelRef } from './engine/builders';
import { FOCUS_FALLBACK } from './engine/constants';
import { FIELD_HANDLERS_MAP } from './engine/handlers';
import { FILTER_HANDLER } from './engine/token';
import { FieldTypes, IFieldType } from './engine/types';
import { BooleanField } from './fields/boolean';
import { ComboField } from './fields/combo';
import { ComboAsyncField } from './fields/combo-async';
import { DateField } from './fields/date';
import { DateRangeField } from './fields/daterange';
import { NumberField } from './fields/number';
import { RangeField } from './fields/range';
import { SelectField } from './fields/select';
import { TextField } from './fields/text';
import { TimeField } from './fields/time';

/** Maps each field type to the component class that renders it. */
const FIELD_COMPONENT_MAP: Record<IFieldType, Type<unknown>> = {
	[FieldTypes.text]: TextField,
	[FieldTypes.number]: NumberField,
	[FieldTypes.boolean]: BooleanField,
	[FieldTypes.range]: RangeField,
	[FieldTypes.time]: TimeField,
	[FieldTypes.date]: DateField,
	[FieldTypes.daterange]: DateRangeField,
	[FieldTypes.select]: SelectField,
	[FieldTypes.combobox]: ComboField,
	[FieldTypes.asyncCombobox]: ComboAsyncField,
};

@Component({
	selector: 'spartan-rich-filter',
	imports: [HlmButtonImports, NgIcon, HlmIconImports, HlmDropdownMenuImports, NgComponentOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [provideIcons({ lucideFunnel, lucideFunnelX, lucideFunnelPlus })],
	template: `
		@let engine = state();
		<div class="flex w-full gap-2">
			<div class="flex flex-1 flex-wrap gap-2">
				@let remaining = engine.availableFields();
				@let active = fields();
				<!--inputs rendered programmatically  -->
				@for (field of active; track field.id) {
					<ng-container *ngComponentOutlet="field.component; injector: field.injector" />
				}
				<!-- button comes after -->
				@if (remaining.length) {
					<button #focusFallback size="icon" hlmBtn [hlmDropdownMenuTrigger]="addFilterMenu" align="start">
						<ng-icon size="sm" hlm [name]="active.length ? 'lucideFunnelPlus' : 'lucideFunnel'" />
					</button>
					<ng-template #addFilterMenu>
						<hlm-dropdown-menu class="w-48">
							<hlm-dropdown-menu-group>
								@for (field of remaining; track field.id) {
									<button hlmDropdownMenuItem (click)="engine.addField(field.id)">
										<span>{{ field.__label ?? field.id }}</span>
									</button>
								} @empty {
									<div class="text-muted-foreground px-2 py-1.5 text-sm">No filters available</div>
								}
							</hlm-dropdown-menu-group>
						</hlm-dropdown-menu>
					</ng-template>
				}
			</div>
			<!--ANYTHING HERE WILL BE OUTSIDE WRAPPING DIV -->
			@if (active.length) {
				<button variant="destructive" size="icon" hlmBtn (click)="engine.clear()">
					<ng-icon size="sm" hlm name="lucideFunnelX" />
				</button>
			}
		</div>
	`,
})
export class SpartanRichFilter {
	readonly state = model.required<FilterModelRef>();

	private readonly injectorCache = new Map<string, DestroyableInjector>();

	private injectorCleanup() {
		this.injectorCache.forEach((injector) => injector.destroy());
		this.injectorCache.clear();
	}

	/**
	 * removes all the injectors when the component is destroyed
	 */
	destroyCb = inject(DestroyRef).onDestroy(this.injectorCleanup.bind(this));

	private getCachedInjector(fId: string, fType: IFieldType, state: Signal<FilterModelRef>) {
		const k = `${fId}-${fType}`;
		const inj =
			this.injectorCache.get(k) ??
			Injector.create({
				providers: [
					{
						provide: FILTER_HANDLER,
						useFactory: () => FIELD_HANDLERS_MAP[fType](fId, state().value, { focusedField: state().focusedField }),
					},
				],
			});

		if (!this.injectorCache.has(k)) {
			this.injectorCache.set(k, inj);
		}

		return inj;
	}

	/** Computed array of { component, inputs } entries for NgComponentOutlet. */
	readonly fields = linkedSignal(() => {
		return this.state()
			.fieldsArray()
			.map((e) => {
				{
					const id = e.id;
					const component = FIELD_COMPONENT_MAP[e.__type];
					const injector = this.getCachedInjector(id, e.__type, this.state);
					return { id, component, injector };
				}
			});
	});

	readonly focusMonitor = inject(FocusMonitor);
	readonly monitoredInput = viewChild('focusFallback', { read: ElementRef<HTMLElement> });

	/**
	 * In some advanced use cases, the user might want to change the model (the reference) from outside of this component, (e.g. populating the model with asynchronous options, or router data).
	 * In that case, the view and injectors will be reset to avoid staleness.
	 * By cleaning the fields and injectors, we're forcing the component to recreate them with the latest copy of the state
	 *
	 * The user must account for this fact in their implementation
	 *
	 */
	readonly onStateChange = effect(() => {
		this.state() && this.fields.set([]);
		this.injectorCleanup();
	});

	readonly onFallbackFocusRequested = afterRenderEffect(() => {
		const trigger = this.state().focusedField()?.startsWith(FOCUS_FALLBACK);
		const el = this.monitoredInput();

		if (trigger && el) {
			this.focusMonitor.focusVia(el, 'mouse');
		}
	});
}
